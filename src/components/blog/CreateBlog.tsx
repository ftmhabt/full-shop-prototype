"use client";

import BlogEditor from "./BlogEditor";

export default function CreateBlog() {
  const handleBlogChange = (data: any) => {
    console.log("Blog Data:", data);
  };

  return (
    <div className="p-4">
      <BlogEditor onChange={handleBlogChange} mode="create" />
    </div>
  );
}
