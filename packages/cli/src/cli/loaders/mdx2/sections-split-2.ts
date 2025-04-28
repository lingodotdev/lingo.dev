import { ILoader } from "../_types";
import { createLoader } from "../_utils";
import { PlaceholderedMdx, SectionedMdx } from "./_types";
import _ from "lodash";

export default function createMdxSectionsSplit2Loader(): ILoader<
  PlaceholderedMdx,
  SectionedMdx
> {
  return createLoader({
    async pull(locale, input) {
      const sections = _.chain(input.content)
        .split("\n\n")
        .filter(Boolean)
        .map((section, index) => [index, section])
        .fromPairs()
        .value();

      const result: SectionedMdx = {
        frontmatter: input.frontmatter,
        sections,
      };

      return result;
    },

    async push(locale, data, originalInput, _originalLocale, pullInput) {
      const content = _.chain(data.sections).values().join("\n\n").value();

      const result: PlaceholderedMdx = {
        frontmatter: data.frontmatter,
        codePlaceholders: pullInput?.codePlaceholders || {},
        content,
      };

      return result;
    },
  });
}
