import { tool, ToolRuntime } from "@langchain/core/tools";
import OpenAI from "openai";
import z from "zod";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const client = new OpenAI({
  apiKey: process.env.A4F_API_KEY || "",
  baseURL: "https://api.a4f.co/v1",
});

export const imageGenerationTool = tool(
  async (
    { prompt }: { prompt: string },
    config: ToolRuntime,
  ): Promise<string> => {
    const writer = config.writer;

    writer?.({
      type: "progress",
      id: "image_generation",
      message: `Generating image for: "${prompt}"`,
    });

    try {
      const response = await client.images.generate({
        model: process.env.IMAGE_GEN_MODEL_ID || "provider-4/imagen-3.5",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json",
      });

      writer?.({
        type: "progress",
        id: "image_generation",
        message: "Uploading image to Cloudinary...",
      });

      if (!response.data || response.data.length === 0) {
        throw new Error("No image generated in response");
      }

      const imageData = response.data[0].b64_json;
      if (!imageData) {
        throw new Error("No image data found in response");
      }

      const uploadResult = await cloudinary.uploader.upload(
        `data:image/png;base64,${imageData}`,
        {
          resource_type: "image",
          folder: "Toolix-ai/generated-images",
        },
      );

      writer?.({
        type: "progress",
        id: "image_generation",
        message: "Image Generated & uploaded successfully success=true",
      });

      const result = {
        imageUrl: uploadResult.secure_url,
      };

      return JSON.stringify(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      writer?.({
        type: "progress",
        id: "image_generation",
        message: `Error generating image: ${errorMessage} success=false`,
      });
      throw error;
    }
  },
  {
    name: "generate_image",
    description:
      "Generate a new, original image based on a text prompt using AI. Only use when the user explicitly requests image generation with phrases like 'generate an image', 'create an image', 'draw', or 'illustrate'. Do not use for finding existing images or logos.",
    schema: z.object({
      prompt: z
        .string()
        .describe(
          "Detailed text description of the image to generate. Be descriptive for best results.",
        ),
    }),
  },
);
