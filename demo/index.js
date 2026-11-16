import { Panel } from "@scalable.software/panel";

await Panel.Template.load("panel.template.html");

customElements.define(Panel.Tag, Panel);
