"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Eye,
  Trash2,
  FileText,
  X,
  Globe,
} from "lucide-react";
import {
  getCurrentUser,
  getPages,
  createPage,
  deletePage,
} from "@/app/lib/storage";
import type { User, SitePage } from "@/app/lib/storage";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [pages, setPages] = useState<SitePage[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setUser(currentUser);
    setPages(getPages(currentUser.id));
  }, [router]);

  const handleCreate = () => {
    if (!user || !newTitle.trim()) return;
    const page = createPage(user.id, newTitle.trim(), newDesc.trim());
    setPages((prev) => [...prev, page]);
    setNewTitle("");
    setNewDesc("");
    setShowCreate(false);
    router.push(`/editor/${page.id}`);
  };

  const handleDelete = (pageId: string) => {
    deletePage(pageId);
    setPages((prev) => prev.filter((p) => p.id !== pageId));
  };

  if (!mounted || !user) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Pages</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your multilingual pages
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">New Page</span>
        </button>
      </div>

      {/* Create Page Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-card-foreground">
                Create New Page
              </h2>
              <button
                onClick={() => setShowCreate(false)}
                className="p-1 rounded-md hover:bg-secondary transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1.5">
                  Page Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="My Landing Page"
                  className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1.5">
                  Description
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="A brief description of your page"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 px-4 py-2.5 border border-border rounded-lg text-foreground font-medium hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newTitle.trim()}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  Create Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pages Grid */}
      {pages.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <FileText className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            No pages yet
          </h2>
          <p className="text-muted-foreground mb-6">
            Create your first multilingual page to get started.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="h-5 w-5" />
            Create Your First Page
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <div
              key={page.id}
              className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-chart-2" />
                    <h3 className="font-semibold text-card-foreground text-lg line-clamp-1">
                      {page.title}
                    </h3>
                  </div>
                </div>
                {page.description && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {page.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span>
                    {page.sections.length}{" "}
                    {page.sections.length === 1 ? "section" : "sections"}
                  </span>
                  <span>
                    Updated{" "}
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/editor/${page.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm bg-secondary text-secondary-foreground px-3 py-2 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Link>
                  <Link
                    href={`/preview/${page.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm bg-chart-2/10 text-chart-2 px-3 py-2 rounded-lg font-medium hover:bg-chart-2/20 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </Link>
                  <button
                    onClick={() => handleDelete(page.id)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete page"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
