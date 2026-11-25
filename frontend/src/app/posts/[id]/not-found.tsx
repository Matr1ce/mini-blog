import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function PostNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-slate-900 mb-3">
        Пост не знайдено
      </h1>
      <p className="text-slate-500 mb-6">
        Можливо, його було видалено або посилання некоректне.
      </p>
      <Link href="/">
        <Button variant="primary">Повернутися на головну</Button>
      </Link>
    </div>
  );
}
