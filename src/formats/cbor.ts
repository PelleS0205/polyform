import { decode, encode } from "cbor2";
import { fromNative, toNative } from "../core/bridge.js";
import type { ASTNode, PolyformPlugin } from "../core/types.ts";

export function cbor(): PolyformPlugin<Uint8Array, Uint8Array> {
  return {
    name: "cbor",

    parse: (input: Uint8Array) => {
      try {
        const vanillaGraph = decode(input);
        return fromNative(vanillaGraph);
      } catch (e) {
        const err = e as Error;
        throw new Error(`CBOR Parse Error: ${err.message}`);
      }
    },

    serialize: (ast: ASTNode): Uint8Array => {
      const vanillaGraph = toNative(ast);

      try {
        return encode(vanillaGraph);
      } catch (e) {
        const err = e as Error;
        throw new Error(`CBOR Serialize Error: ${err.message}`);
      }
    },
  };
}
