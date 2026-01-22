import fs from "fs";
import asyncHandler from "@/utils/asyncHandler.js";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import { FileType } from "@/types/file.type";
import { SUPPORTED_LANGUAGE_CODES } from "@/constants";

import extractorService from "@/services/extractor.service";
import lingoDotDev from "@/config/lingo";
import { LanguageCode } from "@/types/language.type";
import resumeService from "@/services/resume.service";

// Delete file in background after processing
const deleteFile = (filePath: string): void => {
  if (!fs.existsSync(filePath)) {
    console.warn(`File ${filePath} does not exist, cannot delete.`);
    return;
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file ${filePath}:`, err);
    } else {
      console.log(`File ${filePath} deleted successfully.`);
    }
  });
};

const translate = asyncHandler(async (req, res) => {
  let filePath = "";
  try {
    if (!req.file) {
      throw new ApiError(400, "No file uploaded");
    }
    filePath = req.file.path;

    let { sourceLanguage, targetLanguage } = req.body as {
      sourceLanguage?: LanguageCode;
      targetLanguage?: LanguageCode;
    };

    if (!sourceLanguage || !targetLanguage) {
      throw new ApiError(400, "sourceLanguage and targetLanguage are required");
    }

    // extract text from uploaded file
    const text = await extractorService.extractText(
      filePath,
      req.file.mimetype as FileType,
    );

    // translate text using lingo.dev API
    const translatedText = await lingoDotDev.localizeText(text, {
      sourceLocale: sourceLanguage,
      targetLocale: targetLanguage,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=resume.pdf");

    resumeService.createResume(translatedText, res); // pipe the PDF stream to response

    // clean up uploaded file
    deleteFile(filePath);
  } catch (error) {
    // clean up uploaded file in case of error
    if (filePath) {
      deleteFile(filePath);
    }
    throw error;
  }
});

const getSupportedLanguages = asyncHandler(async (_req, res) => {
  const languageDisplay = new Intl.DisplayNames(["en"], { type: "language" });
  const regionDisplay = new Intl.DisplayNames(["en"], { type: "region" });
  const scriptDisplay = new Intl.DisplayNames(["en"], { type: "script" });

  const toLabel = (code: string): string => {
    const parts = code.split("-");
    const language = parts[0];
    const script = parts.find((part) => /^[A-Z][a-z]{3}$/.test(part));
    const region = parts.find((part) => /^[A-Z]{2}$/.test(part));

    const languageName = languageDisplay.of(language) ?? language;
    const qualifiers: string[] = [];

    if (script) qualifiers.push(scriptDisplay.of(script) ?? script);
    if (region) qualifiers.push(regionDisplay.of(region) ?? region);

    if (qualifiers.length === 0) return languageName;
    return `${languageName} (${qualifiers.join(", ")})`;
  };

  const languages = SUPPORTED_LANGUAGE_CODES.map((code) => ({
    code,
    label: toLabel(code),
  }));

  res.json(new ApiResponse(200, "Supported languages fetched", { languages }));
});

export { translate, getSupportedLanguages };
