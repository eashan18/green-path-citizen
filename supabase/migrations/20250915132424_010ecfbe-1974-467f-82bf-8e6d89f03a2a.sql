-- Core helpers
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Profiles
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text check (role in ('citizen','worker','committee','ulb')) default 'citizen',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, full_name, role)
  values (new.id, coalesce((new.raw_user_meta_data->>'full_name')::text, ''), coalesce((new.raw_user_meta_data->>'role')::text, 'citizen'))
  on conflict (user_id) do update set
    full_name = excluded.full_name,
    role = excluded.role,
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at_column();

-- RLS policies for profiles
create policy "Profiles are readable by authenticated users"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

-- Reports
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  location_address text,
  location_lat double precision,
  location_lng double precision,
  image_url text,
  status text not null default 'pending' check (status in ('pending','in_progress','resolved','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.reports enable row level security;

create trigger reports_updated_at
before update on public.reports
for each row execute function public.update_updated_at_column();

create policy "Authenticated can read reports"
  on public.reports for select
  using (auth.role() = 'authenticated');

create policy "Users can create their own reports"
  on public.reports for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reports"
  on public.reports for update
  using (auth.uid() = user_id);

-- Tasks (assignments)
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references public.reports(id) on delete set null,
  title text not null,
  description text,
  assigned_by uuid not null references auth.users(id) on delete cascade,
  worker_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'assigned' check (status in ('assigned','in_progress','completed')),
  location_lat double precision,
  location_lng double precision,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tasks enable row level security;

create trigger tasks_updated_at
before update on public.tasks
for each row execute function public.update_updated_at_column();

create policy "Workers or assigners can read tasks"
  on public.tasks for select
  using (auth.uid() = worker_id or auth.uid() = assigned_by);

create policy "Assigners can create tasks"
  on public.tasks for insert
  with check (auth.uid() = assigned_by);

create policy "Workers or assigners can update tasks"
  on public.tasks for update
  using (auth.uid() = worker_id or auth.uid() = assigned_by);

-- Vehicle tracking
create table if not exists public.vehicle_tracking (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references auth.users(id) on delete cascade,
  start_lat double precision,
  start_lng double precision,
  end_lat double precision,
  end_lng double precision,
  current_lat double precision,
  current_lng double precision,
  status text not null default 'in_progress' check (status in ('in_progress','completed')),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.vehicle_tracking enable row level security;

create trigger vehicle_tracking_updated_at
before update on public.vehicle_tracking
for each row execute function public.update_updated_at_column();

create policy "Authenticated can read tracking"
  on public.vehicle_tracking for select
  using (auth.role() = 'authenticated');

create policy "Drivers can insert their own tracking"
  on public.vehicle_tracking for insert
  with check (auth.uid() = driver_id);

create policy "Drivers can update their own tracking"
  on public.vehicle_tracking for update
  using (auth.uid() = driver_id);

-- Realtime
alter table public.tasks replica identity full;
alter table public.vehicle_tracking replica identity full;

-- Add to realtime publication (ignore errors if already added)
do $$ begin
  alter publication supabase_realtime add table public.tasks;
exception when others then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.vehicle_tracking;
exception when others then null; end $$;

-- Storage for report images
insert into storage.buckets (id, name, public) values ('waste-images','waste-images', true)
on conflict (id) do nothing;

create policy "Public can view waste images"
  on storage.objects for select
  using (bucket_id = 'waste-images');

create policy "Users can upload their own waste images"
  on storage.objects for insert
  with check (
    bucket_id = 'waste-images' and
    (auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "Users can update own waste images"
  on storage.objects for update using (
    bucket_id = 'waste-images' and
    (auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own waste images"
  on storage.objects for delete using (
    bucket_id = 'waste-images' and
    (auth.uid())::text = (storage.foldername(name))[1]
  );