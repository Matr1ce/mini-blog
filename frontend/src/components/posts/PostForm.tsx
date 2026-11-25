"use client";

import React, { useState } from "react";
import { Post, PostPayload } from "@/types";
import { DEFAULT_CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

interface PostFormProps {
  initialData?: Post | null;
  availableCategories?: string[];
  isSubmitting: boolean;
  error?: string;
  onSubmit: (payload: PostPayload) => void;
  onCancel?: () => void;
}

export const PostForm: React.FC<PostFormProps> = ({
  initialData,
  availableCategories = [],
  isSubmitting,
  error,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [category, setCategory] = useState(
    initialData?.category ?? DEFAULT_CATEGORIES[0],
  );
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "");

  const categorySuggestions = Array.from(
    new Set([
      ...DEFAULT_CATEGORIES,
      ...availableCategories,
      ...(initialData?.category ? [initialData.category] : []),
    ]),
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      category: category.trim() || "General",
      imageUrl: imageUrl.trim() || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Заголовок *
          </label>
          <input
            type="text"
            required
            placeholder="Наприклад: Як працює App Router у Next.js"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Категорія *
          </label>
          <input
            type="text"
            required
            list="post-categories"
            maxLength={50}
            placeholder="Оберіть або введіть категорію"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <datalist id="post-categories">
            {categorySuggestions.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Короткий опис (прев&apos;ю на головній) *
        </label>
        <input
          type="text"
          required
          maxLength={300}
          placeholder="1–2 речення про суть статті..."
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          URL зображення (необов&apos;язково)
        </label>
        <input
          type="url"
          placeholder="https://images.unsplash.com/..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Повний текст статті *
        </label>
        <textarea
          required
          rows={6}
          placeholder="Основний текст поста..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Скасувати
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Збереження..."
            : initialData
              ? "Оновити пост"
              : "Опублікувати пост"}
        </Button>
      </div>
    </form>
  );
};
