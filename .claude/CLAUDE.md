# Panel

This repository is `@scalable.software/panel`: the `<window-panel>` web component, a window that holds a taskbar along its top and its content below it. The end user moves it by dragging the taskbar, resizes it with a grip at its lower right, and pins, minimizes, maximizes, restores and closes it with the taskbar's controls.

The guide, the policies and the workflows in `.claude/` hold for every component, and each repository applies them in the context of its own component. They are illustrated with the pin, the reference component, and, where the pin has no example, with the title. The pin shows how the pieces link: a rule, the specification entry it shapes, the code that follows it and the test that proves it. It is an illustration, not a model to copy: the panel's states, operations, events, gestures, tests and specification come from its own requirements in `specifications/`, never from the pin's. When the policies and the code here disagree, one of them is wrong; say so.

The panel is not built yet: the source is still the component template, and its requirements and specification are still to be written. It contains another component, the taskbar (`<task-bar>`, in its own repository), which in turn contains the pin and the window controls. The policies do not cover nested components yet; that policy is developed with the taskbar.

The panel owns the condition of the window, and the taskbar only reports requests and shows what the panel tells it:

- **The panel decides** whether it is normal, maximized or minimized, and whether it is pinned. It holds its own position and dimensions, and the condition it returns to when it is restored.
- **Requests go up, state comes down.** A control in the taskbar asks; the taskbar reports the request as its own event; the panel changes its condition, reports that change as its own event, and tells the taskbar the new condition so that it shows the controls that fit.
- **Pinned** stops the panel from being moved, not from being resized. Dragging the taskbar moves an unpinned panel only while it is normal, and never when the press starts on a control. The grip resizes the panel only while it is normal.
- **Minimized** collapses the panel to its taskbar, where it sits; it can still be moved. Restore returns it to the condition it had before it was minimized.
- **Closing** removes the panel; the taskbar never removes anything.

The package in `.claude/` is the canon. It is changed in the title first, then copied to every web component, this one included. Propose a change to it in the title, not here; this repository's own file is this `CLAUDE.md`.

It is built on the base component, `@scalable.software/component`, which lives in another repository. Never change it from here. When the panel needs something from it, describe the change for the human.

## Starting a session

The human opens a session with **`Yo`**. That is not the signal to start working.

1. **Prepare.** Check the branch and the working tree. Work out which piece of work comes next. Read only the documents that work needs (see "Where to find what"). Change nothing.
2. **Report.** Say what you will work on, your plan, what you checked, which documents you read, and what is unclear. Then stop.
3. **Start on `Go`.** Only the word `Go` is approval; it may be scoped ("Go, first step only").

Panel has no bucket on the Planner boards. Its work comes from the human directly, without a card (`governance.md` §5): it starts at step 1 of the path and writes nothing on the board.

## What always applies

- **Propose before changing a document in `.claude/`.** Say what you would change and why, and change it when the human agrees.
- **Test first.** See a spec fail before writing the code that makes it pass.
- **One concern in each commit,** named by its prefix. Commit when the human asks.
- **The human merges and releases.** Do not push, open or merge a pull request, open an issue, or release unless asked.
- **Never change `.claude/examples/`.** It holds an exact copy of the pin's `src/`, `specifications/` and `test/`, and is refreshed from the pin's own repository.
- **Check, then claim.** Run the suite or try it in a browser before saying something works, and say what you did not check.

## Commands

| Command | What it does |
|---|---|
| `npm test` | checks the specification, compiles, and runs the suite in headless Chrome |
| `npm run check.specification` | checks the specification against the schema in each policy |
| `npm run build` | compiles to `dist/` |
| `npm run serve` | builds and opens the demo page |
| `npm run document` | regenerates the API docs in `docs/` |
| `npm run clean.test` | removes compiled test output; run it after a failed `npm test` |

## Layout

| Path | Holds |
|---|---|
| `specifications/` | the requirements file and the specification |
| `src/` | the component, its metadata, its validators, its template and its stylesheet |
| `test/unit/` | three test files: metadata, validation, component |
| `demo/` | the demo page |
| `docs/` | generated API docs; never edit by hand |
| `.claude/` | the guide, the policies, the add-on guides, the workflows, the skills, the example copy |

## Where to find what

Three sets of documents describe how components are built here. **Do not read them up front.** Each is long. Read the one that matches the work in front of you, when that work starts, and read only the part you need.

### The guide: why it works this way

`.claude/guide/framework.md` explains the framework to someone new, one section for each construct: Composition, State, Data, Validation, Operations, Events, Gestures.

Read a section when you need to understand how a construct works before changing it, or when you have to explain it to someone.

### The policies: what a component must look like

One file for each construct, in `.claude/policies/`. Each ends with a checklist. All except `validation.md` also end with the schema for their section of the specification.

| Before you add or change… | Read |
|---|---|
| a part of the template, or a cached element | `composition.md` |
| data: its type, its validator, or an operation that creates, loads or changes it | `data.md` |
| a state, its setter or its attribute | `state.md` |
| a validator, or anything that rejects a value | `validation.md` |
| an operation | `operation.md` |
| an event, or an `on…` property | `event.md` |
| a gesture, a listener or a handler | `gesture.md` |

`data.md` is illustrated with the title, not the pin, because the pin has no data. The panel has data: its position and dimensions, and the condition it returns to when it is restored.

### The add-ons: how a component uses one

One file for each add-on, in `.claude/add-ons/`. Each explains the pieces an add-on brings, who owns each of them, and how they work together. They are guides, not policies: they have no checklist to audit against and no schema. The panel uses no add-on.

| When you… | Read |
|---|---|
| add a text that depends on the language, or change how a component follows the language | `localizer.md` |

### The workflows: how the work is done

One file for each stage, in `.claude/workflow/`.

| When you… | Read |
|---|---|
| start a piece of work, create a branch, or write a commit | `workflow.md` |
| write or change a user story | `requirements.md` |
| change the specification | `specifications.md` |
| write tests, or decide what goes in one commit | `testing.md` |
| open an issue or a pull request, or prepare a release | `github.md` |
| change the demo page | `demo.md` |
| take up a card, read or answer a post, or close a card | `governance.md` |

`workflow.md` is the map: it gives the whole path from a story to a release, and points to the other six. Start there when you are unsure which one applies.

### Also in `.claude/`

- `examples/` — the exact copy of the pin's implementation. Read it to see how a rule, a specification entry, the code and a test link; read this repository's own `src/`, `specifications/` and `test/` for the component itself.
