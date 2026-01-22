import Link from "next/link";

export default function AuthButtons() {
  return (
    <div className="flex flex-row items-center justify-center gap-4">
      <Link
        href="/auth/signup"
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 border border-primary transition-colors inline-block"
      >
        Sign up
      </Link>
      <span>or</span>
      <Link
        href="/auth/login"
        className="px-4 py-2 bg-secondary text-primary rounded-md hover:bg-gray-200 border border-primary transition-colors inline-block"
      >
        Log in
      </Link>
    </div>
  );
}
