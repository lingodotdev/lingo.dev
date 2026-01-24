import { redirect } from "next/navigation";

/**
 * Root page component.
 * Redirects the user to the English chat page by default.
 *
 * @returns {never} - Redirects immediately.
 */
export default function Home() {
  redirect("/en/chat");
}
