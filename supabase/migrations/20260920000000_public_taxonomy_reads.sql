-- Public pages need only the taxonomy relationships attached to published posts.
-- This migration is intentionally separate from the already-applied schema files.

create index if not exists post_tags_tag_id_idx
  on public.post_tags (tag_id);

drop policy if exists "Public can view categories used by published posts" on public.categories;
create policy "Public can view categories used by published posts"
  on public.categories
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.posts
      where public.posts.category_id = public.categories.id
        and public.posts.status = 'published'
    )
  );

drop policy if exists "Public can view tags used by published posts" on public.tags;
create policy "Public can view tags used by published posts"
  on public.tags
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.post_tags
      join public.posts on public.posts.id = public.post_tags.post_id
      where public.post_tags.tag_id = public.tags.id
        and public.posts.status = 'published'
    )
  );

drop policy if exists "Public can view tags for published posts" on public.post_tags;
create policy "Public can view tags for published posts"
  on public.post_tags
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.posts
      where public.posts.id = public.post_tags.post_id
        and public.posts.status = 'published'
    )
  );
