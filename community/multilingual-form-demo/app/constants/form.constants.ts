export const FORM_DEFAULT_VALUES = {
    name: "",
    email: "",
    phone: "",
    preferences: {
        weekly: true,
        promotions: false,
        updates: true,
    },
    privacy: false,
    frequency: "weekly" as const,
};

export const FORM_MODE = "onChange" as const;

export const PHONE_REGEX = /^[\d\s\-\+\(\)]{10,15}$/;

export const SIMULATED_API_DELAY = 1500;
