import { fromNative, toNative } from "../core/bridge.js";
import type { ASTNode, PolyformPlugin } from "../core/types.ts";

export interface JsonOptions {
  /*
   * Number of spaces (or a specific string like "\t") to use for
   * indentation during the stringification phase.
   */
  indent?: number | string;
}

export function json(
  pluginOptions: JsonOptions = {},
): PolyformPlugin<string, string> {
  const indent = pluginOptions.indent ?? 2;

  return {
    name: "json",

    parse: (input: string) => {
      try {
        const vanillaGraph = JSON.parse(input);

        return fromNative(vanillaGraph);
      } catch (e) {
        const err = e as Error;
        throw new Error(`JSON Parse Error: ${err.message}`);
      }
    },

    serialize: (ast: ASTNode): string => {
      const vanillaGraph = toNative(ast);
      return JSON.stringify(vanillaGraph, null, indent);
    },
  };
}
