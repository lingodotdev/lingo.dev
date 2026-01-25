"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBuilderStore } from "@/store/builder";
import { FieldType } from "@/lib/schema";
import { Input } from "../input";
import { Select } from "../select";

type FieldForm = {
    name: string;
    label: string;
    placeholder: string;
    type: FieldType;
    required: boolean;
    minLength: string;
};

const DEFAULT_FORM: FieldForm = {
    name: "",
    label: "",
    placeholder: "",
    type: "text",
    required: true,
    minLength: "",
};

const FIELD_TYPES: FieldType[] = [
    "text",
    "email",
    "password",
    "textarea",
    "number",
    "url",
    "checkbox",
    "radio",
    "select",
];

export default function FieldEditor() {
    const addField = useBuilderStore((s) => s.addField);

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<FieldForm>(DEFAULT_FORM);

    useEffect(() => {
        if (!open) setForm(DEFAULT_FORM);
    }, [open]);

    const update = useCallback(
        <K extends keyof FieldForm>(key: K, value: FieldForm[K]) => {
            setForm((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const handleAdd = useCallback(() => {
        const name = form.name.trim();
        const label = form.label.trim();

        if (!name || !label) return;

        addField({
            name,
            label,
            placeholder: form.placeholder.trim() || undefined,
            type: form.type,
            validations: {
                required: form.required,
                minLength: form.minLength
                    ? Number(form.minLength)
                    : undefined,
            },
        });

        setOpen(false);
    }, [form, addField]);

    return (
        <>
            {/* Trigger */}
            <button
                onClick={() => setOpen(true)}
                className="px-4 py-1 bg-prim text-white rounded-2xl shadow-sm hover:opacity-80 transition text-sm sm:text-base"
            >
                Add Field
            </button>

            {/* Modal */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 sm:p-6"
                        onClick={() => setOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full max-w-lg rounded-xl p-4 sm:p-6 shadow-xl"
                        >
                            <header className="mb-4 sm:mb-5">
                                <h2 className="text-base sm:text-lg font-semibold">
                                    Add Field
                                </h2>
                            </header>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <Input
                                    label="Label"
                                    placeholder="Full Name"
                                    value={form.label}
                                    onChange={(v) => update("label", v)}
                                />

                                <Input
                                    label="Field Key"
                                    placeholder="fullName"
                                    value={form.name}
                                    onChange={(v) => update("name", v)}
                                />

                                <Input
                                    label="Placeholder"
                                    placeholder="Enter your name"
                                    value={form.placeholder}
                                    onChange={(v) => update("placeholder", v)}
                                />

                                <Select
                                    label="Field Type"
                                    value={form.type}
                                    onChange={(v) => update("type", v as FieldType)}
                                    options={FIELD_TYPES}
                                />

                                <Input
                                    label="Min Length"
                                    type="number"
                                    placeholder="0"
                                    value={form.minLength}
                                    onChange={(v) => update("minLength", v)}
                                />

                                <label className="flex items-center gap-3 text-sm col-span-full pt-1">
                                    <input
                                        type="checkbox"
                                        checked={form.required}
                                        onChange={(e) =>
                                            update("required", e.target.checked)
                                        }
                                        className="w-4 h-4"
                                    />
                                    Required field
                                </label>
                            </div>

                            <footer className="mt-5 sm:mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                                <button
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-1 border rounded-full hover:bg-muted w-full sm:w-auto"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleAdd}
                                    className="px-4 py-1 bg-prim text-white rounded-full hover:bg-prim/80 w-full sm:w-auto"
                                >
                                    Add Field
                                </button>
                            </footer>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
