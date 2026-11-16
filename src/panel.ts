/**
 * @module Panel
 */

// Base Component
import { Component, Template } from "@scalable.software/component";
import { type Configuration } from "@scalable.software/component";

// Panel Metadata
import { Tag, CSS, Attributes, Condition } from "./panel.meta.js";

import { type Meta } from "./panel.meta.js";

// Taskbar
import { Taskbar } from "@scalable.software/taskbar";

/**
 * Optional Configuration: required for panels with custom layout and style
 * @category Configuration
 */
export const configuration: Configuration = {
  url: import.meta.url,
  template: {
    id: Tag
  },
  css: {
    name: CSS
  }
} as const;

/**
 * @category Panel
 */
export class Panel extends Component implements Meta {
  /**
   * The tag name of the panel
   * @category Configuration
   */
  public static get Tag() {
    return Tag;
  }

  /**
   * Only attributes defined the Attributes object will be observed in DOM
   * @category State
   */
  public static get Attributes(): Attributes {
    return Attributes;
  }

  /**
   * Helper function to load the panel template into DOM
   * @category Utility
   */
  public static Template = new Template(import.meta.url);

  /**
   * Internal Condition state of the component
   * @category State
   * @default Condition.NORMAL
   * @hidden
   */
  private _condition: Condition = Condition.NORMAL;

  /**
   * Cache element references to improve performance
   * @category State
   * @hidden
   */
  protected elements: { taskbar: Taskbar | null } = { taskbar: null };

  /**
   * @hidden
   */
  constructor() {
    super(configuration);
  }

  /**
   * Get and set the condition of the panel
   * @category State
   */
  public get condition(): Condition {
    return this._condition;
  }
  public set condition(condition: Condition) {
    // Mutate
    this._condition = condition;
  }

  /**
   * List operations to perform for selected attributes being observed in the DOM.
   * @category Configuration
   * @hidden
   */
  protected _attributeHandlers = {};

  /**
   * Cache element references to improve performance
   * @category Configuration
   * @hidden
   */
  protected _cache = () => {
    this.elements.taskbar = this.root.querySelector<Taskbar>(Taskbar.Tag);
  };

  /**
   * Initialize panel attributes with default values
   * @category Configuration
   * @hidden
   */
  protected _initialize = () => {};

  /**
   * Called by the connectedCallback prototypical method
   * @category Configuration
   * @hidden
   */
  protected _addEventListeners = () => {};

  /**
   * Called by the disconnectedCallback prototypical method
   * @category Configuration
   * @hidden
   */
  protected _removeEventListeners = () => {};
}
