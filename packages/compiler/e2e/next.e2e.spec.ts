import path from "path";
import fs from "fs";
import { execSync, exec as execAsync } from "child_process";
import { test, expect } from "@playwright/test";

const exec = (param: string) => execSync(param, { stdio: "inherit" });
const readJsonFile = (path: string) =>
  JSON.parse(fs.readFileSync(path, "utf8"));
const readJavaScriptFile = (path: string) => {
  const content = fs.readFileSync(path, "utf8");
  const normalized = content
    .replace(/^export\s+default\s+/, "")
    .replace(/;?\s*$/, "")
    .trim();
  return eval(`(${normalized})`);
};

test.describe("Next.js E2E with lingo.dev compiler", () => {
  const cwd = process.cwd();
  let mockEnginePid: number | null = null;

  test.beforeAll(async () => {
    process.chdir(path.join(cwd, "../../demo-e2e/mock-engine"));
    execAsync("pnpm start &");
  });

  test.afterAll(async () => {
    if (mockEnginePid) {
      exec(`kill ${mockEnginePid}`);
    }
    process.chdir(cwd);
  });

  test.beforeEach(async () => {
    process.chdir(path.join(cwd, "../../demo-e2e/next-e2e-app"));
    exec("pnpm reset");
  });

  test("build generates lingo files (meta.json, dictionary.js)", async ({
    page,
  }) => {
    // Start the build process but don't wait for it to complete
    const buildProcess = exec(
      "NODE_ENV=production LINGODOTDEV_API_URL=http://localhost:11290 pnpm build",
    );

    expect(fs.existsSync("src/lingo/meta.json")).toBeTruthy();
    expect(fs.existsSync("src/lingo/dictionary.js")).toBeTruthy();

    const meta = readJsonFile("src/lingo/meta.json");
    expect(meta.version).toBe(0.1);
    expect(
      meta.files["app/page.tsx"].scopes["0/declaration/body/0/argument/1"]
        .content,
    ).toBe("Hello World");

    const dictionary = readJavaScriptFile("src/lingo/dictionary.js");
    expect(dictionary.version).toBe(0.1);
    expect(
      dictionary.files["app/page.tsx"].entries[
        "0/declaration/body/0/argument/1"
      ].content,
    ).toEqual({
      en: "Hello World",
      es: "Hola mundo",
      fr: "Bonjour le monde",
    });

    // Start the app to test the runtime functionality
    exec("pnpm start &");
    await page.goto("http://localhost:3000", { timeout: 30_000 });
    await expect(page.locator("#hero")).toHaveText("Hello World");
    await expect(page.locator("#sub")).toHaveText(
      "This is a localized paragraph.",
    );
    await expect(page.locator("#link")).toHaveAttribute("title", "Docs link");

    await page.selectOption("#switcher select", "es");
    await expect(page.locator("#hero")).toHaveText("Hola mundo");
    await expect(page.locator("#sub")).toHaveText(
      "This is a localized paragraph.",
    );
    await expect(page.locator("#link")).toHaveAttribute(
      "title",
      "Enlace a los documentos",
    );

    await page.selectOption("#switcher select", "fr");
    await expect(page.locator("#hero")).toHaveText("Bonjour le monde");
    await expect(page.locator("#sub")).toHaveText(
      "Ceci est un paragraphe localisé.",
    );
    await expect(page.locator("#link")).toHaveAttribute(
      "title",
      "Lien vers la documentation",
    );
  });

  //   test("dev generates lingo files; locale switch shows translated texts", async ({
  //     page,
  //   }) => {
  //     const stopMock = await startMockEngine(11290);
  //     const fx = await createNextFixture();
  //     const stopDev = await fx.startDev();
  //     try {
  //       await page.goto(fx.url);
  //       await page.waitForSelector("#hero");

  //       // lingo files created
  //       const lingoDir = path.join(fx.dir, "app", "lingo");
  //       expect(fs.existsSync(path.join(lingoDir, "meta.json"))).toBeTruthy();
  //       expect(fs.existsSync(path.join(lingoDir, "dictionary.js"))).toBeTruthy();

  //       // default en content
  //       await expect(page.locator("#hero")).toHaveText("Hello World");
  //       await expect(page.locator("#sub")).toHaveText(
  //         "This is a localized paragraph.",
  //       );

  //       // switch to es
  //       await page.selectOption("#switcher select", "es");
  //       await page.waitForLoadState("networkidle");
  //       await expect(page.locator("#hero")).toHaveText("[es] Hello World");
  //       await expect(page.locator("#sub")).toHaveText(
  //         "[es] This is a localized paragraph.",
  //       );
  //       await expect(page.locator("#link")).toHaveAttribute(
  //         "title",
  //         "[es] Docs link",
  //       );

  //       // switch to fr
  //       await page.selectOption("#switcher select", "fr");
  //       await page.waitForLoadState("networkidle");
  //       await expect(page.locator("#hero")).toHaveText("[fr] Hello World");
  //     } finally {
  //       await fx.cleanup();
  //       await stopDev();
  //       await stopMock();
  //     }
  //   });

  //   test("dev propagates component changes to browser", async ({ page }) => {
  //     const stopMock = await startMockEngine(11290);
  //     const fx = await createNextFixture();
  //     const stopDev = await fx.startDev();
  //     try {
  //       const pageFile = path.join(fx.dir, "app", "page.tsx");
  //       await page.goto(fx.url);
  //       await expect(page.locator("#hero")).toHaveText("Hello World");

  //       // update component text
  //       const updated = `export default function Page(){
  //   return (
  //     <main>
  //       <h1 id="hero">Hello Changed</h1>
  //       <p id="sub">This is a localized paragraph.</p>
  //       <a id="link" href="/docs" title="Docs link">Docs</a>
  //     </main>
  //   );
  // }
  // `;
  //       fs.writeFileSync(pageFile, updated, "utf8");

  //       // wait for HMR to reflect changes
  //       await expect(page.locator("#hero")).toHaveText("Hello Changed");
  //     } finally {
  //       await fx.cleanup();
  //       await stopDev();
  //       await stopMock();
  //     }
  //   });
});
