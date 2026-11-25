import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface PostAttributes {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string | null;
  authorId: number;
}

type PostCreationAttributes = Optional<PostAttributes, "id" | "imageUrl">;

export class Post
  extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes
{
  declare id: number;
  declare title: string;
  declare excerpt: string;
  declare content: string;
  declare category: string;
  declare imageUrl: string | null;
  declare authorId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Post.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    excerpt: {
      type: DataTypes.STRING(300),
      allowNull: false,
      validate: { notEmpty: true },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "General",
    },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
    authorId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: "Post" },
);
