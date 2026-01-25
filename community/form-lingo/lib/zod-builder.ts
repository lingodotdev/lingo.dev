import { z } from "zod";
import { FormSchema } from "./schema";

export const generateZodSchema = (schema: FormSchema) => {
    const shape: Record<string, z.ZodTypeAny> = {};

    schema.fields.forEach((field) => {
        const rules = field.validations || {};
        let validator: z.ZodTypeAny;

        switch (field.type) {
            case "email": {
                let v = z.string().email(rules.message || "Invalid email address");

                if (rules.minLength) {
                    v = v.min(
                        rules.minLength,
                        rules.message || `Minimum ${rules.minLength} characters`
                    );
                }

                if (rules.maxLength) {
                    v = v.max(
                        rules.maxLength,
                        rules.message || `Maximum ${rules.maxLength} characters`
                    );
                }

                if (rules.pattern) {
                    v = v.regex(
                        new RegExp(rules.pattern),
                        rules.message || "Invalid format"
                    );
                }

                if (rules.required) {
                    v = v.min(1, rules.message || "Required field");
                }

                validator = v;
                break;
            }

            case "number": {
                let v = z.preprocess(
                    (val) => (val === "" ? undefined : Number(val)),
                    z.number({
                        error: "Must be a number",
                    })
                );

                if (rules.min !== undefined) {
                    v = v.refine(
                        (n) => n >= rules.min!,
                        rules.message || `Minimum value is ${rules.min}`
                    );
                }

                if (rules.max !== undefined) {
                    v = v.refine(
                        (n) => n <= rules.max!,
                        rules.message || `Maximum value is ${rules.max}`
                    );
                }

                if (rules.required) {
                    v = v.refine(
                        (n) => n !== undefined && !Number.isNaN(n),
                        rules.message || "Required field"
                    );
                }

                validator = v;
                break;
            }

            case "url": {
                let v = z.string().url(rules.message || "Invalid URL");

                if (rules.required) {
                    v = v.min(1, rules.message || "Required field");
                }

                validator = v;
                break;
            }

            case "checkbox": {
                let v = z.boolean();

                if (rules.required) {
                    v = v.refine(
                        (val) => val === true,
                        rules.message || "This field is required"
                    );
                }

                validator = v;
                break;
            }

            case "radio":
            case "select": {
                let v = z.string();

                if (rules.required) {
                    v = v.min(1, rules.message || "Please select an option");
                }

                validator = v;
                break;
            }

            default: {
                let v = z.string();

                if (rules.minLength) {
                    v = v.min(
                        rules.minLength,
                        rules.message || `Minimum ${rules.minLength} characters`
                    );
                }

                if (rules.maxLength) {
                    v = v.max(
                        rules.maxLength,
                        rules.message || `Maximum ${rules.maxLength} characters`
                    );
                }

                if (rules.pattern) {
                    v = v.regex(
                        new RegExp(rules.pattern),
                        rules.message || "Invalid format"
                    );
                }

                if (rules.required) {
                    v = v.min(1, rules.message || "Required field");
                }

                validator = v;
            }
        }

        shape[field.name] = validator;
    });

    return z.object(shape);
};
