"use client";

import { motion } from "framer-motion";
import { useBuilderStore } from "@/store/builder";
import LiveForm from "@/components/preview/live-form";

export default function PreviewPage() {
    const { forms, activeFormId } = useBuilderStore();
    const activeForm = forms.find((f) => f.id === activeFormId);

    if (!activeForm) {
        return (
            <div className="min-h-screen flex items-center justify-center text-subtext">
                No form selected.
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full"
        >
            <LiveForm schema={activeForm} />
        </motion.div>
    );
}
