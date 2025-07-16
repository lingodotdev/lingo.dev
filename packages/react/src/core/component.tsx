import {
  createElement,
  ReactNode,
  FunctionComponent,
  ReactElement,
} from "react";
import _ from "lodash";
import React, { useMemo } from "react";

export type LingoComponentProps = {
  [key: string]: any;
  $dictionary: any;
  $as: any;
  $fileKey: string;
  $entryKey: string;
  $values?: Record<string, ReactNode>;
  $elements?: Array<FunctionComponent<any>>;
  $functions?: Record<string, ReactNode[]>;
  $expressions?: ReactNode[];
};

export const LingoComponent = React.forwardRef(
  (props: Omit<LingoComponentProps, "ref">, ref: React.Ref<any>) => {
    const {
      $dictionary,
      $as,
      $fileKey,
      $entryKey,
      $variables,
      $elements,
      $functions,
      $expressions,
      ...rest
    } = props;
    const maybeValue = $dictionary?.files?.[$fileKey]?.entries?.[$entryKey];

    const children = useMemo(() => {
      return _.flow([
        (nodes) => ifNotEmpty(replaceElements, $elements, nodes),
        (nodes) => ifNotEmpty(replaceVariables, $variables, nodes),
        (nodes) => ifNotEmpty(replaceFunctions, $functions, nodes),
        (nodes) => ifNotEmpty(replaceExpressions, $expressions, nodes),
      ])([maybeValue ?? $entryKey]);
    }, [
      maybeValue,
      $entryKey,
      $elements,
      $variables,
      $functions,
      $expressions,
    ]);

    const isFragment = $as.toString() === "Symbol(react.fragment)";
    const isLingoComponent =
      typeof $as === "function" &&
      ($as.name === "LingoComponent" || $as.name === "LingoAttributeComponent");

    const elementProps = {
      ...rest,
      ...(isLingoComponent ? { $fileKey } : {}),
      ...(isFragment ? {} : { ref }),
    };

    return createElement($as, elementProps, ...children);
  },
);

// testValue needs to be cloned before passing to the callback for the first time only
// it can not be cloned inside the callback because it is called recursively
function ifNotEmpty<T>(
  callback: (nodes: ReactNode[], value: T) => ReactNode[],
  testValue: T,
  nodes: ReactNode[],
): ReactNode[] {
  return callback(nodes, _.clone(testValue));
}

function replaceVariables(
  nodes: ReactNode[],
  variables: Record<string, ReactNode>,
): ReactNode[] {
  if (_.isEmpty(variables)) {
    return nodes;
  }
  const segments = nodes.map((node) => {
    if (typeof node === "string") {
      const segments: ReactNode[] = [];
      let lastIndex = 0;
      const variableRegex = /{([\w\.\[\]]+)}/g;
      let match;

      while ((match = variableRegex.exec(node)) !== null) {
        if (match.index > lastIndex) {
          segments.push(node.slice(lastIndex, match.index));
        }

        const [fullMatch, name] = match;
        const value = variables[name];
        segments.push(value ?? fullMatch);

        lastIndex = match.index + fullMatch.length;
      }

      if (lastIndex < node.length) {
        segments.push(node.slice(lastIndex));
      }

      return segments;
    } else if (isReactElement(node)) {
      const props = node.props as { children?: ReactNode };
      return createElement(
        node.type,
        { ...props },
        ...replaceVariables(_.castArray(props.children || []), variables),
      );
    }
    return node;
  });

  return _.flatMap(segments);
}

function isReactElement(node: ReactNode): node is ReactElement {
  return (
    node !== null &&
    typeof node === "object" &&
    "type" in node &&
    "props" in node
  );
}

function replaceElements(
  nodes: ReactNode[],
  elements?: Array<FunctionComponent>,
  elementIndex: { current: number } = { current: 0 },
): ReactNode[] {
  const ELEMENT_PATTERN = /<element:([\w.]+)>(.*?)<\/element:\1>/gs;

  if (_.isEmpty(elements)) {
    return nodes.map((node) => {
      if (typeof node !== "string") return node;

      return node.replace(ELEMENT_PATTERN, (match, elementName, content) => {
        return content;
      });
    });
  }

  return nodes
    .map((node) => {
      if (typeof node !== "string") return node;

      const segments: ReactNode[] = [];
      let lastIndex = 0;

      let match;

      while ((match = ELEMENT_PATTERN.exec(node)) !== null) {
        if (match.index > lastIndex) {
          segments.push(node.slice(lastIndex, match.index));
        }

        const [fullMatch, elementName, content] = match;
        const Element = elements?.[elementIndex.current];
        elementIndex.current++;

        const innerContent = replaceElements([content], elements, elementIndex);
        if (Element) {
          segments.push(createElement(Element, {}, ...innerContent));
        } else {
          segments.push(...innerContent);
        }

        lastIndex = match.index + fullMatch.length;
      }

      if (lastIndex < node.length) {
        segments.push(node.slice(lastIndex));
      }

      return segments;
    })
    .flat();
}

function replaceFunctions(
  nodes: ReactNode[],
  functions: Record<string, ReactNode[]>,
): ReactNode[] {
  if (_.isEmpty(functions)) {
    return nodes;
  }

  const functionIndices: Record<string, number> = {};

  return nodes
    .map((node) => {
      if (typeof node === "string") {
        const segments: ReactNode[] = [];
        let lastIndex = 0;
        const functionRegex = /<function:([\w\.]+)\/>/g;
        let match;

        while ((match = functionRegex.exec(node)) !== null) {
          if (match.index > lastIndex) {
            segments.push(node.slice(lastIndex, match.index));
          }

          const [fullMatch, name] = match;
          if (!functionIndices[name]) {
            functionIndices[name] = 0;
          }
          const value = functions[name]?.[functionIndices[name]++];
          segments.push(value ?? fullMatch);

          lastIndex = match.index + fullMatch.length;
        }

        if (lastIndex < node.length) {
          segments.push(node.slice(lastIndex));
        }

        return segments;
      } else if (isReactElement(node)) {
        const props = node.props as { children?: ReactNode };
        return createElement(
          node.type,
          { ...props },
          ...replaceFunctions(_.castArray(props.children || []), functions),
        );
      }
      return node;
    })
    .flat();
}

function replaceExpressions(
  nodes: ReactNode[],
  expressions: ReactNode[],
): ReactNode[] {
  if (_.isEmpty(expressions)) {
    return nodes;
  }

  let expressionIndex = 0;

  function processWithIndex(nodeList: ReactNode[]): ReactNode[] {
    return nodeList
      .map((node) => {
        if (typeof node === "string") {
          const segments: ReactNode[] = [];
          let lastIndex = 0;
          const expressionRegex = /<expression\/>/g;
          let match;

          while ((match = expressionRegex.exec(node)) !== null) {
            if (match.index > lastIndex) {
              segments.push(node.slice(lastIndex, match.index));
            }

            const value = expressions[expressionIndex++];
            segments.push(value ?? match[0]);

            lastIndex = match.index + match[0].length;
          }

          if (lastIndex < node.length) {
            segments.push(node.slice(lastIndex));
          }

          return segments;
        } else if (isReactElement(node)) {
          const props = node.props as { children?: ReactNode };
          return createElement(
            node.type,
            { ...props },
            ...processWithIndex(_.castArray(props.children || [])),
          );
        }
        return node;
      })
      .flat();
  }

  return processWithIndex(nodes);
}
