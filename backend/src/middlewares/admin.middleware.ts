import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ error: "Forbidden. Admin privileges required." });
    return;
  }
  next();
};
