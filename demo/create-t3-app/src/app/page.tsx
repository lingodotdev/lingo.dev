import { LocaleSwitcher } from "lingo.dev/react-client";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="mx-auto max-w-lg rounded-lg bg-white p-8 text-center shadow-sm">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">
            Hello, world!
          </h1>
          <p className="mb-4 leading-relaxed text-gray-700">
            This is an example app that demonstrates how{" "}
            <strong className="text-gray-900">Lingo.dev Compiler</strong> can be{" "}
            used to localize apps built with{" "}
            <a
              href="https://create.t3.gg/"
              className="text-blue-600 underline hover:text-blue-800"
            >
              create-t3-app
            </a>
            .
          </p>
          <p className="mb-6 leading-relaxed text-gray-700">
            To switch between locales, use the following dropdown:
          </p>
          <div className="flex justify-center">
            <LocaleSwitcher locales={["en", "es"]} />
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
