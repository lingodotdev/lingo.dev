export type FieldType =
    | "text"
    | "email"
    | "password"
    | "textarea"
    | "number"
    | "url"
    | "checkbox"
    | "radio"
    | "select";

export type ValidationRule = Readonly<{
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
}>;

export type FieldOption = Readonly<{
    label: string;
    value: string;
}>;

export type FormField = Readonly<{
    id: string;
    name: string;
    label: string;
    placeholder?: string;
    type: FieldType;
    options?: readonly FieldOption[];
    validations?: ValidationRule;
    defaultValue?: unknown;
}>;

export type FormSchema = Readonly<{
    id: string;
    title: string;
    color?: string;
    ownerLanguage: string;
    supportedLanguages: readonly string[];
    fields: readonly FormField[];
    data: readonly Record<string, unknown>[];
    createdAt?: string;
    updatedAt?: string;
}>;
