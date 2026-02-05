export function normalizePaths<T>(value: T): T {
    if (typeof value === "string") {
        return value.replace(/\\/g, "/") as T;
    }
    if (Array.isArray(value)) {
        return value.map(normalizePaths) as T;
    }
    if (value && typeof value === "object") {
        const normalized = {} as T;
        for (const [key, val] of Object.entries(value)) {
            (normalized as any)[key] = normalizePaths(val);
        }
        return normalized;
    }
    return value;
}