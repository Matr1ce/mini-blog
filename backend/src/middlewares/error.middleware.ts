import { Request, Response, NextFunction } from "express";
import { AppError } from "../types";

interface SequelizeErr {
  name?: string;
  type?: string;
  status?: number;
  message?: string;
  errors?: Array<{ message: string }>;
}

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error(err);

  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  const e = err as SequelizeErr;

  if (e.name === "SequelizeUniqueConstraintError") {
    res.status(409).json({ error: "Email already registered." });
    return;
  }

  if (e.name === "SequelizeValidationError" && e.errors) {
    res
      .status(400)
      .json({ error: e.errors.map((item) => item.message).join(", ") });
    return;
  }

  if (e.type === "entity.too.large") {
    res.status(413).json({ error: "Payload too large." });
    return;
  }
  if (e.type === "entity.parse.failed") {
    res.status(400).json({ error: "Invalid JSON payload." });
    return;
  }
  res.status(500).json({ error: "Internal Server Error" });
};
