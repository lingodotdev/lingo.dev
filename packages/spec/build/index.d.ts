import Z from 'zod';

declare const localeMap: {
    readonly ur: readonly ["ur-PK"];
    readonly vi: readonly ["vi-VN"];
    readonly tr: readonly ["tr-TR"];
    readonly ta: readonly ["ta-IN"];
    readonly sr: readonly ["sr-RS", "sr-Latn-RS", "sr-Cyrl-RS"];
    readonly hu: readonly ["hu-HU"];
    readonly he: readonly ["he-IL"];
    readonly et: readonly ["et-EE"];
    readonly el: readonly ["el-GR"];
    readonly da: readonly ["da-DK"];
    readonly az: readonly ["az-AZ"];
    readonly th: readonly ["th-TH"];
    readonly sv: readonly ["sv-SE"];
    readonly en: readonly ["en-US", "en-GB", "en-AU", "en-CA"];
    readonly es: readonly ["es-ES", "es-419", "es-MX", "es-AR"];
    readonly fr: readonly ["fr-FR", "fr-CA", "fr-BE"];
    readonly ca: readonly ["ca-ES"];
    readonly ja: readonly ["ja-JP"];
    readonly de: readonly ["de-DE", "de-AT", "de-CH"];
    readonly pt: readonly ["pt-PT", "pt-BR"];
    readonly it: readonly ["it-IT", "it-CH"];
    readonly ru: readonly ["ru-RU", "ru-BY"];
    readonly uk: readonly ["uk-UA"];
    readonly hi: readonly ["hi-IN"];
    readonly zh: readonly ["zh-CN", "zh-TW", "zh-HK", "zh-Hans", "zh-Hant", "zh-Hant-HK", "zh-Hant-TW", "zh-Hant-CN", "zh-Hans-HK", "zh-Hans-TW", "zh-Hans-CN"];
    readonly ko: readonly ["ko-KR"];
    readonly ar: readonly ["ar-EG", "ar-SA", "ar-AE", "ar-MA"];
    readonly bg: readonly ["bg-BG"];
    readonly cs: readonly ["cs-CZ"];
    readonly nl: readonly ["nl-NL", "nl-BE"];
    readonly pl: readonly ["pl-PL"];
    readonly id: readonly ["id-ID"];
    readonly ms: readonly ["ms-MY"];
    readonly fi: readonly ["fi-FI"];
    readonly eu: readonly ["eu-ES"];
    readonly hr: readonly ["hr-HR"];
    readonly iw: readonly ["iw-IL"];
    readonly km: readonly ["km-KH"];
    readonly lv: readonly ["lv-LV"];
    readonly lt: readonly ["lt-LT"];
    readonly no: readonly ["no-NO"];
    readonly ro: readonly ["ro-RO"];
    readonly sk: readonly ["sk-SK"];
    readonly sw: readonly ["sw-TZ", "sw-KE"];
    readonly fa: readonly ["fa-IR"];
    readonly fil: readonly ["fil-PH"];
    readonly pa: readonly ["pa-IN", "pa-PK"];
    readonly bn: readonly ["bn-BD", "bn-IN"];
    readonly ga: readonly ["ga-IE"];
    readonly mt: readonly ["mt-MT"];
    readonly sl: readonly ["sl-SI"];
    readonly sq: readonly ["sq-AL"];
    readonly bar: readonly ["bar-DE"];
    readonly nap: readonly ["nap-IT"];
    readonly af: readonly ["af-ZA"];
    readonly so: readonly ["so-SO"];
    readonly ti: readonly ["ti-ET"];
    readonly zgh: readonly ["zgh-MA"];
    readonly tl: readonly ["tl-PH"];
    readonly te: readonly ["te-IN"];
};
type LocaleCodeShort = keyof typeof localeMap;
type LocaleCodeFull = (typeof localeMap)[LocaleCodeShort][number];
type LocaleCode = LocaleCodeShort | LocaleCodeFull;
declare const localeCodesShort: LocaleCodeShort[];
declare const localeCodesFull: LocaleCodeFull[];
declare const localeCodesFullUnderscore: string[];
declare const localeCodesFullExplicitRegion: string[];
declare const localeCodes: LocaleCode[];
declare const localeCodeSchema: Z.ZodEffects<Z.ZodString, string, string>;
declare const resolveLocaleCode: (value: LocaleCode) => LocaleCodeFull;

// bucket types
declare const bucketTypes: readonly ["android", "csv", "flutter", "html", "json", "markdown", "xcode-strings", "xcode-stringsdict", "xcode-xcstrings", "yaml", "yaml-root-key", "properties", "po", "xliff", "xml", "srt", "dato", "compiler", "docx"];

declare const bucketTypeSchema: Z.ZodEnum<["android", "csv", "flutter", "html", "json", "markdown", "xcode-strings", "xcode-stringsdict", "xcode-xcstrings", "yaml", "yaml-root-key", "properties", "po", "xliff", "xml", "srt", "dato", "compiler", "docx"]>;

declare const localeSchema: Z.ZodObject<{
    source: Z.ZodEffects<Z.ZodString, string, string>;
    targets: Z.ZodArray<Z.ZodEffects<Z.ZodString, string, string>, "many">;
}, "strip", Z.ZodTypeAny, {
    source: string;
    targets: string[];
}, {
    source: string;
    targets: string[];
}>;
type ConfigDefinition<T extends Z.ZodRawShape, P extends Z.ZodRawShape> = {
    schema: Z.ZodObject<T>;
    defaultValue: Z.infer<Z.ZodObject<T>>;
    parse: (rawConfig: unknown) => Z.infer<Z.ZodObject<T>>;
};
declare const configV0Definition: ConfigDefinition<{
    version: Z.ZodDefault<Z.ZodNumber>;
}, Z.ZodRawShape>;
declare const configV1Definition: ConfigDefinition<Z.objectUtil.extendShape<{
    version: Z.ZodDefault<Z.ZodNumber>;
}, {
    locale: Z.ZodObject<{
        source: Z.ZodEffects<Z.ZodString, string, string>;
        targets: Z.ZodArray<Z.ZodEffects<Z.ZodString, string, string>, "many">;
    }, "strip", Z.ZodTypeAny, {
        source: string;
        targets: string[];
    }, {
        source: string;
        targets: string[];
    }>;
    buckets: Z.ZodOptional<Z.ZodDefault<Z.ZodRecord<Z.ZodString, Z.ZodEnum<["android", "csv", "flutter", "html", "json", "markdown", "xcode-strings", "xcode-stringsdict", "xcode-xcstrings", "yaml", "yaml-root-key", "properties", "po", "xliff", "xml", "srt", "dato", "compiler"]>>>>;
}>, Z.ZodRawShape>;
declare const configV1_1Definition: ConfigDefinition<Z.objectUtil.extendShape<Z.objectUtil.extendShape<{
    version: Z.ZodDefault<Z.ZodNumber>;
}, {
    locale: Z.ZodObject<{
        source: Z.ZodEffects<Z.ZodString, string, string>;
        targets: Z.ZodArray<Z.ZodEffects<Z.ZodString, string, string>, "many">;
    }, "strip", Z.ZodTypeAny, {
        source: string;
        targets: string[];
    }, {
        source: string;
        targets: string[];
    }>;
    buckets: Z.ZodOptional<Z.ZodDefault<Z.ZodRecord<Z.ZodString, Z.ZodEnum<["android", "csv", "flutter", "html", "json", "markdown", "xcode-strings", "xcode-stringsdict", "xcode-xcstrings", "yaml", "yaml-root-key", "properties", "po", "xliff", "xml", "srt", "dato", "compiler"]>>>>;
}>, {
    buckets: Z.ZodDefault<Z.ZodRecord<Z.ZodEnum<["android", "csv", "flutter", "html", "json", "markdown", "xcode-strings", "xcode-stringsdict", "xcode-xcstrings", "yaml", "yaml-root-key", "properties", "po", "xliff", "xml", "srt", "dato", "compiler"]>, Z.ZodObject<{
        include: Z.ZodDefault<Z.ZodArray<Z.ZodString, "many">>;
        exclude: Z.ZodOptional<Z.ZodDefault<Z.ZodArray<Z.ZodString, "many">>>;
    }, "strip", Z.ZodTypeAny, {
        include: string[];
        exclude?: string[] | undefined;
    }, {
        exclude?: string[] | undefined;
        include?: string[] | undefined;
    }>>>;
}>, Z.ZodRawShape>;
declare const configV1_2Definition: ConfigDefinition<Z.objectUtil.extendShape<Z.objectUtil.extendShape<Z.objectUtil.extendShape<{
    version: Z.ZodDefault<Z.ZodNumber>;
}, {
    locale: Z.ZodObject<{
        source: Z.ZodEffects<Z.ZodString, string, string>;
        targets: Z.ZodArray<Z.ZodEffects<Z.ZodString, string, string>, "many">;
    }, "strip", Z.ZodTypeAny, {
        source: string;
        targets: string[];
    }, {
        source: string;
        targets: string[];
    }>;
    buckets: Z.ZodOptional<Z.ZodDefault<Z.ZodRecord<Z.ZodString, Z.ZodEnum<["android", "csv", "flutter", "html", "json", "markdown", "xcode-strings", "xcode-stringsdict", "xcode-xcstrings", "yaml", "yaml-root-key", "properties", "po", "xliff", "xml", "srt", "dato", "compiler"]>>>>;
}>, {
    buckets: Z.ZodDefault<Z.ZodRecord<Z.ZodEnum<["android", "csv", "flutter", "html", "json", "markdown", "xcode-strings", "xcode-stringsdict", "xcode-xcstrings", "yaml", "yaml-root-key", "properties", "po", "xliff", "xml", "srt", "dato", "compiler"]>, Z.ZodObject<{
        include: Z.ZodDefault<Z.ZodArray<Z.ZodString, "many">>;
        exclude: Z.ZodOptional<Z.ZodDefault<Z.ZodArray<Z.ZodString, "many">>>;
    }, "strip", Z.ZodTypeAny, {
        include: string[];
        exclude?: string[] | undefined;
    }, {
        exclude?: string[] | undefined;
        include?: string[] | undefined;
    }>>>;
}>, {
    locale: Z.ZodObject<Z.objectUtil.extendShape<{
        source: Z.ZodEffects<Z.ZodString, string, string>;
        targets: Z.ZodArray<Z.ZodEffects<Z.ZodString, string, string>, "many">;
    }, {
        extraSource: Z.ZodOptional<Z.ZodEffects<Z.ZodString, string, string>>;
    }>, "strip", Z.ZodTypeAny, {
        source: string;
        targets: string[];
        extraSource?: string | undefined;
    }, {
        source: string;
        targets: string[];
        extraSource?: string | undefined;
    }>;
}>, Z.ZodRawShape>;
declare const LATEST_CONFIG_DEFINITION: ConfigDefinition<Z.objectUtil.extendShape<Z.objectUtil.extendShape<Z.objectUtil.extendShape<{
    version: Z.ZodDefault<Z.ZodNumber>;
}, {
    locale: Z.ZodObject<{
        source: Z.ZodEffects<Z.ZodString, string, string>;
        targets: Z.ZodArray<Z.ZodEffects<Z.ZodString, string, string>, "many">;
    }, "strip", Z.ZodTypeAny, {
        source: string;
        targets: string[];
    }, {
        source: string;
        targets: string[];
    }>;
    buckets: Z.ZodOptional<Z.ZodDefault<Z.ZodRecord<Z.ZodString, Z.ZodEnum<["android", "csv", "flutter", "html", "json", "markdown", "xcode-strings", "xcode-stringsdict", "xcode-xcstrings", "yaml", "yaml-root-key", "properties", "po", "xliff", "xml", "srt", "dato", "compiler"]>>>>;
}>, {
    buckets: Z.ZodDefault<Z.ZodRecord<Z.ZodEnum<["android", "csv", "flutter", "html", "json", "markdown", "xcode-strings", "xcode-stringsdict", "xcode-xcstrings", "yaml", "yaml-root-key", "properties", "po", "xliff", "xml", "srt", "dato", "compiler"]>, Z.ZodObject<{
        include: Z.ZodDefault<Z.ZodArray<Z.ZodString, "many">>;
        exclude: Z.ZodOptional<Z.ZodDefault<Z.ZodArray<Z.ZodString, "many">>>;
    }, "strip", Z.ZodTypeAny, {
        include: string[];
        exclude?: string[] | undefined;
    }, {
        exclude?: string[] | undefined;
        include?: string[] | undefined;
    }>>>;
}>, {
    locale: Z.ZodObject<Z.objectUtil.extendShape<{
        source: Z.ZodEffects<Z.ZodString, string, string>;
        targets: Z.ZodArray<Z.ZodEffects<Z.ZodString, string, string>, "many">;
    }, {
        extraSource: Z.ZodOptional<Z.ZodEffects<Z.ZodString, string, string>>;
    }>, "strip", Z.ZodTypeAny, {
        source: string;
        targets: string[];
        extraSource?: string | undefined;
    }, {
        source: string;
        targets: string[];
        extraSource?: string | undefined;
    }>;
}>, Z.ZodRawShape>;
type I18nConfig = Z.infer<(typeof LATEST_CONFIG_DEFINITION)["schema"]>;
declare function parseI18nConfig(rawConfig: unknown): {
    version: number;
    locale: {
        source: string;
        targets: string[];
        extraSource?: string | undefined;
    };
    buckets: Partial<Record<"android" | "csv" | "flutter" | "html" | "json" | "markdown" | "xcode-strings" | "xcode-stringsdict" | "xcode-xcstrings" | "yaml" | "yaml-root-key" | "properties" | "po" | "xliff" | "xml" | "srt" | "dato" | "compiler", {
        include: string[];
        exclude?: string[] | undefined;
    }>>;
};
declare const defaultConfig: {
    version: number;
    locale: {
        source: string;
        targets: string[];
        extraSource?: string | undefined;
    };
    buckets: Partial<Record<"android" | "csv" | "flutter" | "html" | "json" | "markdown" | "xcode-strings" | "xcode-stringsdict" | "xcode-xcstrings" | "yaml" | "yaml-root-key" | "properties" | "po" | "xliff" | "xml" | "srt" | "dato" | "compiler", {
        include: string[];
        exclude?: string[] | undefined;
    }>>;
};

export { type I18nConfig, type LocaleCode, type LocaleCodeFull, type LocaleCodeShort, bucketTypeSchema, bucketTypes, configV0Definition, configV1Definition, configV1_1Definition, configV1_2Definition, defaultConfig, localeCodeSchema, localeCodes, localeCodesFull, localeCodesFullExplicitRegion, localeCodesFullUnderscore, localeCodesShort, localeSchema, parseI18nConfig, resolveLocaleCode };
