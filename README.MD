# Polyform

Polyform is a minimalist data conversion library for text and binary formats.

## Features

* **Format Agnostic:** Out-of-the-box support for JSON, YAML, and CBOR.
* **Fluent Chaining API:** Clean, intuitive syntax using convert(data).from('json').to('cbor').
* **Pluggable Registry:** Simple, decoupled plugin system allowing registration of custom parsers and serializers in just a few lines of code.

## Installation

Install Polyform and its companion parsers via npm:

```bash
npm install polyform-tools
```

## Documentation

Example:

```ts
import { convert, use } from "polyform-tools";
import { json } from "polyform-tools/formats/json";
import { yaml } from "polyform-tools/formats/yaml";

use(json());
use(yaml());

const input = `{"name":"John Doe"}`;
const output = convert(input).from("json").to("yaml");
```

## Licensing

This project is licensed under the GNU General Public License v3.0 – see the LICENSE file for details.

### Commercial Use

This project is dual-licensed. If your organization requires a commercial license to bypass the open-source requirements of the AGPLv3, please open a private inquiry via **GitHub Discussions**.
