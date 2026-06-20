const NODE = "/home/thinkpad/.cache/ms-playwright-go/1.57.0/node";
void NODE;

const baseUrl = "http://127.0.0.1:5174";
const version = await fetch("http://127.0.0.1:9222/json/version").then((response) => response.json());
const target = await fetch("http://127.0.0.1:9222/json/new", {
  method: "PUT",
}).then((response) => response.json());

const socket = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
const consoleErrors = [];
let messageId = 0;

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
    return;
  }

  if (message.method === "Runtime.exceptionThrown") {
    consoleErrors.push(message.params.exceptionDetails?.text || "Runtime exception");
  }
  if (message.method === "Log.entryAdded" && message.params.entry.level === "error") {
    consoleErrors.push(message.params.entry.text);
  }
});

await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

function send(method, params = {}) {
  const id = ++messageId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

async function waitFor(expression, timeout = 10000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(`Boolean(${expression})`)) return;
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`Timed out waiting for: ${expression}`);
}

async function navigate(path) {
  await send("Page.navigate", { url: `${baseUrl}${path}` });
  await waitFor("document.readyState === 'complete'");
  await new Promise((resolve) => setTimeout(resolve, 1400));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

await send("Page.enable");
await send("Runtime.enable");
await send("Log.enable");

try {
  await navigate("/admin/login");
  await evaluate("localStorage.removeItem('kashmir-admin-auth'); location.reload()");
  await new Promise((resolve) => setTimeout(resolve, 1600));
  await waitFor("document.querySelector('input[autocomplete=\"username\"]')");
  await evaluate(`
    (() => {
      const set = (element, value) => {
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
      };
      set(document.querySelector('input[autocomplete="username"]'), 'admin');
      set(document.querySelector('input[autocomplete="current-password"]'), 'admin123');
      [...document.querySelectorAll('button')].find((button) => button.textContent.trim() === 'Login').click();
    })()
  `);
  await waitFor("document.body.textContent.includes('Manager panel')");

  const originalHero = await evaluate(`
    [...document.querySelectorAll('label')].find((label) => label.textContent.includes('Hero title'))?.querySelector('input')?.value
  `);
  const originalDestination = await evaluate(`
    [...document.querySelectorAll('summary')].find((summary) => summary.textContent.includes('Destinations'))
      ?.parentElement.querySelector('input')?.value
  `);
  const originalPackageName = await evaluate(`
    [...document.querySelectorAll('label')].find((label) => label.textContent.includes('Package name'))?.querySelector('input')?.value
  `);
  const testHero = `E2E Kashmir ${Date.now()}`;
  const testDestination = `E2E Destination ${Date.now()}`;
  const testPackageName = `E2E Package ${Date.now()}`;
  await evaluate(`
    (() => {
      const set = (input, value) => {
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      };
      set([...document.querySelectorAll('label')].find((label) => label.textContent.includes('Hero title'))?.querySelector('input'), ${JSON.stringify(testHero)});
      set([...document.querySelectorAll('summary')].find((summary) => summary.textContent.includes('Destinations'))?.parentElement.querySelector('input'), ${JSON.stringify(testDestination)});
      set([...document.querySelectorAll('label')].find((label) => label.textContent.includes('Package name'))?.querySelector('input'), ${JSON.stringify(testPackageName)});
      [...document.querySelectorAll('button')].find((button) => button.textContent.trim() === 'Save Changes').click();
    })()
  `);
  await waitFor(`localStorage.getItem('kashmir-site-content-v3')?.includes(${JSON.stringify(testHero)})`);
  await waitFor(`localStorage.getItem('kashmir-destinations')?.includes(${JSON.stringify(testDestination)})`);
  await waitFor(`localStorage.getItem('kashmir-packages-premium-v3')?.includes(${JSON.stringify(testPackageName)})`);

  await navigate("/home");
  await waitFor(`document.body.textContent.includes(${JSON.stringify(testHero)})`);
  assert(await evaluate("document.querySelectorAll('img').length > 0"), "Home page images were not rendered.");
  assert(await evaluate("document.body.textContent.includes('Popular Kashmir packages')"), "Home package section missing.");

  await navigate("/packages");
  assert(await evaluate(`document.body.textContent.includes(${JSON.stringify(testPackageName)})`), "Admin package edit was not published.");
  assert(await evaluate("document.body.textContent.includes('matching packages')"), "Package filter summary missing.");
  assert(await evaluate("document.querySelectorAll('article').length >= 3"), "Package cards did not render.");
  await evaluate(`
    (() => {
      const select = document.querySelector('#package-price-filter');
      select.value = 'under-10000';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    })()
  `);
  await waitFor("document.body.textContent.includes('matching packages')");
  const filteredText = await evaluate("document.body.textContent");
  assert(filteredText.includes("INR 6,500") || filteredText.includes("INR 9,999"), "Price filtering did not show expected packages.");

  await navigate("/destinations");
  assert(await evaluate(`document.body.textContent.includes(${JSON.stringify(testDestination)})`), "Admin destination edit was not published.");
  await navigate("/packages");

  await evaluate(`
    [...document.querySelectorAll('button')].find((button) => button.textContent.trim() === 'View Details')?.click()
  `);
  await waitFor("location.pathname.startsWith('/packages/')");
  await waitFor("document.body.textContent.includes('Route & Itinerary')");
  assert(await evaluate("document.body.textContent.includes('Price Tiers')"), "Package detail price tiers missing.");

  await navigate("/admin/login");
  await waitFor("document.body.textContent.includes('Manager panel')");
  const restoreHero = originalHero || "See Kashmir Beyond The Postcard";
  const restoreDestination = originalDestination || "Srinagar & Dal Lake";
  const restorePackageName = originalPackageName || "Classic Kashmir Circuit";
  await evaluate(`
    (() => {
      const set = (input, value) => {
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      };
      set([...document.querySelectorAll('label')].find((label) => label.textContent.includes('Hero title'))?.querySelector('input'), ${JSON.stringify(restoreHero)});
      set([...document.querySelectorAll('summary')].find((summary) => summary.textContent.includes('Destinations'))?.parentElement.querySelector('input'), ${JSON.stringify(restoreDestination)});
      set([...document.querySelectorAll('label')].find((label) => label.textContent.includes('Package name'))?.querySelector('input'), ${JSON.stringify(restorePackageName)});
      [...document.querySelectorAll('button')].find((button) => button.textContent.trim() === 'Save Changes').click();
    })()
  `);
  await waitFor(`localStorage.getItem('kashmir-site-content-v3')?.includes(${JSON.stringify(restoreHero)})`);
  await waitFor(`localStorage.getItem('kashmir-destinations')?.includes(${JSON.stringify(restoreDestination)})`);
  await waitFor(`localStorage.getItem('kashmir-packages-premium-v3')?.includes(${JSON.stringify(restorePackageName)})`);

  const adminSections = await evaluate(`
    ['Website sections manager', 'Package manager', 'Gallery image manager', 'Blog manager']
      .every((text) => document.body.textContent.includes(text))
  `);
  assert(adminSections, "One or more admin management sections are missing.");
  assert(consoleErrors.length === 0, `Browser errors detected: ${consoleErrors.join(" | ")}`);

  console.log("E2E PASS: admin login; page, destination, and package edits; persistence; filters; details; and restore.");
} finally {
  await send("Target.closeTarget", { targetId: target.id }).catch(() => {});
  socket.close();
}
