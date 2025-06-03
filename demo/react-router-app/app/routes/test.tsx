import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Test() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-4 min-h-0">
        <Link to="/" className="text-blue-500 hover:underline">
          Go back home
        </Link>
        <h1 className="text-2xl font-bold">This is a test page</h1>
        <p>Welcome to non-interactive testing page.</p>
        <p>Please do not try to interact with this page for your own safety.</p>
      </div>
    </main>
  );
}
