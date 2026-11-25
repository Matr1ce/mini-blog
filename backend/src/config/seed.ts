import bcrypt from "bcrypt";
import { User, Post } from "../models";

export const seedDatabase = async (): Promise<void> => {
  const adminEmail = "admin@blog.com";
  let admin = await User.findOne({ where: { email: adminEmail } });

  if (!admin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    admin = await User.create({
      name: "Admin User",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });
    console.log("Seeded default admin: admin@blog.com / admin123");
  }

  const postsCount = await Post.count();
  if (postsCount === 0) {
    await Post.bulkCreate([
      {
        title: "Чому TypeScript став стандартом у Full-stack розробці",
        excerpt:
          "Розбираємося, як сувора типізація зменшує кількість багів на проді та прискорює командну роботу.",
        content:
          "TypeScript дозволяє виявляти помилки ще на етапі написання коду, а не коли користувач натискає кнопку в продакшені.\n\nКоли і бекенд (Express), і фронтенд (Next.js) написані на TypeScript, ви отримуєте спільну мову для контрактів API. Інтерфейси працюють як жива документація, яку перевіряє компілятор.",
        category: "TypeScript",
        imageUrl:
          "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1000&q=80",
        authorId: admin.id,
      },
      {
        title:
          "Layered Architecture в Express: навіщо розділяти контролери і сервіси",
        excerpt:
          "Як перестати писати всю логіку в одному файлі маршрутів і зробити бекенд масштабованим.",
        content:
          "Багаторівнева архітектура розділяє проєкт на чіткі зони відповідальності:\n\n1. Routes — лише опис URL та підключення middlewares.\n2. Controllers — розбір HTTP-запиту та формування відповіді.\n3. Services — бізнес-логіка та робота з базою даних.\n\nЗавдяки цьому код легко тестувати, читати та розширювати новими фічами без рефакторингу всього проєкту.",
        category: "Architecture",
        imageUrl:
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80",
        authorId: admin.id,
      },
      {
        title: "Next.js App Router + Tailwind CSS: швидкий старт сучасного UI",
        excerpt:
          "Поєднуємо файловий роутинг Next.js, React Query та утилітарні стилі Tailwind для створення блогу.",
        content:
          "Next.js App Router дає зручну структуру сторінок із динамічними маршрутами на кшталт /posts/[id].\n\nДодавши перевикористовувані UI-компоненти (Button, Input, PostCard) та винісши запити в кастомні хуки React Query, ми отримуємо швидкий інтерфейс із чистим кодом.",
        category: "Next.js",
        imageUrl:
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80",
        authorId: admin.id,
      },
    ]);
    console.log("Seeded 3 initial blog posts");
  }
};
