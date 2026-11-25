import { Post } from "@/types";

const API_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5001/api";

export async function getServerPosts(category?: string): Promise<Post[]> {
  const url = new URL(`${API_URL}/posts`);
  if (category && category !== "All") {
    url.searchParams.set("category", category);
  }

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
  return res.json();
}

export async function getServerPost(id: string): Promise<Post | null> {
  const res = await fetch(`${API_URL}/posts/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });

  if (res.status === 404 || res.status === 400) {
    return null;
  }
  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }
  return res.json();
}
