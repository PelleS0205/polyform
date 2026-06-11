import type { ParserFn, SerializerFn } from "./registry.ts";

export type NodeType = "Root" | "Object" | "Array" | "Property" | "Literal";

export type ASTNode =
  | RootNode
  | ObjectNode
  | ArrayNode
  | PropertyNode
  | LiteralNode;

export interface BaseNode {
  type: NodeType;
  start: number;
  end: number;
  leadingTrivia?: Trivia[];
  trailingTrivia?: Trivia[];
}

export interface Trivia {
  type: "Whitespace" | "LineComment" | "BlockComment" | "Newline";
  raw: string;
}

export interface RootNode extends BaseNode {
  type: "Root";
  body: ObjectNode | ArrayNode | LiteralNode;
}

export interface ObjectNode extends BaseNode {
  type: "Object";
  properties: PropertyNode[];
}

export interface PropertyNode extends BaseNode {
  type: "Property";
  key: LiteralNode;
  value: ObjectNode | ArrayNode | LiteralNode;
}

export interface ArrayNode extends BaseNode {
  type: "Array";
  elements: (ObjectNode | ArrayNode | LiteralNode)[];
}

export interface LiteralNode extends BaseNode {
  type: "Literal";
  value: string | number | boolean | null | bigint | Uint8Array;
  raw: string;
}
export interface PolyformPlugin {
  name: string;
  parse?: ParserFn;
  serialize?: SerializerFn;
}

export type FormatMap = {
  json: { in: string; out: string };
  cbor: { in: Uint8Array; out: Uint8Array };
  yaml: { in: string; out: string };
  // add other built-ins...
};
