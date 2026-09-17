--
-- Task 12 — blog-images Storage bucket + scoped Storage RLS policies.
--
-- The main blog schema/auth migrations are untouched. This migration only
-- provisions Storage:
--   - one bucket: blog-images (public-read)
--   - read policy for everyone (anon + authenticated)
--   - write policies for authenticated admins only (insert/update/delete)
--
-- No anonymous INSERT/UPDATE/DELETE is created, and no service-role key is
-- used by the application — admins go through the authenticated session.
--

-- Make sure RLS is enforced on the Storage tables so the policies below are
-- the only gate. (Supabase ships these enabled, this is a belt-and-braces.)
alter table storage.objects enable row level security;
alter table storage.buckets enable row level security;

-- Create the bucket. public = the object/public URL is served to anonymous
-- readers (the public blog will display these images later). file_size_limit
-- and allowed_mime_types are enforced by the Storage service itself, layer on
-- top of the app's server-side validation.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-images',
  'blog-images',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

-- PUBLIC read: anyone can view blog images.
create policy "Public can read blog images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'blog-images');

-- AUTHENTICATED admin upload.
create policy "Admins can upload blog images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'blog-images');

-- AUTHENTICATED admin replace/update of existing objects.
create policy "Admins can update blog images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'blog-images')
  with check (bucket_id = 'blog-images');

-- AUTHENTICATED admin delete.
create policy "Admins can delete blog images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'blog-images');