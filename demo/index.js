import {
  Panel,
  State,
  Condition,
  Status,
  Visibility,
  Datum,
  Operation
} from "@scalable.software/panel";
import { Taskbar } from "@scalable.software/taskbar";
import { Pin } from "@scalable.software/pin";
import { Minimize } from "@scalable.software/minimize";
import { Maximize } from "@scalable.software/maximize";
import { Restore } from "@scalable.software/restore";
import { Close } from "@scalable.software/close";

// The host loads each template and defines the five controls, then the taskbar, then the
// panel: the panel holds the taskbar in its template, and the taskbar holds the controls.
const components = {
  "pin.template.html": Pin,
  "minimize.template.html": Minimize,
  "maximize.template.html": Maximize,
  "restore.template.html": Restore,
  "close.template.html": Close,
  "taskbar.template.html": Taskbar,
  "panel.template.html": Panel
};

for (const [template, Component] of Object.entries(components)) {
  await Component.Template.load(template);
  customElements.define(Component.Tag, Component);
}

const stage = document.querySelector(".stage");
const panel = document.querySelector(Panel.Tag);

/* ───────────────────────────── States ───────────────────────────── */

// The value list of each writable state. A state without one is readonly.
const choices = {
  [State.CONDITION]: Condition,
  [State.STATUS]: Status,
  [State.VISIBILITY]: Visibility
};

const states = document.querySelector("#states");

const addChoice = (state, values) => {
  const select = document.createElement("select");
  select.id = state;
  Object.values(values).forEach((value) => select.add(new Option(value)));
  select.addEventListener("change", () => (panel[state] = select.value));
  return select;
};

const addText = (state) => {
  const output = document.createElement("output");
  output.id = state;
  output.title = "readonly";
  return output;
};

Object.values(State).forEach((state) => {
  const name = document.createElement("dt");
  const label = document.createElement("label");
  label.htmlFor = state;
  label.textContent = choices[state] ? state : `${state} (readonly)`;
  name.append(label);

  const value = document.createElement("dd");
  value.append(
    choices[state] ? addChoice(state, choices[state]) : addText(state)
  );

  states.append(name, value);
});

// States are attributes: follow the component when it changes one itself.
const follow = () =>
  Object.values(State).forEach(
    (state) => (states.querySelector(`#${state}`).value = panel[state])
  );

new MutationObserver(follow).observe(panel, { attributes: true });
follow();

/* ───────────────────────────── Data ───────────────────────────── */

const data = document.querySelector("#data");

// The component's current data, as formatted JSON.
const show = () =>
  (data.textContent = JSON.stringify(
    Object.fromEntries(
      Object.values(Datum).map((datum) => [datum, panel[datum]])
    ),
    null,
    2
  ));

// One sample for each data item, and one that shows a panel partly out of view.
const samples = {
  "position: 24, 24": () => (panel.position = { left: 24, top: 24 }),
  "position: -120, 60": () => (panel.position = { left: -120, top: 60 }),
  "dimensions: 320 × 200": () =>
    (panel.dimensions = { width: 320, height: 200 }),
  "dimensions: 560 × 300": () =>
    (panel.dimensions = { width: 560, height: 300 })
};

const addButton = (group, label, invoke) => {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", invoke);
  group.append(button);
};

// Setting data sends no event, so the view is updated after the sample is set.
Object.entries(samples).forEach(([label, set]) =>
  addButton(document.querySelector("#samples"), label, () => {
    set();
    show();
  })
);

show();

/* ───────────────────────────── Operations ───────────────────────────── */

Object.values(Operation).forEach((operation) =>
  addButton(document.querySelector("#operations"), operation, () =>
    panel[operation]()
  )
);

// `close` removes the panel from the page: the page can place it again.
document
  .querySelector("#place")
  .addEventListener("click", () => stage.append(panel));

/* ───────────────────────────── Events ───────────────────────────── */

const events = document.querySelector("#events");

const log = (event) => {
  const entry = document.createElement("li");

  const time = document.createElement("time");
  time.textContent = new Date().toLocaleTimeString();

  const type = document.createElement("strong");
  type.textContent = event.type;

  entry.append(time, type);

  if (event.detail !== null) {
    const detail = document.createElement("code");
    detail.textContent = JSON.stringify(event.detail);
    entry.append(detail);
  }

  events.append(entry);
};

// `onevent` receives every event, and leaves the `on…` properties free. One handler
// hands each event to every part of the page that follows the panel.
panel.onevent = (event) => {
  log(event);
  show();
};

document
  .querySelector("#clear")
  .addEventListener("click", () => events.replaceChildren());
