create extension if not exists pgcrypto;

create table if not exists packages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text,
  package_type text,
  duration text,
  price numeric,
  image_url text,
  overview text,
  destinations jsonb default '[]'::jsonb,
  highlights jsonb default '[]'::jsonb,
  itinerary jsonb default '[]'::jsonb,
  inclusions jsonb default '[]'::jsonb,
  exclusions jsonb default '[]'::jsonb,
  accommodation text,
  meal_plan text,
  transportation text,
  activities text,
  guide_services text,
  reservation_note text,
  is_featured boolean default false,
  is_active boolean default true,
  sort_order integer default 50,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  form_type text,
  name text,
  phone text,
  email text,
  package_name text,
  destination_interest text,
  travel_month text,
  guests text,
  budget text,
  message text,
  preferred_contact text,
  status text default 'New',
  admin_note text default '',
  created_at timestamptz default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  package_name text,
  name text,
  phone text,
  email text,
  travel_month text,
  guests text,
  hotel_preference text,
  transport_preference text,
  meal_preference text,
  activities text,
  budget text,
  message text,
  status text default 'New',
  admin_note text default '',
  created_at timestamptz default now()
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text,
  location text,
  rating text,
  travel_type text,
  review text,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists destinations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  image_url text,
  description text,
  best_season text,
  activities jsonb default '[]'::jsonb,
  is_active boolean default true,
  sort_order integer default 50,
  created_at timestamptz default now()
);

create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  title text,
  category text,
  image_url text,
  alt_text text,
  is_active boolean default true,
  sort_order integer default 50,
  created_at timestamptz default now()
);

create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  setting_value jsonb,
  updated_at timestamptz default now()
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists packages_set_updated_at on packages;
create trigger packages_set_updated_at
before update on packages
for each row execute function set_updated_at();

drop trigger if exists site_settings_set_updated_at on site_settings;
create trigger site_settings_set_updated_at
before update on site_settings
for each row execute function set_updated_at();

alter table packages enable row level security;
alter table enquiries enable row level security;
alter table bookings enable row level security;
alter table testimonials enable row level security;
alter table destinations enable row level security;
alter table gallery enable row level security;
alter table site_settings enable row level security;

drop policy if exists "public read active packages" on packages;
drop policy if exists "public insert enquiries" on enquiries;
drop policy if exists "public insert bookings" on bookings;
drop policy if exists "public read active testimonials" on testimonials;
drop policy if exists "public insert testimonials" on testimonials;
drop policy if exists "public read active destinations" on destinations;
drop policy if exists "public read active gallery" on gallery;
drop policy if exists "public read site settings" on site_settings;
drop policy if exists "frontend admin manage packages" on packages;
drop policy if exists "frontend admin manage enquiries" on enquiries;
drop policy if exists "frontend admin manage bookings" on bookings;
drop policy if exists "frontend admin manage testimonials" on testimonials;
drop policy if exists "frontend admin manage destinations" on destinations;
drop policy if exists "frontend admin manage gallery" on gallery;
drop policy if exists "frontend admin manage site settings" on site_settings;
drop policy if exists "authenticated admin manage packages" on packages;
drop policy if exists "authenticated admin manage enquiries" on enquiries;
drop policy if exists "authenticated admin manage bookings" on bookings;
drop policy if exists "authenticated admin manage testimonials" on testimonials;
drop policy if exists "authenticated admin manage destinations" on destinations;
drop policy if exists "authenticated admin manage gallery" on gallery;
drop policy if exists "authenticated admin manage site settings" on site_settings;

create policy "public read active packages" on packages for select using (is_active = true);
create policy "public insert enquiries" on enquiries for insert with check (true);
create policy "public insert bookings" on bookings for insert with check (true);
create policy "public read active testimonials" on testimonials for select using (is_active = true);
create policy "public insert testimonials" on testimonials for insert with check (true);
create policy "public read active destinations" on destinations for select using (is_active = true);
create policy "public read active gallery" on gallery for select using (is_active = true);
create policy "public read site settings" on site_settings for select using (true);

create policy "authenticated admin manage packages" on packages for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated admin manage enquiries" on enquiries for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated admin manage bookings" on bookings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated admin manage testimonials" on testimonials for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated admin manage destinations" on destinations for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated admin manage gallery" on gallery for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated admin manage site settings" on site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public)
values
  ('package-images', 'package-images', true),
  ('gallery-images', 'gallery-images', true),
  ('testimonial-images', 'testimonial-images', true),
  ('destination-images', 'destination-images', true),
  ('hero-media', 'hero-media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "public read Snow Feather storage" on storage.objects;
drop policy if exists "frontend admin upload Snow Feather storage" on storage.objects;
drop policy if exists "frontend admin update Snow Feather storage" on storage.objects;
drop policy if exists "frontend admin delete Snow Feather storage" on storage.objects;
drop policy if exists "authenticated admin upload Snow Feather storage" on storage.objects;
drop policy if exists "authenticated admin update Snow Feather storage" on storage.objects;
drop policy if exists "authenticated admin delete Snow Feather storage" on storage.objects;

create policy "public read Snow Feather storage" on storage.objects
for select using (bucket_id in ('package-images', 'gallery-images', 'testimonial-images', 'destination-images', 'hero-media'));

create policy "authenticated admin upload Snow Feather storage" on storage.objects
for insert with check (auth.role() = 'authenticated' and bucket_id in ('package-images', 'gallery-images', 'testimonial-images', 'destination-images', 'hero-media'));

create policy "authenticated admin update Snow Feather storage" on storage.objects
for update using (auth.role() = 'authenticated' and bucket_id in ('package-images', 'gallery-images', 'testimonial-images', 'destination-images', 'hero-media'))
with check (auth.role() = 'authenticated' and bucket_id in ('package-images', 'gallery-images', 'testimonial-images', 'destination-images', 'hero-media'));

create policy "authenticated admin delete Snow Feather storage" on storage.objects
for delete using (auth.role() = 'authenticated' and bucket_id in ('package-images', 'gallery-images', 'testimonial-images', 'destination-images', 'hero-media'));
