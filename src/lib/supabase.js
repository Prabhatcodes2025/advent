const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const AUTH_STORAGE_KEY = "snowfeather_supabase_auth";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let authSession = loadStoredAuthSession();

function loadStoredAuthSession() {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function saveAuthSession(session) {
  authSession = session;
  if (session?.access_token) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  else localStorage.removeItem(AUTH_STORAGE_KEY);
}

function headers(extra = {}) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${authSession?.access_token || SUPABASE_ANON_KEY}`,
    ...extra,
  };
}

function assertConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }
}

async function authRequest(path, options = {}) {
  assertConfigured();
  const response = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    method: options.method || "GET",
    headers: headers({
      "Content-Type": "application/json",
      ...options.headers,
    }),
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Supabase Auth request failed.");
  }

  if (response.status === 204) return null;
  return response.json();
}

export const supabaseAuth = {
  getStoredSession() {
    return authSession;
  },
  async signInWithPassword(email, password) {
    const session = await authRequest("token?grant_type=password", {
      method: "POST",
      body: { email, password },
    });
    saveAuthSession(session);
    return session;
  },
  async getUser() {
    if (!authSession?.access_token) return null;
    try {
      const result = await authRequest("user");
      return result?.user || result;
    } catch {
      saveAuthSession(null);
      return null;
    }
  },
  async updatePassword(password) {
    if (!authSession?.access_token) throw new Error("Please sign in before updating the password.");
    return authRequest("user", {
      method: "PUT",
      body: { password },
    });
  },
  async signOut() {
    if (authSession?.access_token) {
      try {
        await authRequest("logout", { method: "POST" });
      } catch {
        // The local session is still cleared even if the remote logout request has expired.
      }
    }
    saveAuthSession(null);
  },
  clearSession() {
    saveAuthSession(null);
  },
};

function buildUrl(table, params = {}) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, value);
  });
  return url.toString();
}

async function request(table, options = {}) {
  assertConfigured();
  const response = await fetch(buildUrl(table, options.params), {
    method: options.method || "GET",
    headers: headers({
      "Content-Type": "application/json",
      Prefer: options.prefer || "return=representation",
      ...options.headers,
    }),
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Supabase ${options.method || "GET"} failed for ${table}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const supabaseDb = {
  select(table, params = {}) {
    return request(table, { params });
  },
  insert(table, row) {
    return request(table, { method: "POST", body: row, prefer: "return=representation" });
  },
  update(table, id, row) {
    return request(table, {
      method: "PATCH",
      params: { id: `eq.${id}` },
      body: row,
      prefer: "return=representation",
    });
  },
  upsert(table, rows, onConflict = "id") {
    return request(table, {
      method: "POST",
      params: { on_conflict: onConflict },
      body: rows,
      prefer: "resolution=merge-duplicates,return=representation",
    });
  },
  remove(table, id) {
    return request(table, {
      method: "DELETE",
      params: { id: `eq.${id}` },
      prefer: "return=minimal",
    });
  },
};

function dataUrlToBlob(dataUrl) {
  const [metadata, base64] = dataUrl.split(",");
  const mimeType = metadata.match(/data:(.*?);base64/)?.[1] || "application/octet-stream";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new Blob([bytes], { type: mimeType });
}

export const supabaseStorage = {
  async upload(bucket, path, fileOrDataUrl) {
    assertConfigured();
    const body = typeof fileOrDataUrl === "string" && fileOrDataUrl.startsWith("data:")
      ? dataUrlToBlob(fileOrDataUrl)
      : fileOrDataUrl;
    const contentType = body?.type || "application/octet-stream";
    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
      method: "POST",
      headers: headers({
        "Content-Type": contentType,
        "x-upsert": "true",
      }),
      body,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Supabase Storage upload failed for ${bucket}/${path}`);
    }

    return this.publicUrl(bucket, path);
  },
  publicUrl(bucket, path) {
    assertConfigured();
    return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
  },
};
