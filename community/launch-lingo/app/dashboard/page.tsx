import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="space-y-4">
        <Link href="/editor/landing" />
        <Link href="/editor/pricing" />
        <Link href="/editor/about" />
      </div>
    </div>
  );
}
