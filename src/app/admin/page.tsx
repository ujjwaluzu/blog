import Link from "next/link";
import { getAdminOverview } from "@/lib/posts/admin-queries";
import { ARTICLE_TOPICS } from "@/lib/topics";

function StatCard({
  label,
  count,
  href,
}: {
  label: string;
  count: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group border border-border bg-surface p-5 transition-colors hover:border-foreground hover:bg-muted"
    >
      <p className="eyebrow text-muted-foreground">{label}</p>
      <p className="mt-5 font-display text-4xl leading-none transition-colors group-hover:text-accent">
        {count}
      </p>
    </Link>
  );
}

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const overview = await getAdminOverview();

  if (overview.error || !overview.data) {
    return (
      <main>
        <h1 className="font-display text-2xl">Overview</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your article publishing workspace.
        </p>
        <div className="mt-8 border border-border px-6 py-16 text-center">
          <h2 className="font-display text-xl">Couldn&rsquo;t load the overview.</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please try again shortly.
          </p>
        </div>
      </main>
    );
  }

  const counts = overview.data;

  return (
    <main>
      <h1 className="font-display text-2xl">Overview</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your article publishing workspace.
      </p>

      <>
          <section className="mt-8" aria-labelledby="article-counts-heading">
            <h2 id="article-counts-heading" className="eyebrow text-accent">
              ARTICLES
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <StatCard label="All articles" count={counts.all} href="/admin/posts" />
              <StatCard
                label="Published articles"
                count={counts.published}
                href="/admin/posts?status=published"
              />
              <StatCard
                label="Draft articles"
                count={counts.drafts}
                href="/admin/posts?status=draft"
              />
            </div>
          </section>

          <section className="mt-10" aria-labelledby="topic-counts-heading">
            <h2 id="topic-counts-heading" className="eyebrow text-accent">
              TOPICS
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {ARTICLE_TOPICS.map((topic) => (
                <StatCard
                  key={topic.slug}
                  label={topic.name}
                  count={counts.topics[topic.slug]}
                  href={`/admin/posts?category=${topic.slug}`}
                />
              ))}
            </div>
          </section>
      </>
    </main>
  );
}
