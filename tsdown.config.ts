import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    "core/index": "src/core/index.ts",
    "formats/json": "src/formats/json.ts",
    "formats/yaml": "src/formats/yaml.ts",
    "formats/cbor": "src/formats/cbor.ts",
  },
  format: ["esm"],
  outExtensions: () => ({ js: ".mjs", dts: ".d.mts" }),
  dts: true,
  clean: true,
});
