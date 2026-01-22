import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import ApiError from "@/utils/ApiError";

import { FileType } from "@/types/file.type";

// A service to extract text from files

class Extractor {
  public async extractText(
    filePath: string,
    mimeType: FileType,
  ): Promise<string> {
    if (mimeType === FileType.PDF) {
      return this.extractTextFromPdf(filePath);
    } else if (mimeType === FileType.DOCX) {
      return this.extractTextFromDocx(filePath);
    } else {
      throw new ApiError(400, `Unsupported file type: ${mimeType}`);
    }
  }

  private async extractTextFromPdf(pdfPath: string): Promise<string> {
    const parser = new PDFParse({ url: pdfPath });

    const result = await parser.getText();
    return this.clean(result.text);
  }

  private async extractTextFromDocx(docPath: string): Promise<string> {
    const result = await mammoth.extractRawText({ path: docPath });

    const text = result.value; // The raw text
    const messages = result.messages;

    if (messages.length > 0) {
      console.warn("Mammoth messages:", messages);
    }

    return this.clean(text);
  }

  private clean(text: string): string {
    return text
      .replace(/\s{2,}/g, " ")
      .replace(/\n{2,}/g, "\n")
      .trim();
  }
}

export default new Extractor();
