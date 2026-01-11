import type { JsonValue } from "../types/json.types.js";

export class ReplacementService {
  private count = 0;

  // Adding replacement vars here so that we can easily modify the behaviour later if needed:
  // - change the values
  // - pass in the values
  private strToReplaceRx = /dog/g;
  private strToReplace = 'dog';
  private strReplaceWith = 'cat';

  constructor(private readonly maxReplacements: number) {}

  public replace(input: JsonValue): JsonValue {
    if (this.count >= this.maxReplacements) return input;

    if (typeof input === 'string') {
      return this.replaceInString(input);
    } else if (Array.isArray(input)) {
      return input.map(item => this.replace(item));
    } else if (typeof input === 'object' && input !== null) {
      const result: Record<string, JsonValue> = {};
      for (const [key, value] of Object.entries(input)) {
        result[key] = this.replace(value);
      }
      return result;
    }

    return input;
  }

  // Replace occurrences of a specific substring in a string
  private replaceInString(str: string): string {
    if (this.count >= this.maxReplacements) return str;

    return str.replace(this.strToReplaceRx, () => {
      // Check if we have reached the maximum number of
      // replacements while looking for the next occurrence.
      // This is important to avoid exceeding the limit while
      // replacing strings inside an array or object loop.
      if (this.count < this.maxReplacements) {
        this.count++;
        return this.strReplaceWith;
      }
      return this.strToReplace;
    });
  }
}