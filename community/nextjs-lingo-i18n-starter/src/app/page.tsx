import { redirect } from "next/navigation";
import { defaultLang } from "@/lib/i18n";

export default function RootPage() {
  redirect(`/${defaultLang}`);
}
