-- CSTiltility: schema inicial + RLS
-- Fase MVP sem cobrança: acesso liberado manualmente pelo admin.

create type user_role as enum ('admin', 'member');
create type user_status as enum ('active', 'inactive');
create type grenade_type as enum ('smoke', 'flash', 'he', 'molotov');
create type difficulty as enum ('easy', 'medium', 'hard');

-- users: espelha auth.users, guarda role/status da aplicação
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text not null,
  role user_role not null default 'member',
  status user_status not null default 'active',
  created_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  cover_image_url text,
  "order" integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  type grenade_type not null,
  "order" integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules (id) on delete cascade,
  title text not null,
  youtube_video_id text not null,
  description text,
  difficulty difficulty not null default 'medium',
  "order" integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  content text not null default '',
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table public.banners (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  title text not null,
  cta_text text,
  cta_link text,
  active boolean not null default true,
  "order" integer not null default 0,
  created_at timestamptz not null default now()
);

-- helper: checa se o usuário autenticado é admin
create function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.users enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.notes enable row level security;
alter table public.progress enable row level security;
alter table public.banners enable row level security;

-- users: cada um vê/edita o próprio perfil; admin vê e gerencia todos
create policy "users select own or admin" on public.users
  for select using (id = auth.uid() or public.is_admin());

create policy "users update own or admin" on public.users
  for update using (id = auth.uid() or public.is_admin());

create policy "users insert admin only" on public.users
  for insert with check (public.is_admin());

create policy "users delete admin only" on public.users
  for delete using (public.is_admin());

-- content tables: leitura liberada para membros ativos autenticados; escrita só admin
create policy "courses read active members" on public.courses
  for select using (
    exists (
      select 1 from public.users
      where id = auth.uid() and status = 'active'
    )
  );
create policy "courses write admin only" on public.courses
  for all using (public.is_admin()) with check (public.is_admin());

create policy "modules read active members" on public.modules
  for select using (
    exists (
      select 1 from public.users
      where id = auth.uid() and status = 'active'
    )
  );
create policy "modules write admin only" on public.modules
  for all using (public.is_admin()) with check (public.is_admin());

create policy "lessons read active members" on public.lessons
  for select using (
    exists (
      select 1 from public.users
      where id = auth.uid() and status = 'active'
    )
  );
create policy "lessons write admin only" on public.lessons
  for all using (public.is_admin()) with check (public.is_admin());

create policy "banners read active members" on public.banners
  for select using (
    exists (
      select 1 from public.users
      where id = auth.uid() and status = 'active'
    )
  );
create policy "banners write admin only" on public.banners
  for all using (public.is_admin()) with check (public.is_admin());

-- notes: só o dono acessa e edita; admin pode ler tudo
create policy "notes owner rw" on public.notes
  for all using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid());

-- progress: só o dono acessa e edita; admin pode ler tudo
create policy "progress owner rw" on public.progress
  for all using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid());
