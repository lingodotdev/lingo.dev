import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import ApiError from "@/utils/ApiError";

import { FileType } from "@/types/file.type";
import { MAX_EXTRACTED_TEXT_LENGTH } from "@/constants";

// A service to extract text from files

class Extractor {
  public async extractText(
    filePath: string,
    mimeType: FileType,
  ): Promise<string> {
    let text = "";
    if (mimeType === FileType.PDF) {
      text = await this.extractTextFromPdf(filePath);
    } else if (mimeType === FileType.DOCX) {
      text = await this.extractTextFromDocx(filePath);
    } else {
      throw new ApiError(400, `Unsupported file type: ${mimeType}`);
    }

    if (!text || text.length === 0) {
      throw new ApiError(400, `No text extracted from file: ${filePath}`);
    } else if (text.length > MAX_EXTRACTED_TEXT_LENGTH) {
      throw new ApiError(
        400,
        `Extracted text exceeds maximum allowed length of ${MAX_EXTRACTED_TEXT_LENGTH} characters.`,
      );
    }

    return text;
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
      .replace(/\r\n/g, "\n") // normalize Windows newlines
      .replace(/[ \t]+$/gm, "") // trim line-end spaces
      .replace(/\n{3,}/g, "\n\n") // max 1 blank line
      .trim();
  }
}

export default new Extractor();
