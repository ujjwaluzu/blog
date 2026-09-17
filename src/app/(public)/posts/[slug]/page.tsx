import { redirect } from "next/navigation";

export default async function LegacyPostPage(props: PageProps<"/posts/[slug]">) {
  const { slug } = await props.params;
  redirect(`/writing/${slug}`);
}
