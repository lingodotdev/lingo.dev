# Anthropic Claude Integration Demo

This demo shows how to use Anthropic Claude models with Lingo.dev for high-quality translation.

## Setup

1. Set your Anthropic API key:
```bash
export ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

2. Run translation:
```bash
npx lingo.dev@latest run
```

## Supported Models

- `claude-3-5-sonnet-20241022` - Latest and most capable model
- `claude-3-5-haiku-20241022` - Fast and efficient for simple translations
- `claude-3-opus-20240229` - Most powerful for complex content
- `claude-3-sonnet-20240229` - Balanced performance and cost
- `claude-3-haiku-20240307` - Fastest and most cost-effective

## Configuration Options

```json
{
  "provider": {
    "id": "anthropic",
    "model": "claude-3-5-sonnet-20241022",
    "prompt": "Custom translation prompt with cultural context",
    "settings": {
      "temperature": 0.2
    }
  }
}
```

## Temperature Settings

- `0.0-0.2` - Most deterministic, consistent translations
- `0.3-0.5` - Balanced creativity and consistency  
- `0.6-1.0` - More creative, varied translations

## Why Choose Claude?

- **Superior Context Understanding**: Excellent at maintaining context across long documents
- **Cultural Awareness**: Better understanding of cultural nuances in translations
- **Safety**: Built-in safety measures for appropriate content
- **Accuracy**: High-quality translations with fewer errors