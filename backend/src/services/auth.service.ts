import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { AppError, UserRole } from "../types";

const DUMMY_HASH = bcrypt.hashSync("dummy_timing_protection", 10);

interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
  };
}

export class AuthService {
  private static generateToken(user: User): string {
    return jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" },
    );
  }

  static async register(
    name: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    if (!name?.trim() || !email?.trim()) {
      throw new AppError(400, "Name and email are required.");
    }
    if (!password || password.length < 6) {
      throw new AppError(400, "Password must be at least 6 characters long.");
    }
    if (Buffer.byteLength(password, "utf8") > 72) {
      throw new AppError(400, "Password is too long (max 72 bytes).");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: "user",
    });

    return {
      token: this.generateToken(user),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    const user = await User.findOne({
      where: { email: (email || "").trim().toLowerCase() },
    });
    const isValid = await bcrypt.compare(
      password || "",
      user ? user.password : DUMMY_HASH,
    );

    if (!user || !isValid) {
      throw new AppError(401, "Invalid email or password.");
    }

    return {
      token: this.generateToken(user),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  static async getMe(userId: number) {
    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email", "role"],
    });
    if (!user) throw new AppError(404, "User not found.");
    return user;
  }
}
