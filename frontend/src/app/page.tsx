import React from "react";
import Link from "next/link";
import { getServerPosts } from "@/lib/posts.server";
import { PostCard } from "@/components/posts/PostCard";
import { Post } from "@/types";

interface HomePageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { category } = await searchParams;
  const selectedCategory = category?.trim() || "All";

  let allPosts: Post[] = [];
  let hasError = false;

  try {
    allPosts = await getServerPosts();
  } catch {
    hasError = true;
  }

  const dynamicCategories = Array.from(
    new Set(allPosts.map((p) => p.category)),
  ).sort();
  const filterCategories = ["All", ...dynamicCategories];

  const posts =
    selectedCategory === "All"
      ? allPosts
      : allPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Hero блок */}
      <section className="mb-10 rounded-3xl bg-linear-to-r from-indigo-600 to-violet-600 px-6 py-12 text-white shadow-md sm:px-12">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          MiniBlog про розробку та архітектуру
        </h1>
        <p className="mt-3 max-w-2xl text-indigo-100 text-base sm:text-lg">
          Статті про TypeScript, Next.js, Express та побудову чистих Full-stack
          застосунків.
        </p>
      </section>

      {!hasError && (
        <div className="mb-8 flex flex-wrap gap-2">
          {filterCategories.map((cat) => {
            const href =
              cat === "All" ? "/" : `/?category=${encodeURIComponent(cat)}`;
            const isActive = selectedCategory === cat;

            return (
              <Link
                key={cat}
                href={href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cat === "All" ? "Усі пости" : cat}
              </Link>
            );
          })}
        </div>
      )}

      {/* Error/Empty State/ Posts */}
      {hasError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
          Не вдалося завантажити пости. Перевір, чи запущений бекенд на порту
          5001.
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          У цій категорії поки що немає постів.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
