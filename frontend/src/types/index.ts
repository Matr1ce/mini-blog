export type UserRole = "user" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Author {
  id: number;
  name: string;
  email: string;
}

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string | null;
  authorId: number;
  author?: Author;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PostPayload {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl?: string | null;
}

export interface ApiError {
  error: string;
}
