import { Request, Response } from "express";
import { AuthRequest } from "../types";
import { AuthService } from "../services/auth.service";

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body;
    const result = await AuthService.register(name, email, password);
    res.status(201).json(result);
  }

  static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json(result);
  }

  static async me(req: AuthRequest, res: Response): Promise<void> {
    const user = await AuthService.getMe(req.user!.id);
    res.json(user);
  }
}
