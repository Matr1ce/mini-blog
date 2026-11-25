import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export const validateBody = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const result = schema.safeParse(body);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`)
        .join("; ");
      res.status(400).json({ error: message });
      return;
    }

    req.body = result.data;
    next();
  };
};
