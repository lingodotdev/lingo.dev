import { describe, it, expect, beforeEach } from "vitest";
import { 
  MultiAgentTranslationReviewSystem,
  createDefaultWorkflow,
  createAgentConfig,
  createTechnicalWorkflow,
  createFastWorkflow
} from "./index";

describe("MultiAgentTranslationReviewSystem", () => {
  let reviewSystem: MultiAgentTranslationReviewSystem;
  const mockApiKey = "test-api-key";

  beforeEach(() => {
    reviewSystem = new MultiAgentTranslationReviewSystem(mockApiKey);
  });

  describe("Workflow Creation", () => {
    it("should create default workflow", () => {
      const workflow = createDefaultWorkflow();
      expect(workflow.id).toBe("default-workflow");
      expect(workflow.steps).toHaveLength(2);
      expect(workflow.steps[0].agentType).toBe("TRANSLATOR");
      expect(workflow.steps[1].agentType).toBe("BRAND_SPECIALIST");
    });

    it("should create technical workflow", () => {
      const workflow = createTechnicalWorkflow();
      expect(workflow.id).toBe("technical-workflow");
      expect(workflow.steps).toHaveLength(3);
      expect(workflow.steps[1].agentType).toBe("TECHNICAL_REVIEWER");
    });

    it("should create fast workflow", () => {
      const workflow = createFastWorkflow();
      expect(workflow.id).toBe("fast-workflow");
      expect(workflow.steps).toHaveLength(1);
      expect(workflow.parallelReviews).toBe(true);
    });
  });

  describe("Agent Configuration", () => {
    it("should create agent config", () => {
      const agent = createAgentConfig("TRANSLATOR", "Test Translator", {
        languages: ["es", "fr"],
        expertise: ["general"],
      });

      expect(agent.name).toBe("Test Translator");
      expect(agent.type).toBe("TRANSLATOR");
      expect(agent.languages).toEqual(["es", "fr"]);
      expect(agent.expertise).toEqual(["general"]);
    });
  });

  describe("System Registration", () => {
    it("should register workflow", () => {
      const workflow = createDefaultWorkflow();
      reviewSystem.registerWorkflow(workflow);
      
      // Note: We can't directly test private methods, but we can test the public interface
      expect(() => reviewSystem.registerWorkflow(workflow)).not.toThrow();
    });

    it("should register agent", () => {
      const agent = createAgentConfig("TRANSLATOR", "Test Agent");
      expect(() => reviewSystem.registerAgent(agent)).not.toThrow();
    });
  });

  describe("Utility Functions", () => {
    it("should create different workflow types", () => {
      const defaultWorkflow = createDefaultWorkflow();
      const technicalWorkflow = createTechnicalWorkflow();
      const fastWorkflow = createFastWorkflow();

      expect(defaultWorkflow.id).not.toBe(technicalWorkflow.id);
      expect(technicalWorkflow.id).not.toBe(fastWorkflow.id);
      expect(fastWorkflow.id).not.toBe(defaultWorkflow.id);
    });

    it("should create agent configs with different types", () => {
      const translator = createAgentConfig("TRANSLATOR", "Translator");
      const brandSpecialist = createAgentConfig("BRAND_SPECIALIST", "Brand Specialist");
      const technicalReviewer = createAgentConfig("TECHNICAL_REVIEWER", "Technical Reviewer");

      expect(translator.type).toBe("TRANSLATOR");
      expect(brandSpecialist.type).toBe("BRAND_SPECIALIST");
      expect(technicalReviewer.type).toBe("TECHNICAL_REVIEWER");
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid agent type", () => {
      const invalidAgent = createAgentConfig("INVALID_TYPE" as any, "Invalid Agent");
      expect(() => reviewSystem.registerAgent(invalidAgent)).toThrow("Unsupported agent type");
    });
  });
}); 