import { parse } from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

export default function createTypescriptLoader(): ILoader<string, Record<string, any>> {
  return createLoader({
    pull: async (locale, input) => {
      if (!input) {
        return {};
      }

      try {
        const ast = parse(input, {
          sourceType: "module",
          plugins: ["typescript"],
        });

        const result: Record<string, any> = {};

        traverse(ast, {
          ExportDefaultDeclaration(path: NodePath<t.ExportDefaultDeclaration>) {
            if (t.isObjectExpression(path.node.declaration)) {
              path.node.declaration.properties.forEach((prop: any) => {
                if (t.isObjectProperty(prop)) {
                  const key = getPropertyKey(prop);
                  
                  if (t.isStringLiteral(prop.value)) {
                    result[key] = prop.value.value;
                  }
                }
              });
            }
            else if (t.isIdentifier(path.node.declaration)) {
              const exportName = path.node.declaration.name;
              const binding = path.scope.bindings[exportName];
              
              if (binding && binding.path.node) {
                const bindingPath = binding.path;
                
                if (
                  t.isVariableDeclarator(bindingPath.node) && 
                  bindingPath.node.init && 
                  t.isObjectExpression(bindingPath.node.init)
                ) {
                  bindingPath.node.init.properties.forEach((prop: any) => {
                    if (t.isObjectProperty(prop)) {
                      const key = getPropertyKey(prop);
                      
                      if (t.isStringLiteral(prop.value)) {
                        result[key] = prop.value.value;
                      }
                    }
                  });
                }
              }
            }
          }
        });

        return result;
      } catch (error) {
        console.error("Error parsing TypeScript file:", error);
        return {};
      }
    },
    push: async (locale, data, originalInput, defaultLocale, pullInput, pullOutput) => {
      if (!data) {
        return "";
      }
      
      const input = originalInput as string;
      
      try {
        const ast = parse(input, {
          sourceType: "module",
          plugins: ["typescript"],
        });

        let modified = false;

        traverse(ast, {
          ExportDefaultDeclaration(path: NodePath<t.ExportDefaultDeclaration>) {
            if (t.isObjectExpression(path.node.declaration)) {
              path.node.declaration.properties.forEach((prop: any) => {
                if (t.isObjectProperty(prop)) {
                  const key = getPropertyKey(prop);
                  
                  if (t.isStringLiteral(prop.value) && data[key] !== undefined) {
                    prop.value.value = data[key];
                    modified = true;
                  }
                }
              });
            }
            else if (t.isIdentifier(path.node.declaration)) {
              const exportName = path.node.declaration.name;
              const binding = path.scope.bindings[exportName];
              
              if (binding && binding.path.node) {
                const bindingPath = binding.path;
                
                if (
                  t.isVariableDeclarator(bindingPath.node) && 
                  bindingPath.node.init && 
                  t.isObjectExpression(bindingPath.node.init)
                ) {
                  bindingPath.node.init.properties.forEach((prop: any) => {
                    if (t.isObjectProperty(prop)) {
                      const key = getPropertyKey(prop);
                      
                      if (t.isStringLiteral(prop.value) && data[key] !== undefined) {
                        prop.value.value = data[key];
                        modified = true;
                      }
                    }
                  });
                }
              }
            }
          }
        });

        if (!modified) {
          return input;
        }

        const generate = require('@babel/generator').default;
        const { code } = generate(ast);
        return code;
      } catch (error) {
        console.error("Error updating TypeScript file:", error);
        return input;
      }
    },
  });
}

function getPropertyKey(prop: t.ObjectProperty): string {
  if (t.isIdentifier(prop.key)) {
    return prop.key.name;
  } else if (t.isStringLiteral(prop.key)) {
    return prop.key.value;
  }
  return String(prop.key);
}
