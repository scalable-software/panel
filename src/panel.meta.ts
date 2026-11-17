/**
 * @module Panel
 */

/**
 * @category Configuration
 */
export const Tag = "window-panel" as const;

/**
 * @category Configuration
 */
export const CSS = "panel.style.css" as const;

/**
 * HTML Attributes available to set
 * @category Metadata
 * @enum
 */
export const Attributes = {
  CONDITION: "condition",
  STATUS: "status",
  VISIBILITY: "visibility"
} as const;
/**
 * HTML Attributes available to set
 * @category Metadata
 */
export type Attributes = typeof Attributes;

/**
 * HTML Attributes available to set
 * @category Metadata
 * @enum
 */
export const State = {
  ...Attributes
} as const;

/**
 * HTML Attributes available to set
 * @category Metadata
 */
export type State = (typeof State)[keyof typeof State];

/**
 * Indicates whether the window is normal, collapsed to its taskbar, or enlarged to fill
 * the space it has
 * @category Metadata
 * @enum
 */
export const Condition = {
  NORMAL: "normal",
  MINIMIZED: "minimized",
  MAXIMIZED: "maximized"
} as const;
/**
 * Indicates whether the window is normal, collapsed to its taskbar, or enlarged to fill
 * the space it has
 * @category Metadata
 */
export type Condition = (typeof Condition)[keyof typeof Condition];

/**
 * Indicates whether the window is pinned in place or unpinned
 * @category Metadata
 * @enum
 */
export const Status = {
  UNPINNED: "unpinned",
  PINNED: "pinned"
} as const;
/**
 * Indicates whether the window is pinned in place or unpinned
 * @category Metadata
 */
export type Status = (typeof Status)[keyof typeof Status];

/**
 * Indicates whether the window is visible or hidden
 * @category Metadata
 * @enum
 */
export const Visibility = {
  VISIBLE: "visible",
  HIDDEN: "hidden"
} as const;
/**
 * Indicates whether the window is visible or hidden
 * @category Metadata
 */
export type Visibility = (typeof Visibility)[keyof typeof Visibility];

/**
 * The data the panel holds
 * @category Metadata
 * @enum
 */
export const Datum = {
  POSITION: "position"
} as const;
/**
 * The data the panel holds
 * @category Metadata
 */
export type Datum = (typeof Datum)[keyof typeof Datum];

/**
 * Where the panel is: the place of its upper left corner in the element it is positioned
 * in, in pixels
 * @category Metadata
 */
export type Position = {
  left: number;
  top: number;
};

/**
 * @category Metadata
 * @enum
 */
export const Operation = {
  HIDE: "hide",
  SHOW: "show",
  PIN: "pin",
  UNPIN: "unpin",
  MINIMIZE: "minimize",
  MAXIMIZE: "maximize",
  RESTORE: "restore",
  CLOSE: "close"
} as const;

/**
 * @category Metadata
 */
export type Operation = (typeof Operation)[keyof typeof Operation];

/**
 * @category Metadata
 * @enum
 */
export const Event = {
  ON_HIDE: "onhide",
  ON_SHOW: "onshow",
  ON_PIN: "onpin",
  ON_UNPIN: "onunpin",
  ON_MINIMIZE: "onminimize",
  ON_MAXIMIZE: "onmaximize",
  ON_RESTORE: "onrestore",
  ON_CLOSE: "onclose"
} as const;
/**
 * @category Metadata
 */
export type Event = (typeof Event)[keyof typeof Event];

/**
 * @category Metadata
 * @enum
 */
export const Gesture = {} as const;
/**
 * @category Metadata
 */
export type Gesture = (typeof Gesture)[keyof typeof Gesture];

/**
 * Every state the component must have
 * @category Metadata
 */
export type States = Record<State, unknown>;

/**
 * Every data item the component must have
 * @category Metadata
 */
export type Data = Record<Datum, unknown>;

/**
 * Every operation the component must have
 * @category Metadata
 */
export type Operations = Record<Operation, (...parameters: any[]) => unknown>;

/**
 * Every event the component must have a subscription property for
 * @category Metadata
 */
export type Events = Record<Event, EventListener | null>;

/**
 * Everything the metadata says the component has: implemented by the component
 * @category Metadata
 */
export type Meta = States & Data & Operations & Events;