export interface PropertyInfo {
  name: string;
  fullPath: string;
  type: string;
  required: boolean;
  description?: string;
  defaultValue?: unknown;
  allowedValues?: unknown[];
  allowedKeys?: string[];
  children?: PropertyInfo[];
}

export interface JSONSchemaObject {
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
}

export interface SchemaParsingOptions {
  customOrder?: string[];
  parentPath?: string;
  rootSchema?: unknown;
}