import { LANGUAGES } from "./languages";
import { FormSchema } from "./schema";

export const sampleSchema: FormSchema = {
    id: "student-admission-form",
    title: "Student Profile & Admission Form",
    ownerLanguage: "en",
    supportedLanguages: LANGUAGES.map((l) => l.code),

    fields: [
        {
            id: "fullName",
            name: "fullName",
            label: "Full Name",
            placeholder: "Enter your full name",
            type: "text",
            validations: {
                required: true,
                minLength: 3,
                message: "Please enter your full name",
            },
        },

        {
            id: "email",
            name: "email",
            label: "Email Address",
            placeholder: "Enter your email",
            type: "email",
            validations: {
                required: true,
                message: "Please enter a valid email address",
            },
        },

        {
            id: "password",
            name: "password",
            label: "Create Password",
            placeholder: "Create a strong password",
            type: "password",
            validations: {
                required: true,
                minLength: 8,
                message: "Password must be at least 8 characters",
            },
        },

        {
            id: "age",
            name: "age",
            label: "Age",
            placeholder: "Enter your age",
            type: "number",
            validations: {
                required: true,
                min: 15,
                max: 60,
                message: "Age must be between 15 and 60",
            },
        },

        {
            id: "gender",
            name: "gender",
            label: "Gender",
            type: "radio",
            options: [
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Other", value: "other" },
            ],
            validations: {
                required: true,
                message: "Please select your gender",
            },
        },

        {
            id: "phone",
            name: "phone",
            label: "Mobile Number",
            placeholder: "Enter your phone number",
            type: "text",
            validations: {
                required: true,
                pattern: "^[0-9]{10}$",
                message: "Enter valid 10 digit mobile number",
            },
        },

        {
            id: "website",
            name: "website",
            label: "Personal Website / Portfolio",
            placeholder: "https://your-portfolio.com",
            type: "url",
            validations: {
                message: "Enter a valid URL",
            },
        },

        {
            id: "country",
            name: "country",
            label: "Country",
            type: "select",
            options: [
                { label: "India", value: "india" },
                { label: "United States", value: "usa" },
                { label: "United Kingdom", value: "uk" },
                { label: "Canada", value: "canada" },
                { label: "Australia", value: "australia" },
            ],
            validations: {
                required: true,
                message: "Please select your country",
            },
        },

        {
            id: "course",
            name: "course",
            label: "Select Course",
            type: "select",
            options: [
                { label: "Computer Science", value: "cs" },
                { label: "Mechanical Engineering", value: "me" },
                { label: "Electrical Engineering", value: "ee" },
                { label: "Civil Engineering", value: "ce" },
                { label: "Business Administration", value: "mba" },
            ],
            validations: {
                required: true,
                message: "Please select a course",
            },
        },

        {
            id: "skills",
            name: "skills",
            label: "Technical Skills",
            placeholder: "e.g. React, Node.js, Python, Java",
            type: "textarea",
            validations: {
                required: true,
                minLength: 10,
                message: "Please describe your technical skills",
            },
        },

        {
            id: "about",
            name: "about",
            label: "About Yourself",
            placeholder: "Tell us about your background, interests and goals",
            type: "textarea",
            validations: {
                required: true,
                minLength: 30,
                message: "Please write at least 30 characters",
            },
        },

        {
            id: "experience",
            name: "experience",
            label: "Do you have prior experience?",
            type: "checkbox",
            validations: {
                message: "Select if you have prior experience",
            },
        },

        {
            id: "terms",
            name: "terms",
            label: "I agree to the Terms & Conditions",
            type: "checkbox",
            validations: {
                required: true,
                message: "You must accept the terms & conditions",
            },
        },
    ],

    data: [
        {
            fullName: "Aarav Sharma",
            email: "aarav@gmail.com",
            password: "securePass123",
            age: 21,
            gender: "male",
            phone: "9876543210",
            website: "https://aarav.dev",
            country: "india",
            course: "cs",
            skills: "React, Node.js, TypeScript, MongoDB",
            about:
                "I am a passionate full stack developer and final year student aiming to build scalable web applications.",
            experience: true,
            terms: true,
        },
        {
            fullName: "Emily Watson",
            email: "emily@gmail.com",
            password: "password@123",
            age: 23,
            gender: "female",
            phone: "9123456780",
            website: "https://emily.dev",
            country: "usa",
            course: "mba",
            skills: "Business analytics, marketing strategy, leadership",
            about:
                "I am interested in business strategy and entrepreneurship and want to build my own startup.",
            experience: false,
            terms: true,
        },
    ],
};
