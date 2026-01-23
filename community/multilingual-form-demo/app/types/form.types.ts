import { UseFormRegisterReturn } from "react-hook-form";

export type FrequencyType = "daily" | "weekly" | "monthly";

export interface PreferencesData {
    weekly: boolean;
    promotions: boolean;
    updates: boolean;
}

export interface NewsletterFormData {
    name: string;
    email: string;
    phone?: string;
    preferences: PreferencesData;
    privacy: boolean;
    frequency?: FrequencyType;
}

export interface FormFieldProps {
    error?: string;
    label: string;
    id: string;
}

export interface InputFieldProps extends FormFieldProps {
    placeholder: string;
    type?: string;
    icon: React.ReactNode;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    register?: UseFormRegisterReturn;
    helperText?: string;
}

export interface CheckboxFieldProps {
    id: string;
    label: string;
    description?: string;
    checked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    register?: UseFormRegisterReturn;
}

export interface SelectFieldProps {
    options: Array<{ value: string; label: string }>;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
}
