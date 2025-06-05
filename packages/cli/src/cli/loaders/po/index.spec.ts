import { describe, it, expect } from "vitest";
import createPoLoader, { PoLoaderParams } from "./index";

describe("createPoDataLoader", () => {
  it("pull the correct data", async () => {
    const loader = createLoader();
    const input = `
  #: hello.py:1
  msgid "Hello world"
  msgstr ""
      `.trim();

    const data = await loader.pull("en", input);
    expect(data).toEqual({
      "Hello world": {
        singular: "Hello world",
        plural: null,
      },
    });
  });

  it("pull entries with context", async () => {
    const loader = createLoader();
    const input = `
#: hello.py:1
msgctxt "role of the user in the workspace"
msgid "Role"
msgstr ""
    `.trim();

    const data = await loader.pull("en", input);
    expect(data).toEqual({
      Role: {
        singular: "Role",
        plural: null,
      },
    });
  });

  it("push entries with context preserving the original context value", async () => {
    const loader = createLoader();
    const input = `
#: hello.py:1
msgctxt "role of the user in the workspace"
msgid "Role"
msgstr ""

#: hello.py:2
msgctxt "role of the user in the workspace"
msgid "Admin"
msgstr ""
    `.trim();

    const update = {
      Admin: {
        singular: "[upd] Admin",
        plural: null,
      },
    };

    const updatedInput = `
#: hello.py:1
msgctxt "role of the user in the workspace"
msgid "Role"
msgstr ""

#: hello.py:2
msgctxt "role of the user in the workspace"
msgid "Admin"
msgstr "[upd] Admin"
    `.trim();

    await loader.pull("en", input);
    const result = await loader.push("en-upd", update);
    expect(result).toEqual(updatedInput);
  });

  it("avoid pulling metadata", async () => {
    const loader = createLoader();
    const input = `
  # SOME DESCRIPTIVE TITLE.
  # Copyright (C) YEAR THE PACKAGE'S COPYRIGHT HOLDER
  # This file is distributed under the same license as the PACKAGE package.
  # FIRST AUTHOR <EMAIL@ADDRESS>, YEAR.
  #
  #, fuzzy
  msgid ""
  msgstr ""
  "Project-Id-Version: PACKAGE VERSION\n"
  "Report-Msgid-Bugs-To: \n"
  "POT-Creation-Date: 2025-01-22 13:15+0000\n"
  "PO-Revision-Date: YEAR-MO-DA HO:MI+ZONE\n"
  "Last-Translator: FULL NAME <EMAIL@ADDRESS>\n"
  "Language-Team: LANGUAGE <LL@li.org>\n"
  "Language: \n"
  "MIME-Version: 1.0\n"
  "Content-Type: text/plain; charset=UTF-8\n"
  "Content-Transfer-Encoding: 8bit\n"
  "Plural-Forms: nplurals=2; plural=(n != 1);\n"

  #: hello.py:1
  msgid "Hello world"
  msgstr ""
      `.trim();

    const data = await loader.pull("en", input);
    expect(data).toEqual({
      "Hello world": {
        singular: "Hello world",
        plural: null,
      },
    });
  });

  it("update data when pushed", async () => {
    const loader = createLoader();
    const input = `
#: hello.py:1
msgid "Hello world"
msgstr ""
      `.trim();
    const updatedData = {
      "Hello world": {
        singular: "Hello world!",
        plural: null,
      },
    };
    const updatedInput = `
#: hello.py:1
msgid "Hello world"
msgstr "Hello world!"
      `.trim();

    await loader.pull("en", input);
    const result = await loader.push("en", updatedData);

    expect(result).toEqual(updatedInput);
  });

  it("avoid pushing default metadata if it's missing", async () => {
    const loader = createLoader();
    const input = `
#: hello.py:1
msgid "Hello world"
msgstr ""
    `.trim();
    const updatedInput = `
#: hello.py:1
msgid "Hello world"
msgstr ""
      `.trim();

    await loader.pull("en", input);
    const result = await loader.push("en", {});
    expect(result).toEqual(updatedInput);
  });

  it("split long lines when told to do so", async () => {
    const loader = createLoader({ multiline: true });
    const input = `
#: hello.py:1
msgid ""
"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod "
"tempor incididunt ut labore et dolore magna aliqua."
msgstr ""
      `.trim();

    await loader.pull("en", input);
    const result = await loader.push("en", {});
    expect(result).toEqual(input);
  });

  it("dont't split long lines by default", async () => {
    const loader = createLoader();
    const input = `
#: hello.py:1
msgid ""
"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod "
"tempor incididunt ut labore et dolore magna aliqua."
msgstr ""
      `.trim();

    const updatedInput = `
#: hello.py:1
msgid "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
msgstr ""
      `.trim();

    await loader.pull("en", input);
    const result = await loader.push("en", {});
    expect(result).toEqual(updatedInput);
  });

  it("pull entries with context", async () => {
    const loader = createLoader();
    const input = `
#: hello.py:1
msgctxt "role of the user in the workspace"
msgid "Role"
msgstr ""
    `.trim();

    const data = await loader.pull("en", input);
    expect(data).toEqual({
      Role: {
        singular: "Role",
        plural: null,
      },
    });
  });

  it("push entries with context preserving the original context value", async () => {
    const loader = createLoader();
    const input = `
#: hello.py:1
msgctxt "role of the user in the workspace"
msgid "Role"
msgstr ""
    `.trim();
    const payload = {
      Role: {
        singular: "[upd] Role",
        plural: null,
      },
    };
    const updatedInput = `
#: hello.py:1
msgctxt "role of the user in the workspace"
msgid "Role"
msgstr "[upd] Role"
    `.trim();

    await loader.pull("en", input);
    const result = await loader.push("en-upd", payload);
    expect(result).toEqual(updatedInput);
  });

  it("fallbacks to msgid when single msgstr value is empty", async () => {
    const loader = createLoader();
    const input = `
#: hello.py:1
msgid "File"
msgstr ""
    `.trim();

    const data = await loader.pull("en", input);
    expect(data).toEqual({
      File: {
        singular: "File",
        plural: null,
      },
    });
  });

  it("fallbacks to msgid when msgstr values are empty", async () => {
    const loader = createLoader();
    const input = `
#: hello.py:1
msgid "File"
msgstr[0] ""
msgstr[1] ""
    `.trim();

    const data = await loader.pull("en", input);
    expect(data).toEqual({
      File: {
        singular: "File",
        plural: "File",
      },
    });
  });

  it("does not fallback to msgid for non-source locale when single msgstr value is empty", async () => {
    const loader = createLoader();
    const input = `
#: hello.py:1
msgid "File"
msgstr ""
    `.trim();

    // First, pull default locale to satisfy loader invariants
    await loader.pull("en", input);

    // Pull a different locale with the same content
    const data = await loader.pull("fr", input);

    expect(data).toEqual({
      File: {
        singular: null,
        plural: null,
      },
    });
  });

  it("does not fallback to msgid for non-source locale when msgstr values are empty", async () => {
    const loader = createLoader();
    const input = `
#: hello.py:1
msgid "File"
msgstr[0] ""
msgstr[1] ""
    `.trim();

    // Pull default locale first
    await loader.pull("en", input);

    // Pull a different locale
    const data = await loader.pull("fr", input);

    expect(data).toEqual({
      File: {
        singular: null,
        plural: null,
      },
    });
  });

  it("should preserve order of comments (file and line number, translator notes)", async () => {
    const loader = createLoader();
    const input = `
# My animal
#, animal
#. This is an animal
#: hello.py:1
# I like animals
#| foobar
msgid "Zebra"
msgstr ""

#. This is a bird
#: hello.py:2
msgid "Parrot"
msgstr ""

#. Food
msgid "Apple"
msgstr ""
    `.trim();

    const data = await loader.pull("en", input);

    const updatedData = {
      Zebra: { singular: "[upd] Zebra", plural: null },
      Parrot: { singular: "[upd] Parrot", plural: null },
      Apple: { singular: "[upd] Apple", plural: null },
    };
    const expectedOutput = `
# My animal
#, animal
#. This is an animal
#: hello.py:1
# I like animals
#| foobar
msgid "Zebra"
msgstr "[upd] Zebra"

#. This is a bird
#: hello.py:2
msgid "Parrot"
msgstr "[upd] Parrot"

#. Food
msgid "Apple"
msgstr "[upd] Apple"
    `.trim();

    const result = await loader.push("en", updatedData);
    expect(result).toEqual(expectedOutput);
  });
});

function createLoader(params: PoLoaderParams = { multiline: false }) {
  return createPoLoader(params).setDefaultLocale("en");
}
