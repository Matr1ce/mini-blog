import { z } from "zod";

const imageUrlSchema = z
  .union([
    z.string().trim().url("imageUrl must be a valid URL"),
    z.literal(""),
    z.null(),
  ])
  .optional()
  .transform((val) => (val === "" ? null : val));

export const createPostSchema = z.object({
  title: z
    .string({ error: "Title must be a string" })
    .trim()
    .min(1, "Title is required")
    .max(255, "Title is too long"),
  excerpt: z
    .string({ error: "Excerpt must be a string" })
    .trim()
    .min(1, "Excerpt is required")
    .max(300, "Excerpt must be at most 300 characters"),
  content: z
    .string({ error: "Content must be a string" })
    .trim()
    .min(1, "Content is required"),
  category: z
    .string({ error: "Category must be a string" })
    .trim()
    .min(1, "Category cannot be empty")
    .max(50, "Category is too long")
    .optional()
    .default("General"),
  imageUrl: imageUrlSchema,
});

export const updatePostSchema = z
  .object({
    title: z
      .string({ error: "Title must be a string" })
      .trim()
      .min(1, "Title cannot be empty")
      .max(255, "Title is too long")
      .optional(),
    excerpt: z
      .string({ error: "Excerpt must be a string" })
      .trim()
      .min(1, "Excerpt cannot be empty")
      .max(300, "Excerpt must be at most 300 characters")
      .optional(),
    content: z
      .string({ error: "Content must be a string" })
      .trim()
      .min(1, "Content cannot be empty")
      .optional(),
    category: z
      .string({ error: "Category must be a string" })
      .trim()
      .min(1, "Category cannot be empty")
      .max(50, "Category is too long")
      .optional(),
    imageUrl: imageUrlSchema,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });
