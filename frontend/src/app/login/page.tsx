"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { ApiError, AuthResponse } from "@/types";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setSession } = useAuth();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      api.post<AuthResponse>("/auth/login", payload),
    onSuccess: ({ data }) => {
      setSession(data);
      router.push(data.user.role === "admin" ? "/admin" : "/");
    },
    onError: (err: AxiosError<ApiError>) => {
      setError(err.response?.data?.error || "Помилка входу. Перевірте дані.");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold text-slate-900">
            З поверненням!
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Увійдіть у свій акаунт MiniBlog
          </p>
        </div>

        <div className="mb-5 rounded-xl bg-indigo-50 p-3 text-xs text-indigo-800">
          <strong>Демо-адмін:</strong> <code>admin@blog.com</code> /{" "}
          <code>admin123</code>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Пароль
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full"
          >
            {loginMutation.isPending ? "Вхід..." : "Увійти"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Ще немає акаунту?{" "}
          <Link
            href="/register"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Зареєструватися
          </Link>
        </p>
      </div>
    </div>
  );
}
