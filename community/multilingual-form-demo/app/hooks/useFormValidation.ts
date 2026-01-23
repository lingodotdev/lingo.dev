"use client";

import { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import type { NewsletterFormData } from "../types/form.types";
import { createValidationSchema } from "@/lib/validation";

export function useFormValidation(
    tValidation: (key: string) => string
): ReturnType<typeof createValidationSchema> {
    return useMemo(() => createValidationSchema(tValidation), [tValidation]);
}

export function useFormHelpers(_form: UseFormReturn<NewsletterFormData>) {
    const formatPhoneNumber = (value: string): string => {
        const numbers = value.replace(/\D/g, "");
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 6)
            return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
        return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6)}`;
    };

    return {
        formatPhoneNumber,
    };
}
