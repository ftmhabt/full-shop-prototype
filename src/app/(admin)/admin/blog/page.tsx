import { getBlogPosts } from "@/app/actions/blog";
import AdminBlogList from "@/components/blog/AdminBlogList";

export default async function AdminBlogPage() {
  const blogs = await getBlogPosts();
  return <AdminBlogList blogs={blogs} />;
}
