--
-- Admin access policies for authenticated (single-user CMS) management.
--
-- The original migration only allows SELECT of published posts (anon + auth).
-- This migration adds the policies the admin needs:
--   - read/write posts in any status (authenticated)
--   - read categories (authenticated) so the admin list can resolve category names
--
-- post_tags cleanup is handled by the existing `on delete cascade` FK — no
-- post_tags policies are required for that.
--

-- Posts: authenticated admins can view all statuses.
create policy "Admins can view all posts"
  on public.posts
  for select
  to authenticated
  using (true);

-- Posts: authenticated admins can create posts.
create policy "Admins can create posts"
  on public.posts
  for insert
  to authenticated
  with check (true);

-- Posts: authenticated admins can update any post.
create policy "Admins can update posts"
  on public.posts
  for update
  to authenticated
  using (true)
  with check (true);

-- Posts: authenticated admins can delete any post.
-- Deleting a post cascades to post_tags via the existing FK constraint.
create policy "Admins can delete posts"
  on public.posts
  for delete
  to authenticated
  using (true);

-- Categories: authenticated admins can read all categories.
-- Required so the admin post list can show category names via the
-- `categories(name)` relationship.
create policy "Admins can view categories"
  on public.categories
  for select
  to authenticated
  using (true);