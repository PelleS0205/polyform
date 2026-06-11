import type {
  DocumentOptions,
  ParseOptions,
  SchemaOptions,
  ToStringOptions,
} from "yaml";
import { Document, parseDocument } from "yaml";
import { fromNative, toNative } from "../core/bridge.js";
import type { ASTNode, PolyformPlugin } from "../core/types.ts";

/**
 * Configuration options for the YAML format plugin.
 */
export interface YamlOptions {
  /**
   * The YAML specification version to use.
   * @default "1.2"
   */
  version?: "1.1" | "1.2";

  /**
   * Number of spaces to use for indentation during serialization.
   * @default 2
   */
  indent?: number;

  /**
   * Maximum line width before the serializer attempts to word-wrap folded strings.
   * Set to 0 to disable word wrapping.
   * @default 0
   */
  lineWidth?: number;

  /**
   * Advanced configuration settings for the YAML parsing phase.
   * Accepts standard options from the underlying 'yaml' library.
   */
  parseOptions?: ParseOptions & DocumentOptions & SchemaOptions;

  /**
   * Advanced configuration settings for the stringification (serialization) phase.
   * Accepts standard output formatting options from the underlying 'yaml' library.
   */
  serializeOptions?: ToStringOptions;
}

/**
 * Creates a YAML format plugin for the Polyform pipeline.
 *
 * @param pluginOptions Configuration options to customize YAML parsing and serialization.
 * @returns A configured PolyformPlugin instance for YAML data.
 */
export function yaml(pluginOptions: YamlOptions = {}): PolyformPlugin {
  const version = pluginOptions.version ?? "1.2";
  const indent = pluginOptions.indent ?? 2;
  const lineWidth = pluginOptions.lineWidth ?? 0;

  return {
    name: "yaml",

    parse: (input: string | Uint8Array) => {
      const sourceText =
        input instanceof Uint8Array ? new TextDecoder().decode(input) : input;

      const doc = parseDocument(sourceText, {
        version,
        ...pluginOptions.parseOptions,
      });

      if (doc.errors && doc.errors.length > 0) {
        throw new Error(`YAML Parse Error: ${doc.errors[0].message}`);
      }

      const vanillaGraph = doc.toJS({
        merge: true,
      });
      return fromNative(vanillaGraph);
    },

    serialize: (ast: ASTNode): string => {
      const vanillaGraph = toNative(ast);

      const doc = new Document(vanillaGraph, {
        version,
        ...pluginOptions.parseOptions,
      });

      return doc.toString({
        indent,
        lineWidth,
        ...pluginOptions.serializeOptions,
      });
    },
  };
}
