export interface RawMdx {
  frontmatter: Record<string, any>;
  content: string;
}

export interface PlaceholderedMdx extends RawMdx {
  codePlaceholders: Record<string, string>;
}

export interface SectionedMdx {
  frontmatter: Record<string, any>;
  sections: Record<string, string>;
}

export type LocalizableMdxDocument = {
  meta: Record<string, any>;
  content: Record<string, string>;
};
