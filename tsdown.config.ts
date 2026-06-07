import { defineConfig } from "tsdown";

export default defineConfig({
	entry: {
		"core/index": "src/core/index.ts",
		"formats/json": "src/formats/json.ts",
		"formats/yaml": "src/formats/yaml.ts",
	},
	format: ["esm"],
	dts: true,
	clean: true,
});
