import { convert, use } from "polyform-tools";
import { csv } from "polyform-tools/formats/csv";
import { yaml } from "polyform-tools/formats/yaml";

// Sample input data
const csvInput = `name,role,location\nAlicia,Developer,Spain\nBob,Designer,Norway`;

// Initialize plugins
use(csv());
use(yaml());

// Perform conversion
const yamlOutput = convert(csvInput).from("csv").to("yaml");

console.log(yamlOutput);

/*
  OUTPUT:
    - name: Alicia
      role: Developer
      location: Spain
    - name: Bob
      role: Designer
      location: Norway
*/
