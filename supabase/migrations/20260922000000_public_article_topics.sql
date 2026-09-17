-- The homepage must show the three article topics even before each topic has
-- a published post. The public category archive still filters posts by status.
drop policy if exists "Public can view article topics" on public.categories;
create policy "Public can view article topics"
  on public.categories
  for select
  to anon, authenticated
  using (slug in ('development', 'projects', 'personal'));
