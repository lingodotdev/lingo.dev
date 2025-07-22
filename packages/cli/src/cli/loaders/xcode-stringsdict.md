# Xcode Stringsdict

## Introduction

Lingo.dev CLI translates Xcode .stringsdict files by extracting localizable strings from the XML plist structure while preserving complex plural rules and format specifications.

This guide explains how to localize Xcode Stringsdict files with Lingo.dev CLI.

## Demo

Try the [interactive demo](https://lingo.dev/demo) to see Xcode Stringsdict localization in action.

## Step 1. Get an API key

Sign up for an account at [Lingo.dev](https://lingo.dev) and get your API key from the dashboard.

## Step 2. Initialize a Lingo.dev project

```bash
npx lingo.dev@latest init
```

## Step 3. Configure the translation pipeline

At a minimum:

- Define the bucket (in this case, the "xcode-stringsdict" bucket)
- Configure the files to localize

For example:

```json
{
  "version": 1.8,
  "locale": {
    "source": "en",
    "targets": ["es"]
  },
  "buckets": {
    "xcode-stringsdict": {
      "include": ["./[locale].lproj/Localizable.stringsdict"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

[locale] is a placeholder that gets replaced with the actual locale code (e.g., "en", "es") to match your file structure.

## Step 4. Create the localizable content

In the directory that contains the source locale content (e.g., en.lproj/), create one or more files that match the specified glob pattern.

For example:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>greeting</key>
  <string>Hello!</string>
  <key>items_count</key>
  <dict>
    <key>NSStringLocalizedFormatKey</key>
    <string>%#@items@</string>
    <key>items</key>
    <dict>
      <key>NSStringFormatSpecTypeKey</key>
      <string>NSStringPluralRuleType</string>
      <key>NSStringFormatValueTypeKey</key>
      <string>d</string>
      <key>one</key>
      <string>%d item</string>
      <key>other</key>
      <string>%d items</string>
    </dict>
  </dict>
</dict>
</plist>
```

## Step 5. Run the translation pipeline

```bash
npx lingo.dev@latest i18n
```

## Example

### Configuration

```json
{
  "version": 1.8,
  "locale": {
    "source": "en",
    "targets": ["es", "fr"]
  },
  "buckets": {
    "xcode-stringsdict": {
      "include": ["./[locale].lproj/Localizable.stringsdict"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

### Input (source locale)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>greeting</key>
  <string>Hello!</string>
  <key>items_count</key>
  <dict>
    <key>NSStringLocalizedFormatKey</key>
    <string>%#@items@</string>
    <key>items</key>
    <dict>
      <key>NSStringFormatSpecTypeKey</key>
      <string>NSStringPluralRuleType</string>
      <key>NSStringFormatValueTypeKey</key>
      <string>d</string>
      <key>one</key>
      <string>%d item</string>
      <key>other</key>
      <string>%d items</string>
    </dict>
  </dict>
</dict>
</plist>
```

### Output (target locale)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>greeting</key>
  <string>¡Hola!</string>
  <key>items_count</key>
  <dict>
    <key>NSStringLocalizedFormatKey</key>
    <string>%#@items@</string>
    <key>items</key>
    <dict>
      <key>NSStringFormatSpecTypeKey</key>
      <string>NSStringPluralRuleType</string>
      <key>NSStringFormatValueTypeKey</key>
      <string>d</string>
      <key>one</key>
      <string>%d elemento</string>
      <key>other</key>
      <string>%d elementos</string>
    </dict>
  </dict>
</dict>
</plist>
```

## Localization reference

### What is localized

- String values within the plist structure
- Plural form strings (zero, one, two, few, many, other)
- Simple string entries
- Text content while preserving format specifiers

### What isn't localized

- XML structure and plist formatting
- System keys (`NSStringLocalizedFormatKey`, `NSStringFormatSpecTypeKey`, etc.)
- Format specifications and value types
- Plural rule structures and configurations
- Format placeholders (`%#@items@`, `%d`, etc.)

## Bucket-specific features

- **Plist Format Support**: Full support for Apple's XML plist format
- **Plural Rules**: Comprehensive handling of iOS/macOS plural rule systems
- **Format Specifier Safety**: Preserves all Apple format specifiers and placeholders
- **Nested Structure**: Maintains complex nested dictionary structures
- **System Key Preservation**: Keeps all NSString* system keys unchanged
- **XML Compliance**: Generates valid XML with proper DOCTYPE declarations
- **Hierarchy Maintenance**: Preserves the complete plist hierarchy and organization

## Next steps

Learn about other file formats:
- [Markdown localization](https://lingo.dev/docs/markdown)
- [JSON localization](https://lingo.dev/docs/json)
- [XML localization](https://lingo.dev/docs/xml)