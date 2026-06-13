import { convert, use } from "polyform-tools";
import { csv } from "polyform-tools/formats/csv";
import { yaml } from "polyform-tools/formats/yaml";

// Sample input data
const yamlInput = `
- name: Bob
  role: Designer
- name: Alice
  role: Developer
`;

/*
 * Initialize plugins with custom options
 *
 * Setting the CSV delimiter to tab, turns
 * it into TSV
 */
use(csv({ delimiter: "\t" }));
use(yaml());

// Perform conversion
const tsvOutput = convert(yamlInput).from("yaml").to("csv");

console.log(tsvOutput);

/*
  OUTPUT:
    name	role
    Bob    Designer
    Alice	Developer
*/
