import type { ASTNode } from "./types.js";

export type ParserFn = (
  input: string | Uint8Array,
  options?: unknown,
) => ASTNode;

export type SerializerFn = (
  ast: ASTNode,
  options?: unknown,
) => string | Uint8Array;

export const parsers = new Map<string, ParserFn>();
export const serializers = new Map<string, SerializerFn>();
