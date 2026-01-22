import { tool, ToolRuntime } from "@langchain/core/tools";
import z from "zod";
import { Supadata } from "@supadata/js";

function optimizeTranscript(
  text: string,
  maxChars: number = 15000
): { transcript: string; metadata: any } {
  let cleaned = text
    .replace(/\b(um|uh|like|you know|actually|basically)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  const originalLength = cleaned.length;
  const wasTruncated = cleaned.length > maxChars;

  if (wasTruncated) {
    const introLength = Math.floor(maxChars * 0.5);
    const outroLength = Math.floor(maxChars * 0.3);

    const intro = cleaned.slice(0, introLength);
    const outro = cleaned.slice(-outroLength);

    cleaned = `${intro}\n\n[... middle section truncated for length ...]\n\n${outro}`;
  }

  return {
    transcript: cleaned,
    metadata: {
      originalLength,
      optimizedLength: cleaned.length,
      wasTruncated,
      compressionRatio: (cleaned.length / originalLength).toFixed(2),
    },
  };
}

export const youtubeTranscriptFetcherTool = tool(
  async ({ videoUrl }: { videoUrl?: string }, config: ToolRuntime) => {
    const writer = config.writer;

    const url = videoUrl || "https://youtu.be/dQw4w9WgXcQ";

    writer?.({
      type: "progress",
      id: "youtube_transcript_fetcher",
      message: `Fetching transcript for YouTube video...`,
    });

    const apiKey = process.env.SUPADATA_API_KEY;
    if (!apiKey) {
      writer?.({
        type: "progress",
        id: "youtube_transcript_fetcher",
        message: "Error: Supadata API key not found success=false",
      });
      throw new Error(
        "Supadata API key not found. Please set SUPADATA_API_KEY environment variable."
      );
    }

    const supadata = new Supadata({
      apiKey,
    });

    const transcript = await supadata.transcript({
      url,
    });

    if (typeof transcript === "string") {
      throw new Error(
        `Transcript request queued with job ID: ${transcript}. Please try again later.`
      );
    }

    const transcriptData = transcript as { content: any[] };
    if (
      !transcriptData ||
      !transcriptData.content ||
      transcriptData.content.length === 0
    ) {
      throw new Error(`No transcript found for the video.`);
    }

    const transcriptText = transcriptData.content
      .map((item: any) => item.text)
      .join(" ");

    const { transcript: optimizedTranscript, metadata } =
      optimizeTranscript(transcriptText);

    writer?.({
      type: "progress",
      id: "youtube_transcript_fetcher",
      message: `Transcript fetched successfully${
        metadata.wasTruncated ? " (optimized for length)" : ""
      } success=true`,
    });

    return JSON.stringify({
      transcript: optimizedTranscript,
      metadata: {
        ...metadata,
        note: metadata.wasTruncated
          ? "Long transcript - showing intro and conclusion sections. Middle content truncated to fit context limits."
          : "Full transcript included",
      },
    });
  },
  {
    name: "youtube_transcript_fetcher",
    description: "Fetch the transcript of a YouTube video.",
    schema: z.object({
      videoUrl: z
        .string()
        .optional()
        .describe("The full YouTube video URL to fetch transcript from"),
    }),
  }
);
