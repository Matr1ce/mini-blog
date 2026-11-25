import { User } from "./user.model";
import { Post } from "./post.model";

User.hasMany(Post, {
  foreignKey: "authorId",
  as: "posts",
  onDelete: "CASCADE",
});
Post.belongsTo(User, { foreignKey: "authorId", as: "author" });

export { User, Post };
