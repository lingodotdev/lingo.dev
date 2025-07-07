# Multi-Agent Translation Review System

A sophisticated AI-powered translation review system that combines multiple specialized agents to ensure high-quality, brand-consistent translations with human-in-the-loop capabilities.

## 🚀 Features

- **Multi-Agent Architecture**: Specialized AI agents for different aspects of translation review
- **Workflow Management**: Configurable review workflows with parallel and sequential processing
- **Brand Consistency**: Dedicated brand specialist agents for voice and tone alignment
- **Technical Accuracy**: Technical reviewer agents for domain-specific terminology
- **Quality Metrics**: Comprehensive metrics and performance tracking
- **Human-in-the-Loop**: Support for human reviewer integration
- **Real-time Events**: Event-driven architecture for monitoring and integration

## 🏗️ Architecture

### Agent Types

1. **Translator Agent**: Primary translation quality and accuracy review
2. **Brand Specialist Agent**: Brand voice, tone, and messaging consistency
3. **Technical Reviewer Agent**: Technical terminology and domain accuracy
4. **Quality Assurance Agent**: Overall quality and compliance review

### Workflow System

The system supports configurable workflows with:
- Sequential or parallel review steps
- Conditional approval requirements
- Auto-approval options
- Multiple reviewers per step

## 📦 Installation

```bash
npm install @lingo.dev/review-system
```

## 🎯 Quick Start

### Basic Usage

```typescript
import { 
  MultiAgentTranslationReviewSystem, 
  createDefaultWorkflow, 
  createAgentConfig 
} from "@lingo.dev/review-system";

// Initialize the review system
const reviewSystem = new MultiAgentTranslationReviewSystem("your-lingo-api-key");

// Register a workflow
const workflow = createDefaultWorkflow();
reviewSystem.registerWorkflow(workflow);

// Register agents
const translatorAgent = createAgentConfig("TRANSLATOR", "AI Translator", {
  languages: ["es", "fr", "de"],
  expertise: ["general", "business"],
});

const brandAgent = createAgentConfig("BRAND_SPECIALIST", "AI Brand Specialist", {
  languages: ["es", "fr", "de"],
  expertise: ["brand", "marketing"],
  brandGuidelines: "Professional, friendly, and approachable tone",
});

reviewSystem.registerAgent(translatorAgent);
reviewSystem.registerAgent(brandAgent);

// Create a review request
const session = await reviewSystem.createReviewRequest(
  "en",
  "es",
  {
    welcome: "Welcome to our platform",
    description: "We provide innovative solutions",
    cta: "Get started today",
  },
  workflow.id,
  {
    domain: "technology",
    tone: "professional",
    brandGuidelines: "Friendly and approachable",
  }
);

console.log("Review session:", session.id);
console.log("Status:", session.status);
```

### CLI Usage

```bash
# Basic review with sample content
npx lingo.dev review --source en --target es

# Review with custom content file
npx lingo.dev review --source en --target es --file content.json

# High priority review
npx lingo.dev review --source en --target es --priority HIGH

# Custom API key
npx lingo.dev review --source en --target es --api-key your-key
```

## 🔧 Configuration

### Workflow Configuration

```typescript
import { createTechnicalWorkflow, createFastWorkflow } from "@lingo.dev/review-system";

// Technical content workflow
const technicalWorkflow = createTechnicalWorkflow();

// Fast review workflow
const fastWorkflow = createFastWorkflow();

// Custom workflow
const customWorkflow = {
  id: "custom-workflow",
  name: "Custom Review Workflow",
  steps: [
    {
      order: 1,
      agentType: "TRANSLATOR",
      required: true,
      autoApprove: false,
      maxReviewers: 2,
    },
    {
      order: 2,
      agentType: "BRAND_SPECIALIST",
      required: true,
      autoApprove: false,
      maxReviewers: 1,
    },
  ],
  autoAssign: true,
  parallelReviews: true,
  isActive: true,
};
```

### Agent Configuration

```typescript
const customAgent = createAgentConfig("TECHNICAL_REVIEWER", "Technical Expert", {
  llmProvider: "openai", // or "anthropic", "lingo"
  llmModel: "gpt-4",
  apiKey: "your-api-key",
  languages: ["es", "fr"],
  expertise: ["software", "api", "documentation"],
  brandGuidelines: "Technical accuracy with clear explanations",
  reviewPrompt: "Custom review prompt for technical content",
});
```

## 📊 Monitoring and Metrics

### Session Metrics

```typescript
const metrics = reviewSystem.getSessionMetrics(sessionId);

console.log("Total Review Time:", metrics.totalReviewTime);
console.log("Average Review Time:", metrics.averageReviewTime);
console.log("Quality Score:", metrics.qualityScore);
console.log("Agent Performance:", metrics.agentPerformance);
```

### Event Tracking

```typescript
const events = reviewSystem.getSessionEvents(sessionId);

events.forEach(event => {
  console.log(`${event.timestamp}: ${event.type}`);
  console.log("Data:", event.data);
});
```

## 🔄 Human-in-the-Loop Integration

The system supports human reviewer integration:

```typescript
// Create a human agent configuration
const humanAgent = createAgentConfig("REVIEWER", "Human Reviewer", {
  isHuman: true,
  email: "reviewer@company.com",
  expertise: ["legal", "compliance"],
});

// Register human agent
reviewSystem.registerAgent(humanAgent);

// The system will pause at human review steps and wait for input
```

## 🎨 Advanced Features

### Custom Review Prompts

```typescript
const customAgent = createAgentConfig("BRAND_SPECIALIST", "Custom Brand Agent", {
  reviewPrompt: `
    You are a brand specialist for {company_name}.
    
    Brand Guidelines:
    - Tone: {tone}
    - Voice: {voice}
    - Key Terms: {key_terms}
    
    Review the translation for brand consistency and suggest improvements.
  `,
});
```

### Parallel Processing

```typescript
const parallelWorkflow = {
  id: "parallel-workflow",
  name: "Parallel Review Workflow",
  steps: [
    {
      order: 1,
      agentType: "TRANSLATOR",
      required: true,
      autoApprove: false,
      maxReviewers: 3, // Multiple reviewers in parallel
    },
  ],
  parallelReviews: true, // Enable parallel processing
};
```

## 📈 Performance Optimization

### Batch Processing

```typescript
// Process multiple content items
const contentBatch = [
  { id: "1", content: { key1: "value1" } },
  { id: "2", content: { key2: "value2" } },
];

const sessions = await Promise.all(
  contentBatch.map(item =>
    reviewSystem.createReviewRequest("en", "es", item.content, workflow.id)
  )
);
```

### Caching and Optimization

The system includes built-in caching for:
- Agent responses
- Translation suggestions
- Review patterns
- Quality metrics

## 🔒 Security and Privacy

- All API keys are handled securely
- Content is processed in memory and not persisted
- Support for enterprise-grade security requirements
- Audit trail for all review activities

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE.md) file for details.

## 🆘 Support

- 📖 [Documentation](https://lingo.dev/docs)
- 💬 [Discord Community](https://lingo.dev/go/discord)
- 🐛 [Issue Tracker](https://github.com/lingodotdev/lingo.dev/issues)
- 📧 [Email Support](mailto:support@lingo.dev) 