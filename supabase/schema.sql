-- ============================================
-- Fonction utilitaire : met à jour updated_at
-- automatiquement à chaque modification de ligne
-- ============================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================
-- GROUPES (table centrale)
-- ============================================
create table groupes (
  id bigint generated always as identity primary key,
  name text not null,
  label text,
  genre text not null,
  country text not null,
  cover_initials text not null,
  love_level smallint not null default 0,
  is_seen boolean not null default false,
  seen_label text,
  added_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_groupes_genre check (genre in ('kpop', 'metal')),
  constraint chk_groupes_love_level check (love_level between 0 and 5)
);

create index idx_groupes_added_by on groupes (added_by);

create trigger trg_groupes_updated_at
  before update on groupes
  for each row execute function set_updated_at();

-- ============================================
-- CONCERTS
-- ============================================
create table concerts (
  id bigint generated always as identity primary key,
  name text not null,
  type text not null default 'concert',
  genre text not null,
  event_date timestamptz not null,
  venue text not null,
  city text not null,
  status text not null default 'prevu',
  has_tickets boolean not null default false,
  price numeric(8, 2),
  photo_url text,
  anecdote text,
  rating smallint,
  added_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_concerts_type check (type in ('concert', 'festival')),
  constraint chk_concerts_genre check (genre in ('kpop', 'metal', 'fest')),
  constraint chk_concerts_status check (status in ('prevu', 'passe', 'annule')),
  constraint chk_concerts_rating check (rating between 0 and 5)
);

create index idx_concerts_added_by on concerts (added_by);

create trigger trg_concerts_updated_at
  before update on concerts
  for each row execute function set_updated_at();

-- ============================================
-- CONCERT_GROUPES (table de jonction many-to-many)
-- ============================================
create table concert_groupes (
  concert_id bigint not null references concerts (id) on delete cascade,
  groupe_id bigint not null references groupes (id) on delete cascade,
  primary key (concert_id, groupe_id),
  constraint fk_concert_groupes_concert_id foreign key (concert_id) references concerts (id),
  constraint fk_concert_groupes_groupe_id foreign key (groupe_id) references groupes (id)
);

create index idx_concert_groupes_groupe_id on concert_groupes (groupe_id);

-- ============================================
-- REVES (wishlist)
-- ============================================
create table reves (
  id bigint generated always as identity primary key,
  title text not null,
  subtitle text,
  genre text not null,
  priority text not null,
  date_value text,
  budget numeric(8, 2),
  note text,
  is_watched boolean not null default false,
  added_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_reves_genre check (genre in ('kpop', 'metal')),
  constraint chk_reves_priority check (priority in ('ultime', 'haute', 'moyenne'))
);

create index idx_reves_added_by on reves (added_by);

create trigger trg_reves_updated_at
  before update on reves
  for each row execute function set_updated_at();

-- ============================================
-- MERCH
-- ============================================
create table merch (
  id bigint generated always as identity primary key,
  groupe_id bigint references groupes (id),
  concert_id bigint references concerts (id),
  name text not null,
  category text not null,
  preview_style text not null,
  band_note text,
  price numeric(8, 2),
  owner_id uuid not null references auth.users (id),
  photo_url text,
  anecdote text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_merch_category check (category in ('tshirt', 'hoodie', 'poster', 'cd-album', 'photocard', 'lightstick', 'casquette')),
  constraint chk_merch_preview_style check (preview_style in ('tee', 'hoodie', 'poster', 'cd', 'photocard', 'lightstick', 'vinyl', 'cap'))
);

create index idx_merch_owner_id on merch (owner_id);
create index idx_merch_groupe_id on merch (groupe_id);

create trigger trg_merch_updated_at
  before update on merch
  for each row execute function set_updated_at();

  create policy "groupes_authenticated_access"
  on groupes
  for all
  to authenticated
  using (true)
  with check (true);

create policy "concerts_authenticated_access"
  on concerts
  for all
  to authenticated
  using (true)
  with check (true);

create policy "concert_groupes_authenticated_access"
  on concert_groupes
  for all
  to authenticated
  using (true)
  with check (true);

create policy "reves_authenticated_access"
  on reves
  for all
  to authenticated
  using (true)
  with check (true);

create policy "merch_authenticated_access"
  on merch
  for all
  to authenticated
  using (true)
  with check (true);

  alter table concerts add column is_shared boolean not null default false;
alter table reves add column is_shared boolean not null default false;
alter table merch add column is_shared boolean not null default false;