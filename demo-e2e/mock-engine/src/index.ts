import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

function log(...args: any[]) {
  if (process.env.DEBUG === "true") {
    console.log(...args);
  }
}

app.post("/i18n", async (c) => {
  const body = await c.req.json();
  const target = body?.locale?.target || "xx";
  const data = body?.data || {};

  log("::: MOCK ENGINE - REQUEST", JSON.stringify(body, null, 2));

  const authorization = c.req.header("authorization");

  if (!authorization?.startsWith("Bearer api_")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const supportedLocales = Object.keys(hardcodedTranslations);
  if (!supportedLocales.includes(target)) {
    return c.json(
      {
        error: `Unsupported locale "${target}". Supported locales: ${supportedLocales.join(", ")}`,
      },
      400,
    );
  }

  const localized: Record<string, any> = {
    version: data.version,
    locale: target,
    files: {},
  };

  Object.entries(data.files).forEach(([fileKey, fileData]: [string, any]) => {
    const entries: Record<string, string> = {};
    Object.entries(fileData.entries).forEach(
      ([scopeKey, scopeData]: [string, any]) => {
        entries[scopeKey] =
          hardcodedTranslations[target][scopeData] ?? "Translation failed.";
      },
    );
    localized.files[fileKey] = { entries };
  });

  log("::: MOCK ENGINE - LOCALIZED", JSON.stringify(localized, null, 2));

  // simulate async request
  await new Promise((resolve) => setTimeout(resolve, 100));

  return c.json({ data: localized });
});

serve({ fetch: app.fetch, port: 11290 }, (info) =>
  log(`::: MOCK ENGINE - STARTED @ ${info?.port}`),
);

const hardcodedTranslations: Record<string, Record<string, string>> = {
  fr: {
    "Hello World": "Bonjour le monde",
    "This is a localized paragraph.": "Ceci est un paragraphe localisé.",
    Docs: "La documentation",
    "Docs link": "Lien vers la documentation",
  },
  es: {
    "Hello World": "Hola mundo",
    "This is a localized paragraph.": "Este es un párrafo localizado.",
    Docs: "Documentos",
    "Docs link": "Enlace a los documentos",
  },
};
