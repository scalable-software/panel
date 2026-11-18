![License: CC BY-NC-SA 4.0](https://flat.badgen.net/static/license/CC-BY-NC-SA-4.0/green)

# Panel

A lightweight, self-contained web component that holds a host application's content in a window: a taskbar along its top with the window's controls, the content below it, and a grip at its lower right. The end user moves the window by dragging the taskbar, resizes it with the grip, and pins, minimizes, maximizes, restores and closes it with the controls. The host application can do the same from code, and is told about every change. The panel can be shown or hidden on demand, and adapts automatically to light and dark themes.

The panel owns the condition of the window. The taskbar and its controls only report what the end user asks for and show what the panel tells them.

---

## 1. Introduction

The **Panel** component gives a host application a window with one element. The host places its content in it, and a title with `slot="title"`.

```html
<window-panel>
  <span slot="title">Window title</span>
  <p>The content of the window.</p>
</window-panel>
```

```js
const panel = document.querySelector("window-panel");

panel.onclose = () => console.log("The window is closing");
panel.onmove = (event) => console.log(event.detail.position);

panel.maximize();
panel.restore();
```

The panel neither listens to the content and the title nor changes them.

The title is shown centred between the pin and the window controls.

The panel depends on `@scalable.software/taskbar` 0.2.1 or later, and through it on `@scalable.software/pin`, `@scalable.software/minimize`, `@scalable.software/maximize`, `@scalable.software/restore` and `@scalable.software/close`. The host application defines the five controls, then the taskbar, then the panel, each after loading its template (see 5.3).

### 1.1 Installation & Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/scalable-software/panel.git
   cd panel
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run Tests (Optional)**

   ```bash
   npm test
   ```

   - Ensures everything is working as expected before you start.

4. **Start Local Server**

   ```bash
   npm run serve
   ```

   - This builds the component and opens the demo page, with a `<window-panel>` on a stage at the top and its controls below it.

---

## 2. Quick Start Usage Walkthrough

This walkthrough uses the demo page to show how `<window-panel>` behaves. The page has the panel on a stage across the top, and four groups below it: **States**, **Data**, **Operations** and **Events**.

1. **Drag** the taskbar of the panel, by its title or by the empty part of the bar.
   - The panel follows the pointer. The **Events** log shows `onmove` for every step, and the **Data** group shows the new `position`.
   - Press on a control and move: nothing is dragged.

2. **Drag** the grip at the lower right of the panel.
   - The lower right corner follows the pointer. The log shows `onresize` for every step, and **Data** shows the new `dimensions`.
   - Drag it up and to the left as far as it goes: the panel stops at the size of its taskbar.

3. **Click** the pin in the taskbar.
   - The pin shows pinned, `status` in the **States** group becomes `pinned`, and the log shows `onpin`.
   - Drag the taskbar: the panel does not move. Drag the grip: it still resizes.
   - Click the pin again: the log shows `onunpin`.

4. **Click** the minimize control.
   - The panel collapses to its taskbar, where it sits, and the log shows `onminimize`. The taskbar now shows restore and maximize, and hides minimize.
   - Drag the collapsed panel: it can still be moved.
   - Click restore: the panel returns to how it was, at the place you moved it to, and the log shows `onrestore`.

5. **Click** the maximize control.
   - The panel fills the stage, the element it is positioned in, and the log shows `onmaximize`. The pin and the grip are hidden.
   - Click minimize, then restore: the panel returns to maximized, because that is what it was when it was minimized.
   - Click restore again: the panel returns to its own place and size.

6. **Click** `hide`, then `show`, in the **Operations** group.
   - The panel disappears and comes back as it was. The log shows `onhide` and `onshow`.

7. **Click** the buttons in the **Data** group.
   - The host application places and sizes the panel from code: `panel.position = { left: 24, top: 24 }`. Setting data sends no event.

8. **Click** the close control.
   - The log shows `onclose`, and then the panel is removed from the page. Click **Place the panel again** to put it back; that button belongs to the page, not to the panel.

9. **Open the Developer Tools**, select the **Console**, and try:

   ```js
   const panel = document.querySelector("window-panel");

   panel.condition;
   panel.dimensions = { width: 400, height: 240 };
   panel.onresize = (event) => console.log(event.detail.dimensions);
   ```

For more details on **States**, **Data**, **Operations**, **Events** and **Gestures**, consult the sections below or check the generated **API documentation** (see `npm run document`).

---

## 3. Architectural Overview

### 3.1 Composition

- **Template** (`panel.template.html`): Defines DOM structure — a `.window` surface holding the `<task-bar>`, with a slot named `title` in its centre, a `.content` region with the default slot, and the `.grip`. Its one style rule, `:host { display: none; }`, keeps the panel hidden until its stylesheet applies, so the panel is never seen unstyled.
- **Style** (`panel.style.css`): Encapsulates the surface of the window, the layout of its parts, the grip, what a minimized, maximized or hidden panel looks like, and light/dark theme adaptation. The window is glass: translucent, with what lies behind it blurred. The taskbar is opaque and fits inside the edge of the window. The stylesheet's rule `:host(:defined) { display: inline-block; }` reveals the panel; a stylesheet that replaces this one must carry that rule, or the panel stays hidden.
- **Class** (`panel.ts`): Extends the base component class to handle lifecycle hooks, attribute reflection, the states, the data, the operations, the dispatch of its events, and the gestures on the taskbar and the grip.

### 3.2 Class Lifecycle

- **`connectedCallback()`**
  - Upgrades the taskbar and its controls, and caches the taskbar and the grip.
  - Shows the controls that fit the `condition`, makes the pin show the `status`, and places and sizes the panel when it has a `position` or `dimensions`.
  - Starts listening: to the five controls through their own `on…` properties, and to the pointer on the taskbar and on the grip.

- **`disconnectedCallback()`**
  - Stops listening. A panel that is added again listens once.

The panel takes the `on…` properties of the controls in its taskbar. A host application listens to the panel, such as `panel.onpin`, not to a control.

### 3.3 Placement

The panel is positioned (`position: absolute`) in the nearest positioned element around it.

- Until it has a `position`, it is where the host's own styles place it; until it has `dimensions`, it has the size the host's styles give it.
- Once it has them, the panel writes `left`, `top`, `width` and `height` on its own element.
- While `maximized` it fills the element it is positioned in, and while `minimized` it is as high as its taskbar, whatever place and size it was given. It keeps its `position` and `dimensions` meanwhile.
- The panel is never shown narrower than its taskbar needs.

### 3.4 Appearing

A stylesheet loads a moment after a component is added to the page, and again each time it is added. Until then a component has its structure but not its layout.

- The panel stays hidden, and takes no room in the page, until its stylesheet applies; it then shows at once, in its finished look.
- The taskbar and each of its controls do the same with their own stylesheets, so none of them is seen unstyled inside the window.

---

## 4. Core Concepts: State, Data, Operations, Events, and Gestures

### 4.1 State

- **`condition`** (`normal` | `minimized` | `maximized`)
  - Whether the window is normal, collapsed to its taskbar, or enlarged to fill the space it has.
  - It decides what the taskbar shows: minimize and maximize while `normal`; restore and maximize while `minimized`; minimize and restore while `maximized`. Close is always shown. The pin is hidden while `maximized`.
  - **Optional attribute**: absent from the DOM when `normal` (the default).

- **`status`** (`pinned` | `unpinned`)
  - Whether the window is pinned in place. The panel holds it, and the pin in the taskbar shows it.
  - Pinned stops the end user from moving the panel, not from resizing it.
  - **Optional attribute**: absent from the DOM when `unpinned` (the default).

- **`visibility`** (`visible` | `hidden`)
  - Whether the panel is displayed. A hidden panel keeps everything else as it is.
  - **Optional attribute**: absent from the DOM when `visible` (the default).

Any other value is rejected: assigning it to the property throws, and writing it to the attribute puts the current state back. Assigning `null` returns a state to its default.

### 4.2 Data

- **`position`** (`{ left, top }` | `null`)
  - The place of the panel's upper left corner in the element it is positioned in, in pixels.
  - `null` until the panel is moved or given a position.

- **`dimensions`** (`{ width, height }` | `null`)
  - How large the panel is, in pixels; neither may be negative.
  - `null` until the panel is resized or given dimensions.

The getter returns a frozen copy that the panel owns: changing the object that was assigned changes nothing, and assigning to a field of the returned value throws. A value with a missing, extra or invalid field is rejected with a message that names the field, such as `Invalid position value: top is required`. `null` cannot be assigned.

Assigning data places or sizes the panel and sends no event. The host application can place a pinned or maximized panel this way; only the end user's drag is stopped.

### 4.3 Operations

| Operation | What it does |
|---|---|
| `hide()` | hides the panel |
| `show()` | shows the panel |
| `pin()` | sets `status` to `pinned`; the pin shows pinned |
| `unpin()` | sets `status` to `unpinned`; the pin shows unpinned |
| `minimize()` | sets `condition` to `minimized`: the panel collapses to its taskbar |
| `maximize()` | sets `condition` to `maximized`: the panel fills the space it has |
| `restore()` | returns the panel to how it was: a maximized panel becomes normal; a minimized panel returns to the condition it had when it was minimized |
| `close()` | dispatches `onclose`, then removes the panel from the page |

An operation whose outcome is already true does nothing and sends no event.

### 4.4 Events

| Event | Dispatched when | `detail` |
|---|---|---|
| `onhide` | the panel becomes hidden | `{ visibility: "hidden" }` |
| `onshow` | the panel becomes visible | `{ visibility: "visible" }` |
| `onpin` | `status` becomes `pinned` | `{ status: "pinned" }` |
| `onunpin` | `status` becomes `unpinned` | `{ status: "unpinned" }` |
| `onminimize` | `condition` becomes `minimized` | `{ condition: "minimized" }` |
| `onmaximize` | `condition` becomes `maximized` | `{ condition: "maximized" }` |
| `onrestore` | `condition` becomes `normal` | `{ condition: "normal" }` |
| `onclose` | the panel closes, before it is removed from the page | none |
| `onmove` | the end user drags the panel to a new position, once for every step | `{ position }` |
| `onresize` | the end user drags the grip to new dimensions, once for every step | `{ dimensions }` |

- Subscribe with the property of the same name, such as `panel.onmove = handler`, or with `addEventListener("onmove", handler)`. `onevent` receives every event.
- A state event is sent whenever the state changes, whether by an operation, the property, the attribute or a control.
- Restoring a panel that was minimized from maximized makes it `maximized`, so it sends `onmaximize`, not `onrestore`.
- `onclose` and `onresize` deliberately replace the properties of the same name every HTML element has: on the panel they subscribe to the panel's own events.

### 4.5 Gestures

| Gesture | On | What it does |
|---|---|---|
| `pointerdown` | the taskbar | starts dragging the panel, unless it is pinned or maximized, or the press is on a control |
| `pointerdown` | the grip | starts resizing the panel, while it is normal |
| `pointermove` | the taskbar, the grip | the panel, or its lower right corner, follows the pointer |
| `pointerup`, `pointercancel` | the taskbar, the grip | ends the drag or the resizing where the panel is |

A click on a control in the taskbar is the control's own gesture: the panel hears what the control reports, and pins, unpins, minimizes, maximizes, restores or closes itself.

Moving and resizing need a pointer; they have no keyboard equivalent.

---

## 5. Development Workflow

### 5.1 Testing

Unit tests run with Karma + Jasmine. The specification is checked first, then the suite covers composition, states, data, validation, operations, events and gestures. The suite defines the five controls and the taskbar once, as a host does.

```bash
npm test
```

### 5.2 Documentation (Typedoc)

```bash
npm run document
```

Auto-generates API docs from TypeScript annotations.

### 5.3 Import Maps

The host maps the panel, the base component, the taskbar and the five controls:

```html
<script type="importmap">
  {
    "imports": {
      "@scalable.software/panel": "./node_modules/@scalable.software/panel/dist/index.js",
      "@scalable.software/component": "./node_modules/@scalable.software/component/dist/index.js",
      "@scalable.software/taskbar": "./node_modules/@scalable.software/taskbar/dist/index.js",
      "@scalable.software/pin": "./node_modules/@scalable.software/pin/dist/index.js",
      "@scalable.software/minimize": "./node_modules/@scalable.software/minimize/dist/index.js",
      "@scalable.software/maximize": "./node_modules/@scalable.software/maximize/dist/index.js",
      "@scalable.software/restore": "./node_modules/@scalable.software/restore/dist/index.js",
      "@scalable.software/close": "./node_modules/@scalable.software/close/dist/index.js"
    }
  }
</script>
```

```js
import { Panel } from "@scalable.software/panel";
import { Taskbar } from "@scalable.software/taskbar";
import { Pin } from "@scalable.software/pin";
import { Minimize } from "@scalable.software/minimize";
import { Maximize } from "@scalable.software/maximize";
import { Restore } from "@scalable.software/restore";
import { Close } from "@scalable.software/close";

await Pin.Template.load("pin.template.html");
await Minimize.Template.load("minimize.template.html");
await Maximize.Template.load("maximize.template.html");
await Restore.Template.load("restore.template.html");
await Close.Template.load("close.template.html");
await Taskbar.Template.load("taskbar.template.html");
await Panel.Template.load("panel.template.html");

[Pin, Minimize, Maximize, Restore, Close, Taskbar, Panel].forEach((Component) =>
  customElements.define(Component.Tag, Component)
);
```

Define the controls and the taskbar, and load every template, before the panel, so that the taskbar and its controls are complete the moment the panel is connected.

The metadata (the tag, the attributes, the states, the data, the operations, the events and the other names) is also importable on its own, as `@scalable.software/panel/meta`. It loads without the element, so a consumer outside the browser, such as Node, can `import` or `require()` it without a DOM:

```js
import { Tag, Attributes } from "@scalable.software/panel/meta";
```

## License

> This software and its documentation are released under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International Public License (CC BY-NC-SA 4.0). This means you are free to share, copy, distribute, and transmit the work, and to adapt it, but only under the following conditions:
>
> Attribution: You must attribute the work in the manner specified by the author or licensor (but not in any way that suggests that they endorse you or your use of the work).
>
> NonCommercial: You may not use this material for commercial purposes.
>
> ShareAlike: If you alter, transform, or build upon this work, you may distribute the resulting work only under the same or similar license to this one.
>
> For more details, please visit the full [license agreement](https://creativecommons.org/licenses/by-nc-sa/4.0/).
