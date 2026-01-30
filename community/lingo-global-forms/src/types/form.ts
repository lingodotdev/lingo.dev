export type SupportedLocale = 'en' | 'es' | 'fr' | 'de' | 'hi';

export interface FormField {
  id: string;
  label: string;
  placeholder: string;
  helperText: string;
  errorMessage: string;
  required: boolean;
  type: 'text' | 'email' | 'number' | 'textarea' | 'radio' | 'select' | 'checkbox' | 'date';
  options?: string[]; // For radio, select, checkbox
}

export interface FormContent {
  title: string;
  description: string;
  fields: FormField[];
  submitButtonText: string;
}

export interface TranslatableFormContent {
  title: string;
  description: string;
  submitButtonText: string;
  [key: string]: string; // For dynamic field properties like field_0_label, field_0_placeholder, etc.
}

export const SUPPORTED_LOCALES: { code: SupportedLocale; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
];

export const DEFAULT_FORM_CONTENT: FormContent = {
  title: 'Contact Us',
  description: 'Fill out this form and we will get back to you shortly.',
  fields: [
    {
      id: 'name',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      helperText: 'Please enter your first and last name',
      errorMessage: 'Name is required',
      required: true,
      type: 'text',
    },
    {
      id: 'email',
      label: 'Email Address',
      placeholder: 'you@example.com',
      helperText: 'We will never share your email',
      errorMessage: 'Please enter a valid email address',
      required: true,
      type: 'email',
    },
    {
      id: 'message',
      label: 'Message',
      placeholder: 'Type your message here...',
      helperText: 'Maximum 500 characters',
      errorMessage: 'Message cannot be empty',
      required: true,
      type: 'textarea',
    },
  ],
  submitButtonText: 'Send Message',
};
