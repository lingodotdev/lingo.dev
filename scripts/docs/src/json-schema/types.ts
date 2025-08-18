export type PropertyInfo = {
  name: string;
  fullPath: string;
  type: string;
  required: boolean;
  description?: string;
  defaultValue?: unknown;
  allowedValues?: unknown[];
  allowedKeys?: string[];
  children?: PropertyInfo[];
};

export type JSONSchemaObject = {
  type?: string | string[];
  properties?: Record<string, unknown>;
  required?: string[];
  items?: unknown;
  anyOf?: unknown[];
  $ref?: string;
  description?: string;
  markdownDescription?: string;
  default?: unknown;
  enum?: unknown[];
  propertyNames?: {
    enum?: string[];
  };
  additionalProperties?: unknown;
  definitions?: Record<string, unknown>;
};

export type SchemaParsingOptions = {
  customOrder?: string[];
  parentPath?: string;
  rootSchema?: unknown;
};
