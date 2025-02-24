import * as mammoth from "mammoth";
import { promises as fs } from "fs";
import { ILoader } from "./_types";

export async function loadDocx(filePath: string): Promise<{ content: string }> {
    try {
        await fs.access(filePath);
        const { value } = await mammoth.convertToHtml({ path: filePath });

        if (!value.trim()) {
            throw new Error("DOCX file is empty or could not be parsed.");
        }

        return { content: value };
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to load DOCX file: ${error.message}`);
        }
        throw new Error("Failed to load DOCX file due to an unknown error.");
    }
}

// Default export - fully implementing ILoader
export default function createDocxLoader(): ILoader<string, { content: string }> {
    let defaultLocale = "en"; // Default locale

    return {
        setDefaultLocale(locale: string) {
            defaultLocale = locale;
            return this;
        },

        async pull(locale: string, filePath: string): Promise<{ content: string }> {
            return loadDocx(filePath);
        },

        async push(locale: string, data: { content: string }): Promise<string> {
            throw new Error("Push operation is not supported for DOCX files.");
        }
    };
}
