import { Panel } from "@scalable.software/panel";
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
