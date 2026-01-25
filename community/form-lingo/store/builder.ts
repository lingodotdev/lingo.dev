import { create } from "zustand";
import { nanoid } from "nanoid";
import { FormField, FormSchema } from "@/lib/schema";
import { LANGUAGES } from "@/lib/languages";
import { sampleSchema } from "@/lib/sample-schema";

const STORAGE_KEY = "formlingo-forms";

type BuilderState = {
    forms: FormSchema[];
    activeFormId: string | null;

    createForm: () => void;
    setActiveForm: (id: string) => void;
    deleteForm: (id: string) => void;
    updateFormMeta: (data: Partial<FormSchema>) => void;

    addField: (field: Omit<FormField, "id">) => void;
    updateField: (id: string, field: Partial<FormField>) => void;
    removeField: (id: string) => void;

    addFormData: (data: Record<string, unknown>) => void;
    clearFormData: () => void;
};

const createEmptyForm = (): FormSchema => ({
    id: nanoid(),
    title: "Untitled Form",
    color: "#3b82f6",
    ownerLanguage: "en",
    supportedLanguages: LANGUAGES.map((l) => l.code),
    fields: [],
    data: [],
});

const safeParse = (value: string | null): FormSchema[] | null => {
    if (!value) return null;
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
};

const loadForms = (): FormSchema[] => {
    if (typeof window === "undefined") return [];

    const parsed = safeParse(localStorage.getItem(STORAGE_KEY));

    if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
    }

    return [{ ...sampleSchema, id: nanoid() }];
};

const saveForms = (forms: FormSchema[]) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
    }
};

const updateForms =
    (updater: (forms: FormSchema[], activeId: string | null) => FormSchema[]) =>
        (set: any) =>
            set((state: BuilderState) => {
                const forms = updater(state.forms, state.activeFormId);
                saveForms(forms);
                return { forms };
            });

export const useBuilderStore = create<BuilderState>((set) => {
    const initialForms = loadForms();

    return {
        forms: initialForms,
        activeFormId: initialForms[0]?.id ?? null,

        createForm: () =>
            set((state) => {
                const newForm = createEmptyForm();
                const forms = [...state.forms, newForm];
                saveForms(forms);
                return { forms, activeFormId: newForm.id };
            }),

        setActiveForm: (id) => set({ activeFormId: id }),

        deleteForm: (id) =>
            set((state) => {
                const forms = state.forms.filter((f) => f.id !== id);
                saveForms(forms);
                return { forms, activeFormId: forms[0]?.id ?? null };
            }),

        updateFormMeta: (data) =>
            updateForms((forms, activeId) =>
                forms.map((f) => (f.id === activeId ? { ...f, ...data } : f))
            )(set),

        addField: (field) =>
            updateForms((forms, activeId) =>
                forms.map((f) =>
                    f.id === activeId
                        ? { ...f, fields: [...f.fields, { ...field, id: nanoid() }] }
                        : f
                )
            )(set),

        updateField: (id, updated) =>
            updateForms((forms, activeId) =>
                forms.map((f) =>
                    f.id === activeId
                        ? {
                            ...f,
                            fields: f.fields.map((fld) =>
                                fld.id === id ? { ...fld, ...updated } : fld
                            ),
                        }
                        : f
                )
            )(set),

        removeField: (id) =>
            updateForms((forms, activeId) =>
                forms.map((f) =>
                    f.id === activeId
                        ? { ...f, fields: f.fields.filter((fld) => fld.id !== id) }
                        : f
                )
            )(set),

        addFormData: (data) =>
            updateForms((forms, activeId) =>
                forms.map((f) =>
                    f.id === activeId ? { ...f, data: [...f.data, data] } : f
                )
            )(set),

        clearFormData: () =>
            updateForms((forms, activeId) =>
                forms.map((f) => (f.id === activeId ? { ...f, data: [] } : f))
            )(set),
    };
});
