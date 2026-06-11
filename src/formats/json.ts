import { fromNative, toNative } from "../core/bridge.js";
import type { ASTNode, PolyformPlugin } from "../core/types.ts";

/**
 * Configuration options for the JSON format plugin.
 */
export interface JsonOptions {
  /**
   * Number of spaces (or a specific string like "\t") to use for
   * indentation during the stringification phase.
   */
  indent?: number | string;
}

/**
 * Creates a JSON format plugin for the Polyform pipeline.
 *
 * @param pluginOptions Configuration options to customize JSON parsing and serialization.
 * @returns A configured PolyformPlugin instance for JSON data.
 */
export function json(pluginOptions: JsonOptions = {}): PolyformPlugin {
  const indent = pluginOptions.indent ?? 2;

  return {
    name: "json",

    parse: (input: string | Uint8Array) => {
      try {
        const sourceText =
          input instanceof Uint8Array ? new TextDecoder().decode(input) : input;
        const vanillaGraph = JSON.parse(sourceText);

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
