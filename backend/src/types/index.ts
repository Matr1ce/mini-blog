import { Request } from "express";

export type UserRole = "user" | "admin";

export interface JwtPayload {
  id: number;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export class AppError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
