import { Command } from "interactive-commander";
import { MultiAgentTranslationReviewSystem, createDefaultWorkflow, createAgentConfig } from "@lingo.dev/review-system";
import { LingoDotDevEngine } from "@lingo.dev/sdk";
import { createId } from "@paralleldrive/cuid2";

const reviewCmd = new Command("review")
  .description("Multi-Agent Translation Review System")
  .option("-s, --source <locale>", "Source locale", "en")
  .option("-t, --target <locale>", "Target locale", "es")
  .option("-f, --file <path>", "Input file path (JSON)")
  .option("-w, --workflow <id>", "Workflow ID", "default")
  .option("-p, --priority <level>", "Priority level", "MEDIUM")
  .option("--api-key <key>", "Lingo.dev API key")
  .action(async (options) => {
    try {
      // Get API key from options or environment
      const apiKey = options.apiKey || process.env.LINGODOTDEV_API_KEY;
      if (!apiKey) {
        console.error("❌ Lingo.dev API key is required. Set --api-key or LINGODOTDEV_API_KEY environment variable.");
        process.exit(1);
      }

      // Initialize the review system
      const reviewSystem = new MultiAgentTranslationReviewSystem(apiKey);

      // Register default workflow
      const defaultWorkflow = createDefaultWorkflow();
      reviewSystem.registerWorkflow(defaultWorkflow);

      // Register agents
      const translatorAgent = createAgentConfig("TRANSLATOR", "AI Translator", {
        llmProvider: "lingo",
        languages: [options.target],
        expertise: ["general"],
      });
      reviewSystem.registerAgent(translatorAgent);

      const brandAgent = createAgentConfig("BRAND_SPECIALIST", "AI Brand Specialist", {
        llmProvider: "lingo",
        languages: [options.target],
        expertise: ["brand", "marketing"],
        brandGuidelines: "Maintain professional, friendly tone with clear messaging",
      });
      reviewSystem.registerAgent(brandAgent);

      // Load content from file or use sample
      let content: Record<string, string>;
      if (options.file) {
        try {
          const fs = await import("fs");
          const fileContent = fs.readFileSync(options.file, "utf-8");
          content = JSON.parse(fileContent);
        } catch (error) {
          console.error(`❌ Error reading file ${options.file}:`, error);
          process.exit(1);
        }
      } else {
        // Sample content for demonstration
        content = {
          welcome: "Welcome to our platform",
          description: "We provide innovative solutions for your business needs",
          cta: "Get started today",
        };
      }

      console.log("🚀 Starting Multi-Agent Translation Review...");
      console.log(`📝 Source: ${options.source} → Target: ${options.target}`);
      console.log(`📊 Content keys: ${Object.keys(content).join(", ")}`);

      // Create review request
      const session = await reviewSystem.createReviewRequest(
        options.source,
        options.target,
        content,
        defaultWorkflow.id,
        {
          domain: "technology",
          tone: "professional",
          brandGuidelines: "Friendly and approachable",
        },
        options.priority
      );

      console.log(`✅ Review session created: ${session.id}`);
      console.log(`📈 Status: ${session.status}`);

      // Wait for completion and show results
      let currentSession = session;
      const maxWaitTime = 30000; // 30 seconds
      const startTime = Date.now();

      while (currentSession.status === "PENDING" || currentSession.status === "IN_PROGRESS") {
        if (Date.now() - startTime > maxWaitTime) {
          console.log("⏰ Timeout waiting for review completion");
          break;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        currentSession = reviewSystem.getSession(session.id)!;
      }

      // Display results
      console.log("\n📋 Review Results:");
      console.log(`Status: ${currentSession.status}`);
      console.log(`Total Reviews: ${currentSession.reviews.length}`);

      if (currentSession.finalTranslation) {
        console.log("\n🎯 Final Translation:");
        Object.entries(currentSession.finalTranslation).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
      }

      // Show review details
      if (currentSession.reviews.length > 0) {
        console.log("\n🔍 Review Details:");
        currentSession.reviews.forEach((review, index) => {
          console.log(`\n  Review ${index + 1} (${review.agentType}):`);
          console.log(`    Status: ${review.status}`);
          console.log(`    Confidence: ${(review.confidence! * 100).toFixed(1)}%`);
          console.log(`    Time: ${review.reviewTime?.toFixed(2)}s`);
          
          if (review.comments.length > 0) {
            console.log(`    Comments: ${review.comments.length}`);
            review.comments.forEach(comment => {
              console.log(`      - ${comment.key}: ${comment.message}`);
              if (comment.suggestion) {
                console.log(`        Suggestion: ${comment.suggestion}`);
              }
            });
          }
        });
      }

      // Show metrics
      const metrics = reviewSystem.getSessionMetrics(session.id);
      if (metrics) {
        console.log("\n📊 Metrics:");
        console.log(`Total Review Time: ${metrics.totalReviewTime.toFixed(2)}s`);
        console.log(`Average Review Time: ${metrics.averageReviewTime.toFixed(2)}s`);
        console.log(`Quality Score: ${(metrics.qualityScore! * 100).toFixed(1)}%`);
      }

      console.log("\n✨ Review process completed!");

    } catch (error) {
      console.error("❌ Error during review process:", error);
      process.exit(1);
    }
  });

export default reviewCmd; 