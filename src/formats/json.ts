import { fromNative, toNative } from "../core/bridge.js";
import type { PolyformPlugin } from "../core/types.js";

export interface JsonOptions {
	/*
	 * Number of spaces (or a specific string like "\t") to use for
	 * indentation during the stringification phase.
	 */
	indent?: number | string;
}

export function json(pluginOptions: JsonOptions = {}): PolyformPlugin {
	const indent = pluginOptions.indent ?? 2;

	return {
		name: "json",

		parse: (input: string) => {
			try {
				const vanillaGraph = JSON.parse(input);

				return fromNative(vanillaGraph);
			} catch (error: any) {
				throw new Error(
					`JSON Parse Error: ${error.message}`,
				);
			}
		},

		serialize: (ast) => {
			const vanillaGraph = toNative(ast);
			return JSON.stringify(vanillaGraph, null, indent);
		},
	};
}
