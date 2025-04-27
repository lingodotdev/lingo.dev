import { composeLoaders } from "../_utils";
import createMdxFrontmatterSplitLoader from "./frontmatter-split";
import createMdxCodePlaceholderLoader from "./code-placeholder";
import createMdxSectionSplitLoader from "./section-split";
import createLocalizableMdxDocumentLoader from "./localizable-document";

export default function createMdxLoader() {
  return composeLoaders(
    createMdxFrontmatterSplitLoader(),
    createMdxCodePlaceholderLoader(),
    createMdxSectionSplitLoader(),
    createLocalizableMdxDocumentLoader(),
  );
}
