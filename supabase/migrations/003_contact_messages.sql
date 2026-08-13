create extension if not exists pgcrypto;

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  phone text check (phone is null or char_length(phone) <= 40),
  company text check (company is null or char_length(company) <= 150),
  subject text check (subject is null or char_length(subject) <= 200),
  message text not null check (char_length(message) between 1 and 5000),
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  admin_note text check (admin_note is null or char_length(admin_note) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);
create index if not exists contact_messages_status_idx
  on public.contact_messages (status);
create index if not exists contact_messages_email_idx
  on public.contact_messages (email);

drop trigger if exists set_contact_messages_updated_at on public.contact_messages;
create trigger set_contact_messages_updated_at before update on public.contact_messages
for each row execute function public.set_updated_at();

alter table public.contact_messages enable row level security;

drop policy if exists "Admins can read contact messages" on public.contact_messages;
create policy "Admins can read contact messages" on public.contact_messages
for select to authenticated using (public.is_admin());

drop policy if exists "Admins can update contact messages" on public.contact_messages;
create policy "Admins can update contact messages" on public.contact_messages
for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete contact messages" on public.contact_messages;
create policy "Admins can delete contact messages" on public.contact_messages
for delete to authenticated using (public.is_admin());

-- Public callers cannot insert into the table directly. This narrowly scoped
-- function is called only after the Next.js server validates the submission.
create or replace function public.submit_contact_message(
  contact_name text,
  contact_email text,
  contact_phone text default null,
  contact_company text default null,
  contact_subject text default null,
  contact_message text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_id uuid;
begin
  if char_length(trim(coalesce(contact_name, ''))) not between 1 and 120
    or char_length(trim(coalesce(contact_email, ''))) not between 3 and 254
    or char_length(trim(coalesce(contact_message, ''))) not between 1 and 5000
    or contact_email !~* '^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$'
    or char_length(coalesce(contact_phone, '')) > 40
    or char_length(coalesce(contact_company, '')) > 150
    or char_length(coalesce(contact_subject, '')) > 200 then
    raise exception 'Invalid contact submission';
  end if;

  insert into public.contact_messages (name, email, phone, company, subject, message)
  values (
    trim(contact_name), lower(trim(contact_email)), nullif(trim(contact_phone), ''),
    nullif(trim(contact_company), ''), nullif(trim(contact_subject), ''), trim(contact_message)
  ) returning id into inserted_id;

  return inserted_id;
end;
$$;

revoke all on table public.contact_messages from anon;
revoke all on function public.submit_contact_message(text, text, text, text, text, text) from public;
grant execute on function public.submit_contact_message(text, text, text, text, text, text) to anon, authenticated;
