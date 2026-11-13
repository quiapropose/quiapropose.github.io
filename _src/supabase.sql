-- quiapropose.fr : ligues partagées (classement du Défi du jour)
-- À coller dans Supabase > SQL Editor > New query, puis cliquer « Run ».
-- Les tables ne sont pas lisibles directement : tout passe par les fonctions qp_*.

create extension if not exists pgcrypto;

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  secret uuid not null default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 20),
  emo text not null default '🦊' check (char_length(emo) <= 8),
  created_at timestamptz not null default now()
);

create table if not exists public.leagues (
  code text primary key,
  name text not null check (char_length(name) between 1 and 30),
  owner uuid references public.players(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.members (
  league text not null references public.leagues(code) on delete cascade,
  player uuid not null references public.players(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (league, player)
);

create table if not exists public.scores (
  player uuid not null references public.players(id) on delete cascade,
  day int not null,
  score int not null check (score between 0 and 5),
  pts int not null check (pts between 0 and 5000),
  created_at timestamptz not null default now(),
  primary key (player, day)
);

alter table public.players enable row level security;
alter table public.leagues enable row level security;
alter table public.members enable row level security;
alter table public.scores enable row level security;
revoke all on public.players, public.leagues, public.members, public.scores from anon, authenticated;

-- Numéro du défi du jour (n°1 = 13 novembre 2026, heure de Paris)
create or replace function public.qp_today() returns int
language sql stable as $$
  select ((now() at time zone 'Europe/Paris')::date - date '2026-11-13') + 1;
$$;

create or replace function public.qp_auth(p_id uuid, p_secret uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from players where id = p_id and secret = p_secret) then
    raise exception 'profil inconnu';
  end if;
end $$;

create or replace function public.qp_create_player(p_name text, p_emo text)
returns table(pid uuid, psecret uuid)
language plpgsql security definer set search_path = public as $$
begin
  if char_length(trim(coalesce(p_name, ''))) = 0 then raise exception 'pseudo vide'; end if;
  return query
    insert into players(name, emo) values (left(trim(p_name), 20), left(coalesce(p_emo, '🦊'), 8))
    returning players.id, players.secret;
end $$;

create or replace function public.qp_update_player(p_id uuid, p_secret uuid, p_name text, p_emo text)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform qp_auth(p_id, p_secret);
  if char_length(trim(coalesce(p_name, ''))) = 0 then raise exception 'pseudo vide'; end if;
  update players set name = left(trim(p_name), 20), emo = left(coalesce(p_emo, emo), 8) where id = p_id;
end $$;

create or replace function public.qp_delete_player(p_id uuid, p_secret uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform qp_auth(p_id, p_secret);
  delete from players where id = p_id;
end $$;

create or replace function public.qp_create_league(p_id uuid, p_secret uuid, p_name text)
returns text language plpgsql security definer set search_path = public as $$
declare
  c text;
  abc text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  i int;
begin
  perform qp_auth(p_id, p_secret);
  if char_length(trim(coalesce(p_name, ''))) = 0 then raise exception 'nom de ligue vide'; end if;
  if (select count(*) from leagues where owner = p_id) >= 10 then raise exception 'trop de ligues créées'; end if;
  loop
    c := '';
    for i in 1..6 loop
      c := c || substr(abc, 1 + floor(random() * length(abc))::int, 1);
    end loop;
    exit when not exists (select 1 from leagues where code = c);
  end loop;
  insert into leagues(code, name, owner) values (c, left(trim(p_name), 30), p_id);
  insert into members(league, player) values (c, p_id);
  return c;
end $$;

create or replace function public.qp_join_league(p_id uuid, p_secret uuid, p_code text)
returns text language plpgsql security definer set search_path = public as $$
declare n text; k text := upper(trim(p_code));
begin
  perform qp_auth(p_id, p_secret);
  select name into n from leagues where code = k;
  if n is null then raise exception 'code de ligue inconnu'; end if;
  if (select count(*) from members where league = k) >= 100 then raise exception 'ligue complète'; end if;
  insert into members(league, player) values (k, p_id) on conflict do nothing;
  return n;
end $$;

create or replace function public.qp_leave_league(p_id uuid, p_secret uuid, p_code text)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform qp_auth(p_id, p_secret);
  delete from members where league = upper(trim(p_code)) and player = p_id;
  delete from leagues l where l.code = upper(trim(p_code)) and not exists (select 1 from members m where m.league = l.code);
end $$;

create or replace function public.qp_my_leagues(p_id uuid, p_secret uuid)
returns table(lcode text, lname text, nb int)
language plpgsql security definer set search_path = public as $$
begin
  perform qp_auth(p_id, p_secret);
  return query
    select l.code, l.name, (select count(*)::int from members m2 where m2.league = l.code)
    from leagues l join members m on m.league = l.code
    where m.player = p_id
    order by m.joined_at;
end $$;

create or replace function public.qp_league_name(p_code text)
returns text language sql stable security definer set search_path = public as $$
  select name from leagues where code = upper(trim(p_code));
$$;

create or replace function public.qp_submit(p_id uuid, p_secret uuid, p_day int, p_score int, p_pts int)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform qp_auth(p_id, p_secret);
  if p_day < qp_today() - 1 or p_day > qp_today() + 1 then raise exception 'défi expiré'; end if;
  insert into scores(player, day, score, pts)
    values (p_id, p_day, greatest(0, least(5, p_score)), greatest(0, least(5000, p_pts)))
    on conflict do nothing;
end $$;

create or replace function public.qp_board(p_code text, p_viewer uuid default null)
returns table(pname text, pemo text, today int, week int, total int, played int, ptsum int, isme boolean)
language plpgsql stable security definer set search_path = public as $$
declare t int := qp_today();
begin
  return query
    select p.name, p.emo,
      coalesce(max(s.score) filter (where s.day = t), -1)::int,
      coalesce(sum(s.score) filter (where s.day > t - 7), 0)::int,
      coalesce(sum(s.score), 0)::int,
      count(s.day)::int,
      coalesce(sum(s.pts), 0)::int,
      coalesce(p.id = p_viewer, false)
    from members m
    join players p on p.id = m.player
    left join scores s on s.player = p.id
    where m.league = upper(trim(p_code))
    group by p.id, p.name, p.emo
    order by 4 desc, 7 desc;
end $$;

revoke execute on function public.qp_auth(uuid, uuid) from public, anon, authenticated;
