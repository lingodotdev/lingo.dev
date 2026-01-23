import { z } from 'zod';

export const createValidationSchema = (t: (key: string) => string) => {
    return z.object({
        name: z.string()
            .min(2, { message: t('name.minLength') })
            .max(50, { message: t('name.maxLength') }),
        email: z.string()
            .min(1, { message: t('email.required') })
            .email({ message: t('email.invalid') }),
        phone: z.string()
            .optional()
            .refine((val) => !val || /^[\d\s\-\+\(\)]{10,15}$/.test(val.replace(/[\s\-\+\(\)]/g, '')), {
                message: t('phone.invalid'),
            }),
        preferences: z.object({
            weekly: z.boolean(),
            promotions: z.boolean(),
            updates: z.boolean(),
        }),
        privacy: z.boolean()
            .refine((val) => val === true, {
                message: t('privacy.required'),
            }),
        frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
    });
};

export type ValidationSchema = ReturnType<typeof createValidationSchema>;
export type NewsletterFormData = z.infer<ValidationSchema>;