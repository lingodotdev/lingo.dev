"use client";

import { useState, useCallback } from "react";
import { useBuilderStore } from "@/store/builder";
import { motion, AnimatePresence } from "framer-motion";
import { CircleOff, Delete, SquarePen } from "lucide-react";
import { FormField, FieldType } from "@/lib/schema";
import { Select } from "../select";
import { Input } from "../input";

type EditFormState = {
    name: string;
    label: string;
    placeholder: string;
    type: FieldType;
    required: boolean;
    minLength: string;
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

export default function FieldList() {
    const { forms, activeFormId, removeField, updateField } =
        useBuilderStore();

    const activeForm = forms.find((f) => f.id === activeFormId);
    const [editing, setEditing] = useState<FormField | null>(null);

    if (!activeForm) {
        return (
            <div className="text-sm text-subtxt italic">
                No form selected.
            </div>
        );
    }

    if (!activeForm.fields.length) {
        return (
            <div className="text-base sm:text-lg text-subtxt p-4 flex flex-col items-center gap-2 text-center">
                <CircleOff size={64} />
                No fields added yet.
            </div>
        );
    }

    return (
        <>
            <div className="space-y-3 sm:space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {activeForm.fields.map((field) => (
                    <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="rounded-lg border border-boder bg-crd px-3 sm:px-4 py-2 flex items-start sm:items-center justify-between gap-3"
                    >
                        <div className="flex flex-col">
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="font-semibold text-text">
                                    {field.label}
                                </p>

                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <Badge>{field.type}</Badge>
                                    <Badge>
                                        {field.validations?.required
                                            ? "Required"
                                            : "Optional"}
                                    </Badge>
                                    {field.validations?.minLength && (
                                        <Badge>
                                            Min: {field.validations.minLength}
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {field.placeholder && (
                                <p className="text-xs sm:text-sm text-subtext">
                                    {field.placeholder}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                            <button
                                onClick={() => setEditing(field)}
                                className="p-1.5 sm:px-2 sm:py-1 rounded-xl text-green-500 hover:bg-green-50 transition"
                                aria-label="Edit field"
                            >
                                <SquarePen size={18} />
                            </button>

                            <button
                                onClick={() => removeField(field.id)}
                                className="p-1.5 sm:px-2 sm:py-1 rounded-xl text-red-500 hover:bg-red-50 transition"
                                aria-label="Delete field"
                            >
                                <Delete size={18} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {editing && (
                    <EditFieldDialog
                        field={editing}
                        onClose={() => setEditing(null)}
                        onSave={(data) => {
                            updateField(editing.id, data);
                            setEditing(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

function EditFieldDialog({
    field,
    onClose,
    onSave,
}: {
    field: FormField;
    onClose: () => void;
    onSave: (data: Partial<FormField>) => void;
}) {
    const [form, setForm] = useState<EditFormState>({
        name: field.name,
        label: field.label,
        placeholder: field.placeholder || "",
        type: field.type,
        required: field.validations?.required ?? true,
        minLength: field.validations?.minLength?.toString() || "",
    });

    const update = useCallback(
        <K extends keyof EditFormState>(
            key: K,
            value: EditFormState[K]
        ) => {
            setForm((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const handleSave = useCallback(() => {
        onSave({
            name: form.name.trim(),
            label: form.label.trim(),
            placeholder: form.placeholder.trim(),
            type: form.type,
            validations: {
                required: form.required,
                minLength: form.minLength
                    ? Number(form.minLength)
                    : undefined,
            },
        });
    }, [form, onSave]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-lg rounded-xl p-4 sm:p-6 shadow-xl"
            >
                <h2 className="text-base sm:text-lg font-semibold mb-4">
                    Edit Field
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <Input
                        label="Label"
                        value={form.label}
                        onChange={(v) => update("label", v)}
                    />

                    <Input
                        label="Key"
                        value={form.name}
                        onChange={(v) => update("name", v)}
                    />

                    <Input
                        label="Placeholder"
                        value={form.placeholder}
                        onChange={(v) => update("placeholder", v)}
                    />

                    <Select
                        label="Type"
                        value={form.type}
                        onChange={(v) => update("type", v as FieldType)}
                        options={FIELD_TYPES}
                    />

                    <Input
                        label="Min Length"
                        type="number"
                        value={form.minLength}
                        onChange={(v) => update("minLength", v)}
                    />

                    <label className="flex items-center gap-2 col-span-full text-sm pt-1">
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

                <div className="mt-5 sm:mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-1 border rounded-full hover:bg-muted w-full sm:w-auto"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        className="px-4 py-1 bg-prim text-white rounded-full hover:bg-prim/80 w-full sm:w-auto"
                    >
                        Save Changes
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

function Badge({ children }: { children: React.ReactNode }) {
    return (
        <span className="text-xs rounded-xl px-2 py-0.5 text-subtext capitalize bg-mute">
            {children}
        </span>
    );
}
