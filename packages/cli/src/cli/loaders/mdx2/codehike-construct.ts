import { ILoader } from "../_types";
import { createLoader } from "../_utils";
import { md5 } from "../../utils/md5";
import _ from "lodash";

const chComponentRegex = /<CH\.(Code|Section|Scrollycoding|Spotlight|Slideshow)[^>]*>([\s\S]*?)<\/CH\.\1>/g;

const annotationRegex = /```[\s\S]*?{[\s\S]*?(focus|mark|withClass|link|from)[\s\S]*?}[\s\S]*?```/gm;

const paramsRegex = /###\s*!params/g;

/**
 * Extracts Code Hike constructs and replaces them with placeholders.
 * Returns the transformed content and a mapping of placeholders to original content.
 */
function extractCodeHikeConstructs(content: string): {
  content: string;
  codehikePlaceholders: Record<string, string>;
} {
  let finalContent = content;
  const codehikePlaceholders: Record<string, string> = {};
  
  const componentMatches = Array.from(finalContent.matchAll(chComponentRegex));
  for (const match of componentMatches) {
    const [fullMatch, componentType, componentContent] = match;
    const constructHash = md5(fullMatch);
    const placeholder = `---CODEHIKE-COMPONENT-${constructHash}---`;
    
    codehikePlaceholders[placeholder] = fullMatch;
    finalContent = finalContent.replace(fullMatch, placeholder);
  }
  
  const annotationMatches = Array.from(finalContent.matchAll(annotationRegex));
  for (const match of annotationMatches) {
    const construct = match[0];
    const constructHash = md5(construct);
    const placeholder = `---CODEHIKE-ANNOTATION-${constructHash}---`;
    
    codehikePlaceholders[placeholder] = construct;
    finalContent = finalContent.replace(construct, placeholder);
  }
  
  const paramsMatches = Array.from(finalContent.matchAll(paramsRegex));
  for (const match of paramsMatches) {
    const construct = match[0];
    const constructHash = md5(construct);
    const placeholder = `---CODEHIKE-PARAMS-${constructHash}---`;
    
    codehikePlaceholders[placeholder] = construct;
    finalContent = finalContent.replace(construct, placeholder);
  }
  
  return {
    content: finalContent,
    codehikePlaceholders,
  };
}

export interface MdxWithCodeHikePlaceholders {
  content: string;
  codehikePlaceholders: Record<string, string>;
}

export default function createMdxCodeHikeLoader(): ILoader<
  string,
  MdxWithCodeHikePlaceholders
> {
  return createLoader({
    async pull(locale, input) {
      const preserveAnnotations = true;
      const preserveComponents = true;
      
      let content = input || "";
      const codehikePlaceholders: Record<string, string> = {};
      
      if (preserveComponents) {
        const componentMatches = Array.from(content.matchAll(chComponentRegex));
        for (const match of componentMatches) {
          const [fullMatch, componentType, componentContent] = match;
          
          if (componentType === 'Section') {
            const openingTag = `<CH.Section>`;
            const closingTag = `</CH.Section>`;
            
            const openingHash = md5(openingTag);
            const closingHash = md5(closingTag);
            const openingPlaceholder = `---CODEHIKE-SECTION-OPEN-${openingHash}---`;
            const closingPlaceholder = `---CODEHIKE-SECTION-CLOSE-${closingHash}---`;
            
            codehikePlaceholders[openingPlaceholder] = openingTag;
            codehikePlaceholders[closingPlaceholder] = closingTag;
            
            content = content.replace(
              fullMatch, 
              `${openingPlaceholder}\n\n${componentContent}\n\n${closingPlaceholder}`
            );
          } else {
            const constructHash = md5(fullMatch);
            const placeholder = `---CODEHIKE-COMPONENT-${constructHash}---`;
            
            codehikePlaceholders[placeholder] = fullMatch;
            content = content.replace(fullMatch, placeholder);
          }
        }
      }
      
      if (preserveAnnotations) {
        const annotationMatches = Array.from(content.matchAll(annotationRegex));
        for (const match of annotationMatches) {
          const construct = match[0];
          const constructHash = md5(construct);
          const placeholder = `---CODEHIKE-ANNOTATION-${constructHash}---`;
          
          codehikePlaceholders[placeholder] = construct;
          content = content.replace(construct, placeholder);
        }
        
        const paramsMatches = Array.from(content.matchAll(paramsRegex));
        for (const match of paramsMatches) {
          const construct = match[0];
          const constructHash = md5(construct);
          const placeholder = `---CODEHIKE-PARAMS-${constructHash}---`;
          
          codehikePlaceholders[placeholder] = construct;
          content = content.replace(construct, placeholder);
        }
      }
      
      return {
        content,
        codehikePlaceholders,
      };
    },
    
    async push(locale, data, originalInput, originalLocale, pullInput) {
      let translatedContent = typeof data === 'string' 
        ? data 
        : data?.content || '';
      
      const codehikePlaceholders = data?.codehikePlaceholders || {};
      
      const sourceInfo = originalInput 
        ? extractCodeHikeConstructs(originalInput as string) 
        : { content: "", codehikePlaceholders: {} };
      
      const mergedPlaceholders = _.merge(
        sourceInfo.codehikePlaceholders,
        codehikePlaceholders,
      );
      
      let result = translatedContent;
      for (const [placeholder, original] of Object.entries(mergedPlaceholders)) {
        result = result.replace(placeholder, original);
      }
      
      return result;
    },
  });
}
