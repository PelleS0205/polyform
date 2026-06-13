import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { fromNative, toNative } from "../core/bridge.js";
import type { ASTNode, PolyformPlugin } from "../core/types.ts";

/**
 * Configuration options for the CSV format plugin.
 */
export interface CsvOptions {
  /** The character used to separate fields. Defaults to "," */
  delimiter?: string;

  /** Whether to output headers on serialization and expect them on parsing. Defaults to true. */
  hasHeaders?: boolean;

  /** The character used to quote fields containing special characters. Defaults to '"' */
  quote?: string | boolean;

  /** The character used to escape the quote character within a field. Defaults to '"' */
  escape?: string;

  /** String used to delimit records (rows). Defaults to "\n" */
  recordDelimiter?: string;

  /** Whether to prefix formulas (=, +, -, @) with a single quote to prevent CSV injection. Defaults to true. */
  escapeFormulas?: boolean;
}

/**
 * Creates a CSV format plugin for the Polyform pipeline.
 *
 * @returns A configured PolyformPlugin instance for CSV data.
 */
export function csv(pluginOptions: CsvOptions = {}): PolyformPlugin {
  const delimiter = pluginOptions.delimiter ?? ",";
  const hasHeaders = pluginOptions.hasHeaders ?? true;
  const quote = pluginOptions.quote ?? '"';
  const escapeChar = pluginOptions.escape ?? '"';
  const recordDelimiter = pluginOptions.recordDelimiter ?? "\n";
  const escapeFormulas = pluginOptions.escapeFormulas ?? true;

  return {
    name: "csv",

    parse: (input: string | Uint8Array) => {
      try {
        const sourceText =
          input instanceof Uint8Array ? new TextDecoder().decode(input) : input;

        const nativeArray = parse(sourceText, {
          delimiter: delimiter,
          columns: hasHeaders,
          quote: typeof quote === "string" ? quote : '"',
          escape: escapeChar,
          skip_empty_lines: true,
          trim: true,
        });

        return fromNative(nativeArray);
      } catch (e) {
        const err = e as Error;
        throw new Error(`CSV Parse Error: ${err.message}`);
      }
    },

    serialize(ast: ASTNode): string {
      const nativeData = toNative(ast);
      const records = Array.isArray(nativeData) ? nativeData : [nativeData];
      const first = records[0];
      const isObject =
        first !== null && typeof first === "object" && !Array.isArray(first);

      const options = {
        header: hasHeaders,
        delimiter: delimiter,
        quote: quote,
        escape: escapeChar,
        record_delimiter: recordDelimiter,
        escape_formulas: escapeFormulas,
        columns: isObject
          ? Object.keys(first).map((key) => ({ key, header: key }))
          : [{ key: "value", header: "value" }],
        cast: {
          number: (value: number) => value.toString(),
          boolean: (value: boolean) => value.toString(),
          object: (value: object) => JSON.stringify(value),
        },
      };

      try {
        return stringify(records, options);
      } catch (error) {
        throw new Error(`CSV Serialize Error: ${(error as Error).message}`);
      }
    },
  };
}
