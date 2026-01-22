import { DEFAULT_RESUME_LAYOUT } from "@/constants";
import type { ResumeLayout } from "@/types/resumeLayout.type";
import type { Response } from "express";
import PDFDocument from "pdfkit";

class ResumeService {
  createResume(
    data: string,
    res: Response,
    layout: ResumeLayout = DEFAULT_RESUME_LAYOUT,
  ): void {
    const doc = new PDFDocument({
      size: layout.page.size,
      margin: layout.page.margin,
    });

    doc.pipe(res);

    const lines = data.split("\n");

    lines.forEach((line, index) => {
      // First line = Name (assumption)
      if (index === 0) {
        doc.fontSize(layout.fonts.name).text(line);
        doc.moveDown(0.5);
        return;
      }

      // Section heading (ALL CAPS line)
      if (/^[A-Z\s]{3,}$/.test(line)) {
        doc.moveDown(layout.spacing.sectionGap / 10);
        doc.fontSize(layout.fonts.section).text(line);
        doc.moveDown(0.3);
        return;
      }

      // Normal content
      doc
        .fontSize(layout.fonts.body)
        .text(line, { lineGap: layout.spacing.lineGap });
    });

    doc.end();
  }
}

export default new ResumeService();
