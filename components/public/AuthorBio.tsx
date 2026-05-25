import Image from "next/image";
import type { Profile } from "@/types";

interface AuthorBioProps {
  author: Profile;
}

export default function AuthorBio({ author }: AuthorBioProps) {
  return (
    <div className="flex gap-4 p-5 border border-[#e5e7eb] rounded-lg">
      {author.avatar_url ? (
        <Image
          src={author.avatar_url}
          alt={author.full_name}
          width={56}
          height={56}
          className="rounded-full object-cover flex-shrink-0 w-14 h-14"
        />
      ) : (
        <div className="w-14 h-14 rounded-full bg-[#f0f4f8] flex-shrink-0 flex items-center justify-center">
          <span className="text-[#1a3a5c] font-bold text-lg font-sans">
            {author.full_name[0]}
          </span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold font-sans text-[#111111] text-sm">{author.full_name}</p>
        {author.bio && (
          <p className="text-sm text-[#6b7280] mt-0.5 leading-relaxed">{author.bio}</p>
        )}
        {author.twitter_handle && (
          <a
            href={`https://twitter.com/${author.twitter_handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[#1a3a5c] hover:underline mt-1"
          >
            @{author.twitter_handle}
          </a>
        )}
      </div>
    </div>
  );
}
