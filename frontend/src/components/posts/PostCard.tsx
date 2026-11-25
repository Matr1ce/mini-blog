import React from "react";
import Link from "next/link";
import { Calendar, User as UserIcon, ArrowRight } from "lucide-react";
import { Post } from "@/types";

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const formattedDate = new Date(post.createdAt).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {post.imageUrl ? (
        <div className="h-48 w-full overflow-hidden bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.imageUrl}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex h-48 w-full items-center justify-center bg-linear-to-br from-indigo-500 to-purple-600 text-white/80 font-semibold text-lg">
          {post.category}
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            {formattedDate}
          </span>
        </div>

        <Link
          href={`/posts/${post.id}`}
          className="group-hover:text-indigo-600 transition-colors"
        >
          <h2 className="mb-2 text-xl font-bold text-slate-900 line-clamp-2">
            {post.title}
          </h2>
        </Link>

        <p className="mb-5 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <UserIcon className="h-4 w-4 text-slate-400" />
            <span>{post.author?.name || "Admin"}</span>
          </div>

          <Link
            href={`/posts/${post.id}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <span>Читати</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
};
