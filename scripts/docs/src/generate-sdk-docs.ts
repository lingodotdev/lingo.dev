#!/usr/bin/env node

import { mkdir, writeFile } from "fs/promises";
import { dirname, resolve } from "path";
import {
  Application,
  ReflectionKind,
  type DeclarationReflection,
  type ParameterReflection,
  type ProjectReflection,
  type Reflection,
} from "typedoc";
import type { Root } from "mdast";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { createOrUpdateGitHubComment, getRepoRoot } from "./utils";

async function generateMarkdown(options: {
  outputPath: string;
}): Promise<void> {
  const repoRoot = getRepoRoot();

  const app = await Application.bootstrap({
    entryPoints: [resolve(repoRoot, "packages", "sdk", "src", "index.ts")],
    tsconfig: resolve(repoRoot, "packages", "sdk", "tsconfig.json"),
  });

  const project = await app.convert();

  if (!project) {
    throw new Error("TypeDoc conversion failed.");
  }

  const markdown = buildFullMarkdown(project);

  function buildFullMarkdown(proj: ProjectReflection): string {
    const md: string[] = ["# Lingo.dev SDK Reference\n"];

    const children = proj.children ?? [];

    // Sort for consistency
    children.sort((a, b) => a.name.localeCompare(b.name));

    children.forEach((child) => {
      renderReflection(child, 2, md);
    });

    return md.join("\n");
  }

  function addHeading(md: string[], level: number, text: string) {
    md.push(`${"#".repeat(level)} ${text}`);
  }

  function renderReflection(refl: Reflection, level: number, md: string[]) {
    switch (refl.kind) {
      case ReflectionKind.Function:
        renderFunction(refl as DeclarationReflection, level, md);
        break;
      case ReflectionKind.Class:
        renderClass(refl as DeclarationReflection, level, md);
        break;
      case ReflectionKind.Interface:
        renderInterface(refl as DeclarationReflection, level, md);
        break;
      case ReflectionKind.Enum:
        renderEnum(refl as DeclarationReflection, level, md);
        break;
      case ReflectionKind.TypeAlias:
        renderTypeAlias(refl as DeclarationReflection, level, md);
        break;
      case ReflectionKind.Module:
      case ReflectionKind.Namespace:
        renderContainer(refl as DeclarationReflection, level, md);
        break;
      default:
        // skip other kinds
        break;
    }
  }

  function renderComment(refl: DeclarationReflection, md: string[]) {
    if (refl.comment?.summary?.length) {
      const txt = refl.comment.summary
        .map((p) => p.text)
        .join("")
        .trim();
      if (txt) {
        md.push(txt);
      }
    }
  }

  function renderFunction(
    fn: DeclarationReflection,
    level: number,
    md: string[],
  ) {
    addHeading(md, level, `\`${fn.name}\``);
    renderComment(fn, md);

    const sig = fn.signatures?.[0];
    if (!sig) return;

    const params = (sig.parameters ?? []).map((p) => {
      const typeStr = p.type?.toString() ?? "unknown";
      const desc =
        p.comment?.summary
          ?.map((pt) => pt.text)
          .join("")
          .trim() ?? "";
      return `- \`${p.name}\` (${typeStr})${desc ? ` — ${desc}` : ""}`;
    });
    if (params.length) {
      md.push("### Parameters", ...params);
    }

    const retDesc =
      sig.comment?.blockTags
        ?.find((t) => t.tag === "@returns")
        ?.content?.map((c) => c.text)
        .join("")
        .trim() ?? "";
    md.push("### Returns");
    md.push(
      `\`${sig.type?.toString() ?? "void"}\`${retDesc ? ` — ${retDesc}` : ""}`,
    );
  }

  function renderClass(
    cls: DeclarationReflection,
    level: number,
    md: string[],
  ) {
    addHeading(md, level, `class \`${cls.name}\``);
    renderComment(cls, md);

    // Constructors
    const ctor = cls.children?.find(
      (c) => c.kind === ReflectionKind.Constructor,
    );
    if (ctor && (ctor as DeclarationReflection).signatures?.[0]) {
      md.push("### Constructor");
      const sig = (ctor as DeclarationReflection).signatures![0];
      md.push(
        "```ts",
        `new ${cls.name}(${sig.parameters?.map((p) => p.name).join(", ") ?? ""})`,
        "```",
      );
    }

    // Properties
    const props = cls.children?.filter(
      (c) => c.kind === ReflectionKind.Property,
    ) as DeclarationReflection[];
    if (props?.length) {
      md.push("### Properties");
      props.forEach((p) =>
        md.push(`- \`${p.name}\`: ${p.type?.toString() ?? "unknown"}`),
      );
    }

    // Methods
    const methods = cls.children?.filter(
      (c) => c.kind === ReflectionKind.Method,
    ) as DeclarationReflection[];
    if (methods?.length) {
      md.push("### Methods");
      methods.forEach((m) => {
        md.push(`#### \`${m.name}()\``);
        renderComment(m, md);
        const sig = m.signatures?.[0];
        if (sig) {
          const ps =
            sig.parameters
              ?.map((p) => `${p.name}: ${p.type?.toString() ?? "unknown"}`)
              .join(", ") ?? "";
          md.push(
            "```ts",
            `${m.name}(${ps}): ${sig.type?.toString() ?? "void"};`,
            "```",
          );
          // detailed param table
          if (sig.parameters?.length) {
            md.push("**Parameters**");
            sig.parameters.forEach((p) => {
              const d =
                p.comment?.summary
                  ?.map((pt) => pt.text)
                  .join("")
                  .trim() ?? "";
              md.push(`- \`${p.name}\` — ${d || ""}`);
            });
          }
          const rdesc =
            sig.comment?.blockTags
              ?.find((t) => t.tag === "@returns")
              ?.content?.map((c) => c.text)
              .join("")
              .trim() ?? "";
          if (rdesc) {
            md.push("**Returns**", rdesc);
          }
        }
      });
    }
  }

  function renderInterface(
    intf: DeclarationReflection,
    level: number,
    md: string[],
  ) {
    addHeading(md, level, `interface \`${intf.name}\``);
    renderComment(intf, md);

    const props = intf.children ?? [];
    props.forEach((p) => {
      md.push(
        `- \`${p.name}\`: ${(p as DeclarationReflection).type?.toString() ?? "unknown"}`,
      );
    });
  }

  function renderEnum(enm: DeclarationReflection, level: number, md: string[]) {
    addHeading(md, level, `enum \`${enm.name}\``);
    renderComment(enm, md);

    const members = enm.children ?? [];
    members.forEach((m) => md.push(`- \`${m.name}\``));
  }

  function renderTypeAlias(
    ta: DeclarationReflection,
    level: number,
    md: string[],
  ) {
    addHeading(md, level, `type \`${ta.name}\``);
    renderComment(ta, md);
    md.push(
      "```ts",
      `${ta.name} = ${ta.type?.toString() ?? "unknown"};`,
      "```",
    );
  }

  function renderContainer(
    cnt: DeclarationReflection,
    level: number,
    md: string[],
  ) {
    addHeading(md, level, cnt.name);
    renderComment(cnt, md);

    const kids = cnt.children ?? [];
    kids.sort((a, b) => a.name.localeCompare(b.name));
    kids.forEach((k) => renderReflection(k, level + 1, md));
  }

  const directory = dirname(options.outputPath);
  await mkdir(directory, { recursive: true });
  await writeFile(options.outputPath, markdown, "utf8");
}

async function main(): Promise<void> {
  const commentMarker = "<!-- generate-sdk-docs -->";

  console.log("🔄 Generating SDK docs...");

  const outputArg = process.argv[2];
  if (!outputArg) {
    throw new Error(
      "Output file path is required. Usage: generate-sdk-docs <output-path>",
    );
  }

  const outputFilePath = resolve(process.cwd(), outputArg);

  await generateMarkdown({ outputPath: outputFilePath });
  console.log(`✅ Saved to ${outputFilePath}`);

  if (!process.env.GITHUB_ACTIONS) {
    return;
  }

  console.log("💬 Commenting on GitHub PR...");

  const mdPreview = await (
    await import("fs/promises")
  ).readFile(outputFilePath, "utf8");

  const previewTruncated =
    mdPreview.length > 60000
      ? `${mdPreview.slice(0, 60000)}\n...truncated...`
      : mdPreview;

  const mdast: Root = {
    type: "root",
    children: [
      { type: "html", value: commentMarker },
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value:
              "Your PR affects Lingo.dev SDK and, as a result, may affect the auto-generated reference documentation that will be published to the documentation website. Please review the output below to ensure that the changes are correct.",
          },
        ],
      },
      { type: "html", value: "<details>" },
      {
        type: "html",
        value: "<summary>Lingo.dev SDK Exported Functions</summary>",
      },
      { type: "code", lang: "markdown", value: previewTruncated },
      { type: "html", value: "</details>" },
    ],
  };

  const body = unified()
    .use([[remarkStringify, { fence: "~" }]])
    .stringify(mdast)
    .toString();

  await createOrUpdateGitHubComment({ commentMarker, body });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
