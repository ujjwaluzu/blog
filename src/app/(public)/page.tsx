import BlogHero from "@/components/blog/BlogHero";
import CategoryNavigation from "@/components/blog/CategoryNavigation";
import EditorialStatement from "@/components/blog/EditorialStatement";
import FeaturedPost from "@/components/blog/FeaturedPost";
import LatestPosts from "@/components/blog/LatestPosts";
import {
  getFeaturedPublishedPost,
  getLatestPublishedPosts,
  getPublishedArticleTopics,
} from "@/lib/blog/queries";

export default async function Home() {
  const [featured, latest, categories] = await Promise.all([
    getFeaturedPublishedPost(),
    getLatestPublishedPosts(6),
    getPublishedArticleTopics(),
  ]);

  return (
    <main>
      <BlogHero />
      <FeaturedPost
        post={featured.data}
        error={featured.error !== null && latest.data.length === 0}
      />
      <LatestPosts
        posts={latest.data}
        error={latest.error !== null}
        viewAllHref="/writing"
      />
      <CategoryNavigation
        categories={categories.data}
        error={categories.error !== null}
      />
      <EditorialStatement />
    </main>
  );
}
