import { convert, use } from "polyform-tools";
import { cbor } from "polyform-tools/formats/cbor";
import { yaml } from "polyform-tools/formats/yaml";

// Sample input data
const yamlInput = `
server:
  host: 127.0.0.1
  ports: [8080, 443]
`;

// Initialize plugins
use(yaml());
use(cbor());

// Perform conversion
const cborOutput: Uint8Array = convert(yamlInput).from("yaml").to("cbor");

console.log(cborOutput);

/*
  OUTPUT:
    Uint8Array(37) [
    161, 102, 115, 101, 114, 118, 101, 114,
    162, 100, 104, 111, 115, 116, 105,  49,
    50,  55,  46,  48,  46,  48,  46,  49,
    101, 112, 111, 114, 116, 115, 130,  25,
    31, 144,  25,   1, 187
    ]
*/
