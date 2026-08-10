import Link from "next/link";
import Image from "next/image";
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
    <article className="bg-white border border-[#ddd5c8] rounded-sm overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <Link href={`/${post.slug}`} className="block">
        <div className="relative w-full aspect-video">
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full bg-[#f0ebe2] relative overflow-hidden">
              <GeometricPattern className="absolute inset-0 w-full h-full opacity-50" />
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/${post.slug}`}>
          <h2 className="font-serif text-[16px] leading-snug text-[#0f2240] group-hover:text-[#b8862a] transition-colors duration-200 mb-2">
            {post.title}
          </h2>
        </Link>
        {post.excerpt && (
          <p className="text-[#7c6f64] text-xs leading-relaxed line-clamp-2 mb-3">
            {post.excerpt}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-1.5 text-[10px] uppercase tracking-widest text-[#9c8c7c]">
          <span className="text-[#7c6f64]">David Fell</span>
          {post.published_at && (
            <><span>·</span><time dateTime={post.published_at}>{formatDate(post.published_at)}</time></>
          )}
          {post.reading_time_minutes && (
            <span>· {post.reading_time_minutes} min</span>
          )}
          {post.tags?.map((tag) => (
            <span key={tag.id} className="text-[#b8862a]">· {tag.name}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
