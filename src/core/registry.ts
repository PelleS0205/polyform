import type { ASTNode } from "./types.js";

export type ParserFn<TInput> = (input: TInput, options?: unknown) => ASTNode;
export type SerializerFn<TOutput> = (
  ast: ASTNode,
  options?: unknown,
) => TOutput;

export const parsers = new Map<string, ParserFn<any>>();
export const serializers = new Map<string, SerializerFn<any>>();
