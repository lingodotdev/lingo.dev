"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  Save,
  Layout,
  Type,
  MessageSquareQuote,
  Megaphone,
  Layers,
  GripVertical,
  Check,
} from "lucide-react";
import {
  getPage,
  updatePage,
  updateSection,
  addSection,
  removeSection,
  moveSectionUp,
  moveSectionDown,
} from "@/app/lib/storage";
import type { SitePage, SectionType, PageSection } from "@/app/lib/storage";

const SECTION_TYPES: { type: SectionType; label: string; icon: typeof Layout }[] = [
  { type: "hero", label: "Hero", icon: Layout },
  { type: "features", label: "Features", icon: Layers },
  { type: "text", label: "Text Block", icon: Type },
  { type: "cta", label: "Call to Action", icon: Megaphone },
  { type: "testimonial", label: "Testimonial", icon: MessageSquareQuote },
];

const FIELD_LABELS: Record<string, string> = {
  heading: "Heading",
  subheading: "Subheading",
  buttonText: "Button Text",
  body: "Body Text",
  description: "Description",
  feature1Title: "Feature 1 Title",
  feature1Desc: "Feature 1 Description",
  feature2Title: "Feature 2 Title",
  feature2Desc: "Feature 2 Description",
  feature3Title: "Feature 3 Title",
  feature3Desc: "Feature 3 Description",
  quote: "Quote",
  author: "Author",
  role: "Role / Title",
};

function SectionEditor({
  section,
  index,
  total,
  pageId,
  onUpdate,
}: {
  section: PageSection;
  index: number;
  total: number;
  pageId: string;
  onUpdate: () => void;
}) {
  const [content, setContent] = useState(section.content);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setContent(section.content);
    setDirty(false);
  }, [section.content]);

  const handleFieldChange = (key: string, value: string) => {
    const updated = { ...content, [key]: value };
    setContent(updated);
    setDirty(true);
  };

  const handleSave = () => {
    updateSection(pageId, section.id, content);
    setDirty(false);
    onUpdate();
  };

  const handleRemove = () => {
    removeSection(pageId, section.id);
    onUpdate();
  };

  const handleMoveUp = () => {
    if (dirty) handleSave();
    moveSectionUp(pageId, section.id);
    onUpdate();
  };

  const handleMoveDown = () => {
    if (dirty) handleSave();
    moveSectionDown(pageId, section.id);
    onUpdate();
  };

  const sectionMeta = SECTION_TYPES.find((t) => t.type === section.type);
  const Icon = sectionMeta?.icon ?? Layout;

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-secondary/50 border-b border-border">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <Icon className="h-4 w-4 text-chart-2" />
          <span className="text-sm font-semibold text-card-foreground">
            {sectionMeta?.label ?? section.type}
          </span>
          <span className="text-xs text-muted-foreground">#{index + 1}</span>
        </div>
        <div className="flex items-center gap-1">
          {dirty && (
            <button
              onClick={handleSave}
              className="p-1.5 rounded-md bg-chart-2/10 text-chart-2 hover:bg-chart-2/20 transition-colors"
              title="Save changes"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={handleMoveUp}
            disabled={index === 0}
            className="p-1.5 rounded-md hover:bg-secondary transition-colors disabled:opacity-30"
            title="Move up"
          >
            <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          <button
            onClick={handleMoveDown}
            disabled={index === total - 1}
            className="p-1.5 rounded-md hover:bg-secondary transition-colors disabled:opacity-30"
            title="Move down"
          >
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          <button
            onClick={handleRemove}
            className="p-1.5 rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors"
            title="Remove section"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {Object.entries(content).map(([key, value]) => {
          const isLong = key === "body" || key === "description" || key === "quote" || key.endsWith("Desc");
          return (
            <div key={key}>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {FIELD_LABELS[key] ?? key}
              </label>
              {isLong ? (
                <textarea
                  value={value}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.pageId as string;
  const [page, setPage] = useState<SitePage | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showAddSection, setShowAddSection] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  const loadPage = useCallback(() => {
    const loaded = getPage(pageId);
    if (!loaded) {
      router.push("/dashboard");
      return;
    }
    setPage(loaded);
    setTitle(loaded.title);
    setDescription(loaded.description);
  }, [pageId, router]);

  useEffect(() => {
    setMounted(true);
    loadPage();
  }, [loadPage]);

  const handleSavePageInfo = () => {
    if (!page) return;
    updatePage(page.id, { title: title.trim(), description: description.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    loadPage();
  };

  const handleAddSection = (type: SectionType) => {
    addSection(pageId, type);
    setShowAddSection(false);
    loadPage();
  };

  if (!mounted || !page) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <Link
          href={`/preview/${pageId}`}
          className="inline-flex items-center gap-1.5 text-sm bg-chart-2/10 text-chart-2 px-4 py-2 rounded-lg font-medium hover:bg-chart-2/20 transition-colors"
        >
          <Eye className="h-4 w-4" />
          Preview Page
        </Link>
      </div>

      {/* Page Info */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Page Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Page Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
          <button
            onClick={handleSavePageInfo}
            className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Save className="h-4 w-4" />
            {saved ? "Saved!" : "Save Details"}
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Sections ({page.sections.length})
        </h2>
        <button
          onClick={() => setShowAddSection(!showAddSection)}
          className="inline-flex items-center gap-1.5 text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Add Section
        </button>
      </div>

      {/* Add Section Panel */}
      {showAddSection && (
        <div className="bg-card rounded-xl border border-border shadow-sm p-4 mb-6">
          <p className="text-sm text-muted-foreground mb-3">
            Choose a section type to add:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {SECTION_TYPES.map(({ type, label, icon: SIcon }) => (
              <button
                key={type}
                onClick={() => handleAddSection(type)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:bg-secondary hover:border-chart-2/30 transition-all text-center"
              >
                <SIcon className="h-5 w-5 text-chart-2" />
                <span className="text-xs font-medium text-card-foreground">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Section Editors */}
      <div className="space-y-4">
        {page.sections.map((section, i) => (
          <SectionEditor
            key={section.id}
            section={section}
            index={i}
            total={page.sections.length}
            pageId={pageId}
            onUpdate={loadPage}
          />
        ))}
      </div>

      {page.sections.length === 0 && (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <Layers className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            No sections yet. Add your first section above.
          </p>
        </div>
      )}
    </div>
  );
}
