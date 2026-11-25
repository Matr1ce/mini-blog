import { Post, User } from "../models";
import { AppError } from "../types";

interface CreatePostDto {
  title: string;
  excerpt: string;
  content: string;
  category?: string;
  imageUrl?: string | null;
}

type UpdatePostDto = Partial<CreatePostDto>;

export class PostService {
  static async getAll(category?: string) {
    const whereClause: Record<string, string> = {};
    if (category && category !== "All") {
      whereClause.category = category;
    }

    return Post.findAll({
      where: whereClause,
      include: [
        { model: User, as: "author", attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  static async getById(id: number) {
    if (Number.isNaN(id)) throw new AppError(400, "Invalid post ID.");

    const post = await Post.findByPk(id, {
      include: [
        { model: User, as: "author", attributes: ["id", "name", "email"] },
      ],
    });

    if (!post) throw new AppError(404, "Post not found.");
    return post;
  }

  static async create(data: CreatePostDto, authorId: number) {
    if (!data.title?.trim() || !data.excerpt?.trim() || !data.content?.trim()) {
      throw new AppError(400, "Title, excerpt, and content are required.");
    }

    const post = await Post.create({
      title: data.title.trim(),
      excerpt: data.excerpt.trim(),
      content: data.content.trim(),
      category: data.category?.trim() || "General",
      imageUrl: data.imageUrl?.trim() || null,
      authorId,
    });

    return this.getById(post.id);
  }

  static async update(id: number, data: UpdatePostDto) {
    const post = await this.getById(id);
    await post.update({
      ...(data.title !== undefined && { title: data.title.trim() }),
      ...(data.excerpt !== undefined && { excerpt: data.excerpt.trim() }),
      ...(data.content !== undefined && { content: data.content.trim() }),
      ...(data.category !== undefined && { category: data.category.trim() }),
      ...(data.imageUrl !== undefined && {
        imageUrl: data.imageUrl?.trim() || null,
      }),
    });

    return this.getById(post.id);
  }

  static async delete(id: number) {
    if (Number.isNaN(id)) throw new AppError(400, "Invalid post ID.");

    const deleted = await Post.destroy({ where: { id } });
    if (!deleted) throw new AppError(404, "Post not found.");
  }
}
