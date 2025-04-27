import { ILoader } from "../_types";
import { createLoader } from "../_utils";
import { LocalizableMdxDocument, SectionedMdx } from "./_types";

export default function createLocalizableMdxDocumentLoader(): ILoader<SectionedMdx, LocalizableMdxDocument> {
  return createLoader({
    async pull(_locale, input) {
      return {
        meta: input.frontmatter,
        content: input.sections,
      };
    },

    async push(_locale, data, originalInput, _originalLocale, pullInput) {
      const result: SectionedMdx = {
        frontmatter: data.meta || {},
        sections: data.content || {},
      };

      return result;
    },
  });
}
