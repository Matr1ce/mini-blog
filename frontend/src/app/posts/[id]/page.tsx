import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Calendar, User as UserIcon, Tag } from "lucide-react";
import { getServerPost } from "@/lib/posts.server";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PostDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const post = await getServerPost(id);
    if (!post) {
      return { title: "Пост не знайдено | MiniBlog" };
    }

    return {
      title: `${post.title} | MiniBlog`,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: "article",
        ...(post.imageUrl ? { images: [post.imageUrl] } : {}),
      },
    };
  } catch {
    return { title: "MiniBlog" };
  }
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  const post = await getServerPost(id);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Назад до всіх постів</span>
      </Link>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {post.imageUrl && (
          <div className="h-72 sm:h-96 w-full overflow-hidden bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.imageUrl}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="p-6 sm:p-10">
          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              <Tag className="h-3.5 w-3.5" />
              {post.category}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-400" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <UserIcon className="h-4 w-4 text-slate-400" />
              {post.author?.name || "Admin"}
            </span>
          </div>

          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {post.title}
          </h1>

          <p className="mb-8 rounded-2xl bg-slate-50 p-4 text-base font-medium text-slate-600 border-l-4 border-indigo-500">
            {post.excerpt}
          </p>

          <div className="space-y-4 text-base leading-8 text-slate-700 whitespace-pre-line">
            {post.content}
          </div>
        </div>
      </div>
    </article>
  );
}
