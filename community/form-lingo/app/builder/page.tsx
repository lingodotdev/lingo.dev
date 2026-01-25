"use client";

import FormBuilder from "@/components/builder/form-builder";
import FormData from "@/components/builder/form-data";

export default function BuilderPage() {
    return (
        <main className="min-h-screen bg-bg flex flex-col">
            <FormBuilder />

            {/* Submissions Panel */}
            <section className="border-t border-boder bg-card px-4 py-6 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <FormData />
                </div>
            </section>
        </main>
    );
}
