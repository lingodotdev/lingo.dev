import { describe, test, expect } from "vitest";
import createAilLoader from "./ail";

describe("ail loader", () => {
  test("should extract single entry", async () => {
    const loader = createAilLoader();
    loader.setDefaultLocale("en");
    const input = `<?xml version="1.0" encoding="UTF-8"?>
<DICTIONARY type="multilanguage">
  <ENTRY id="Control.Text.WelcomeDlg#Title">
    <STRING lang="en" value="Welcome to Setup"/>
  </ENTRY>
</DICTIONARY>`;

    const result = await loader.pull("en", input);
    expect(result["Control.Text.WelcomeDlg#Title"]).toBe("Welcome to Setup");
  });

  test("should extract multiple entries", async () => {
    const loader = createAilLoader();
    loader.setDefaultLocale("en");
    const input = `<?xml version="1.0" encoding="UTF-8"?>
<DICTIONARY type="multilanguage">
  <ENTRY id="Control.Text.WelcomeDlg#Title">
    <STRING lang="en" value="Welcome to Setup"/>
  </ENTRY>
  <ENTRY id="Property.ProductName">
    <STRING lang="en" value="My Application"/>
  </ENTRY>
  <ENTRY id="Control.Text.InstallDlg#NextButton">
    <STRING lang="en" value="Install"/>
  </ENTRY>
</DICTIONARY>`;

    const result = await loader.pull("en", input);
    expect(result["Control.Text.WelcomeDlg#Title"]).toBe("Welcome to Setup");
    expect(result["Property.ProductName"]).toBe("My Application");
    expect(result["Control.Text.InstallDlg#NextButton"]).toBe("Install");
  });

  test("should extract only specified locale", async () => {
    const loader = createAilLoader();
    loader.setDefaultLocale("en");
    const input = `<?xml version="1.0" encoding="UTF-8"?>
<DICTIONARY type="multilanguage">
  <ENTRY id="Control.Text.WelcomeDlg#Title">
    <STRING lang="en" value="Welcome to Setup"/>
    <STRING lang="de" value="Willkommen"/>
    <STRING lang="fr" value="Bienvenue"/>
  </ENTRY>
</DICTIONARY>`;

    const result = await loader.pull("en", input);
    expect(result["Control.Text.WelcomeDlg#Title"]).toBe("Welcome to Setup");
    expect(Object.keys(result).length).toBe(1);
  });

  test("should extract German locale", async () => {
    const loader = createAilLoader();
    loader.setDefaultLocale("de");
    const input = `<?xml version="1.0" encoding="UTF-8"?>
<DICTIONARY type="multilanguage">
  <ENTRY id="Control.Text.WelcomeDlg#Title">
    <STRING lang="en" value="Welcome to Setup"/>
    <STRING lang="de" value="Willkommen"/>
  </ENTRY>
</DICTIONARY>`;

    const result = await loader.pull("de", input);
    expect(result["Control.Text.WelcomeDlg#Title"]).toBe("Willkommen");
  });

  test("should skip entries without matching locale", async () => {
    const loader = createAilLoader();
    loader.setDefaultLocale("en");
    const input = `<?xml version="1.0" encoding="UTF-8"?>
<DICTIONARY type="multilanguage">
  <ENTRY id="Control.Text.WelcomeDlg#Title">
    <STRING lang="de" value="Willkommen"/>
    <STRING lang="fr" value="Bienvenue"/>
  </ENTRY>
  <ENTRY id="Property.ProductName">
    <STRING lang="en" value="My Application"/>
  </ENTRY>
</DICTIONARY>`;

    const result = await loader.pull("en", input);
    expect(result["Control.Text.WelcomeDlg#Title"]).toBeUndefined();
    expect(result["Property.ProductName"]).toBe("My Application");
  });

  test("should skip entries without id attribute", async () => {
    const loader = createAilLoader();
    loader.setDefaultLocale("en");
    const input = `<?xml version="1.0" encoding="UTF-8"?>
<DICTIONARY type="multilanguage">
  <ENTRY>
    <STRING lang="en" value="No ID"/>
  </ENTRY>
  <ENTRY id="Property.ProductName">
    <STRING lang="en" value="My Application"/>
  </ENTRY>
</DICTIONARY>`;

    const result = await loader.pull("en", input);
    expect(Object.keys(result).length).toBe(1);
    expect(result["Property.ProductName"]).toBe("My Application");
  });

  test("should handle empty DICTIONARY", async () => {
    const loader = createAilLoader();
    loader.setDefaultLocale("en");
    const input = `<?xml version="1.0" encoding="UTF-8"?>
<DICTIONARY type="multilanguage">
</DICTIONARY>`;

    const result = await loader.pull("en", input);
    expect(Object.keys(result).length).toBe(0);
  });

  test("should handle empty input", async () => {
    const loader = createAilLoader();
    loader.setDefaultLocale("en");
    const result = await loader.pull("en", "");
    expect(Object.keys(result).length).toBe(0);
  });

  test("should handle special characters in values", async () => {
    const loader = createAilLoader();
    loader.setDefaultLocale("en");
    const input = `<?xml version="1.0" encoding="UTF-8"?>
<DICTIONARY type="multilanguage">
  <ENTRY id="Message.Warning">
    <STRING lang="en" value="Error: &quot;File not found&quot; &amp; other issues"/>
  </ENTRY>
</DICTIONARY>`;

    const result = await loader.pull("en", input);
    expect(result["Message.Warning"]).toBe('Error: "File not found" & other issues');
  });

  test("should push translation to new locale", async () => {
    const loader = createAilLoader();
    loader.setDefaultLocale("en");
    const originalInput = `<?xml version="1.0" encoding="UTF-8"?>
<DICTIONARY type="multilanguage">
  <ENTRY id="Control.Text.WelcomeDlg#Title">
    <STRING lang="en" value="Welcome to Setup"/>
  </ENTRY>
</DICTIONARY>`;

    await loader.pull("en", originalInput);

    const translations = {
      "Control.Text.WelcomeDlg#Title": "Willkommen",
    };

    const output = await loader.push("de", translations, originalInput);

    expect(output).toContain('lang="en"');
    expect(output).toContain('value="Welcome to Setup"');
    expect(output).toContain('lang="de"');
    expect(output).toContain('value="Willkommen"');
  });

  test("should update existing locale translation", async () => {
    const loader = createAilLoader();
    loader.setDefaultLocale("en");
    const originalInput = `<?xml version="1.0" encoding="UTF-8"?>
<DICTIONARY type="multilanguage">
  <ENTRY id="Control.Text.WelcomeDlg#Title">
    <STRING lang="en" value="Welcome to Setup"/>
    <STRING lang="de" value="Old Translation"/>
  </ENTRY>
</DICTIONARY>`;

    await loader.pull("en", originalInput);

    const translations = {
      "Control.Text.WelcomeDlg#Title": "Willkommen",
    };

    const output = await loader.push("de", translations, originalInput);

    expect(output).toContain('lang="de"');
    expect(output).toContain('value="Willkommen"');
    expect(output).not.toContain("Old Translation");
  });

  test("should preserve other locales when pushing", async () => {
    const loader = createAilLoader();
    loader.setDefaultLocale("en");
    const originalInput = `<?xml version="1.0" encoding="UTF-8"?>
<DICTIONARY type="multilanguage">
  <ENTRY id="Control.Text.WelcomeDlg#Title">
    <STRING lang="en" value="Welcome to Setup"/>
    <STRING lang="fr" value="Bienvenue"/>
  </ENTRY>
</DICTIONARY>`;

    await loader.pull("en", originalInput);

    const translations = {
      "Control.Text.WelcomeDlg#Title": "Willkommen",
    };

    const output = await loader.push("de", translations, originalInput);

    expect(output).toContain('lang="en"');
    expect(output).toContain('lang="fr"');
    expect(output).toContain('value="Bienvenue"');
    expect(output).toContain('lang="de"');
    expect(output).toContain('value="Willkommen"');
  });

  test("should add new entry when pushing new key", async () => {
    const loader = createAilLoader();
    loader.setDefaultLocale("en");
    const originalInput = `<?xml version="1.0" encoding="UTF-8"?>
<DICTIONARY type="multilanguage">
  <ENTRY id="Control.Text.WelcomeDlg#Title">
    <STRING lang="en" value="Welcome to Setup"/>
  </ENTRY>
</DICTIONARY>`;

    await loader.pull("en", originalInput);

    const translations = {
      "Control.Text.WelcomeDlg#Title": "Welcome to Setup",
      "Property.ProductName": "My Application",
    };

    const output = await loader.push("en", translations, originalInput);

    expect(output).toContain('id="Control.Text.WelcomeDlg#Title"');
    expect(output).toContain('id="Property.ProductName"');
    expect(output).toContain('value="My Application"');
  });

  test("should preserve DICTIONARY attributes", async () => {
    const loader = createAilLoader();
    loader.setDefaultLocale("en");
    const originalInput = `<?xml version="1.0" encoding="UTF-8"?>
<DICTIONARY type="multilanguage" ignore="de">
  <ENTRY id="Control.Text.WelcomeDlg#Title">
    <STRING lang="en" value="Welcome to Setup"/>
  </ENTRY>
</DICTIONARY>`;

    await loader.pull("en", originalInput);

    const translations = {
      "Control.Text.WelcomeDlg#Title": "Willkommen",
    };

    const output = await loader.push("de", translations, originalInput);

    expect(output).toContain('type="multilanguage"');
    expect(output).toContain('ignore="de"');
  });

  test("should handle multiple translations", async () => {
    const loader = createAilLoader();
    loader.setDefaultLocale("en");
    const originalInput = `<?xml version="1.0" encoding="UTF-8"?>
<DICTIONARY type="multilanguage">
  <ENTRY id="Control.Text.WelcomeDlg#Title">
    <STRING lang="en" value="Welcome to Setup"/>
  </ENTRY>
  <ENTRY id="Property.ProductName">
    <STRING lang="en" value="My Application"/>
  </ENTRY>
  <ENTRY id="Control.Text.InstallDlg#NextButton">
    <STRING lang="en" value="Install"/>
  </ENTRY>
</DICTIONARY>`;

    await loader.pull("en", originalInput);

    const translations = {
      "Control.Text.WelcomeDlg#Title": "Willkommen",
      "Property.ProductName": "Meine Anwendung",
      "Control.Text.InstallDlg#NextButton": "Installieren",
    };

    const output = await loader.push("de", translations, originalInput);

    expect(output).toContain('value="Willkommen"');
    expect(output).toContain('value="Meine Anwendung"');
    expect(output).toContain('value="Installieren"');
  });

  test("should create new AIL file from scratch", async () => {
    const loader = createAilLoader();
    loader.setDefaultLocale("en");

    // Pull from empty input first
    await loader.pull("en", "");

    const translations = {
      "Control.Text.WelcomeDlg#Title": "Welcome to Setup",
      "Property.ProductName": "My Application",
    };

    const output = await loader.push("en", translations, "");

    expect(output).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(output).toContain('<DICTIONARY');
    expect(output).toContain('type="multilanguage"');
    expect(output).toContain('id="Control.Text.WelcomeDlg#Title"');
    expect(output).toContain('id="Property.ProductName"');
    expect(output).toContain('lang="en"');
    expect(output).toContain('value="Welcome to Setup"');
    expect(output).toContain('value="My Application"');
  });

  test("should handle entries with empty values", async () => {
    const loader = createAilLoader();
    loader.setDefaultLocale("en");
    const input = `<?xml version="1.0" encoding="UTF-8"?>
<DICTIONARY type="multilanguage">
  <ENTRY id="Control.Text.EmptyValue">
    <STRING lang="en" value=""/>
  </ENTRY>
  <ENTRY id="Property.ProductName">
    <STRING lang="en" value="My Application"/>
  </ENTRY>
</DICTIONARY>`;

    const result = await loader.pull("en", input);
    // Empty values should not be extracted
    expect(result["Control.Text.EmptyValue"]).toBeUndefined();
    expect(result["Property.ProductName"]).toBe("My Application");
  });

  test("should handle property style IDs", async () => {
    const loader = createAilLoader();
    loader.setDefaultLocale("en");
    const input = `<?xml version="1.0" encoding="UTF-8"?>
<DICTIONARY type="multilanguage">
  <ENTRY id="Property.ARPCOMMENTS">
    <STRING lang="en" value="Application Comments"/>
  </ENTRY>
  <ENTRY id="Property.ARPCONTACT">
    <STRING lang="en" value="Support Contact"/>
  </ENTRY>
</DICTIONARY>`;

    const result = await loader.pull("en", input);
    expect(result["Property.ARPCOMMENTS"]).toBe("Application Comments");
    expect(result["Property.ARPCONTACT"]).toBe("Support Contact");
  });

  test("should handle control style IDs", async () => {
    const loader = createAilLoader();
    loader.setDefaultLocale("en");
    const input = `<?xml version="1.0" encoding="UTF-8"?>
<DICTIONARY type="multilanguage">
  <ENTRY id="Control.Text.WelcomeDlg#Title">
    <STRING lang="en" value="Welcome"/>
  </ENTRY>
  <ENTRY id="Control.Text.WelcomeDlg#Description">
    <STRING lang="en" value="Setup will guide you"/>
  </ENTRY>
</DICTIONARY>`;

    const result = await loader.pull("en", input);
    expect(result["Control.Text.WelcomeDlg#Title"]).toBe("Welcome");
    expect(result["Control.Text.WelcomeDlg#Description"]).toBe("Setup will guide you");
  });

  test("should handle XML entities in pushed values", async () => {
    const loader = createAilLoader();
    loader.setDefaultLocale("en");
    const originalInput = `<?xml version="1.0" encoding="UTF-8"?>
<DICTIONARY type="multilanguage">
  <ENTRY id="Message.Warning">
    <STRING lang="en" value="Original"/>
  </ENTRY>
</DICTIONARY>`;

    await loader.pull("en", originalInput);

    const translations = {
      "Message.Warning": 'Error: "File not found" & other issues',
    };

    const output = await loader.push("en", translations, originalInput);

    expect(output).toContain("&quot;");
    expect(output).toContain("&amp;");
  });
});
