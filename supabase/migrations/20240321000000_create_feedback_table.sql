create table public.feedback (
  id uuid default gen_random_uuid() primary key,
  resume_id uuid references public.resumes(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table public.feedback enable row level security;

create policy "Enable read access for all users" on public.feedback
  for select using (true);

create policy "Enable insert access for authenticated users" on public.feedback
  for insert with check (auth.role() = 'authenticated');

-- Create indexes
create index feedback_resume_id_idx on public.feedback(resume_id);
create index feedback_created_at_idx on public.feedback(created_at); 