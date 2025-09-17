import { BlogTagsHeader } from "@/components/blog/BlogTagsHeader";
import { BlogTagsList } from "@/components/blog/BlogTagsList";
import { db } from "@/lib/db";

export default async function TagsPage() {
  const blogTags = await db.blogTag.findMany();

  return (
    <div className="space-y-6">
      <BlogTagsHeader />
      <BlogTagsList blogTags={blogTags} />
    </div>
  );
}
