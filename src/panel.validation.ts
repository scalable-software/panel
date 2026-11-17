/**
 * @module Panel
 */

import { Condition, Status, Visibility } from "./panel.meta.js";

import { type Position, type Dimensions } from "./panel.meta.js";

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
    const valid = Object.values(Status).includes(value as Status);
    if (!valid) {
      throw new Error(`Invalid status value: ${value}`);
    }
    return value as Status;
  };

  /**
   * Validates that the value is a member of the `Visibility` enum.
   * Throws if the value is not a recognized visibility state.
   * @category Validation
   */
  public static visibility = (value: unknown) => {
    const valid = Object.values(Visibility).includes(value as Visibility);
    if (!valid) {
      throw new Error(`Invalid visibility value: ${value}`);
    }
    return value as Visibility;
  };

  /**
   * Validates that the value is a position: a plain object with a `left` and a `top`,
   * each a finite number, and nothing else. Throws and names the field that fails.
   * @category Validation
   */
  public static position = (value: unknown) => {
    // Structure
    if (typeof value !== "object" || value === null || Array.isArray(value))
      throw new Error(`Invalid position value: ${value}`);

    const { left, top, ...rest } = value as Record<string, unknown>;

    // Undeclared fields
    const undeclared = Object.keys(rest)[0];
    if (undeclared)
      throw new Error(`Invalid position value: ${undeclared} is not declared`);

    // Declared fields
    if (left === undefined)
      throw new Error("Invalid position value: left is required");
    if (typeof left !== "number" || !Number.isFinite(left))
      throw new Error("Invalid position value: left is invalid");

    if (top === undefined)
      throw new Error("Invalid position value: top is required");
    if (typeof top !== "number" || !Number.isFinite(top))
      throw new Error("Invalid position value: top is invalid");

    return value as Position;
  };

  /**
   * Validates that the value is dimensions: a plain object with a `width` and a `height`.
   * @category Validation
   */
  public static dimensions = (value: unknown) => {
    return value as Dimensions;
  };
}
