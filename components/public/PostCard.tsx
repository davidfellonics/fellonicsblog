import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import GeometricPattern from "@/components/shared/GeometricPattern";
import type { PostWithTags } from "@/types";
import { formatDate } from "@/lib/utils/formatDate";

interface PostCardProps {
  post: PostWithTags;
  /** Set true for the first visible card — removes lazy-load to improve LCP */
  priority?: boolean;
}

export default function PostCard({ post, priority = false }: PostCardProps) {
  return (
    <article className="border border-[#e5e7eb] rounded-lg overflow-hidden group">
      <Link href={`/${post.slug}`} className="block">
        <div className="relative w-full aspect-video">
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 430px"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full bg-[#f0f4f8] relative overflow-hidden">
              <GeometricPattern className="absolute inset-0 w-full h-full opacity-80" />
            </div>
          )}
        </div>
      </Link>
      <div className="p-5">
        <Link href={`/${post.slug}`}>
          <h2 className="font-bold font-sans text-[20px] text-[#111111] group-hover:text-[#1a3a5c] transition-colors duration-200 leading-snug mb-2">
            {post.title}
          </h2>
        </Link>
        {post.excerpt && (
          <p className="text-[#6b7280] text-sm leading-relaxed line-clamp-2 mb-4">
            {post.excerpt}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6b7280]">
          {post.published_at && (
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
          )}
          {post.reading_time_minutes && (
            <>
              <span>·</span>
              <span>{post.reading_time_minutes} min read</span>
            </>
          )}
          {post.tags?.map((tag) => (
            <Badge key={tag.id} className="bg-[#f0f4f8] text-[#1a3a5c] border-0 text-xs px-2 py-0.5">
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>
    </article>
  );
}
