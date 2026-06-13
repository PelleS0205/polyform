import * as BuilderModule from "fast-xml-builder";
import { XMLParser } from "fast-xml-parser";
import { fromNative, toNative } from "../core/bridge.js";
import type { ASTNode, PolyformPlugin } from "../core/types.ts";

/**
 * Configuration options for the XML format plugin.
 */
export interface XmlOptions {
  /**
   * The prefix used for attributes.
   * @default "@_"
   */
  attributePrefix?: string;

  /**
   * Whether the serialized XML output should be formatted.
   * @default false
   */
  format?: boolean;

  /**
   * Whether to ignore the XML declaration (e.g., <?xml version="1.0" ...?>).
   * @default false
   */
  ignoreDeclaration?: boolean;

  /**
   * Whether to ignore XML attributes.
   * @default false
   */
  ignoreAttributes?: boolean;
}

/**
 * Creates an XML format plugin for the Polyform pipeline.
 *
 * @param pluginOptions Configuration options to customize XML parsing and serialization.
 * @returns A configured PolyformPlugin instance for XML data.
 */
export function xml(pluginOptions: XmlOptions = {}): PolyformPlugin {
  const {
    attributePrefix = "@_",
    format = false,
    ignoreDeclaration = false,
    ignoreAttributes = false,
  } = pluginOptions;

  const parser = new XMLParser({
    attributeNamePrefix: attributePrefix,
    ignoreAttributes,
    ignoreDeclaration,
    parseTagValue: true,
  });

  const builder = new BuilderModule.default({
    attributeNamePrefix: attributePrefix,
    format,
    suppressEmptyNode: false,
    suppressUnpairedNode: true,
  });

  return {
    name: "xml",
    parse: (input: string | Uint8Array) => {
      const sourceText =
        input instanceof Uint8Array ? new TextDecoder().decode(input) : input;
      return fromNative(parser.parse(sourceText));
    },
    serialize: (ast: ASTNode): string => {
      return builder.build(toNative(ast));
    },
  };
}
