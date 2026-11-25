import { Request, Response } from "express";
import { AuthRequest } from "../types";
import { PostService } from "../services/post.service";

export class PostController {
  static async getAll(req: Request, res: Response): Promise<void> {
    const category =
      typeof req.query.category === "string" ? req.query.category : undefined;
    const posts = await PostService.getAll(category);
    res.json(posts);
  }

  static async getOne(req: Request, res: Response): Promise<void> {
    const post = await PostService.getById(Number(req.params.id));
    res.json(post);
  }

  static async create(req: AuthRequest, res: Response): Promise<void> {
    const post = await PostService.create(req.body, req.user!.id);
    res.status(201).json(post);
  }

  static async update(req: AuthRequest, res: Response): Promise<void> {
    const post = await PostService.update(Number(req.params.id), req.body);
    res.json(post);
  }

  static async delete(req: AuthRequest, res: Response): Promise<void> {
    await PostService.delete(Number(req.params.id));
    res.status(204).send();
  }
}
