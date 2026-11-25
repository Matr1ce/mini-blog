"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { Pencil, Trash2, Plus, ShieldAlert, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePosts, usePostMutations } from "@/hooks/usePosts";
import { PostForm } from "@/components/posts/PostForm";
import { Button } from "@/components/ui/Button";
import { ApiError, Post, PostPayload } from "@/types";

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { data: posts = [], isLoading: postsLoading } = usePosts();
  const { createPost, updatePost, deletePost } = usePostMutations();

  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formResetKey, setFormResetKey] = useState(0);
  const [formError, setFormError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  if (authLoading) {
    return (
      <div className="py-20 text-center text-slate-500">
        Перевірка прав доступу...
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Доступ обмежено
        </h1>
        <p className="text-slate-500 mb-6">
          Ця сторінка доступна лише адміністраторам. Увійдіть під обліковим
          записом адміна (<code>admin@blog.com</code> / <code>admin123</code>).
        </p>
        <Link href="/login">
          <Button variant="primary">Перейти до входу</Button>
        </Link>
      </div>
    );
  }

  const availableCategories = Array.from(new Set(posts.map((p) => p.category)));

  const handleSubmit = (payload: PostPayload) => {
    setFormError("");

    if (editingPost) {
      updatePost.mutate(
        { id: editingPost.id, payload },
        {
          onSuccess: () => {
            setEditingPost(null);
            router.refresh();
          },
          onError: (err) => {
            const axiosErr = err as AxiosError<ApiError>;
            setFormError(
              axiosErr.response?.data?.error || "Не вдалося оновити пост.",
            );
          },
        },
      );
    } else {
      createPost.mutate(payload, {
        onSuccess: () => {
          setFormResetKey((prev) => prev + 1);
          router.refresh();
        },
        onError: (err) => {
          const axiosErr = err as AxiosError<ApiError>;
          setFormError(
            axiosErr.response?.data?.error || "Не вдалося створити пост.",
          );
        },
      });
    }
  };

  const handleDelete = (id: number, title: string) => {
    if (!window.confirm(`Видалити пост «${title}»?`)) return;

    setDeleteError("");
    setDeletingId(id);

    deletePost.mutate(id, {
      onSuccess: () => {
        if (editingPost?.id === id) setEditingPost(null);
        router.refresh();
      },
      onError: (err) => {
        const axiosErr = err as AxiosError<ApiError>;
        setDeleteError(
          axiosErr.response?.data?.error ||
            `Не вдалося видалити пост «${title}».`,
        );
      },
      onSettled: () => {
        setDeletingId(null);
      },
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Адмін-панель
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Створення, редагування та видалення постів блогу
          </p>
        </div>
        {editingPost && (
          <Button variant="secondary" onClick={() => setEditingPost(null)}>
            <Plus className="h-4 w-4" />
            <span>Новий пост</span>
          </Button>
        )}
      </div>

      {/* Форма створення / редагування */}
      <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-5 text-xl font-bold text-slate-900">
          {editingPost
            ? `Редагування: ${editingPost.title}`
            : "Додати новий пост"}
        </h2>
        <PostForm
          key={editingPost ? `edit-${editingPost.id}` : `new-${formResetKey}`}
          initialData={editingPost}
          availableCategories={availableCategories}
          isSubmitting={createPost.isPending || updatePost.isPending}
          error={formError}
          onSubmit={handleSubmit}
          onCancel={editingPost ? () => setEditingPost(null) : undefined}
        />
      </section>

      {/* Список існуючих постів */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-5 text-xl font-bold text-slate-900">
          Усі пости ({posts.length})
        </h2>

        {deleteError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {deleteError}
          </div>
        )}

        {postsLoading ? (
          <p className="text-slate-500">Завантаження...</p>
        ) : posts.length === 0 ? (
          <p className="text-slate-500">Постів ще немає.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {posts.map((post) => {
              const isDeletingThis = deletingId === post.id;

              return (
                <div
                  key={post.id}
                  className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                        {post.category}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(post.createdAt).toLocaleDateString("uk-UA")}
                      </span>
                    </div>
                    <h3 className="truncate font-bold text-slate-900">
                      {post.title}
                    </h3>
                    <p className="truncate text-sm text-slate-500">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/posts/${post.id}`} title="Відкрити пост">
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={isDeletingThis}
                      onClick={() => {
                        setEditingPost(post);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                      <span>Редагувати</span>
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={isDeletingThis}
                      onClick={() => handleDelete(post.id, post.title)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>
                        {isDeletingThis ? "Видалення..." : "Видалити"}
                      </span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
