"use client";

import dynamic from "next/dynamic";

const CreateBlog = dynamic(() => import("@/components/blog/CreateBlog"), {
  ssr: false,
});
export default function CreateBlogPage() {
  return <CreateBlog />;
}
