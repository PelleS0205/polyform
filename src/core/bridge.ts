import type {
  ArrayNode,
  ASTNode,
  LiteralNode,
  ObjectNode,
  PropertyNode,
} from "./types.js";

/**
 * Converts a native JS runtime value into an AST node.
 * Since native objects lack positional data, we use -1 to indicate
 * this node was generated programmatically, not parsed from a string.
 */
export function fromNative(value: unknown): ASTNode {
  if (value === null || typeof value !== "object") {
    return {
      type: "Literal",
      start: -1,
      end: -1,
      value: value,
      raw: String(value),
    } as LiteralNode;
  }

  if (Array.isArray(value)) {
    return {
      type: "Array",
      start: -1,
      end: -1,
      elements: value.map(fromNative) as (
        | ObjectNode
        | ArrayNode
        | LiteralNode
      )[],
    } as ArrayNode;
  }

  const properties: PropertyNode[] = [];

  const entries =
    value instanceof Map ? value.entries() : Object.entries(value);

  for (const [key, val] of entries) {
    properties.push({
      type: "Property",
      start: -1,
      end: -1,
      key: {
        type: "Literal",
        start: -1,
        end: -1,
        value: key,
        raw: `"${key}"`,
      },
      value: fromNative(val) as ObjectNode | ArrayNode | LiteralNode,
    });
  }

  return {
    type: "Object",
    start: -1,
    end: -1,
    properties,
  } as ObjectNode;
}

/**
 * Converts an AST node back into a plain JavaScript runtime value.
 * This strips away all positional data (start/end) and formatting trivia.
 */
export function toNative(node: ASTNode): any {
  switch (node.type) {
    case "Root":
      return toNative(node.body);

    case "Literal":
      return node.value;

    case "Array":
      return node.elements.map(toNative);

    case "Object": {
      const obj: Record<string, any> = {};

      for (const prop of node.properties) {
        const key = String(prop.key.value);
        obj[key] = toNative(prop.value);
      }

      return obj;
    }

    case "Property":
      return [String(node.key.value), toNative(node.value)];

    default:
      throw new Error(
        `Unsupported AST node type encountered during serialization: ${(node as any).type}`,
      );
  }
}
