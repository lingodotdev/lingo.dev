"use client";

import { useEffect, useMemo, useState, useCallback, JSX } from "react";
import { FormSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateZodSchema } from "@/lib/zod-builder";
import { motion, AnimatePresence } from "framer-motion";
import { translateObjectData } from "@/lib/lingo-client";
import { ListOrdered, Loader } from "lucide-react";
import { LANGUAGES } from "@/lib/languages";
import { useBuilderStore } from "@/store/builder";

type Props = {
    schema: FormSchema;
};

export default function LiveForm({ schema }: Props) {
    const accent = schema.color || "#4f46e5";

    const [activeSchema, setActiveSchema] = useState<FormSchema>(schema);
    const [activeLang, setActiveLang] = useState(schema.ownerLanguage);
    const [translating, setTranslating] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const { addFormData } = useBuilderStore();

    const zodSchema = useMemo(
        () => generateZodSchema(activeSchema),
        [activeSchema]
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(zodSchema as any),
    });

    useEffect(() => {
        let mounted = true;

        const translateSchema = async () => {
            try {
                setTranslating(true);

                const payload = schema.fields.reduce((acc, f, index) => {
                    acc[`label_${index}`] = f.label;
                    acc[`placeholder_${index}`] = f.placeholder;
                    return acc;
                }, {} as Record<string, any>);

                const translated = await translateObjectData(
                    payload,
                    schema.ownerLanguage,
                    activeLang
                );

                if (!mounted) return;

                const translatedFields = schema.fields.map((f, index) => ({
                    ...f,
                    label: translated[`label_${index}`],
                    placeholder: translated[`placeholder_${index}`],
                }));

                setActiveSchema({ ...schema, fields: translatedFields });
            } catch (err) {
                console.error("Schema translation error:", err);
                setActiveSchema(schema);
            } finally {
                mounted && setTranslating(false);
            }
        };

        if (activeLang !== schema.ownerLanguage) {
            translateSchema();
        } else {
            setActiveSchema(schema);
        }

        return () => {
            mounted = false;
        };
    }, [activeLang, schema]);

    const onSubmit = useCallback(
        async (data: Record<string, any>) => {
            try {
                setSubmitting(true);

                const translated = await translateObjectData(
                    data,
                    activeLang,
                    schema.ownerLanguage
                );

                addFormData(translated);
                reset();
            } catch (err) {
                console.error("Submit error:", err);
            } finally {
                setSubmitting(false);
            }
        },
        [activeLang, schema.ownerLanguage, addFormData, reset]
    );

    return (
        <div
            className="min-h-screen flex flex-col items-center p-4"
            style={{ backgroundColor: `${accent}22` }}
        >
            <AnimatePresence>
                {translating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center"
                    >
                        <div className="bg-crd p-4 rounded-xl shadow-lg flex flex-col items-center gap-3">
                            <Loader className="animate-spin" size={32} />
                            <p className="text-sm font-medium">Translating form...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full max-w-xl"
            >
                {/* Header */}
                <div className="mb-6 bg-crd p-4 sm:p-6 flex flex-col gap-3 border-2 border-black rounded">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center justify-center size-12 rounded-lg"
                            style={{ backgroundColor: accent }}
                        >
                            <ListOrdered size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-semibold tracking-wide">
                                {activeSchema.title || "Form"}
                            </h2>
                            <p className="text-subtxt text-sm">
                                Fill out the form below properly and submit.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <p className="text-subtxt text-sm">
                            <span className="font-semibold text-txt">Note:</span> * indicates
                            required field
                        </p>

                        <select
                            value={activeLang}
                            onChange={(e) => setActiveLang(e.target.value)}
                            disabled={translating}
                            className="w-full sm:w-44 border border-black rounded-lg px-3 py-1.5 bg-crd disabled:opacity-60"
                        >
                            {LANGUAGES.map((l) => (
                                <option key={l.code} value={l.code}>
                                    {l.code} - {l.nativeName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    {activeSchema.fields.map((field) => (
                        <div
                            key={field.id}
                            className="bg-crd p-4 border border-black rounded"
                        >
                            <label className="block text-sm font-medium mb-1 pl-4">
                                {field.label}
                                {field.validations?.required ? " *" : ""}
                            </label>

                            <RenderField
                                field={field} register={register}
                            />

                            <AnimatePresence>
                                {errors[field.name] && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -3 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -3 }}
                                        transition={{ duration: 0.15 }}
                                        className="text-xs text-red-500 mt-1 pl-4"
                                    >
                                        {String(errors[field.name]?.message)}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}

                    {/* Footer */}
                    <div className="bg-crd p-4 border border-black rounded-xl flex flex-col sm:flex-row items-center gap-3">
                        <button
                            type="button"
                            onClick={() => reset()}
                            className="px-4 py-1 border rounded-full hover:bg-muted w-full sm:w-auto"
                        >
                            Reset
                        </button>

                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={submitting}
                            style={{ backgroundColor: accent }}
                            className="w-full flex-1 flex items-center justify-center py-1.5 rounded-full text-black font-medium shadow-md transition disabled:opacity-80"
                        >
                            {submitting ? (
                                <Loader size={22} className="animate-spin" />
                            ) : (
                                "Submit"
                            )}
                        </motion.button>
                    </div>
                </form>
            </motion.div>

            <div className="h-px mt-4 max-w-2xl w-full bg-subtxt" />
            <footer className="mt-8 text-xs text-subtxt text-center flex flex-col gap-1">
                <span>Powered by FormLingo with 💚</span>
                <span>
                    Developed by{" "}
                    <a
                        href="http://gupta-shubham-11.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-prim hover:underline"
                    >
                        Shubham
                    </a>
                </span>
            </footer>
        </div>
    );
}

type RenderFieldProps = {
    field: any;
    register: any;
};

function RenderField({ field, register }: RenderFieldProps) {
    const base =
        "w-full border border-boder rounded-full pl-4 px-3 py-2 bg-crd outline-none transition focus:ring-2 focus:ring-prim/20 disabled:opacity-60";

    switch (field.type) {
        case "textarea":
            return (
                <textarea
                    {...register(field.name)}
                    placeholder={field.placeholder}
                    className={`${base} min-h-[90px] resize-y`}
                />
            );

        case "checkbox":
            return (
                <label className="flex items-center gap-3 pl-4">
                    <input
                        type="checkbox"
                        {...register(field.name)}
                        className="w-4 h-4"
                    />
                    <span className="text-sm">Yes</span>
                </label>
            );

        case "radio":
        case "select":
            return (
                <select {...register(field.name)} className={base}>
                    <option value="">Select option</option>
                    {field.options?.map((opt: any) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            );

        default:
            return (
                <input
                    type={field.type}
                    {...register(field.name)}
                    placeholder={field.placeholder}
                    className={base}
                />
            );
    }
}
