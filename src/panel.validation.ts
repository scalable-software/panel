/**
 * @module Panel
 */

import { Condition, Status } from "./panel.meta.js";

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

  /**
   * Validates that the value is a member of the `Status` enum.
   * Throws if the value is not a recognized status state.
   * @category Validation
   */
  public static status = (value: unknown) => {
    return value as Status;
  };
}
