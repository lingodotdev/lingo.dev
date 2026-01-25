"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useBuilderStore } from "@/store/builder";
import { Inbox } from "lucide-react";

export default function FormData() {
    const { forms, activeFormId } = useBuilderStore();

    const activeForm = forms.find((f) => f.id === activeFormId);
    const submissions = activeForm?.data || [];

    if (!activeForm) {
        return (
            <div className="text-sm text-subtext italic">
                No form selected.
            </div>
        );
    }

    if (!submissions.length) {
        return (
            <div className="flex flex-col items-center justify-center p-6 sm:p-10 text-subtext gap-2 sm:gap-3 text-center">
                <Inbox size={56} className="sm:w-16 sm:h-16" />
                <p className="text-base sm:text-lg font-medium">
                    No submissions yet
                </p>
                <p className="text-xs sm:text-sm max-w-md">
                    Form responses will appear here after users submit the form.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3 sm:space-y-4">
            <header className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg sm:text-xl font-semibold">
                    Submissions
                    <span className="text-subtext text-sm ml-1">
                        ({submissions.length})
                    </span>
                </h2>
            </header>

            <AnimatePresence>
                <div className="space-y-3 sm:space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                    {submissions.map((entry, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.18 }}
                            className="border border-boder bg-crd rounded-xl p-3 sm:p-4 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <p className="font-medium text-text text-sm sm:text-base">
                                    Submission #{index + 1}
                                </p>
                            </div>

                            <pre className="text-[11px] sm:text-xs bg-muted p-2.5 sm:p-3 rounded-lg overflow-x-auto leading-relaxed">
                                {JSON.stringify(entry, null, 2)}
                            </pre>
                        </motion.div>
                    ))}
                </div>
            </AnimatePresence>
        </div>
    );
}
