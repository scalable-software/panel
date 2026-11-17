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
  Visibility,
  Event
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
   * The condition the panel had when it was minimized: the one `restore` returns it to
   * @category State
   * @default Condition.NORMAL
   * @hidden
   */
  private _former: Condition = Condition.NORMAL;

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
   * onhide triggered when panel visibility changes to hidden
   * @category Events
   * @hidden
   */
  private _onhide: EventListener | null = null;

  /**
   * onshow triggered when panel visibility changes to visible
   * @category Events
   * @hidden
   */
  private _onshow: EventListener | null = null;

  /**
   * onpin triggered when panel status changes to pinned
   * @category Events
   * @hidden
   */
  private _onpin: EventListener | null = null;

  /**
   * onunpin triggered when panel status changes to unpinned
   * @category Events
   * @hidden
   */
  private _onunpin: EventListener | null = null;

  /**
   * onminimize triggered when panel condition changes to minimized
   * @category Events
   * @hidden
   */
  private _onminimize: EventListener | null = null;

  /**
   * onmaximize triggered when panel condition changes to maximized
   * @category Events
   * @hidden
   */
  private _onmaximize: EventListener | null = null;

  /**
   * onrestore triggered when panel condition changes to normal
   * @category Events
   * @hidden
   */
  private _onrestore: EventListener | null = null;

  /**
   * onclose triggered each time the panel closes
   * @category Events
   * @hidden
   */
  private _onclose: EventListener | null = null;

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

      // Guard
      if (this._condition === condition) return;

      // Mutate
      if (condition === Condition.MINIMIZED) this._former = this._condition;
      this._condition = condition;

      // Synchronize
      this._showControls();
    } finally {
      // Reflect
      this._reflect(Attributes.CONDITION, this._condition, Condition.NORMAL);
    }

    // Dispatch
    const detail = { condition };
    condition === Condition.MINIMIZED &&
      this._dispatch(Event.ON_MINIMIZE, detail);
    condition === Condition.MAXIMIZED &&
      this._dispatch(Event.ON_MAXIMIZE, detail);
    condition === Condition.NORMAL && this._dispatch(Event.ON_RESTORE, detail);
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

      // Guard
      if (this._status === status) return;

      // Mutate
      this._status = status;

      // Synchronize
      this._showStatus();
    } finally {
      // Reflect
      this._reflect(Attributes.STATUS, this._status, Status.UNPINNED);
    }

    // Dispatch
    const detail = { status };
    status === Status.PINNED && this._dispatch(Event.ON_PIN, detail);
    status === Status.UNPINNED && this._dispatch(Event.ON_UNPIN, detail);
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

      // Guard
      if (this._visibility === visibility) return;

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

    // Dispatch
    const detail = { visibility };
    visibility === Visibility.HIDDEN && this._dispatch(Event.ON_HIDE, detail);
    visibility === Visibility.VISIBLE && this._dispatch(Event.ON_SHOW, detail);
  }

  /**
   * Triggered via `.hide()`
   * @event
   * @category Events
   */
  public set onhide(handler: EventListener | null) {
    this._onhide = this._subscribe(Event.ON_HIDE, this._onhide, handler);
  }

  /**
   * Triggered via `.show()`
   * @event
   * @category Events
   */
  public set onshow(handler: EventListener | null) {
    this._onshow = this._subscribe(Event.ON_SHOW, this._onshow, handler);
  }

  /**
   * Triggered via `.pin()`
   * @event
   * @category Events
   */
  public set onpin(handler: EventListener | null) {
    this._onpin = this._subscribe(Event.ON_PIN, this._onpin, handler);
  }

  /**
   * Triggered via `.unpin()`
   * @event
   * @category Events
   */
  public set onunpin(handler: EventListener | null) {
    this._onunpin = this._subscribe(Event.ON_UNPIN, this._onunpin, handler);
  }

  /**
   * Triggered via `.minimize()`
   * @event
   * @category Events
   */
  public set onminimize(handler: EventListener | null) {
    this._onminimize = this._subscribe(
      Event.ON_MINIMIZE,
      this._onminimize,
      handler
    );
  }

  /**
   * Triggered via `.maximize()`
   * @event
   * @category Events
   */
  public set onmaximize(handler: EventListener | null) {
    this._onmaximize = this._subscribe(
      Event.ON_MAXIMIZE,
      this._onmaximize,
      handler
    );
  }

  /**
   * Triggered via `.restore()`
   * @event
   * @category Events
   */
  public set onrestore(handler: EventListener | null) {
    this._onrestore = this._subscribe(
      Event.ON_RESTORE,
      this._onrestore,
      handler
    );
  }

  /**
   * Triggered via `.close()`, before the panel is removed from the page.
   * Deliberately replaces the `onclose` property every HTML element has:
   * on the panel it subscribes to the component's own `onclose` event.
   * @event
   * @category Events
   */
  public set onclose(handler: EventListener | null) {
    this._onclose = this._subscribe(Event.ON_CLOSE, this._onclose, handler);
  }

  /**
   * Hide the panel when it is visible
   * @category Operations
   */
  public hide = () => {
    this.visibility = Visibility.HIDDEN;
  };

  /**
   * Show the panel when it is hidden
   * @category Operations
   */
  public show = () => {
    this.visibility = Visibility.VISIBLE;
  };

  /**
   * Pin the panel when it is unpinned
   * @category Operations
   */
  public pin = () => {
    this.status = Status.PINNED;
  };

  /**
   * Unpin the panel when it is pinned
   * @category Operations
   */
  public unpin = () => {
    this.status = Status.UNPINNED;
  };

  /**
   * Minimize the panel when it is normal or maximized
   * @category Operations
   */
  public minimize = () => {
    this.condition = Condition.MINIMIZED;
  };

  /**
   * Maximize the panel when it is normal or minimized
   * @category Operations
   */
  public maximize = () => {
    this.condition = Condition.MAXIMIZED;
  };

  /**
   * Return the panel to how it was before it was minimized or maximized
   * @category Operations
   */
  public restore = () => {
    this.condition =
      this._condition === Condition.MINIMIZED ? this._former : Condition.NORMAL;
  };

  /**
   * Close the panel: tell the host, then remove the panel from the page
   * @category Operations
   */
  public close = () => {
    if (!this.isConnected) return;

    this._dispatch(Event.ON_CLOSE);

    this.remove();
  };

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
  protected _addEventListeners = () => {
    const { pin, minimize, maximize, restore } = this.elements.taskbar ?? {};
    if (!pin || !minimize || !maximize || !restore) return;

    pin.onpin = this._handlePin;
    pin.onunpin = this._handleUnpin;
    minimize.onminimize = this._handleMinimize;
    maximize.onmaximize = this._handleMaximize;
    restore.onrestore = this._handleRestore;
  };

  /**
   * Called by the disconnectedCallback prototypical method
   * @category Configuration
   * @hidden
   */
  protected _removeEventListeners = () => {
    const { pin, minimize, maximize, restore } = this.elements.taskbar ?? {};
    if (!pin || !minimize || !maximize || !restore) return;

    pin.onpin = null;
    pin.onunpin = null;
    minimize.onminimize = null;
    maximize.onmaximize = null;
    restore.onrestore = null;
  };

  /**
   * Handles the pin in the taskbar reporting that it is pinned: pins the panel
   * @category Gesture
   * @hidden
   */
  private _handlePin = () => this.pin();

  /**
   * Handles the pin in the taskbar reporting that it is unpinned: unpins the panel
   * @category Gesture
   * @hidden
   */
  private _handleUnpin = () => this.unpin();

  /**
   * Handles the minimize control in the taskbar asking to minimize: minimizes the panel
   * @category Gesture
   * @hidden
   */
  private _handleMinimize = () => this.minimize();

  /**
   * Handles the maximize control in the taskbar asking to maximize: maximizes the panel
   * @category Gesture
   * @hidden
   */
  private _handleMaximize = () => this.maximize();

  /**
   * Handles the restore control in the taskbar asking to restore: restores the panel
   * @category Gesture
   * @hidden
   */
  private _handleRestore = () => this.restore();

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
    fits(this._condition !== Condition.MAXIMIZED, taskbar?.pin);
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
