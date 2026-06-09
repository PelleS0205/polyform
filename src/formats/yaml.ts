import type {
  DocumentOptions,
  ParseOptions,
  SchemaOptions,
  ToStringOptions,
} from "yaml";
import { Document, parseDocument } from "yaml";
import { fromNative, toNative } from "../core/bridge.js";
import type { ASTNode, PolyformPlugin } from "../core/types.ts";

export interface YamlOptions {
  /* The YAML specification version to use. */
  version?: "1.1" | "1.2";

  /* Number of spaces to use for indentation during serialization. */
  indent?: number;

  /* Maximum line width before the serializer attempts to word-wrap folded strings. */
  lineWidth?: number;

  /* Advanced configuration for the parsing phase. */
  parseOptions?: ParseOptions & DocumentOptions & SchemaOptions;

  /* Advanced configuration for the stringification phase. */
  serializeOptions?: ToStringOptions;
}

export function yaml(
  pluginOptions: YamlOptions = {},
): PolyformPlugin<string, string> {
  const version = pluginOptions.version ?? "1.2";
  const indent = pluginOptions.indent ?? 2;
  const lineWidth = pluginOptions.lineWidth ?? 0;

  return {
    name: "yaml",

    parse: (input: string) => {
      const doc = parseDocument(input, {
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
