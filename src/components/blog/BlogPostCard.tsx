import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import { FallbackImage } from "../FallbackImage";

type BlogPostCardProps = {
  categorySlug: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  imageUrl?: string;
  authorAvatarUrl?: string;
  onClick?: () => void;
};

const BlogPostCard: React.FC<BlogPostCardProps> = ({
  categorySlug,
  slug,
  title,
  excerpt,
  author,
  date,
  imageUrl,
  onClick,
}) => (
  <Link href={`/blog/${categorySlug}/${slug}`}>
    <Card className="min-w-xs cursor-pointer" onClick={onClick}>
      {imageUrl && (
        <FallbackImage
          src={imageUrl}
          alt={title}
          className="w-full h-44 object-cover rounded-t-md"
          width={50}
          height={50}
        />
      )}
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-2">{excerpt}</p>
      </CardContent>
      <CardFooter className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{author}</span>
        <span>&middot;</span>
        <span>{date}</span>
      </CardFooter>
    </Card>
  </Link>
);

export default BlogPostCard;
