/**
 * PII Redaction Utilities
 *
 * Redacts personally identifiable information before sending to LLM providers.
 * Supports emails, phone numbers, SSNs, credit cards, and IP addresses.
 */

interface RedactionResult {
    text: string;
    map: Map<string, string>;
}

// Patterns for common PII types
const PII_PATTERNS = [
    {
        name: "email",
        pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        prefix: "[EMAIL_",
    },
    {
        name: "phone",
        pattern:
            /\b(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b/g,
        prefix: "[PHONE_",
    },
    {
        name: "ssn",
        pattern: /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g,
        prefix: "[SSN_",
    },
    {
        name: "credit_card",
        pattern: /\b(?:\d{4}[-.\s]?){3}\d{4}\b/g,
        prefix: "[CC_",
    },
    {
        name: "ip_address",
        pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
        prefix: "[IP_",
    },
];

/**
 * Redact PII from text, returning the redacted text and a map for restoration
 */
export function redactPII(text: string): RedactionResult {
    const map = new Map<string, string>();
    let redactedText = text;
    let counter = 0;

    for (const { pattern, prefix } of PII_PATTERNS) {
        redactedText = redactedText.replace(pattern, (match) => {
            const placeholder = `${prefix}${counter++}]`;
            map.set(placeholder, match);
            return placeholder;
        });
    }

    return { text: redactedText, map };
}

/**
 * Restore PII from placeholders using the redaction map
 */
export function restorePII(text: string, map: Map<string, string>): string {
    let restoredText = text;

    for (const [placeholder, original] of map.entries()) {
        restoredText = restoredText.replace(placeholder, original);
    }

    return restoredText;
}

/**
 * Hash sensitive data for logging/caching purposes
 */
export async function hashPII(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Check if text contains potential PII
 */
export function containsPII(text: string): boolean {
    for (const { pattern } of PII_PATTERNS) {
        if (pattern.test(text)) {
            return true;
        }
        // Reset lastIndex for global patterns
        pattern.lastIndex = 0;
    }
    return false;
}
