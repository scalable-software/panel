/**
 * @module Panel
 */

// Base Component
import { Component, Template } from "@scalable.software/component";
import { type Configuration } from "@scalable.software/component";

// Panel Metadata
import {
  Tag,
  CSS,
  Attributes,
  Condition,
  Status,
  Visibility
} from "./panel.meta.js";

import { type Meta } from "./panel.meta.js";

// Validation
import { Validate } from "./panel.validation.js";

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
   * Internal Status state of the component
   * @category State
   * @default Status.UNPINNED
   * @hidden
   */
  private _status: Status = Status.UNPINNED;

  /**
   * Internal Visibility state of the component
   * @category State
   * @default Visibility.VISIBLE
   * @hidden
   */
  private _visibility: Visibility = Visibility.VISIBLE;

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
  public set condition(condition: Condition | null) {
    try {
      // Normalize
      condition = condition ?? Condition.NORMAL;

      // Validate
      condition = Validate.condition(condition);

      // Mutate
      this._condition = condition;

      // Synchronize
      this._showControls();
    } finally {
      // Reflect
      this._reflect(Attributes.CONDITION, this._condition, Condition.NORMAL);
    }
  }

  /**
   * Get and set the status of the panel
   * @category State
   */
  public get status(): Status {
    return this._status;
  }
  public set status(status: Status | null) {
    try {
      // Normalize
      status = status ?? Status.UNPINNED;

      // Validate
      status = Validate.status(status);

      // Mutate
      this._status = status;

      // Synchronize
      this._showStatus();
    } finally {
      // Reflect
      this._reflect(Attributes.STATUS, this._status, Status.UNPINNED);
    }
  }

  /**
   * Get and set the visibility of the panel
   * @category State
   */
  public get visibility(): Visibility {
    return this._visibility;
  }
  public set visibility(visibility: Visibility | null) {
    try {
      // Normalize
      visibility = visibility ?? Visibility.VISIBLE;

      // Validate
      visibility = Validate.visibility(visibility);

      // Mutate
      this._visibility = visibility;
    } finally {
      // Reflect
      this._reflect(
        Attributes.VISIBILITY,
        this._visibility,
        Visibility.VISIBLE
      );
    }
  }

  /**
   * List operations to perform for selected attributes being observed in the DOM.
   * @category Configuration
   * @hidden
   */
  protected _attributeHandlers = {
    [Attributes.CONDITION]: (value: Condition | null) =>
      (this.condition = value),
    [Attributes.STATUS]: (value: Status | null) => (this.status = value),
    [Attributes.VISIBILITY]: (value: Visibility | null) =>
      (this.visibility = value)
  };

  /**
   * Cache element references to improve performance
   * @category Configuration
   * @hidden
   */
  protected _cache = () => {
    // The taskbar and its controls are upgraded before they are used: an element in the
    // template is not upgraded yet when the panel is connected
    customElements.upgrade(this.root);
    this.elements.taskbar = this.root.querySelector<Taskbar>(Taskbar.Tag);
  };

  /**
   * Initialize panel attributes with default values
   * @category Configuration
   * @hidden
   */
  protected _initialize = () => {
    this._showControls();
    this._showStatus();
  };

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

  /**
   * Shows the controls of the taskbar that fit the condition, and hides the others
   * @category Configuration
   * @hidden
   */
  private _showControls = () => {
    const taskbar = this.elements.taskbar;
    const fits = (fit: boolean, control?: { show(): void; hide(): void } | null) =>
      fit ? control?.show() : control?.hide();

    fits(this._condition !== Condition.MINIMIZED, taskbar?.minimize);
    fits(this._condition !== Condition.MAXIMIZED, taskbar?.maximize);
    fits(this._condition !== Condition.NORMAL, taskbar?.restore);
  };

  /**
   * Makes the pin of the taskbar show the status
   * @category Configuration
   * @hidden
   */
  private _showStatus = () => {
    const pin = this.elements.taskbar?.pin;
    this._status === Status.PINNED ? pin?.pin() : pin?.unpin();
  };
}
