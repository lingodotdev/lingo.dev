# OpenAI GPT Integration Demo

This demo shows how to use OpenAI GPT models with Lingo.dev for translation.

## Setup

1. Set your OpenAI API key:
```bash
export OPENAI_API_KEY=your_openai_api_key_here
```

2. Run translation:
```bash
npx lingo.dev@latest run
```

## Supported Models

- `gpt-4` - Most accurate, best for complex content
- `gpt-4-turbo` - Faster and cheaper than GPT-4
- `gpt-3.5-turbo` - Fast and cost-effective for simple translations

## Configuration Options

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4",
    "prompt": "Custom translation prompt",
    "settings": {
      "temperature": 0.3
    }
  }
}
```

## Temperature Settings

- `0.0-0.3` - More deterministic, consistent translations
- `0.4-0.7` - Balanced creativity and consistency  
- `0.8-1.0` - More creative, varied translations