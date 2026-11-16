/**
 * @module Panel
 */

import { Condition } from "./panel.meta.js";

/**
 * @category Validation
 */
export class Validate {
  /**
   * Validates that the value is a member of the `Condition` enum.
   * Throws if the value is not a recognized condition state.
   * @category Validation
   */
  public static condition = (value: unknown) => {
    const valid = Object.values(Condition).includes(value as Condition);
    if (!valid) {
      throw new Error(`Invalid condition value: ${value}`);
    }
    return value as Condition;
  };
}
