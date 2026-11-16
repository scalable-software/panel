import { Template } from "@scalable.software/component";

import { Panel, Tag, CSS, Attributes } from "@scalable.software/panel";
import { Taskbar } from "@scalable.software/taskbar";
import { Pin } from "@scalable.software/pin";
import { Minimize } from "@scalable.software/minimize";
import { Maximize } from "@scalable.software/maximize";
import { Restore } from "@scalable.software/restore";
import { Close } from "@scalable.software/close";

// As the host does: the templates are loaded and the five controls, then the taskbar,
// are defined once, before the panel, and stay for every suite
beforeAll(async () => {
  await Pin.Template.load("pin.template.html");
  await Minimize.Template.load("minimize.template.html");
  await Maximize.Template.load("maximize.template.html");
  await Restore.Template.load("restore.template.html");
  await Close.Template.load("close.template.html");
  await Taskbar.Template.load("taskbar.template.html");
  define(Pin.Tag, Pin);
  define(Minimize.Tag, Minimize);
  define(Maximize.Tag, Maximize);
  define(Restore.Tag, Restore);
  define(Close.Tag, Close);
  define(Taskbar.Tag, Taskbar);
});

// Adds a panel to DOM as the page's HTML does: from markup, so that it is constructed
// once it is in the page, as the specification requires
const place = (markup = `<${Tag}></${Tag}>`) => {
  const host = document.createElement("div");
  host.innerHTML = markup;
  return document.body.appendChild(host.firstElementChild as Panel);
};

// Configuration
configuration(Configuration.TAG, () => {
  and("Panel imported", () => {
    then("Panel is defined", () => {
      expect(Panel).toBeDefined();
    });

    and("Panel is defined", () => {
      then("Panel.Tag static getter is defined", () => {
        expect(Panel.Tag).toBeDefined();
      });

      and("Panel.Tag static getter is defined", () => {
        then("Panel.Tag is Tag", () => {
          expect(Panel.Tag).toBe(Tag);
        });
      });
    });
  });
});

configuration(Configuration.ATTRIBUTES, () => {
  and("Panel imported", () => {
    then("Panel is defined", () => {
      expect(Panel).toBeDefined();
    });

    and("Panel is defined", () => {
      then("Panel.Attributes static getter is defined", () => {
        expect(Panel.Attributes).toBeDefined();
      });

      and("Panel.Attributes static getter is defined", () => {
        then("Panel.Attributes is Attributes", () => {
          expect(Panel.Attributes).toBe(Attributes);
        });
      });
    });
  });
});

// Utilities
utility(Utilities.TEMPLATE, () => {
  then("Panel.Template static property is defined", () => {
    expect(Panel.Template).toBeDefined();
  });

  and("Panel.Template static property is defined", () => {
    then("Panel.Template is a Template", () => {
      expect(Panel.Template).toBeInstanceOf(Template);
    });
  });
});

// Compositions
composition(Composition.TEMPLATE, () => {
  given("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("HTML Template is added to DOM", () => {
      let template: HTMLTemplateElement;
      beforeEach(async () => {
        template = (await Panel.Template.load(
          "panel.template.html"
        )) as HTMLTemplateElement;
      });
      afterEach(() => {
        remove(Panel.Tag);
      });

      then("template is defined", () => {
        expect(template).toBeDefined();
      });

      and("a new panel is added to DOM", () => {
        let panel: Panel;
        beforeEach(() => {
          panel = place();
        });
        afterEach(() => {
          panel.remove();
        });

        then("panel.root contents contains template contents", () => {
          expect(panel.root.innerHTML).toContain(template.innerHTML);
        });

        then("`panel.root` contains `div.window`", () => {
          const div = panel.root.querySelector("div.window");
          expect(div).not.toBeNull();
        });

        when("`panel.root` contains `div.window`", () => {
          let div: HTMLDivElement;
          beforeEach(() => {
            div = panel.root.querySelector("div.window") as HTMLDivElement;
          });

          then(
            "`div.window` contains `task-bar` and `div.content`, in that order, and nothing else",
            () => {
              const parts = [...div.children].map((part) =>
                part.className
                  ? `${part.localName}.${part.className}`
                  : part.localName
              );
              expect(parts).toEqual([Taskbar.Tag, "div.content"]);
            }
          );
        });
      });
    });
  });
});

composition(Composition.CSS, () => {
  given("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });
    and("HTML Template is added to DOM", () => {
      beforeEach(async () => {
        await Panel.Template.load("panel.template.html");
      });
      afterEach(() => {
        remove(Panel.Tag);
      });

      and("a new panel is added to DOM", () => {
        let panel: Panel;
        beforeEach(() => {
          panel = place();
        });
        afterEach(() => {
          panel.remove();
        });

        then("panel.root contents contains a link to stylesheet", () => {
          expect(panel.root.innerHTML).toContain("stylesheet");
        });

        and("panel.root contents contains a link to stylesheet", () => {
          then("the stylesheet file's name is correct", () => {
            expect(panel.root.innerHTML).toContain(CSS);
          });
        });
      });
    });
  });
});

// State

// Operation

// Event

// Gesture
