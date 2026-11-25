"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import api from "@/lib/api";
import { Post, PostPayload } from "@/types";

export const usePosts = (category?: string) => {
  return useQuery<Post[]>({
    queryKey: ["posts", category || "All"],
    queryFn: async () => {
      const params = category && category !== "All" ? { category } : {};
      const { data } = await api.get<Post[]>("/posts", { params });
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

export const usePost = (id: string | number) => {
  return useQuery<Post>({
    queryKey: ["post", String(id)],
    queryFn: async () => {
      const { data } = await api.get<Post>(`/posts/${id}`);
      return data;
    },
    enabled: Boolean(id),
  });
};

export const usePostMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
    queryClient.invalidateQueries({ queryKey: ["post"] });
  };

  const createPost = useMutation({
    mutationFn: (payload: PostPayload) => api.post<Post>("/posts", payload),
    onSuccess: invalidate,
  });

  const updatePost = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<PostPayload>;
    }) => api.patch<Post>(`/posts/${id}`, payload),
    onSuccess: invalidate,
  });

  const deletePost = useMutation({
    mutationFn: (id: number) => api.delete(`/posts/${id}`),
    onSuccess: invalidate,
  });

  return { createPost, updatePost, deletePost };
};
