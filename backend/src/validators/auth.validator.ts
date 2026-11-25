import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ error: "Name must be a string" })
    .trim()
    .min(1, "Name is required")
    .max(100, "Name is too long"),
  email: z
    .string({ error: "Email must be a string" })
    .trim()
    .toLowerCase()
    .email("Invalid email format"),
  password: z
    .string({ error: "Password must be a string" })
    .min(6, "Password must be at least 6 characters long")
    .refine((val) => Buffer.byteLength(val, "utf8") <= 72, {
      message: "Password is too long (max 72 bytes)",
    }),
});

export const loginSchema = z.object({
  email: z
    .string({ error: "Email must be a string" })
    .trim()
    .toLowerCase()
    .email("Invalid email format"),
  password: z
    .string({ error: "Password must be a string" })
    .min(1, "Password is required"),
});
