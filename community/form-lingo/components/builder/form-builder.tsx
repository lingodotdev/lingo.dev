"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import FieldEditor from "./field-editor";
import FieldList from "./field-list";
import { useBuilderStore } from "@/store/builder";
import { LANGUAGES } from "@/lib/languages";
import {
    CircleChevronLeft,
    CirclePlus,
    TextInitial,
    Trash,
    Menu,
} from "lucide-react";
import { Select } from "../select";

const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED = 72;

export default function FormBuilder() {
    const router = useRouter();

    const [collapsed, setCollapsed] = useState(false);
    const [search, setSearch] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    const {
        forms,
        activeFormId,
        setActiveForm,
        createForm,
        updateFormMeta,
        deleteForm,
    } = useBuilderStore();

    useEffect(() => {
        const check = () => setIsDesktop(window.innerWidth >= 1024);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const activeForm = useMemo(
        () => forms.find((f) => f.id === activeFormId),
        [forms, activeFormId]
    );

    const filteredForms = useMemo(() => {
        const q = search.toLowerCase();
        return forms.filter((f) => f.title.toLowerCase().includes(q));
    }, [forms, search]);

    const handleDelete = useCallback(
        (id: string) => {
            if (forms.length === 1) return;
            deleteForm(id);
        },
        [deleteForm, forms.length]
    );

    if (!activeForm) return null;

    const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH;

    return (
        <div className="min-h-screen bg-bg flex relative">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-14 z-40 bg-crd border-b border-boder flex items-center px-4">
                <button
                    onClick={() => setMobileOpen(true)}
                    className="p-2 rounded-lg hover:bg-mute"
                >
                    <Menu size={22} />
                </button>
                <h2 className="ml-3 font-semibold truncate">
                    {activeForm.title || "Untitled Form"}
                </h2>
            </div>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {!isDesktop && mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 z-40"
                        onClick={() => setMobileOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: sidebarWidth,
                    x: isDesktop ? 0 : mobileOpen ? 0 : -sidebarWidth,
                }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="
          fixed lg:static z-50 lg:z-10
          left-0 top-0 bottom-0
          bg-crd border-r p-3 flex flex-col
          overflow-hidden
        "
            >
                <div className="flex items-center justify-between mb-2">
                    {!collapsed && <h2 className="font-semibold text-lg">Your Forms</h2>}

                    <button
                        onClick={() => setCollapsed((v) => !v)}
                        className="hidden lg:inline-flex hover:bg-muted p-1 rounded-xl px-2"
                    >
                        <motion.div animate={{ rotate: collapsed ? 180 : 0 }}>
                            <CircleChevronLeft />
                        </motion.div>
                    </button>
                </div>

                <button
                    onClick={createForm}
                    className={`text-sm ${collapsed ? "py-2.5" : "py-1"}
            rounded-xl bg-prim text-white mb-2 flex items-center justify-center gap-2 hover:bg-prim/80 transition`}
                >
                    <CirclePlus size={20} />
                    {!collapsed && "New Form"}
                </button>

                {!collapsed && (
                    <input
                        placeholder="Search forms..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full mb-2 px-3 py-1 border border-boder rounded bg-crd text-sm"
                    />
                )}

                <div className="flex-1 space-y-1 overflow-y-auto pr-1">
                    {filteredForms.map((form, i) => (
                        <motion.button
                            key={form.id}
                            onClick={() => {
                                setActiveForm(form.id);
                                setMobileOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-2 py-1 rounded-xl transition ${form.id === activeFormId
                                    ? "bg-black text-white"
                                    : "hover:bg-mute"
                                }`}
                        >
                            <div className="size-8 flex items-center justify-center rounded-lg bg-crd text-black font-semibold">
                                {i + 1}
                            </div>

                            {!collapsed && (
                                <div className="flex items-center justify-between gap-2 w-full">
                                    <span className="truncate w-40 text-sm">
                                        {form.title || "Untitled Form"}
                                    </span>

                                    <span
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(form.id);
                                        }}
                                        className="px-2 py-1 rounded-xl hover:bg-red-100 hover:text-red-600 transition"
                                    >
                                        <Trash size={18} />
                                    </span>
                                </div>
                            )}
                        </motion.button>
                    ))}
                </div>
            </motion.aside>

            {/* Main */}
            <main
                // style={{ marginLeft: isDesktop ? sidebarWidth : 0 }}
                className="flex-1 pt-16 lg:pt-6 p-4 sm:p-6 lg:p-8 overflow-y-auto transition-all"
            >
                <header className="mb-6 sm:mb-8 flex gap-3">
                    <div className="flex items-center justify-center size-12 sm:size-14 bg-acc rounded-xl shrink-0">
                        <TextInitial size={40} />
                    </div>

                    <div className="flex-1 min-w-0">
                        <input
                            value={activeForm.title}
                            onChange={(e) =>
                                updateFormMeta({ title: e.target.value })
                            }
                            className="text-xl sm:text-3xl font-bold bg-transparent outline-none border-b border-transparent focus:border-boder w-full truncate"
                        />
                        <p className="text-subtext text-xs sm:text-sm">
                            Click title to rename your form
                        </p>
                    </div>
                </header>

                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 max-w-3xl">
                    <Select
                        label="Form Language"
                        value={activeForm.ownerLanguage}
                        onChange={(v) =>
                            updateFormMeta({ ownerLanguage: v })
                        }
                        options={LANGUAGES.map((l) => l.code)}
                    />

                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            Form Color
                        </label>
                        <input
                            type="text"
                            placeholder="#3b82f6"
                            value={activeForm.color || ""}
                            onChange={(e) =>
                                updateFormMeta({ color: e.target.value })
                            }
                            className="w-full px-3 py-1 border border-boder rounded bg-crd"
                        />
                    </div>
                </section>

                <div className="bg-crd p-3 sm:p-4 rounded-lg">
                    <div className="flex flex-wrap justify-between gap-2 mb-4 p-3 sm:p-4 bg-mute rounded-full">
                        <h2 className="text-lg sm:text-xl font-semibold">
                            Fields
                            <span className="text-subtxt ml-1">
                                ({activeForm.fields.length})
                            </span>
                        </h2>
                        <FieldEditor />
                    </div>

                    <FieldList />
                </div>

                <footer className="mt-8 sm:mt-10 flex justify-end">
                    <button
                        onClick={() => router.push("/preview")}
                        className="px-5 py-1.5 text-base sm:text-lg font-medium bg-acc rounded-full hover:bg-acc/80 transition"
                    >
                        Preview
                    </button>
                </footer>
            </main>
        </div>
    );
}
