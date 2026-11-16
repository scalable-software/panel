import { component } from "@scalable.software/panel";

await component.Template.load("component.template.html");

customElements.define(component.Tag, component);
