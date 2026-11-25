# MiniBlog — Full-stack Next.js + Express (TypeScript)

Міні-блог із JWT-авторизацією, рольовим доступом (`user` / `admin`), адмін-панеллю (CRUD постів), фільтрацією та детальними сторінками статей.

## Технологічний стек

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS v4, TanStack React Query v5, Axios, Lucide Icons.
- **Backend:** Express 5, TypeScript, Sequelize ORM, SQLite, JWT, bcrypt, express-rate-limit.

## Архітектура

- **Backend (Layered Architecture):** `routes → controllers → services → models` + `middlewares` (`authenticate`, `requireAdmin`, `errorHandler`).
- **Frontend:** розділення на сторінки (`app/`), перевикористовувані компоненти (`components/ui`, `components/layout`, `components/posts`), кастомні хуки (`hooks/useAuth.tsx`, `hooks/usePosts.ts`), API-клієнт (`lib/api.ts`) та спільні типи (`types/`).

## Демо-доступ (створюється автоматично при першому запуску бекенду)

- **Admin:** `admin@blog.com` / `admin123`

Разом з адміном створюються 3 демо-пости. Нові користувачі, які реєструються через форму, отримують роль `user`.

## Вимоги

- Node.js 20+ та npm

## Запуск локально

Потрібні два термінали: один для бекенду, другий для фронтенду.

### 1. Бекенд (порт 5001)

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Файл `.env` містить:

| Змінна       | Опис                                                                      |
| ------------ | ------------------------------------------------------------------------- |
| `PORT`       | Порт API (за замовчуванням `5001`)                                        |
| `JWT_SECRET` | Секрет для підпису JWT, **мінімум 32 символи** (інакше сервер не стартує) |

Для власного секрету можна згенерувати випадковий рядок:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

База даних (SQLite, файл `backend/database.sqlite`) створюється автоматично при запуску. API доступне на `http://localhost:5001/api`.

### 2. Фронтенд (порт 3000)

В іншому терміналі:

```bash
cd frontend
npm install
npm run dev
```

Відкрийте [http://localhost:3000](http://localhost:3000).

За замовчуванням фронтенд звертається до `http://localhost:5001/api`. Щоб змінити адресу API, створіть `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

> Бекенд дозволяє CORS лише для `http://localhost:3000`, тому фронтенд потрібно запускати саме на цьому порту.

## Корисні команди

| Де         | Команда         | Призначення                      |
| ---------- | --------------- | -------------------------------- |
| `backend`  | `npm run dev`   | Запуск із автоперезавантаженням  |
| `backend`  | `npm run build` | Перевірка типів (`tsc --noEmit`) |
| `frontend` | `npm run dev`   | Dev-сервер Next.js               |
| `frontend` | `npm run build` | Продакшн-збірка                  |
| `frontend` | `npm run lint`  | ESLint                           |

## API

| Метод    | Маршрут              | Доступ | Опис                         |
| -------- | -------------------- | ------ | ---------------------------- |
| `POST`   | `/api/auth/register` | усі    | Реєстрація                   |
| `POST`   | `/api/auth/login`    | усі    | Вхід, повертає JWT           |
| `GET`    | `/api/auth/me`       | user   | Поточний користувач          |
| `GET`    | `/api/posts`         | усі    | Список постів (`?category=`) |
| `GET`    | `/api/posts/:id`     | усі    | Один пост                    |
| `POST`   | `/api/posts`         | admin  | Створити пост                |
| `PATCH`  | `/api/posts/:id`     | admin  | Редагувати пост              |
| `DELETE` | `/api/posts/:id`     | admin  | Видалити пост                |
