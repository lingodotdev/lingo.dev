import Link from "next/link";

export default function Test() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Link href="/" className="text-primary underline">Navigate home</Link>
        <div className="flex flex-col justify-center items-center gap-4 w-100">
          <h1 className="text-4xl">Testing this thing now</h1>
          <p>
            Hello, this is a non-interactive test. Please do not try to interact
            with it.
          </p>
        </div>
      </main>
    </div>
  );
}
