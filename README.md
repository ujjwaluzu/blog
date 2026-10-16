# Ujjwaluzu

Ujjwal Baunthiyal's personal developer blog, built with Next.js and Supabase and deployed at [blog.ujjwaluzu.in](https://blog.ujjwaluzu.in).

Readers can browse published writing by topic, category, and tag. A protected admin area supports creating, editing, featuring, archiving, and deleting posts, including cover image uploads.

## Stack

- Next.js 16 App Router and React 19
- TypeScript
- Tailwind CSS 4
- Supabase (Postgres, Auth, and Storage)
- `react-markdown` with GitHub Flavored Markdown support

## Requirements

- Node.js compatible with Next.js 16
- npm
- A Supabase project

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your local environment file from the example:

   ```bash
   cp .env.example .env.local
   ```

   On Windows PowerShell, use `Copy-Item .env.example .env.local`.

3. Set the Supabase project URL and anon/public key in `.env.local` (see [Environment variables](#environment-variables)).

4. Configure Supabase as described in [Supabase setup](#supabase-setup).

5. Start the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | URL of the Supabase project. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon (publishable) key. Row Level Security policies protect database and storage access. Do not use a service role key here. |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical site origin used to generate metadata, sitemap links, and structured data. Defaults to `https://blog.ujjwaluzu.in`. For local development, you can set it to `http://localhost:3000`. |

Keep real credentials in `.env.local`; do not commit them. `.env.example` contains empty placeholders.

## Supabase setup

The database schema and access policies are versioned in `supabase/migrations/`. Apply every migration in timestamp order, using the Supabase CLI or the SQL Editor:

1. `20260917000000_create_blog_schema.sql`
2. `20260918000000_admin_posts_access.sql`
3. `20260919000000_blog_images_storage.sql`
4. `20260920000000_public_taxonomy_reads.sql`
5. `20260921000000_seed_article_topics.sql`
6. `20260922000000_public_article_topics.sql`

These migrations create the blog tables and Row Level Security policies, configure the public `blog-images` storage bucket with a 5 MB image limit, and establish the Development, Projects, and Personal topics. Review and apply migrations once per Supabase project; keep their order intact.

Create an administrator account under **Supabase Dashboard → Authentication → Users**. Sign in to the site's `/admin/login` page with that account. The admin area uses Supabase Auth and authenticated database/storage policies; the application does not require a service role key.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Home page with featured and latest published posts. |
| `/writing` | Paginated list of published posts. |
| `/writing/[slug]` | Public article page. |
| `/posts/[slug]` | Legacy article URL; redirects to `/writing/[slug]`. |
| `/categories/[slug]` | Published posts for a category. |
| `/tags/[slug]` | Published posts for a tag. |
| `/about` | About page. |
| `/admin/login` | Administrator sign-in. |
| `/admin` | Admin dashboard. |
| `/admin/posts` | Manage posts. |
| `/admin/posts/new` | Create a post. |
| `/admin/posts/[id]/edit` | Edit a post. |

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run build` | Build the production application. |
| `npm run start` | Serve the production build locally. |
| `npm run lint` | Run ESLint. |

## Deployment

Deploy as a Next.js application on a compatible hosting provider. Configure the environment variables above in the hosting environment and apply all Supabase migrations to the connected project. Set `NEXT_PUBLIC_SITE_URL` to the deployed origin when deploying to a domain other than the default.
