# Xcode XCStrings

## Introduction

Lingo.dev CLI translates Xcode .xcstrings files by extracting localizable strings from the modern Xcode Strings Catalog format while preserving complex plural rules, metadata, and localization states.

This guide explains how to localize Xcode XCStrings files with Lingo.dev CLI.

## Demo

Try the [interactive demo](https://lingo.dev/demo) to see Xcode XCStrings localization in action.

## Step 1. Get an API key

Sign up for an account at [Lingo.dev](https://lingo.dev) and get your API key from the dashboard.

## Step 2. Initialize a Lingo.dev project

```bash
npx lingo.dev@latest init
```

## Step 3. Configure the translation pipeline

At a minimum:

- Define the bucket (in this case, the "xcode-xcstrings" bucket)
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
    "xcode-xcstrings": {
      "include": ["./Localizable.xcstrings"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

The original file is updated with translations added as new locale sections. No separate locale directories are needed.

## Step 4. Create the localizable content

Create the .xcstrings file in your project directory with the source language content.

For example:

```json
{
  "sourceLanguage": "en",
  "strings": {
    "greeting": {
      "extractionState": "manual",
      "localizations": {
        "en": {
          "stringUnit": {
            "state": "translated",
            "value": "Hello!"
          }
        }
      }
    },
    "items_count": {
      "extractionState": "manual",
      "localizations": {
        "en": {
          "variations": {
            "plural": {
              "zero": {
                "stringUnit": {
                  "state": "translated",
                  "value": "No items"
                }
              },
              "one": {
                "stringUnit": {
                  "state": "translated",
                  "value": "%d item"
                }
              },
              "other": {
                "stringUnit": {
                  "state": "translated",
                  "value": "%d items"
                }
              }
            }
          }
        }
      }
    }
  }
}
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
    "xcode-xcstrings": {
      "include": ["./Localizable.xcstrings"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

### Input (before localization)

```json
{
  "sourceLanguage": "en",
  "strings": {
    "greeting": {
      "extractionState": "manual",
      "localizations": {
        "en": {
          "stringUnit": {
            "state": "translated",
            "value": "Hello!"
          }
        }
      }
    },
    "welcome": {
      "extractionState": "manual",
      "localizations": {
        "en": {
          "stringUnit": {
            "state": "translated",
            "value": "Welcome to our app"
          }
        }
      }
    }
  }
}
```

### Output (with translations added)

```json
{
  "sourceLanguage": "en",
  "strings": {
    "greeting": {
      "extractionState": "manual",
      "localizations": {
        "en": {
          "stringUnit": {
            "state": "translated",
            "value": "Hello!"
          }
        },
        "es": {
          "stringUnit": {
            "state": "translated",
            "value": "¡Hola!"
          }
        },
        "fr": {
          "stringUnit": {
            "state": "translated",
            "value": "Bonjour!"
          }
        }
      }
    },
    "welcome": {
      "extractionState": "manual",
      "localizations": {
        "en": {
          "stringUnit": {
            "state": "translated",
            "value": "Welcome to our app"
          }
        },
        "es": {
          "stringUnit": {
            "state": "translated",
            "value": "Bienvenido a nuestra aplicación"
          }
        },
        "fr": {
          "stringUnit": {
            "state": "translated",
            "value": "Bienvenue dans notre application"
          }
        }
      }
    }
  }
}
```

## Localization reference

### What is localized

- String unit values within localizations
- Plural form variations (zero, one, two, few, many, other)
- Text content while preserving format specifiers
- Fallback to key name when no source localization exists

### What isn't localized

- String keys and identifiers
- Metadata (`extractionState`, `state`, etc.)
- Structure and organization
- Entries marked with `shouldTranslate: false`
- System-level configuration

### Variable support

This format supports variable placeholders that are preserved during translation:
- `%d` - Integer placeholder
- `%@` - Object placeholder  
- `%s` - String placeholder
- `%f` - Float placeholder
- IEEE-style format specifiers

Variables are automatically detected and converted to `{variable:N}` format during processing, then restored to original format.

### Metadata preservation

Non-translatable content is preserved exactly as it appears in the source:
- Extraction states and translation states
- Localization metadata and configurations
- File structure and organization
- Plural variation structures

Only the actual string values are translated.

## Bucket-specific features

- **Modern Xcode Format**: Full support for Xcode 15+ Strings Catalog format
- **In-place Updates**: Adds translations directly to the existing file structure
- **Plural Variations**: Complete support for complex plural rule variations
- **Metadata Preservation**: Maintains all extraction states and localization metadata
- **Conditional Translation**: Respects `shouldTranslate: false` flags
- **Fallback Handling**: Uses key names as fallback values when source localization is missing
- **State Management**: Properly sets translation states for new localizations
- **IEEE Variable Processing**: Handles format specifiers according to IEEE standards

## Next steps

Learn about other file formats:
- [Markdown localization](https://lingo.dev/docs/markdown)
- [JSON localization](https://lingo.dev/docs/json)
- [XML localization](https://lingo.dev/docs/xml)