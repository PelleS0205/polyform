# Polyform

Polyform is a high-performance data transformation library. 

## Installation

Install Polyform and its companion parsers via npm:

```bash
npm install polyform

## Documentation

Example:

```ts
import { convert, use } from "polyform/core";
import { json, yaml } from "polyform/formats";

use(json());
use(yaml());

const input = `{"name":"John Doe"}`;
const output = convert(input).from("json").to("yaml");
```

## Licensing

Polyform is dual-licensed. 

See the `LICENSE` file for details.

### Commercial Use
For commercial licensing inquiries, please reach out privately via **GitHub Discussions** under the repository's Discussions tab.
