"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  getTemplate,
  getUi,
  getLocaleLabel,
  SUPPORTED_LOCALES,
  type Locale,
  type Task,
} from "@/lib/i18n";
import { translateWelcomeNote } from "@/lib/lingo-client";

const DEFAULT_WELCOME =
  "Welcome to the team! Use this space to celebrate new hires and explain how their work matters.";

const HERO_HIGHLIGHTS = [
  "HR writes onboarding once in English.",
  "Lingo CLI + CI auto-sync localized JSON.",
  "Lingo SDK personalizes welcome notes live.",
  "Download polished onboarding packs per locale instantly.",
];
const LENGTH_ALERT_RATIO = 1.5;
const STATUS_LABELS: Record<TranslationStatus, string> = {
  machine: "Machine",
  edited: "Edited",
  approved: "Approved",
};
const STATUS_STYLES: Record<TranslationStatus, string> = {
  machine: "bg-white/10 text-slate-200 dark:bg-slate-800 dark:text-slate-200",
  edited: "bg-blue-500/20 text-blue-100 dark:bg-blue-500/30 dark:text-blue-100",
  approved: "bg-emerald-500/20 text-emerald-100 dark:bg-emerald-500/30 dark:text-emerald-100",
};
const LOGO_GRADIENT_ID = "globalonboard-logo-orbit";

const GlobalOnboardWordmark = () => (
  <div className="inline-flex items-center gap-3">
    <svg
      className="h-14 w-14 text-emerald-400"
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-labelledby="globalonboard-wordmark"
    >
      <title id="globalonboard-wordmark">GlobalOnboard logo</title>
      <defs>
        <linearGradient
          id={LOGO_GRADIENT_ID}
          x1="10"
          y1="54"
          x2="54"
          y2="10"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0f172a" />
          <stop offset="1" stopColor="#34d399" />
        </linearGradient>
      </defs>
      <circle
        cx="32"
        cy="32"
        r="16"
        stroke={`url(#${LOGO_GRADIENT_ID})`}
        strokeWidth="2.4"
      />
      <path
        d="M12.5 35.5c9.2-2.8 21.8-2.5 30.3 0 8.5 2.5 14.5 7.2 8 11-6 3.5-17.4 4.8-26.2 2.8-8.8-2-15.2-6.8-16.1-9.6-.8-2.7 1.1-4 4-4.2Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="32" r="6.5" fill="currentColor" fillOpacity="0.15" />
      <path
        d="M32 27c2 1.5 3.6 4.3 3.6 6.9 0 2.6-1.6 4.7-3.6 4.7s-3.6-2-3.6-4.7c0-2.6 1.6-5.4 3.6-6.9Z"
        fill="currentColor"
      />
    </svg>
    <div className="text-3xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-white md:text-4xl">
      <span>Global</span>
      <span className="ml-1 bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
        Onboard
      </span>
    </div>
  </div>
);

type WelcomeCacheEntry = {
  source: string;
  value: string;
};

type ViewMode = "single" | "qa";

type TranslationStatus = "machine" | "edited" | "approved";

type TranslatableFieldId =
  | { type: "companyName" }
  | { type: "role" }
  | { type: "taskTitle"; taskId: string }
  | { type: "taskDescription"; taskId: string };

type PrimaryField = "companyName" | "role";

type TranslationOverride = {
  text: string;
  status: TranslationStatus;
};

type OverridesState = Partial<Record<Locale, Record<string, TranslationOverride>>>;

const storageKey = "globalonboard_overrides_v1";
const LOCALE_BADGE_LABELS: Record<Locale, string> = {
  en: "English (en)",
  es: "Spanish (es)",
  fr: "French (fr)",
  hi: "Hindi (hi)",
};
type TaskSource = "template" | "custom";
type HrTask = Task & { source: TaskSource };
type CustomTranslationCache = Partial<
  Record<Locale, Record<string, { title?: string; description?: string }>>
>;

function buildFieldKey(field: TranslatableFieldId) {
  switch (field.type) {
    case "companyName":
      return "companyName";
    case "role":
      return "role";
    case "taskTitle":
      return `task:${field.taskId}:title`;
    case "taskDescription":
      return `task:${field.taskId}:description`;
    default:
      return "";
  }
}

export default function Home() {
  const hrStrings = getUi("en");
  const englishTemplate = getTemplate("en");
  const defaultCompanyName = englishTemplate.companyName;
  const defaultRole = englishTemplate.role;

  const [companyName, setCompanyName] = useState(defaultCompanyName);
  const [role, setRole] = useState(defaultRole);
  const [tasks, setTasks] = useState<HrTask[]>(
    () =>
      englishTemplate.tasks.map((task) => ({
        ...task,
        source: "template" as const,
      })) as HrTask[],
  );
  const [welcomeNote, setWelcomeNote] = useState(DEFAULT_WELCOME);
  const [selectedLocale, setSelectedLocale] = useState<Locale>("en");
  const [translatedWelcome, setTranslatedWelcome] = useState(DEFAULT_WELCOME);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("single");
  const [overrides, setOverrides] = useState<OverridesState>(() => {
    if (typeof window === "undefined") {
      return {};
    }
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved) as OverridesState;
      }
    } catch (error) {
      console.warn("Failed to load overrides", error);
    }
    return {};
  });
  const welcomeCache = useRef<Partial<Record<Locale, WelcomeCacheEntry>>>({});
  const [customTranslations, setCustomTranslations] = useState<CustomTranslationCache>({});
  const pendingCustomTranslations = useRef<Set<string>>(new Set());
  const [fieldTranslations, setFieldTranslations] = useState<
    Partial<Record<Locale, Partial<Record<PrimaryField, WelcomeCacheEntry>>>>
  >({});
  const pendingFieldTranslations = useRef<Set<string>>(new Set());
  const [translationCount, setTranslationCount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(overrides));
    } catch (error) {
      console.warn("Failed to persist overrides", error);
    }
  }, [overrides]);

  const updateOverride = (locale: Locale, fieldKey: string, override: TranslationOverride | null) => {
    setOverrides((prev) => {
      const next = { ...prev };
      const localeOverrides = { ...(next[locale] ?? {}) };

      if (!override) {
        delete localeOverrides[fieldKey];
      } else {
        localeOverrides[fieldKey] = override;
      }

      if (Object.keys(localeOverrides).length === 0) {
        delete next[locale];
      } else {
        next[locale] = localeOverrides;
      }

      return next;
    });
  };

  const getOverrideForField = (locale: Locale, fieldKey: string) => {
    return overrides[locale]?.[fieldKey];
  };

  const getStatusForField = (locale: Locale, fieldKey: string): TranslationStatus => {
    return getOverrideForField(locale, fieldKey)?.status ?? "machine";
  };

  const clearCustomTranslationsForTask = (taskId: string) => {
    setCustomTranslations((prev) => {
      const next = { ...prev };
      SUPPORTED_LOCALES.forEach((locale) => {
        const localeMap = next[locale];
        if (!localeMap) return;
        if (localeMap[taskId]) {
          const updated = { ...localeMap };
          delete updated[taskId];
          next[locale] = updated;
        }
      });
      return next;
    });
  };

  const removeTaskOverrides = (taskId: string) => {
    setOverrides((prev) => {
      const next = { ...prev };
      SUPPORTED_LOCALES.forEach((locale) => {
        const localeOverrides = next[locale];
        if (!localeOverrides) return;
        const updated = { ...localeOverrides };
        delete updated[buildFieldKey({ type: "taskTitle", taskId })];
        delete updated[buildFieldKey({ type: "taskDescription", taskId })];
        if (Object.keys(updated).length === 0) {
          delete next[locale];
        } else {
          next[locale] = updated;
        }
      });
      return next;
    });
  };

  const startTranslationJob = () => {
    setTranslationCount((count) => count + 1);
  };

  const finishTranslationJob = () => {
    setTranslationCount((count) => Math.max(0, count - 1));
  };

  const previewStrings = useMemo(() => getUi(selectedLocale), [selectedLocale]);
  const previewTemplate = useMemo(() => {
    if (selectedLocale === "en") {
      return { companyName, role, tasks };
    }

    const localizedTemplate = getTemplate(selectedLocale);
    const templateTasksById = localizedTemplate.tasks.reduce<Record<string, Task>>((acc, task) => {
      acc[task.id] = task;
      return acc;
    }, {});
    const localeCustomTranslations = customTranslations[selectedLocale] ?? {};
    const localeFieldCache = fieldTranslations[selectedLocale] ?? {};
    const resolveField = (
      field: PrimaryField,
      englishValue: string,
      localizedValue: string,
    ) => {
      const trimmedValue = englishValue.trim();
      if (!trimmedValue) {
        return "";
      }

      const defaultValue = field === "companyName" ? defaultCompanyName : defaultRole;
      if (trimmedValue === defaultValue.trim()) {
        return localizedValue;
      }

      const cached = localeFieldCache[field];
      if (cached?.source === englishValue) {
        return cached.value;
      }

      return englishValue;
    };

    return {
      companyName: resolveField("companyName", companyName, localizedTemplate.companyName),
      role: resolveField("role", role, localizedTemplate.role),
      tasks: tasks.map((task) => {
        if (task.source === "template") {
          return (
            templateTasksById[task.id] ?? {
              id: task.id,
              title: task.title,
              description: task.description,
            }
          );
        }

        const cache = localeCustomTranslations[task.id];
        return {
          id: task.id,
          title: cache?.title ?? task.title,
          description: cache?.description ?? task.description,
        };
      }),
    };
  }, [
    companyName,
    customTranslations,
    defaultCompanyName,
    defaultRole,
    fieldTranslations,
    role,
    selectedLocale,
    tasks,
  ]);
  const effectiveTemplate = useMemo(() => {
    if (selectedLocale === "en") {
      return previewTemplate;
    }

    const localeOverrides = overrides[selectedLocale] ?? {};
    const getText = (fieldKey: string, fallback: string) =>
      localeOverrides[fieldKey]?.text ?? fallback;

    return {
      companyName: getText(buildFieldKey({ type: "companyName" }), previewTemplate.companyName),
      role: getText(buildFieldKey({ type: "role" }), previewTemplate.role),
      tasks: previewTemplate.tasks.map((task) => ({
        ...task,
        title: getText(buildFieldKey({ type: "taskTitle", taskId: task.id }), task.title),
        description: getText(
          buildFieldKey({ type: "taskDescription", taskId: task.id }),
          task.description,
        ),
      })),
    };
  }, [overrides, previewTemplate, selectedLocale]);

  useEffect(() => {
    if (selectedLocale === "en") return;
    tasks.forEach((task) => {
      if (task.source === "template") return;
      const trimmedTitle = task.title.trim();
      const trimmedDescription = task.description.trim();
      if (!trimmedTitle && !trimmedDescription) return;

      const localeCache = customTranslations[selectedLocale] ?? {};
      const cached = localeCache[task.id];
      const needsTitle = trimmedTitle.length > 0 && !cached?.title;
      const needsDescription = trimmedDescription.length > 0 && !cached?.description;
      if (!needsTitle && !needsDescription) return;

      const key = `${selectedLocale}-${task.id}`;
      if (pendingCustomTranslations.current.has(key)) return;
      pendingCustomTranslations.current.add(key);

      startTranslationJob();
      (async () => {
        try {
          const [titleTranslation, descriptionTranslation] = await Promise.all([
            needsTitle ? translateWelcomeNote(task.title, selectedLocale) : Promise.resolve(cached?.title ?? ""),
            needsDescription
              ? translateWelcomeNote(task.description, selectedLocale)
              : Promise.resolve(cached?.description ?? ""),
          ]);
          setCustomTranslations((prev) => {
            const localeMap = { ...(prev[selectedLocale] ?? {}) };
            const existing = localeMap[task.id] ?? {};
            localeMap[task.id] = {
              title: needsTitle ? titleTranslation : existing.title,
              description: needsDescription ? descriptionTranslation : existing.description,
            };
            return { ...prev, [selectedLocale]: localeMap };
          });
        } catch (error) {
          console.error("Failed to translate custom task", error);
        } finally {
          pendingCustomTranslations.current.delete(key);
          finishTranslationJob();
        }
      })();
    });
  }, [customTranslations, selectedLocale, tasks]);

  useEffect(() => {
    if (selectedLocale === "en") return;

    const locale = selectedLocale;
    const localeCache = fieldTranslations[locale] ?? {};
    ( ["companyName", "role"] as PrimaryField[] ).forEach((field) => {
      const value = field === "companyName" ? companyName : role;
      const trimmedValue = value.trim();
      if (!trimmedValue) {
        return;
      }

      const defaultValue = field === "companyName" ? defaultCompanyName : defaultRole;
      if (trimmedValue === defaultValue.trim()) {
        return;
      }

      const cached = localeCache[field];
      if (cached?.source === value) {
        return;
      }

      const key = `${locale}-${field}`;
      if (pendingFieldTranslations.current.has(key)) {
        return;
      }
      pendingFieldTranslations.current.add(key);

      startTranslationJob();
      translateWelcomeNote(value, locale)
        .then((result) => {
          setFieldTranslations((prev) => {
            const localeEntries = { ...(prev[locale] ?? {}) };
            localeEntries[field] = {
              source: value,
              value: result,
            };
            return { ...prev, [locale]: localeEntries };
          });
        })
        .catch((error) => {
          console.error(`Failed to translate ${field}`, error);
        })
        .finally(() => {
          pendingFieldTranslations.current.delete(key);
          finishTranslationJob();
        });
    });
  }, [companyName, defaultCompanyName, defaultRole, fieldTranslations, role, selectedLocale]);

  const shouldTranslate =
    selectedLocale !== "en" && welcomeNote.trim().length > 0;

  useEffect(() => {
    if (!shouldTranslate) {
      return;
    }

    let cancelled = false;
    const cached = welcomeCache.current[selectedLocale];
    if (cached && cached.source === welcomeNote) {
      setTranslatedWelcome(cached.value);
      return;
    }

    setIsTranslating(true);
    setTranslationError(false);
    startTranslationJob();
    translateWelcomeNote(welcomeNote, selectedLocale)
      .then((result) => {
        if (cancelled) return;

        welcomeCache.current[selectedLocale] = {
          source: welcomeNote,
          value: result,
        };
        setTranslatedWelcome(result);
      })
      .catch(() => {
        if (cancelled) return;
        setTranslationError(true);
        setTranslatedWelcome(welcomeNote);
      })
      .finally(() => {
        if (!cancelled) {
          setIsTranslating(false);
        }
        finishTranslationJob();
      });

    return () => {
      cancelled = true;
    };
  }, [selectedLocale, shouldTranslate, welcomeNote]);

  const previewWelcome =
    shouldTranslate && !translationError ? translatedWelcome : welcomeNote;

  const qaComparisons = useMemo(() => {
    if (selectedLocale === "en") {
      return [];
    }

    const localeOverrides = overrides[selectedLocale] ?? {};
    const machineTaskMap = new Map(previewTemplate.tasks.map((task) => [task.id, task]));

    return tasks.map((task) => {
      const machineTask =
        machineTaskMap.get(task.id) ?? {
          id: task.id,
          title: task.title,
          description: task.description,
        };
      const effectiveTask =
        effectiveTemplate.tasks.find((t) => t.id === task.id) ?? machineTask;

      const titleKey = buildFieldKey({ type: "taskTitle", taskId: task.id });
      const descriptionKey = buildFieldKey({ type: "taskDescription", taskId: task.id });
      const titleStatus = localeOverrides[titleKey]?.status ?? "machine";
      const descriptionStatus = localeOverrides[descriptionKey]?.status ?? "machine";

      const titleRatio =
        task.title.length > 0
          ? effectiveTask.title.length / task.title.length
          : 1;
      const descriptionRatio =
        task.description.length > 0
          ? effectiveTask.description.length / task.description.length
          : 1;

      const titleNeedsReview = titleRatio > LENGTH_ALERT_RATIO;
      const descriptionNeedsReview = descriptionRatio > LENGTH_ALERT_RATIO;

      return {
        id: task.id,
        english: task,
        machine: machineTask,
        target: effectiveTask,
        titleStatus,
        descriptionStatus,
        titleNeedsReview,
        descriptionNeedsReview,
        titleKey,
        descriptionKey,
      };
    });
  }, [effectiveTemplate, overrides, previewTemplate, selectedLocale, tasks]);

  const qaIssues = qaComparisons.filter(
    (comparison) => comparison.titleNeedsReview || comparison.descriptionNeedsReview,
  ).length;
  const localeLabel = getLocaleLabel(selectedLocale);
  const isQaMode = viewMode === "qa";
  const companyFieldKey = buildFieldKey({ type: "companyName" });
  const roleFieldKey = buildFieldKey({ type: "role" });
  const companyStatus = getStatusForField(selectedLocale, companyFieldKey);
  const roleStatus = getStatusForField(selectedLocale, roleFieldKey);
  const statusBadgeClass = (status: TranslationStatus) =>
    `inline-flex items-center rounded-full border border-white/10 px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[status]} dark:border-slate-700`;
  const warningBadgeClass =
    "inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-100";
  const hasTranslationsInFlight = translationCount > 0;
  const readableLocaleName = LOCALE_BADGE_LABELS[selectedLocale] ?? selectedLocale;

  const handleTaskChange = (index: number, field: "title" | "description", value: string) => {
    const currentTask = tasks[index];
    setTasks((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [field]: value,
      };
      return next;
    });
    if (currentTask && currentTask.source === "custom" && currentTask[field] !== value) {
      clearCustomTranslationsForTask(currentTask.id);
    }
  };

  const handleAddTask = () => {
    const newId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setTasks((prev) => [
      ...prev,
      {
        id: `custom-${newId}`,
        title: "",
        description: "",
        source: "custom",
      },
    ]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    clearCustomTranslationsForTask(taskId);
    removeTaskOverrides(taskId);
  };

  const handleTargetFieldChange = (fieldKey: string, machineText: string, value: string) => {
    if (selectedLocale === "en") return;
    const current = getOverrideForField(selectedLocale, fieldKey);
    if (current?.status === "approved") {
      return;
    }

    if (value === machineText) {
      updateOverride(selectedLocale, fieldKey, null);
      return;
    }

    updateOverride(selectedLocale, fieldKey, {
      text: value,
      status: "edited",
    });
  };

  const handleResetField = (fieldKey: string) => {
    if (selectedLocale === "en") return;
    const current = getOverrideForField(selectedLocale, fieldKey);
    if (current?.status === "approved") return;
    updateOverride(selectedLocale, fieldKey, null);
  };

  const handleApproveField = (fieldKey: string, effectiveText: string) => {
    if (selectedLocale === "en") return;
    updateOverride(selectedLocale, fieldKey, {
      text: effectiveText,
      status: "approved",
    });
  };

  const handleUnlockField = (fieldKey: string) => {
    if (selectedLocale === "en") return;
    const current = getOverrideForField(selectedLocale, fieldKey);
    if (!current) return;
    updateOverride(selectedLocale, fieldKey, {
      text: current.text,
      status: "edited",
    });
  };

  const handleDownloadPack = () => {
    const docWelcome = selectedLocale === "en" ? welcomeNote : previewWelcome;
    const docTasks = effectiveTemplate.tasks
      .map(
        (task, index) =>
          `<p><strong>Task ${index + 1}: ${task.title}</strong><br/>${task.description}</p>`,
      )
      .join("");

    const docHtml = `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Onboarding Pack - ${localeLabel}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.5; color: #0f172a; }
            h1 { font-size: 24px; margin-bottom: 0; }
            h2 { font-size: 18px; margin-top: 24px; }
            p { font-size: 14px; }
          </style>
        </head>
        <body>
          <h1>Onboarding Pack – ${localeLabel}</h1>
          <p><strong>Locale:</strong> ${selectedLocale}</p>
          <p><strong>Company:</strong> ${effectiveTemplate.companyName}</p>
          <p><strong>Role:</strong> ${effectiveTemplate.role}</p>
          <h2>Welcome Note</h2>
          <p>${docWelcome}</p>
          <h2>Onboarding Checklist</h2>
          ${docTasks}
        </body>
      </html>`;

    const blob = new Blob([docHtml], {
      type: "application/msword",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `onboarding-pack-${selectedLocale}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] px-4 py-10 text-foreground transition-colors">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-10 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-emerald-500/25 via-cyan-500/20 to-transparent blur-[130px]" />
        <div className="absolute left-20 top-1/3 h-[360px] w-[360px] rounded-full bg-gradient-to-tr from-indigo-500/25 via-sky-500/20 to-transparent blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-fuchsia-500/20 via-transparent to-transparent blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="space-y-5 rounded-[36px] border border-white/10 bg-slate-900/80 p-6 text-center shadow-[0_35px_120px_-30px_rgba(30,64,175,0.7)] ring-1 ring-white/5 backdrop-blur-xl transition md:text-left">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="space-y-3">
                <div className="flex justify-center">
                  <GlobalOnboardWordmark />
                </div>
                <p className="sr-only">{hrStrings["app.title"]}</p>
                <p className="text-sm font-semibold uppercase tracking-wide text-indigo-500 dark:text-indigo-300">
                  LingoHack25 showcase
                </p>
                <h1 className="text-3xl font-semibold text-slate-900 dark:text-white md:text-4xl">
                  {hrStrings["app.subtitle"]}
                </h1>
                <p className="text-base text-slate-600 dark:text-slate-300">
                  GlobalOnboard combines Lingo CLI, SDK, and CI so HR can design one onboarding flow
                  and preview it for employees in any language.
                </p>
              </div>
            </div>
            <ul className="grid gap-3 text-left text-sm text-slate-200 sm:grid-cols-2">
              {HERO_HIGHLIGHTS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 rounded-2xl border border-white/5 bg-gradient-to-r from-slate-900/70 to-slate-900/30 p-4 text-white shadow-inner transition"
                >
                  <span className="mt-0.5 text-indigo-300">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </header>

        <section className="grid items-start gap-6 lg:grid-cols-2">
          <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-[0_25px_80px_-30px_rgba(15,23,42,0.9)] backdrop-blur-2xl transition">
            <div className="mb-6 space-y-3">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                    HR Workspace
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Configure the onboarding journey for this role.
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-indigo-600/20 px-3 py-1 text-xs font-semibold text-indigo-200">
                  👤 HR / People Ops
                </span>
              </div>
              <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                <p>{hrStrings["field.base_language"]}</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {hrStrings["field.base_language_value"]}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-300">
                  Your company name
                </label>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-white dark:focus:ring-white/20"
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-300">
                  Role this onboarding is for
                </label>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-white dark:focus:ring-white/20"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                />
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <label className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-300">
                    Onboarding checklist
                  </label>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {hrStrings["section.template"]}
                  </p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  These are the steps your new hire will see. Add, edit, or remove items to fit this role.
                </p>

                <div className="mt-3 space-y-4">
                  {tasks.map((task, index) => (
                    <div
                      key={task.id}
                      className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm ring-1 ring-white/40 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                        <span>{task.source === "template" ? "Template task" : "Custom task"}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteTask(task.id)}
                          className="rounded-full px-3 py-1 text-rose-500 transition hover:bg-rose-500/10"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-2">
                        <input
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-white dark:focus:ring-white/20"
                          value={task.title}
                          onChange={(event) =>
                            handleTaskChange(index, "title", event.target.value)
                          }
                        />
                        <textarea
                          className="h-24 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-white dark:focus:ring-white/20"
                          value={task.description}
                          onChange={(event) =>
                            handleTaskChange(index, "description", event.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddTask}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-500 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-400"
                >
                  <span className="text-lg">+</span>
                  Add onboarding step
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-300">
                  Your welcome note to the new hire
                </label>
                <textarea
                  className="mt-2 h-28 w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-white dark:focus:ring-white/20"
                  placeholder={hrStrings["welcome.placeholder"]}
                  value={welcomeNote}
                  onChange={(event) => setWelcomeNote(event.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Write this once in English — we’ll translate it for each employee.
                </p>
              </div>
            </div>
          </div>

          <div className="relative rounded-[30px] border border-white/10 bg-slate-900/80 p-6 text-slate-200 shadow-[0_25px_80px_-30px_rgba(15,23,42,0.9)] backdrop-blur-2xl transition">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold tracking-wide text-slate-300">
                    Employee Experience
                  </p>
                  <p className="text-lg font-medium text-slate-900 dark:text-white">
                    This is what your new hire will see.
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-100">
                  🧑‍💼 New hire – {readableLocaleName}
                </span>
              </div>

              <div className="flex flex-col gap-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-500">
                <span>{hrStrings["field.language"]}</span>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <select
                    value={selectedLocale}
                    onChange={(event) => {
                      setSelectedLocale(event.target.value as Locale);
                    }}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:border-slate-900 focus:outline-none dark:border-white/20 dark:bg-slate-800/60 dark:text-white"
                  >
                    {SUPPORTED_LOCALES.map((locale) => (
                      <option key={locale} value={locale} className="text-slate-900">
                        {getLocaleLabel(locale)}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleDownloadPack}
                    className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-900 transition hover:border-slate-900 hover:bg-slate-50 dark:border-white/20 dark:text-white dark:hover:bg-slate-800 sm:ml-auto"
                  >
                    Download Onboarding Pack
                  </button>
                </div>
                <p className="text-xs text-muted-foreground self-end text-right sm:text-right">
                  Use this document in your HRIS, email, or onboarding portal.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-500">
                  Preview mode
                </p>
                <div className="flex gap-1 rounded-full bg-slate-100 p-1 text-xs font-semibold dark:bg-white/10">
                    <button
                      type="button"
                      onClick={() => setViewMode("single")}
                      className={`rounded-full px-4 py-1 capitalize transition ${
                        viewMode === "single"
                          ? "bg-white text-slate-900 dark:bg-slate-100 dark:text-slate-900"
                          : "text-slate-200 dark:text-slate-400"
                      }`}
                    >
                      Employee view
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("qa")}
                      className={`rounded-full px-4 py-1 capitalize transition ${
                        viewMode === "qa"
                          ? "bg-white text-slate-900 dark:bg-slate-100 dark:text-slate-900"
                          : "text-slate-200 dark:text-slate-400"
                      }`}
                    >
                    Translation QA
                  </button>
                </div>
              </div>
              {viewMode === "single" ? (
                <p className="text-xs text-muted-foreground">
                  You’re seeing the onboarding exactly like the employee.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  You’re reviewing English vs translated copy side-by-side.
                </p>
              )}
            </div>

            {isQaMode ? (
              <div className="mt-6 space-y-5">
                {selectedLocale === "en" ? (
                  <p className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-100">
                    Choose a non-English locale to compare translations side-by-side.
                  </p>
                ) : (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                        <p className="text-xs uppercase tracking-wide text-slate-300">
                          English company
                        </p>
                        <p className="text-xl font-semibold text-slate-900 dark:text-white">
                          {companyName}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                        <div className="flex items-center justify-between">
                          <p className="text-xs uppercase tracking-wide text-slate-300">
                            {localeLabel} company
                          </p>
                          <span className={statusBadgeClass(companyStatus)}>
                            {STATUS_LABELS[companyStatus]}
                          </span>
                        </div>
                        <input
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-70 dark:border-white/20 dark:bg-white/10 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
                          value={effectiveTemplate.companyName}
                          disabled={companyStatus === "approved"}
                          onChange={(event) =>
                            handleTargetFieldChange(
                              companyFieldKey,
                              previewTemplate.companyName,
                              event.target.value,
                            )
                          }
                        />
                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-200">
                          {companyStatus !== "approved" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleApproveField(companyFieldKey, effectiveTemplate.companyName)
                              }
                              className="rounded-full border border-emerald-200 px-3 py-1 text-emerald-700 transition hover:border-emerald-400 dark:border-emerald-200/30 dark:text-emerald-100"
                            >
                              Approve
                            </button>
                          )}
                          {companyStatus === "approved" && (
                            <button
                              type="button"
                              onClick={() => handleUnlockField(companyFieldKey)}
                              className="rounded-full border border-slate-300 px-3 py-1 text-slate-700 transition hover:border-slate-500 dark:border-white/30 dark:text-white"
                            >
                              Unlock
                            </button>
                          )}
                          {companyStatus !== "approved" && companyStatus !== "machine" && (
                            <button
                              type="button"
                              onClick={() => handleResetField(companyFieldKey)}
                              className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 transition hover:border-slate-400 dark:border-white/20 dark:text-white/80"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                        <p className="text-xs uppercase tracking-wide text-slate-300">
                          English role
                        </p>
                        <p className="text-base text-slate-800 dark:text-slate-100">{role}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-900/80">
                        <div className="flex items-center justify-between">
                          <p className="text-xs uppercase tracking-wide text-slate-300">
                            {localeLabel} role
                          </p>
                          <span className={statusBadgeClass(roleStatus)}>
                            {STATUS_LABELS[roleStatus]}
                          </span>
                        </div>
                        <input
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-70 dark:border-white/20 dark:bg-white/10 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
                          value={effectiveTemplate.role}
                          disabled={roleStatus === "approved"}
                          onChange={(event) =>
                            handleTargetFieldChange(
                              roleFieldKey,
                              previewTemplate.role,
                              event.target.value,
                            )
                          }
                        />
                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-200">
                          {roleStatus !== "approved" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleApproveField(roleFieldKey, effectiveTemplate.role)
                              }
                              className="rounded-full border border-emerald-200 px-3 py-1 text-emerald-700 transition hover:border-emerald-400 dark:border-emerald-200/30 dark:text-emerald-100"
                            >
                              Approve
                            </button>
                          )}
                          {roleStatus === "approved" && (
                            <button
                              type="button"
                              onClick={() => handleUnlockField(roleFieldKey)}
                              className="rounded-full border border-slate-300 px-3 py-1 text-slate-700 transition hover:border-slate-500 dark:border-white/30 dark:text-white"
                            >
                              Unlock
                            </button>
                          )}
                          {roleStatus !== "approved" && roleStatus !== "machine" && (
                            <button
                              type="button"
                              onClick={() => handleResetField(roleFieldKey)}
                              className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 transition hover:border-slate-400 dark:border-white/20 dark:text-white/80"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-100">
                      <p className="font-semibold uppercase tracking-wide text-slate-300">
                        Localization health
                      </p>
                      <p className="mt-1">
                        {qaIssues === 0
                          ? `${localeLabel}: All tasks fit within English length.`
                          : `${localeLabel}: ${qaIssues} ${
                              qaIssues === 1 ? "task needs" : "tasks need"
                            } review because translations are longer than English.`}
                      </p>
                    </div>

                    <div className="space-y-6">
                      {qaComparisons.map((comparison) => (
                        <div key={comparison.id} className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                            <p className="text-xs uppercase tracking-wide text-slate-300">
                              English task
                            </p>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {comparison.english?.title ?? "Untitled task"}
                            </p>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                              {comparison.english?.description ?? "No description available."}
                            </p>
                          </div>
                        <div className="rounded-2xl bg-slate-100 p-4 space-y-4 dark:bg-slate-900/80">
                            <div className="flex items-center justify-between">
                              <p className="text-xs uppercase tracking-wide text-slate-300">
                                {localeLabel} title
                              </p>
                              <div className="flex items-center gap-2">
                                {comparison.titleNeedsReview && (
                                  <span className={warningBadgeClass}>
                                    ⚠ <span>Longer than English</span>
                                  </span>
                                )}
                                <span className={statusBadgeClass(comparison.titleStatus)}>
                                  {STATUS_LABELS[comparison.titleStatus]}
                                </span>
                              </div>
                            </div>
                            <input
                              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-70 dark:border-white/20 dark:bg-white/10 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
                              value={comparison.target.title}
                              disabled={comparison.titleStatus === "approved"}
                              onChange={(event) =>
                                handleTargetFieldChange(
                                  comparison.titleKey,
                                  comparison.machine.title,
                                  event.target.value,
                                )
                              }
                            />
                            <div className="flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-200">
                              {comparison.titleStatus !== "approved" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleApproveField(
                                      comparison.titleKey,
                                      comparison.target.title,
                                    )
                                  }
                                  className="rounded-full border border-emerald-200 px-3 py-1 text-emerald-700 transition hover:border-emerald-400 dark:border-emerald-200/30 dark:text-emerald-100"
                                >
                                  Approve
                                </button>
                              )}
                              {comparison.titleStatus === "approved" && (
                                <button
                                  type="button"
                                  onClick={() => handleUnlockField(comparison.titleKey)}
                                  className="rounded-full border border-slate-300 px-3 py-1 text-slate-700 transition hover:border-slate-500 dark:border-white/30 dark:text-white"
                                >
                                  Unlock
                                </button>
                              )}
                              {comparison.titleStatus !== "approved" &&
                                comparison.titleStatus !== "machine" && (
                                  <button
                                    type="button"
                                    onClick={() => handleResetField(comparison.titleKey)}
                                    className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 transition hover:border-slate-400 dark:border-white/20 dark:text-white/80"
                                  >
                                    Reset
                                  </button>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                              <p className="text-xs uppercase tracking-wide text-slate-300">
                                {localeLabel} description
                              </p>
                              <div className="flex items-center gap-2">
                                {comparison.descriptionNeedsReview && (
                                  <span className={warningBadgeClass}>
                                    ⚠ <span>Longer than English</span>
                                  </span>
                                )}
                                <span className={statusBadgeClass(comparison.descriptionStatus)}>
                                  {STATUS_LABELS[comparison.descriptionStatus]}
                                </span>
                              </div>
                            </div>
                            <textarea
                              className="h-24 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-70 dark:border-white/20 dark:bg-white/10 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
                              value={comparison.target.description}
                              disabled={comparison.descriptionStatus === "approved"}
                              onChange={(event) =>
                                handleTargetFieldChange(
                                  comparison.descriptionKey,
                                  comparison.machine.description,
                                  event.target.value,
                                )
                              }
                            />
                            <div className="flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-200">
                              {comparison.descriptionStatus !== "approved" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleApproveField(
                                      comparison.descriptionKey,
                                      comparison.target.description,
                                    )
                                  }
                                  className="rounded-full border border-emerald-200 px-3 py-1 text-emerald-700 transition hover:border-emerald-400 dark:border-emerald-200/30 dark:text-emerald-100"
                                >
                                  Approve
                                </button>
                              )}
                              {comparison.descriptionStatus === "approved" && (
                                <button
                                  type="button"
                                  onClick={() => handleUnlockField(comparison.descriptionKey)}
                                  className="rounded-full border border-slate-300 px-3 py-1 text-slate-700 transition hover:border-slate-500 dark:border-white/30 dark:text-white"
                                >
                                  Unlock
                                </button>
                              )}
                              {comparison.descriptionStatus !== "approved" &&
                                comparison.descriptionStatus !== "machine" && (
                                  <button
                                    type="button"
                                    onClick={() => handleResetField(comparison.descriptionKey)}
                                    className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 transition hover:border-slate-400 dark:border-white/20 dark:text-white/80"
                                  >
                                    Reset
                                  </button>
                                )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="mt-6 space-y-6">
                <p className="text-xs text-muted-foreground">
                  Viewing as a new hire in {readableLocaleName}.
                </p>
                <div>
                  <p className="text-sm uppercase tracking-wide text-slate-400">
                    {previewStrings["field.company_name"]}
                  </p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                    {effectiveTemplate.companyName}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                    {effectiveTemplate.role}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                    {previewStrings["section.welcome_note"]}
                  </p>
                  <p className="mt-2 rounded-2xl bg-slate-100 p-4 text-base leading-relaxed text-slate-800 dark:bg-white/5 dark:text-slate-100">
                    {previewWelcome}
                  </p>
                  {shouldTranslate && (isTranslating || translationError) && (
                    <p className="mt-2 text-xs text-slate-300">
                      {isTranslating
                        ? previewStrings["status.translating"]
                        : previewStrings["status.translation_error"]}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                    Your onboarding steps
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Here’s what your first days with the company will look like.
                  </p>
                  <ol className="mt-3 space-y-3">
                    {effectiveTemplate.tasks.map((task) => (
                      <li
                        key={task.id}
                        className="rounded-2xl bg-slate-100 p-4 dark:bg-white/5"
                      >
                        <p className="font-semibold text-slate-900 dark:text-white">{task.title}</p>
                        <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                          {task.description}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
            {hasTranslationsInFlight && (
              <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center rounded-4xl bg-background/70 backdrop-blur-sm dark:bg-background/60">
                <div className="mb-2 h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                <p className="text-sm text-muted-foreground">Translating content…</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
