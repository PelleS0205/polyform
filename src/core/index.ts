/**
 * Polyform – A minimalist data conversion framework for text and binary formats
 * Copyright (C) 2026 Pelle Stormark
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License v3 (GPLv3) as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import {
  PolyformError,
  PolyformParseError,
  PolyformSerializeError,
} from "./errors.js";
import { parsers, serializers } from "./registry.js";
import type { ASTNode, PolyformPlugin } from "./types.ts";

export function use(plugin: PolyformPlugin<any, any>): void {
  if (plugin.parse) {
    parsers.set(plugin.name, plugin.parse);
  }
  if (plugin.serialize) {
    serializers.set(plugin.name, plugin.serialize);
  }
}

export function convert<TFrom, TTo>(input: TFrom) {
  return {
    from(sourceFormat: string) {
      return {
        to(targetFormat: string): TTo {
          const parser = parsers.get(sourceFormat);

          const serializer = serializers.get(targetFormat);

          if (!parser) {
            throw new PolyformError(
              `Parser for format "${sourceFormat}" is not registered.`,
            );
          }

          if (!serializer) {
            throw new PolyformError(
              `Serializer for "${targetFormat}" is not registered.`,
            );
          }

          let intermediateAST: ASTNode;
          try {
            intermediateAST = parser(input);
          } catch (e) {
            const error = e as Error;
            throw new PolyformParseError(sourceFormat, error);
          }

          try {
            return serializer(intermediateAST);
          } catch (e) {
            const error = e as Error;
            throw new PolyformSerializeError(targetFormat, error);
          }
        },
      };
    },
  };
}
