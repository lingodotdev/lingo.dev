import { XMLParser, XMLBuilder } from "fast-xml-parser";
import _ from "lodash";

// Generic tag names used in XML output
const TAG_OBJECT = "object";
const TAG_ARRAY = "array";
const TAG_VALUE = "value";

/**
 * Converts a JavaScript value to a generic XML node structure understood by fast-xml-parser.
 */
function _toGenericNode(value: any, key?: string): Record<string, any> {
  if (_.isArray(value)) {
    const children = _.map(value, (item) => _toGenericNode(item));
    return {
      [TAG_ARRAY]: {
        ...(key ? { key } : {}),
        ..._groupChildren(children),
      },
    };
  }

  if (_.isPlainObject(value)) {
    const children = _.map(Object.entries(value), ([k, v]) =>
      _toGenericNode(v, k),
    );
    return {
      [TAG_OBJECT]: {
        ...(key ? { key } : {}),
        ..._groupChildren(children),
      },
    };
  }

  return {
    [TAG_VALUE]: {
      ...(key ? { key } : {}),
      "#text": value ?? "",
    },
  };
}

/**
 * Groups a list of nodes by their tag name so that fast-xml-parser outputs arrays even for single elements.
 */
function _groupChildren(nodes: Record<string, any>[]): Record<string, any> {
  return _(nodes)
    .groupBy((node) => Object.keys(node)[0])
    .mapValues((arr) => _.map(arr, (n) => n[Object.keys(n)[0]]))
    .value();
}

/**
 * Recursively converts a generic XML node back to a JavaScript value.
 */
function _fromGenericNode(tag: string, data: any): any {
  if (tag === TAG_VALUE) {
    // <value>123</value> without attributes is parsed as a primitive (number | string)
    // whereas <value key="id">123</value> is parsed as an object with a "#text" field.
    // Support both shapes.
    if (_.isPlainObject(data)) {
      return _.get(data, "#text", "");
    }
    return data ?? "";
  }

  if (tag === TAG_ARRAY) {
    const result: any[] = [];
    _.forEach([TAG_VALUE, TAG_OBJECT, TAG_ARRAY], (childTag) => {
      const childNodes = _.castArray(_.get(data, childTag, []));
      _.forEach(childNodes, (child) => {
        result.push(_fromGenericNode(childTag, child));
      });
    });
    return result;
  }

  // TAG_OBJECT
  const obj: Record<string, any> = {};
  _.forEach([TAG_VALUE, TAG_OBJECT, TAG_ARRAY], (childTag) => {
    const childNodes = _.castArray(_.get(data, childTag, []));
    _.forEach(childNodes, (child) => {
      const key = _.get(child, "key", "");
      obj[key] = _fromGenericNode(childTag, child);
    });
  });
  return obj;
}

export function obj2xml<T>(obj: T): string {
  const rootNode = _toGenericNode(obj)[TAG_OBJECT];
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    format: true,
    suppressEmptyNode: true,
  });
  return builder.build({ [TAG_OBJECT]: rootNode });
}

export function xml2obj<T = any>(xml: string): T {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    parseTagValue: true,
    parseAttributeValue: false,
    processEntities: true,
    isArray: (name) => [TAG_VALUE, TAG_ARRAY, TAG_OBJECT].includes(name),
  });
  const parsed = parser.parse(xml);

  // The parser keeps the XML declaration (<?xml version="1.0"?>) under the
  // pseudo-tag "?xml". Skip it so that we always start the conversion at the
  // first real node (i.e. <object>, <array> or <value>).
  const withoutDeclaration = _.omit(parsed, "?xml");

  const rootTag = Object.keys(withoutDeclaration)[0];

  // fast-xml-parser treats every <object>, <array> and <value> element as an array
  // because we configured the `isArray` option above. This means even the root
  // element comes wrapped in an array. Unwrap it so that the recursive
  // conversion logic receives the actual node object instead of an array –
  // otherwise no children will be found and we would return an empty result.
  const rootNode = _.castArray(withoutDeclaration[rootTag])[0];

  return _fromGenericNode(rootTag, rootNode);
}
