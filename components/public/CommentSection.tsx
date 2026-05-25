import type { Comment } from "@/types";
import { formatDate } from "@/lib/utils/formatDate";

interface CommentSectionProps {
  comments: Comment[];
}

export default function CommentSection({ comments }: CommentSectionProps) {
  if (comments.length === 0) {
    return (
      <div>
        <h3 className="font-bold font-sans text-lg text-[#111111] mb-4">Comments</h3>
        <p className="text-[#6b7280] text-sm">No comments yet. Be the first to share your thoughts.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-bold font-sans text-lg text-[#111111] mb-6">
        {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
      </h3>
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b border-[#e5e7eb] pb-6 last:border-0">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold font-sans text-sm text-[#111111]">
                {comment.author_name}
              </span>
              <time
                dateTime={comment.created_at}
                className="text-xs text-[#6b7280]"
              >
                {formatDate(comment.created_at)}
              </time>
            </div>
            <p className="text-[#111111] text-sm leading-relaxed font-serif">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
