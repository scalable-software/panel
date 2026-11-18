import { Template } from "@scalable.software/component";

import {
  Panel,
  Tag,
  CSS,
  Attributes,
  State,
  Condition,
  Status,
  Visibility,
  Operation,
  Event,
  Datum,
  type Position,
  Gesture,
  type Dimensions
} from "@scalable.software/panel";
import {
  Taskbar,
  Control,
  Visibility as ControlVisibility
} from "@scalable.software/taskbar";
import { Pin, Status as PinStatus } from "@scalable.software/pin";
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

// Adds a panel to DOM as the page's HTML does: from markup
const place = (markup = `<${Tag}></${Tag}>`) => {
  const host = document.createElement("div");
  host.innerHTML = markup;
  return document.body.appendChild(host.firstElementChild as Panel);
};

// The window controls the taskbar of a panel shows, in their order
const shown = (panel: Panel) => {
  const taskbar = panel.root.querySelector(Taskbar.Tag) as Taskbar;
  return [
    Control.MINIMIZE,
    Control.MAXIMIZE,
    Control.RESTORE,
    Control.CLOSE
  ].filter((control) => taskbar[control]?.visibility === ControlVisibility.VISIBLE);
};

// The pin in the taskbar of a panel
const pinOf = (panel: Panel) =>
  (panel.root.querySelector(Taskbar.Tag) as Taskbar).pin as Pin;

// A click by the end user on the pin in the taskbar of a panel
const clickPin = (panel: Panel) =>
  (pinOf(panel).root.querySelector(".icon") as HTMLElement).click();

// A click by the end user on a window control in the taskbar of a panel
const click = (panel: Panel, control: Exclude<Control, typeof Control.PIN>) => {
  const taskbar = panel.root.querySelector(Taskbar.Tag) as Taskbar;
  (taskbar[control]?.root.querySelector(".icon") as HTMLElement).click();
};

// A panel with a size, so that its taskbar has room beside its controls
const SIZED = `<${Tag} style="left: 40px; top: 30px; width: 480px; height: 320px"></${Tag}>`;

// Waits until the stylesheets of a panel, its taskbar and its controls are loaded: a
// stylesheet is loaded after the element is added, and the layout depends on it
const styled = async (panel: Panel) => {
  const taskbar = panel.root.querySelector(Taskbar.Tag) as Taskbar;
  const controls = [taskbar.pin, taskbar.minimize, taskbar.maximize, taskbar.restore, taskbar.close];
  const roots = [panel.root, taskbar.root, ...controls.map((control) => control?.root)];
  const links = roots.flatMap((root) => [...(root?.querySelectorAll("link") ?? [])]);
  await Promise.all(
    links.map(
      (link) =>
        link.sheet ??
        new Promise((resolve) => {
          link.addEventListener("load", resolve, { once: true });
          link.addEventListener("error", resolve, { once: true });
        })
    )
  );
};

// A pointer event of the end user on the taskbar of a panel, at a place in the viewport
const pointer = (panel: Panel, type: string, x: number, y: number) =>
  (panel.root.querySelector(Taskbar.Tag) as Taskbar).dispatchEvent(
    new PointerEvent(type, { clientX: x, clientY: y, pointerId: 1, bubbles: true })
  );

// A place on the taskbar of a panel that no control covers: its centre
const onBar = (panel: Panel) => {
  const box = (panel.root.querySelector(Taskbar.Tag) as Taskbar).getBoundingClientRect();
  return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
};

// A drag by the end user: a press on the taskbar, one move, and the release
const drag = (panel: Panel, right: number, down: number) => {
  const start = onBar(panel);
  pointer(panel, Gesture.POINTERDOWN, start.x, start.y);
  pointer(panel, Gesture.POINTERMOVE, start.x + right, start.y + down);
  pointer(panel, Gesture.POINTERUP, start.x + right, start.y + down);
};

// The centre of a control in the taskbar of a panel
const onControl = (panel: Panel, control: Control) => {
  const taskbar = panel.root.querySelector(Taskbar.Tag) as Taskbar;
  const box = (taskbar[control] as HTMLElement).getBoundingClientRect();
  return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
};

// A pointer event of the end user on the grip of a panel, at a place in the viewport
const gripPointer = (panel: Panel, type: string, x: number, y: number) =>
  (panel.root.querySelector(".grip") as HTMLElement).dispatchEvent(
    new PointerEvent(type, { clientX: x, clientY: y, pointerId: 1, bubbles: true })
  );

// The centre of the grip of a panel
const onGrip = (panel: Panel) => {
  const box = (panel.root.querySelector(".grip") as HTMLElement).getBoundingClientRect();
  return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
};

// A drag of the grip by the end user: a press on the grip, one move, and the release
const stretch = (panel: Panel, right: number, down: number) => {
  const start = onGrip(panel);
  gripPointer(panel, Gesture.POINTERDOWN, start.x, start.y);
  gripPointer(panel, Gesture.POINTERMOVE, start.x + right, start.y + down);
  gripPointer(panel, Gesture.POINTERUP, start.x + right, start.y + down);
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

        then("`panel.root` contains a `style`, before `div.window`", () => {
          const parts = [...panel.root.children].map((part) => part.localName);
          expect(parts).toEqual(["link", "style", "div"]);
        });

        then("the panel is not displayed before the stylesheet of the panel has loaded", () => {
          expect(getComputedStyle(panel).display).toBe("none");
        });

        when("the stylesheets have loaded", () => {
          beforeEach(async () => {
            await styled(panel);
          });

          then("the panel is displayed", () => {
            expect(getComputedStyle(panel).display).not.toBe("none");
          });
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
            "`div.window` contains `task-bar`, `div.content` and `div.grip`, in that order, and nothing else",
            () => {
              const parts = [...div.children].map((part) =>
                part.className
                  ? `${part.localName}.${part.className}`
                  : part.localName
              );
              expect(parts).toEqual([Taskbar.Tag, "div.content", "div.grip"]);
            }
          );

          then("`task-bar` contains `slot.title`, and nothing else", () => {
            const parts = [...div.querySelectorAll("task-bar > *")].map(
              (part) => `${part.localName}.${part.className}`
            );
            expect(parts).toEqual(["slot.title"]);
          });

          then("`slot.title` has `name` `title`", () => {
            const slot = div.querySelector("slot.title");
            expect(slot?.getAttribute("name")).toBe("title");
          });

          then("`div.content` contains a `slot`, and nothing else", () => {
            const parts = [...div.querySelectorAll("div.content > *")].map(
              (part) => part.localName
            );
            expect(parts).toEqual(["slot"]);
          });

          then("the `slot` of `div.content` has no `name`", () => {
            const slot = div.querySelector("div.content > slot");
            expect(slot?.hasAttribute("name")).toBeFalse();
          });
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

composition(Composition.ELEMENT, () => {
  and("Panel is defined in custom element registry", () => {
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

        then(
          "`panel.elements.taskbar` is a cached reference to the `task-bar`",
          () => {
            const part = panel.root.querySelector(Taskbar.Tag) as Taskbar;
            expect(panel["elements"].taskbar).toBe(part);
          }
        );

        then("`panel.elements.grip` is a cached reference to `div.grip`", () => {
          const part = panel.root.querySelector("div.grip");
          expect(part).not.toBeNull();
          expect(panel["elements"].grip).toBe(part as HTMLDivElement);
        });

        then("the cached `task-bar` offers its five controls", () => {
          const taskbar = panel["elements"].taskbar;
          const controls = [
            taskbar?.pin,
            taskbar?.minimize,
            taskbar?.maximize,
            taskbar?.restore,
            taskbar?.close
          ].map((control) => control?.localName);
          expect(controls).toEqual([
            Pin.Tag,
            Minimize.Tag,
            Maximize.Tag,
            Restore.Tag,
            Close.Tag
          ]);
        });
      });

      and("a new panel with a title and content is added to DOM", () => {
        let panel: Panel;
        beforeEach(() => {
          panel = place(
            `<${Tag}><span slot="title">Title</span><p>Content</p></${Tag}>`
          );
        });
        afterEach(() => {
          panel.remove();
        });

        then("the title is shown in `slot.title`, in the `task-bar`", () => {
          const slot = panel.root.querySelector(
            "task-bar > slot.title"
          ) as HTMLSlotElement;
          expect(slot.assignedElements()).toEqual([
            panel.querySelector("span") as Element
          ]);
        });

        then("the content is shown in the `slot` of `div.content`", () => {
          const slot = panel.root.querySelector(
            "div.content > slot"
          ) as HTMLSlotElement;
          expect(slot.assignedElements()).toEqual([
            panel.querySelector("p") as Element
          ]);
        });
      });
    });
  });
});

// State

state(State.CONDITION, () => {
  given("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("a HTML Template is added to DOM", () => {
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

        then("`panel.condition` getter exists", () => {
          expect(panel.condition).toBeDefined();
        });

        when("`panel.condition` getter exists", () => {
          then("`panel.condition` is `Condition.NORMAL`", () => {
            expect(panel.condition).toBe(Condition.NORMAL);
          });
        });

        then("`condition` attribute does not exist", () => {
          expect(panel.hasAttribute(Attributes.CONDITION)).toBeFalse();
        });

        then("`panel.condition` setter exists", () => {
          expect(hasSetter(panel, "condition")).toBeTrue();
        });

        and("`panel.condition` setter exists", () => {
          when("`panel.condition` is set to `Condition.MINIMIZED`", () => {
            beforeEach(() => {
              panel.condition = Condition.MINIMIZED;
            });

            then("`panel.condition` is `Condition.MINIMIZED`", () => {
              expect(panel.condition).toBe(Condition.MINIMIZED);
            });

            then("panel `condition` attribute is `Condition.MINIMIZED`", () => {
              const value = panel.getAttribute(Attributes.CONDITION);
              expect(value).toBe(Condition.MINIMIZED);
            });

            when("`panel.condition` is set to `Condition.NORMAL`", () => {
              beforeEach(() => {
                panel.condition = Condition.NORMAL;
              });

              then("`condition` attribute does not exist", () => {
                expect(panel.hasAttribute(Attributes.CONDITION)).toBeFalse();
              });
            });
          });

          when("`panel.condition` is set to `null`", () => {
            beforeEach(() => {
              panel.condition = null;
            });

            then("`panel.condition` is `Condition.NORMAL`", () => {
              expect(panel.condition).toBe(Condition.NORMAL);
            });
          });

          when("`condition` attribute is set to `Condition.MINIMIZED`", () => {
            beforeEach(() => {
              panel.setAttribute(Attributes.CONDITION, Condition.MINIMIZED);
            });

            then("`panel.condition` is `Condition.MINIMIZED`", () => {
              expect(panel.condition).toBe(Condition.MINIMIZED);
            });
          });

          when("`condition` attribute is set to `invalid`", () => {
            let error: Error;
            beforeEach(async () => {
              await jasmine.spyOnGlobalErrorsAsync(async (reported) => {
                panel.setAttribute(Attributes.CONDITION, "invalid");
                error = reported.calls.mostRecent()?.args[0];
              });
            });

            then("`condition` attribute does not exist", () => {
              expect(panel.hasAttribute(Attributes.CONDITION)).toBeFalse();
            });

            then("`panel.condition` is `Condition.NORMAL`", () => {
              expect(panel.condition).toBe(Condition.NORMAL);
            });

            then("an error is reported", () => {
              expect(error).toBeDefined();
            });

            then("error message contains 'Invalid condition value: invalid'", () => {
              expect(error.message).toBe("Invalid condition value: invalid");
            });
          });

          when("`condition` attribute is set to `Condition.NORMAL`", () => {
            beforeEach(() => {
              panel.setAttribute(Attributes.CONDITION, Condition.NORMAL);
            });

            then("`condition` attribute does not exist", () => {
              expect(panel.hasAttribute(Attributes.CONDITION)).toBeFalse();
            });
          });

          and("`panel.condition` is set to `Condition.MINIMIZED`", () => {
            beforeEach(() => {
              panel.condition = Condition.MINIMIZED;
            });

            when("`condition` attribute is set to `invalid`", () => {
              beforeEach(async () => {
                await jasmine.spyOnGlobalErrorsAsync(async () => {
                  panel.setAttribute(Attributes.CONDITION, "invalid");
                });
              });

              then("`condition` attribute is `Condition.MINIMIZED`", () => {
                const value = panel.getAttribute(Attributes.CONDITION);
                expect(value).toBe(Condition.MINIMIZED);
              });
            });
          });

          when("`panel.condition` is set to `invalid`", () => {
            let error: Error;
            beforeEach(() => {
              try {
                // @ts-expect-error
                panel.condition = "invalid";
              } catch (err) {
                error = err as Error;
              }
            });

            then("an error is thrown", () => {
              expect(error).toBeDefined();
            });

            then("error message contains 'Invalid condition value: invalid'", () => {
              expect(error.message).toBe("Invalid condition value: invalid");
            });
          });
        });

        then(
          "the taskbar shows `minimize`, `maximize` and `close`, and hides `restore`",
          () => {
            expect(shown(panel)).toEqual([
              Control.MINIMIZE,
              Control.MAXIMIZE,
              Control.CLOSE
            ]);
          }
        );

        when("`panel.condition` is set to `Condition.MINIMIZED`", () => {
          beforeEach(() => {
            panel.condition = Condition.MINIMIZED;
          });

          then(
            "the taskbar shows `maximize`, `restore` and `close`, and hides `minimize`",
            () => {
              expect(shown(panel)).toEqual([
                Control.MAXIMIZE,
                Control.RESTORE,
                Control.CLOSE
              ]);
            }
          );
        });

        when("`panel.condition` is set to `Condition.MAXIMIZED`", () => {
          beforeEach(() => {
            panel.condition = Condition.MAXIMIZED;
          });

          then(
            "the taskbar shows `minimize`, `restore` and `close`, and hides `maximize`",
            () => {
              expect(shown(panel)).toEqual([
                Control.MINIMIZE,
                Control.RESTORE,
                Control.CLOSE
              ]);
            }
          );

          when("`panel.condition` is set to `Condition.NORMAL`", () => {
            beforeEach(() => {
              panel.condition = Condition.NORMAL;
            });

            then(
              "the taskbar shows `minimize`, `maximize` and `close`, and hides `restore`",
              () => {
                expect(shown(panel)).toEqual([
                  Control.MINIMIZE,
                  Control.MAXIMIZE,
                  Control.CLOSE
                ]);
              }
            );
          });
        });

        and(
          "a panel with `condition` `Condition.MAXIMIZED` in its markup is added to DOM",
          () => {
            let maximized: Panel;
            beforeEach(() => {
              maximized = place(
                `<${Tag} ${Attributes.CONDITION}="${Condition.MAXIMIZED}"></${Tag}>`
              );
            });
            afterEach(() => {
              maximized.remove();
            });

            then("its `condition` is `Condition.MAXIMIZED`", () => {
              expect(maximized.condition).toBe(Condition.MAXIMIZED);
            });

            then(
              "its taskbar shows `minimize`, `restore` and `close`, and hides `maximize`",
              () => {
                expect(shown(maximized)).toEqual([
                  Control.MINIMIZE,
                  Control.RESTORE,
                  Control.CLOSE
                ]);
              }
            );
          }
        );

        and("a panel made with `document.createElement` is added to DOM", () => {
          let created: Panel;
          beforeEach(() => {
            created = add<Panel>(Panel.Tag);
          });
          afterEach(() => {
            created.remove();
          });

          then(
            "its taskbar shows `minimize`, `maximize` and `close`, and hides `restore`",
            () => {
              expect(shown(created)).toEqual([
                Control.MINIMIZE,
                Control.MAXIMIZE,
                Control.CLOSE
              ]);
            }
          );
        });

        when("`panel.condition` is set to `Condition.MAXIMIZED`", () => {
          beforeEach(() => {
            panel.condition = Condition.MAXIMIZED;
          });

          then("the pin in the taskbar is hidden", () => {
            expect(pinOf(panel).visibility).toBe(ControlVisibility.HIDDEN);
          });
        });

        then("the pin in the taskbar is shown", () => {
          expect(pinOf(panel).visibility).toBe(ControlVisibility.VISIBLE);
        });

        when("`panel.condition` is set to `Condition.MINIMIZED`", () => {
          beforeEach(() => {
            panel.condition = Condition.MINIMIZED;
          });

          then("the pin in the taskbar is shown", () => {
            expect(pinOf(panel).visibility).toBe(ControlVisibility.VISIBLE);
          });
        });

        and("a pinned panel is maximized", () => {
          beforeEach(() => {
            panel.status = Status.PINNED;
            panel.condition = Condition.MAXIMIZED;
          });

          then("`panel.status` is `Status.PINNED`", () => {
            expect(panel.status).toBe(Status.PINNED);
          });

          when("`panel.condition` is set to `Condition.NORMAL`", () => {
            beforeEach(() => {
              panel.condition = Condition.NORMAL;
            });

            then("the pin in the taskbar is shown", () => {
              expect(pinOf(panel).visibility).toBe(ControlVisibility.VISIBLE);
            });

            then("the pin in the taskbar is pinned", () => {
              expect(pinOf(panel).status).toBe(PinStatus.PINNED);
            });
          });

          and("`panel.status` is set to `Status.UNPINNED` while it is maximized", () => {
            beforeEach(() => {
              panel.status = Status.UNPINNED;
            });

            then("the pin in the taskbar is hidden", () => {
              expect(pinOf(panel).visibility).toBe(ControlVisibility.HIDDEN);
            });

            when("`panel.condition` is set to `Condition.NORMAL`", () => {
              beforeEach(() => {
                panel.condition = Condition.NORMAL;
              });

              then("the pin in the taskbar is unpinned", () => {
                expect(pinOf(panel).status).toBe(PinStatus.UNPINNED);
              });
            });
          });
        });

        and(
          "a panel with `condition` `Condition.MAXIMIZED` in its markup is added to DOM",
          () => {
            let maximized: Panel;
            beforeEach(() => {
              maximized = place(
                `<${Tag} ${Attributes.CONDITION}="${Condition.MAXIMIZED}"></${Tag}>`
              );
            });
            afterEach(() => {
              maximized.remove();
            });

            then("the pin in its taskbar is hidden", () => {
              expect(pinOf(maximized).visibility).toBe(ControlVisibility.HIDDEN);
            });
          }
        );
      });
    });
  });
});

state(State.STATUS, () => {
  given("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("a HTML Template is added to DOM", () => {
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

        then("`panel.status` getter exists", () => {
          expect(panel.status).toBeDefined();
        });

        when("`panel.status` getter exists", () => {
          then("`panel.status` is `Status.UNPINNED`", () => {
            expect(panel.status).toBe(Status.UNPINNED);
          });
        });

        then("`status` attribute does not exist", () => {
          expect(panel.hasAttribute(Attributes.STATUS)).toBeFalse();
        });

        then("`panel.status` setter exists", () => {
          expect(hasSetter(panel, "status")).toBeTrue();
        });

        and("`panel.status` setter exists", () => {
          when("`panel.status` is set to `Status.PINNED`", () => {
            beforeEach(() => {
              panel.status = Status.PINNED;
            });

            then("`panel.status` is `Status.PINNED`", () => {
              expect(panel.status).toBe(Status.PINNED);
            });

            then("panel `status` attribute is `Status.PINNED`", () => {
              const value = panel.getAttribute(Attributes.STATUS);
              expect(value).toBe(Status.PINNED);
            });

            when("`panel.status` is set to `Status.UNPINNED`", () => {
              beforeEach(() => {
                panel.status = Status.UNPINNED;
              });

              then("`status` attribute does not exist", () => {
                expect(panel.hasAttribute(Attributes.STATUS)).toBeFalse();
              });
            });
          });

          when("`panel.status` is set to `null`", () => {
            beforeEach(() => {
              panel.status = null;
            });

            then("`panel.status` is `Status.UNPINNED`", () => {
              expect(panel.status).toBe(Status.UNPINNED);
            });
          });

          when("`status` attribute is set to `Status.PINNED`", () => {
            beforeEach(() => {
              panel.setAttribute(Attributes.STATUS, Status.PINNED);
            });

            then("`panel.status` is `Status.PINNED`", () => {
              expect(panel.status).toBe(Status.PINNED);
            });
          });

          when("`status` attribute is set to `invalid`", () => {
            let error: Error;
            beforeEach(async () => {
              await jasmine.spyOnGlobalErrorsAsync(async (reported) => {
                panel.setAttribute(Attributes.STATUS, "invalid");
                error = reported.calls.mostRecent()?.args[0];
              });
            });

            then("`status` attribute does not exist", () => {
              expect(panel.hasAttribute(Attributes.STATUS)).toBeFalse();
            });

            then("`panel.status` is `Status.UNPINNED`", () => {
              expect(panel.status).toBe(Status.UNPINNED);
            });

            then("an error is reported", () => {
              expect(error).toBeDefined();
            });

            then("error message contains 'Invalid status value: invalid'", () => {
              expect(error.message).toBe("Invalid status value: invalid");
            });
          });

          when("`status` attribute is set to `Status.UNPINNED`", () => {
            beforeEach(() => {
              panel.setAttribute(Attributes.STATUS, Status.UNPINNED);
            });

            then("`status` attribute does not exist", () => {
              expect(panel.hasAttribute(Attributes.STATUS)).toBeFalse();
            });
          });

          and("`panel.status` is set to `Status.PINNED`", () => {
            beforeEach(() => {
              panel.status = Status.PINNED;
            });

            when("`status` attribute is set to `invalid`", () => {
              beforeEach(async () => {
                await jasmine.spyOnGlobalErrorsAsync(async () => {
                  panel.setAttribute(Attributes.STATUS, "invalid");
                });
              });

              then("`status` attribute is `Status.PINNED`", () => {
                const value = panel.getAttribute(Attributes.STATUS);
                expect(value).toBe(Status.PINNED);
              });
            });
          });

          when("`panel.status` is set to `invalid`", () => {
            let error: Error;
            beforeEach(() => {
              try {
                // @ts-expect-error
                panel.status = "invalid";
              } catch (err) {
                error = err as Error;
              }
            });

            then("an error is thrown", () => {
              expect(error).toBeDefined();
            });

            then("error message contains 'Invalid status value: invalid'", () => {
              expect(error.message).toBe("Invalid status value: invalid");
            });
          });
        });

        when("`panel.status` is set to `Status.PINNED`", () => {
          beforeEach(() => {
            panel.status = Status.PINNED;
          });

          then("the pin in the taskbar shows pinned", () => {
            expect(pinOf(panel).status).toBe(PinStatus.PINNED);
          });
        });

        and(
          "a panel with `status` `Status.PINNED` in its markup is added to DOM",
          () => {
            let pinned: Panel;
            beforeEach(() => {
              pinned = place(
                `<${Tag} ${Attributes.STATUS}="${Status.PINNED}"></${Tag}>`
              );
            });
            afterEach(() => {
              pinned.remove();
            });

            then("its `status` is `Status.PINNED`", () => {
              expect(pinned.status).toBe(Status.PINNED);
            });

            then("the pin in its taskbar shows pinned", () => {
              expect(pinOf(pinned).status).toBe(PinStatus.PINNED);
            });
          }
        );

        and("`panel.status` is set to `Status.PINNED`", () => {
          beforeEach(() => {
            panel.status = Status.PINNED;
          });

          when("`panel.status` is set to `Status.UNPINNED`", () => {
            beforeEach(() => {
              panel.status = Status.UNPINNED;
            });

            then("the pin in the taskbar shows unpinned", () => {
              expect(pinOf(panel).status).toBe(PinStatus.UNPINNED);
            });
          });

          when("the panel is removed from DOM and added again", () => {
            beforeEach(() => {
              panel.remove();
              document.body.appendChild(panel);
            });

            then("`panel.status` is `Status.PINNED`", () => {
              expect(panel.status).toBe(Status.PINNED);
            });

            then("the pin in the taskbar shows pinned", () => {
              expect(pinOf(panel).status).toBe(PinStatus.PINNED);
            });
          });
        });
      });
    });
  });
});

state(State.VISIBILITY, () => {
  given("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("a HTML Template is added to DOM", () => {
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

        then("`panel.visibility` getter exists", () => {
          expect(panel.visibility).toBeDefined();
        });

        when("`panel.visibility` getter exists", () => {
          then("`panel.visibility` is `Visibility.VISIBLE`", () => {
            expect(panel.visibility).toBe(Visibility.VISIBLE);
          });
        });

        then("`visibility` attribute does not exist", () => {
          expect(panel.hasAttribute(Attributes.VISIBILITY)).toBeFalse();
        });

        then("`panel.visibility` setter exists", () => {
          expect(hasSetter(panel, "visibility")).toBeTrue();
        });

        and("`panel.visibility` setter exists", () => {
          when("`panel.visibility` is set to `Visibility.HIDDEN`", () => {
            beforeEach(() => {
              panel.visibility = Visibility.HIDDEN;
            });

            then("`panel.visibility` is `Visibility.HIDDEN`", () => {
              expect(panel.visibility).toBe(Visibility.HIDDEN);
            });

            then("panel `visibility` attribute is `Visibility.HIDDEN`", () => {
              const value = panel.getAttribute(Attributes.VISIBILITY);
              expect(value).toBe(Visibility.HIDDEN);
            });

            when("`panel.visibility` is set to `Visibility.VISIBLE`", () => {
              beforeEach(() => {
                panel.visibility = Visibility.VISIBLE;
              });

              then("`visibility` attribute does not exist", () => {
                expect(panel.hasAttribute(Attributes.VISIBILITY)).toBeFalse();
              });
            });
          });

          when("`panel.visibility` is set to `null`", () => {
            beforeEach(() => {
              panel.visibility = null;
            });

            then("`panel.visibility` is `Visibility.VISIBLE`", () => {
              expect(panel.visibility).toBe(Visibility.VISIBLE);
            });
          });

          when("`visibility` attribute is set to `Visibility.HIDDEN`", () => {
            beforeEach(() => {
              panel.setAttribute(Attributes.VISIBILITY, Visibility.HIDDEN);
            });

            then("`panel.visibility` is `Visibility.HIDDEN`", () => {
              expect(panel.visibility).toBe(Visibility.HIDDEN);
            });
          });

          when("`visibility` attribute is set to `invalid`", () => {
            let error: Error;
            beforeEach(async () => {
              await jasmine.spyOnGlobalErrorsAsync(async (reported) => {
                panel.setAttribute(Attributes.VISIBILITY, "invalid");
                error = reported.calls.mostRecent()?.args[0];
              });
            });

            then("`visibility` attribute does not exist", () => {
              expect(panel.hasAttribute(Attributes.VISIBILITY)).toBeFalse();
            });

            then("`panel.visibility` is `Visibility.VISIBLE`", () => {
              expect(panel.visibility).toBe(Visibility.VISIBLE);
            });

            then("an error is reported", () => {
              expect(error).toBeDefined();
            });

            then("error message contains 'Invalid visibility value: invalid'", () => {
              expect(error.message).toBe("Invalid visibility value: invalid");
            });
          });

          when("`visibility` attribute is set to `Visibility.VISIBLE`", () => {
            beforeEach(() => {
              panel.setAttribute(Attributes.VISIBILITY, Visibility.VISIBLE);
            });

            then("`visibility` attribute does not exist", () => {
              expect(panel.hasAttribute(Attributes.VISIBILITY)).toBeFalse();
            });
          });

          and("`panel.visibility` is set to `Visibility.HIDDEN`", () => {
            beforeEach(() => {
              panel.visibility = Visibility.HIDDEN;
            });

            when("`visibility` attribute is set to `invalid`", () => {
              beforeEach(async () => {
                await jasmine.spyOnGlobalErrorsAsync(async () => {
                  panel.setAttribute(Attributes.VISIBILITY, "invalid");
                });
              });

              then("`visibility` attribute is `Visibility.HIDDEN`", () => {
                const value = panel.getAttribute(Attributes.VISIBILITY);
                expect(value).toBe(Visibility.HIDDEN);
              });
            });
          });

          when("`panel.visibility` is set to `invalid`", () => {
            let error: Error;
            beforeEach(() => {
              try {
                // @ts-expect-error
                panel.visibility = "invalid";
              } catch (err) {
                error = err as Error;
              }
            });

            then("an error is thrown", () => {
              expect(error).toBeDefined();
            });

            then("error message contains 'Invalid visibility value: invalid'", () => {
              expect(error.message).toBe("Invalid visibility value: invalid");
            });
          });
        });
      });
    });
  });
});

// Data

data(Datum.POSITION, () => {
  and("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("a HTML Template is added to DOM", () => {
      beforeEach(async () => {
        await Panel.Template.load("panel.template.html");
      });
      afterEach(() => {
        remove(Panel.Tag);
      });

      and("a new panel, 480 wide and 320 high, is added to DOM", () => {
        let panel: Panel;
        beforeEach(async () => {
          panel = place(SIZED);
          await styled(panel);
        });
        afterEach(() => {
          panel.remove();
        });

        then("`panel.position` getter exists", () => {
          expect("position" in panel).toBeTrue();
        });

        then("`panel.position` is `null`", () => {
          expect(panel.position).toBeNull();
        });

        and("a panel that is never added to DOM", () => {
          let apart: Panel;
          beforeEach(() => {
            apart = document.createElement(Panel.Tag) as Panel;
          });

          then("its `position` is `null`", () => {
            expect(apart.position).toBeNull();
          });

          and("its `position` is set to `{ left: 120, top: 80 }`", () => {
            beforeEach(() => {
              apart.position = { left: 120, top: 80 };
            });

            when("it is added to DOM", () => {
              beforeEach(() => {
                document.body.appendChild(apart);
              });
              afterEach(() => {
                apart.remove();
              });

              then("its `position` equals `{ left: 120, top: 80 }`", () => {
                expect(apart.position).toEqual({ left: 120, top: 80 });
              });

              then("it is placed 120 from the left and 80 from the top", () => {
                expect([apart.style.left, apart.style.top]).toEqual(["120px", "80px"]);
              });
            });
          });
        });

        then("`panel.position` setter exists", () => {
          expect(hasSetter(panel, "position")).toBeTrue();
        });

        and("`panel.position` setter exists, and `place` is `{ left: 120, top: 80 }`", () => {
          let place: Position;
          beforeEach(() => {
            place = { left: 120, top: 80 };
          });

          when("`panel.position` is set to `place`", () => {
            beforeEach(() => {
              panel.position = place;
            });

            then("`panel.position` equals `place`", () => {
              expect(panel.position).toEqual({ left: 120, top: 80 });
            });

            then("`panel.position` is a copy, not `place` itself", () => {
              expect(panel.position).not.toBe(place);
            });

            then("`panel.position` is frozen", () => {
              expect(Object.isFrozen(panel.position)).toBeTrue();
            });

            when("`place.left` is changed afterwards", () => {
              beforeEach(() => {
                place.left = 500;
              });

              then("`panel.position.left` is still 120", () => {
                expect(panel.position?.left).toBe(120);
              });
            });

            when("`panel.position.left` is assigned", () => {
              let error: unknown;
              beforeEach(() => {
                try {
                  (panel.position as Position).left = 500;
                } catch (err) {
                  error = err;
                }
              });

              then("a `TypeError` is thrown", () => {
                expect(error).toEqual(jasmine.any(TypeError));
              });

              then("`panel.position.left` is still 120", () => {
                expect(panel.position?.left).toBe(120);
              });
            });

            then("the panel is placed 120 from the left", () => {
              expect(panel.style.left).toBe("120px");
            });

            then("the panel is placed 80 from the top", () => {
              expect(panel.style.top).toBe("80px");
            });

            then("`panel.condition`, `panel.status` and `panel.visibility` are as they were", () => {
              expect(panel.condition).toBe(Condition.NORMAL);
              expect(panel.status).toBe(Status.UNPINNED);
              expect(panel.visibility).toBe(Visibility.VISIBLE);
            });

            when("the panel is removed from DOM and added again", () => {
              beforeEach(() => {
                panel.remove();
                document.body.appendChild(panel);
              });

              then("`panel.position` equals `place`", () => {
                expect(panel.position).toEqual({ left: 120, top: 80 });
              });

              then("the panel is placed 120 from the left and 80 from the top", () => {
                expect([panel.style.left, panel.style.top]).toEqual(["120px", "80px"]);
              });
            });

            when("`panel.position` is set to a position without `top`", () => {
              let error: Error;
              beforeEach(() => {
                try {
                  // @ts-expect-error: `top` is required
                  panel.position = { left: 5 };
                } catch (err) {
                  error = err as Error;
                }
              });

              then("an error is thrown", () => {
                expect(error).toBeDefined();
              });

              then("error message contains 'Invalid position value: top is required'", () => {
                expect(error.message).toBe("Invalid position value: top is required");
              });

              then("`panel.position` equals `place` still", () => {
                expect(panel.position).toEqual({ left: 120, top: 80 });
              });
            });
          });

          when("`panel.position` is set to `null`", () => {
            let error: Error;
            beforeEach(() => {
              try {
                (panel as { position: unknown }).position = null;
              } catch (err) {
                error = err as Error;
              }
            });

            then("an error is thrown", () => {
              expect(error).toBeDefined();
            });

            then("error message contains 'Invalid position value: null'", () => {
              expect(error.message).toBe("Invalid position value: null");
            });

            then("`panel.position` is `null` still", () => {
              expect(panel.position).toBeNull();
            });
          });

          then("assigning `null` to `panel.position` does not compile", () => {
            const assign = () => {
              // @ts-expect-error: the setter of `position` does not accept `null`
              panel.position = null;
            };
            expect(assign).toEqual(jasmine.any(Function));
          });
        });
      });
    });
  });
});

data(Datum.DIMENSIONS, () => {
  and("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("a HTML Template is added to DOM", () => {
      beforeEach(async () => {
        await Panel.Template.load("panel.template.html");
      });
      afterEach(() => {
        remove(Panel.Tag);
      });

      and("a new panel, 480 wide and 320 high, is added to DOM", () => {
        let panel: Panel;
        beforeEach(async () => {
          panel = place(SIZED);
          await styled(panel);
        });
        afterEach(() => {
          panel.remove();
        });

        then("`panel.dimensions` getter exists", () => {
          expect("dimensions" in panel).toBeTrue();
        });

        then("`panel.dimensions` is `null`", () => {
          expect(panel.dimensions).toBeNull();
        });

        and("a panel that is never added to DOM", () => {
          let apart: Panel;
          beforeEach(() => {
            apart = document.createElement(Panel.Tag) as Panel;
          });

          then("its `dimensions` is `null`", () => {
            expect(apart.dimensions).toBeNull();
          });

          and("its `dimensions` is set to `{ width: 120, height: 80 }`", () => {
            beforeEach(() => {
              apart.dimensions = { width: 120, height: 80 };
            });

            when("it is added to DOM", () => {
              beforeEach(() => {
                document.body.appendChild(apart);
              });
              afterEach(() => {
                apart.remove();
              });

              then("its `dimensions` equals `{ width: 120, height: 80 }`", () => {
                expect(apart.dimensions).toEqual({ width: 120, height: 80 });
              });

              then("it is 120 wide and 80 high", () => {
                expect([apart.style.width, apart.style.height]).toEqual(["120px", "80px"]);
              });
            });
          });
        });

        then("`panel.dimensions` setter exists", () => {
          expect(hasSetter(panel, "dimensions")).toBeTrue();
        });

        and("`panel.dimensions` setter exists, and `size` is `{ width: 120, height: 80 }`", () => {
          let size: Dimensions;
          beforeEach(() => {
            size = { width: 120, height: 80 };
          });

          when("`panel.dimensions` is set to `size`", () => {
            beforeEach(() => {
              panel.dimensions = size;
            });

            then("`panel.dimensions` equals `size`", () => {
              expect(panel.dimensions).toEqual({ width: 120, height: 80 });
            });

            then("`panel.dimensions` is a copy, not `size` itself", () => {
              expect(panel.dimensions).not.toBe(size);
            });

            then("`panel.dimensions` is frozen", () => {
              expect(Object.isFrozen(panel.dimensions)).toBeTrue();
            });

            when("`size.width` is changed afterwards", () => {
              beforeEach(() => {
                size.width = 500;
              });

              then("`panel.dimensions.width` is still 120", () => {
                expect(panel.dimensions?.width).toBe(120);
              });
            });

            when("`panel.dimensions.width` is assigned", () => {
              let error: unknown;
              beforeEach(() => {
                try {
                  (panel.dimensions as Dimensions).width = 500;
                } catch (err) {
                  error = err;
                }
              });

              then("a `TypeError` is thrown", () => {
                expect(error).toEqual(jasmine.any(TypeError));
              });

              then("`panel.dimensions.width` is still 120", () => {
                expect(panel.dimensions?.width).toBe(120);
              });
            });

            then("the panel is 120 wide", () => {
              expect(panel.style.width).toBe("120px");
            });

            then("the panel is 80 high", () => {
              expect(panel.style.height).toBe("80px");
            });

            then("`panel.condition`, `panel.status` and `panel.visibility` are as they were", () => {
              expect(panel.condition).toBe(Condition.NORMAL);
              expect(panel.status).toBe(Status.UNPINNED);
              expect(panel.visibility).toBe(Visibility.VISIBLE);
            });

            when("the panel is removed from DOM and added again", () => {
              beforeEach(() => {
                panel.remove();
                document.body.appendChild(panel);
              });

              then("`panel.dimensions` equals `size`", () => {
                expect(panel.dimensions).toEqual({ width: 120, height: 80 });
              });

              then("the panel is 120 wide and 80 high", () => {
                expect([panel.style.width, panel.style.height]).toEqual(["120px", "80px"]);
              });
            });

            when("`panel.dimensions` is set to dimensions without `height`", () => {
              let error: Error;
              beforeEach(() => {
                try {
                  // @ts-expect-error: `height` is required
                  panel.dimensions = { width: 5 };
                } catch (err) {
                  error = err as Error;
                }
              });

              then("an error is thrown", () => {
                expect(error).toBeDefined();
              });

              then("error message contains 'Invalid dimensions value: height is required'", () => {
                expect(error.message).toBe("Invalid dimensions value: height is required");
              });

              then("`panel.dimensions` equals `size` still", () => {
                expect(panel.dimensions).toEqual({ width: 120, height: 80 });
              });
            });
          });

          when("`panel.dimensions` is set to `null`", () => {
            let error: Error;
            beforeEach(() => {
              try {
                (panel as { dimensions: unknown }).dimensions = null;
              } catch (err) {
                error = err as Error;
              }
            });

            then("an error is thrown", () => {
              expect(error).toBeDefined();
            });

            then("error message contains 'Invalid dimensions value: null'", () => {
              expect(error.message).toBe("Invalid dimensions value: null");
            });

            then("`panel.dimensions` is `null` still", () => {
              expect(panel.dimensions).toBeNull();
            });
          });

          then("assigning `null` to `panel.dimensions` does not compile", () => {
            const assign = () => {
              // @ts-expect-error: the setter of `dimensions` does not accept `null`
              panel.dimensions = null;
            };
            expect(assign).toEqual(jasmine.any(Function));
          });
        });
      });
    });
  });
});

// Operation

operation(Operation.HIDE, () => {
  and("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("a HTML Template is added to DOM", () => {
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

        then("`panel.hide` method exists", () => {
          expect(panel.hide).toBeDefined();
        });

        and("`panel.hide` method exists", () => {
          when("invoking `panel.hide`", () => {
            let result: unknown;
            beforeEach(() => {
              result = panel.hide();
            });

            then("`panel.visibility` is `Visibility.HIDDEN`", () => {
              expect(panel.visibility).toBe(Visibility.HIDDEN);
            });

            then("`panel.hide` returns nothing", () => {
              expect(result).toBeUndefined();
            });
          });
        });
      });
    });
  });
});

operation(Operation.SHOW, () => {
  and("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("a HTML Template is added to DOM", () => {
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

        then("`panel.show` method exists", () => {
          expect(panel.show).toBeDefined();
        });

        and("`panel.show` method exists", () => {
          and("`panel.visibility` is `Visibility.HIDDEN`", () => {
            beforeEach(() => {
              panel.visibility = Visibility.HIDDEN;
            });

            when("invoking `panel.show`", () => {
              let result: unknown;
              beforeEach(() => {
                result = panel.show();
              });

              then("`panel.visibility` is `Visibility.VISIBLE`", () => {
                expect(panel.visibility).toBe(Visibility.VISIBLE);
              });

              then("`panel.show` returns nothing", () => {
                expect(result).toBeUndefined();
              });
            });
          });

          and("the panel is minimized and pinned", () => {
            beforeEach(() => {
              panel.condition = Condition.MINIMIZED;
              panel.status = Status.PINNED;
            });

            when("invoking `panel.hide`, then `panel.show`", () => {
              beforeEach(() => {
                panel.hide();
                panel.show();
              });

              then("`panel.condition` is `Condition.MINIMIZED`", () => {
                expect(panel.condition).toBe(Condition.MINIMIZED);
              });

              then("`panel.status` is `Status.PINNED`", () => {
                expect(panel.status).toBe(Status.PINNED);
              });

              then("the taskbar shows `maximize`, `restore` and `close`", () => {
                expect(shown(panel)).toEqual([
                  Control.MAXIMIZE,
                  Control.RESTORE,
                  Control.CLOSE
                ]);
              });

              then("the pin in the taskbar is pinned", () => {
                expect(pinOf(panel).status).toBe(PinStatus.PINNED);
              });
            });
          });
        });
      });
    });
  });
});

operation(Operation.PIN, () => {
  and("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("a HTML Template is added to DOM", () => {
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

        then("`panel.pin` method exists", () => {
          expect(panel.pin).toBeDefined();
        });

        and("`panel.pin` method exists", () => {
          and("`panel.status` is `Status.UNPINNED`", () => {
            beforeEach(() => {
              panel.status = Status.UNPINNED;
            });

            when("invoking `panel.pin`", () => {
              let result: unknown;
              beforeEach(() => {
                result = panel.pin();
              });

              then("`panel.status` is `Status.PINNED`", () => {
                expect(panel.status).toBe(Status.PINNED);
              });

              then("`panel.pin` returns nothing", () => {
                expect(result).toBeUndefined();
              });

              then("the pin in the taskbar is pinned", () => {
                expect(pinOf(panel).status).toBe(PinStatus.PINNED);
              });
            });
          });
        });
      });
    });
  });
});

operation(Operation.UNPIN, () => {
  and("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("a HTML Template is added to DOM", () => {
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

        then("`panel.unpin` method exists", () => {
          expect(panel.unpin).toBeDefined();
        });

        and("`panel.unpin` method exists", () => {
          and("`panel.status` is `Status.PINNED`", () => {
            beforeEach(() => {
              panel.status = Status.PINNED;
            });

            when("invoking `panel.unpin`", () => {
              let result: unknown;
              beforeEach(() => {
                result = panel.unpin();
              });

              then("`panel.status` is `Status.UNPINNED`", () => {
                expect(panel.status).toBe(Status.UNPINNED);
              });

              then("`panel.unpin` returns nothing", () => {
                expect(result).toBeUndefined();
              });

              then("the pin in the taskbar is unpinned", () => {
                expect(pinOf(panel).status).toBe(PinStatus.UNPINNED);
              });
            });
          });
        });
      });
    });
  });
});

operation(Operation.MINIMIZE, () => {
  and("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("a HTML Template is added to DOM", () => {
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

        then("`panel.minimize` method exists", () => {
          expect(panel.minimize).toBeDefined();
        });

        and("`panel.minimize` method exists", () => {
          and("`panel.condition` is `Condition.NORMAL`", () => {
            beforeEach(() => {
              panel.condition = Condition.NORMAL;
            });

            when("invoking `panel.minimize`", () => {
              let result: unknown;
              beforeEach(() => {
                result = panel.minimize();
              });

              then("`panel.condition` is `Condition.MINIMIZED`", () => {
                expect(panel.condition).toBe(Condition.MINIMIZED);
              });

              then("`panel.minimize` returns nothing", () => {
                expect(result).toBeUndefined();
              });

              then("the taskbar shows `maximize`, `restore`, `close`", () => {
                expect(shown(panel)).toEqual([
                  Control.MAXIMIZE,
                  Control.RESTORE,
                  Control.CLOSE
                ]);
              });
            });
          });
        });
      });
    });
  });
});

operation(Operation.MAXIMIZE, () => {
  and("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("a HTML Template is added to DOM", () => {
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

        then("`panel.maximize` method exists", () => {
          expect(panel.maximize).toBeDefined();
        });

        and("`panel.maximize` method exists", () => {
          and("`panel.condition` is `Condition.NORMAL`", () => {
            beforeEach(() => {
              panel.condition = Condition.NORMAL;
            });

            when("invoking `panel.maximize`", () => {
              let result: unknown;
              beforeEach(() => {
                result = panel.maximize();
              });

              then("`panel.condition` is `Condition.MAXIMIZED`", () => {
                expect(panel.condition).toBe(Condition.MAXIMIZED);
              });

              then("`panel.maximize` returns nothing", () => {
                expect(result).toBeUndefined();
              });

              then("the taskbar shows `minimize`, `restore`, `close`", () => {
                expect(shown(panel)).toEqual([
                  Control.MINIMIZE,
                  Control.RESTORE,
                  Control.CLOSE
                ]);
              });
            });
          });
        });
      });
    });
  });
});

operation(Operation.RESTORE, () => {
  and("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("a HTML Template is added to DOM", () => {
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

        then("`panel.restore` method exists", () => {
          expect(panel.restore).toBeDefined();
        });

        and("`panel.restore` method exists", () => {
          and("`panel.condition` is `Condition.MAXIMIZED`", () => {
            beforeEach(() => {
              panel.condition = Condition.MAXIMIZED;
            });

            when("invoking `panel.restore`", () => {
              let result: unknown;
              beforeEach(() => {
                result = panel.restore();
              });

              then("`panel.condition` is `Condition.NORMAL`", () => {
                expect(panel.condition).toBe(Condition.NORMAL);
              });

              then("`panel.restore` returns nothing", () => {
                expect(result).toBeUndefined();
              });

              then("the taskbar shows `minimize`, `maximize`, `close`", () => {
                expect(shown(panel)).toEqual([
                  Control.MINIMIZE,
                  Control.MAXIMIZE,
                  Control.CLOSE
                ]);
              });
            });
          });

          and("a maximized panel is minimized", () => {
            beforeEach(() => {
              panel.condition = Condition.MAXIMIZED;
              panel.minimize();
            });

            when("invoking `panel.restore`", () => {
              beforeEach(() => {
                panel.restore();
              });

              then("`panel.condition` is `Condition.MAXIMIZED`", () => {
                expect(panel.condition).toBe(Condition.MAXIMIZED);
              });

              when("invoking `panel.restore` again", () => {
                beforeEach(() => {
                  panel.restore();
                });

                then("`panel.condition` is `Condition.NORMAL`", () => {
                  expect(panel.condition).toBe(Condition.NORMAL);
                });
              });
            });
          });

          and("a normal panel is minimized", () => {
            beforeEach(() => {
              panel.minimize();
            });

            when("invoking `panel.restore`", () => {
              beforeEach(() => {
                panel.restore();
              });

              then("`panel.condition` is `Condition.NORMAL`", () => {
                expect(panel.condition).toBe(Condition.NORMAL);
              });
            });
          });

          and("a maximized panel is minimized by its `condition` attribute", () => {
            beforeEach(() => {
              panel.setAttribute(Attributes.CONDITION, Condition.MAXIMIZED);
              panel.setAttribute(Attributes.CONDITION, Condition.MINIMIZED);
            });

            when("invoking `panel.restore`", () => {
              beforeEach(() => {
                panel.restore();
              });

              then("`panel.condition` is `Condition.MAXIMIZED`", () => {
                expect(panel.condition).toBe(Condition.MAXIMIZED);
              });
            });
          });

          and("a minimized panel is maximized", () => {
            beforeEach(() => {
              panel.minimize();
              panel.maximize();
            });

            when("invoking `panel.restore`", () => {
              beforeEach(() => {
                panel.restore();
              });

              then("`panel.condition` is `Condition.NORMAL`", () => {
                expect(panel.condition).toBe(Condition.NORMAL);
              });
            });
          });

          and("a panel is maximized, minimized, restored twice and minimized again", () => {
            beforeEach(() => {
              panel.maximize();
              panel.minimize();
              panel.restore();
              panel.restore();
              panel.minimize();
            });

            when("invoking `panel.restore`", () => {
              beforeEach(() => {
                panel.restore();
              });

              then("`panel.condition` is `Condition.NORMAL`", () => {
                expect(panel.condition).toBe(Condition.NORMAL);
              });
            });
          });

          and("`panel.condition` is `Condition.NORMAL`", () => {
            beforeEach(() => {
              panel.condition = Condition.NORMAL;
            });

            when("invoking `panel.restore`", () => {
              beforeEach(() => {
                panel.restore();
              });

              then("`panel.condition` is `Condition.NORMAL`", () => {
                expect(panel.condition).toBe(Condition.NORMAL);
              });
            });
          });

          and(
            "a panel with `condition` `Condition.MINIMIZED` in its markup is added to DOM",
            () => {
              let minimized: Panel;
              beforeEach(() => {
                minimized = place(
                  `<${Tag} ${Attributes.CONDITION}="${Condition.MINIMIZED}"></${Tag}>`
                );
              });
              afterEach(() => {
                minimized.remove();
              });

              when("invoking `restore` on it", () => {
                beforeEach(() => {
                  minimized.restore();
                });

                then("its `condition` is `Condition.NORMAL`", () => {
                  expect(minimized.condition).toBe(Condition.NORMAL);
                });
              });
            }
          );
        });
      });
    });
  });
});

operation(Operation.CLOSE, () => {
  and("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("a HTML Template is added to DOM", () => {
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

        then("`panel.close` method exists", () => {
          expect(panel.close).toBeDefined();
        });

        and("`panel.close` method exists", () => {
          then("the panel is in the page", () => {
            expect(panel.isConnected).toBeTrue();
          });

          when("invoking `panel.close`", () => {
            let result: unknown;
            beforeEach(() => {
              result = panel.close();
            });

            then("the panel is removed from the page", () => {
              expect(panel.isConnected).toBeFalse();
            });

            then("`panel.close` returns nothing", () => {
              expect(result).toBeUndefined();
            });

            then("the taskbar still holds its five controls", () => {
              const taskbar = panel.root.querySelector(Taskbar.Tag) as Taskbar;
              const controls = [
                taskbar.pin,
                taskbar.minimize,
                taskbar.maximize,
                taskbar.restore,
                taskbar.close
              ];
              expect(controls.every((control) => !!control?.parentNode)).toBeTrue();
            });

            then("the taskbar is still in the panel", () => {
              expect(panel.root.querySelector(Taskbar.Tag)).not.toBeNull();
            });
          });

          and("`panel.condition` is `Condition.NORMAL`", () => {
            beforeEach(() => {
              panel.condition = Condition.NORMAL;
            });

            then("the taskbar shows `close`", () => {
              expect(shown(panel)).toEqual([
                Control.MINIMIZE,
                Control.MAXIMIZE,
                Control.CLOSE
              ]);
            });

            when("the end user clicks `close` in the taskbar", () => {
              beforeEach(() => {
                click(panel, Control.CLOSE);
              });

              then("the panel is removed from the page", () => {
                expect(panel.isConnected).toBeFalse();
              });
            });
          });

          and("`panel.condition` is `Condition.MINIMIZED`", () => {
            beforeEach(() => {
              panel.condition = Condition.MINIMIZED;
            });

            then("the taskbar shows `close`", () => {
              expect(shown(panel)).toEqual([
                Control.MAXIMIZE,
                Control.RESTORE,
                Control.CLOSE
              ]);
            });

            when("the end user clicks `close` in the taskbar", () => {
              beforeEach(() => {
                click(panel, Control.CLOSE);
              });

              then("the panel is removed from the page", () => {
                expect(panel.isConnected).toBeFalse();
              });
            });
          });

          and("`panel.condition` is `Condition.MAXIMIZED`", () => {
            beforeEach(() => {
              panel.condition = Condition.MAXIMIZED;
            });

            then("the taskbar shows `close`", () => {
              expect(shown(panel)).toEqual([
                Control.MINIMIZE,
                Control.RESTORE,
                Control.CLOSE
              ]);
            });

            when("the end user clicks `close` in the taskbar", () => {
              beforeEach(() => {
                click(panel, Control.CLOSE);
              });

              then("the panel is removed from the page", () => {
                expect(panel.isConnected).toBeFalse();
              });
            });
          });
        });
      });
    });
  });
});

// Event

events(Event.ON_HIDE, () => {
  and("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("a HTML Template is added to DOM", () => {
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

        then("`panel.onhide` setter exists", () => {
          expect(hasSetter(panel, Event.ON_HIDE)).toBeTrue();
        });

        and("`panel.onhide` setter exists", () => {
          and("`panel.onhide` is set to a listener", () => {
            let onhide: jasmine.Spy;
            beforeEach(() => {
              onhide = jasmine.createSpy("onhide");
              panel.onhide = onhide;
            });
            afterEach(() => {
              panel.onhide = null;
            });

            when("`panel.visibility` is set to `Visibility.HIDDEN`", () => {
              beforeEach(() => {
                panel.visibility = Visibility.HIDDEN;
              });

              then("`panel.onhide` is called", () => {
                expect(onhide).toHaveBeenCalled();
              });

              then(
                "`panel.onhide` is called with `{ detail: { visibility: Visibility.HIDDEN } }`",
                () => {
                  const message = {
                    detail: { visibility: Visibility.HIDDEN }
                  };
                  expect(onhide).toHaveBeenCalledWith(
                    jasmine.objectContaining(message)
                  );
                }
              );
            });

            when("`panel.visibility` is set to `Visibility.HIDDEN` twice", () => {
              beforeEach(() => {
                panel.visibility = Visibility.HIDDEN;
                panel.visibility = Visibility.HIDDEN;
              });

              then("`panel.onhide` is called once", () => {
                expect(onhide).toHaveBeenCalledTimes(1);
              });
            });

            when("`panel.onhide` is set to `invalid`", () => {
              let error: Error;
              beforeEach(() => {
                try {
                  // @ts-expect-error
                  panel.onhide = "invalid";
                } catch (err) {
                  error = err as Error;
                }
              });

              then("an error is thrown", () => {
                expect(error).toBeDefined();
              });

              then("error message contains 'Invalid onhide value: invalid'", () => {
                expect(error.message).toBe("Invalid onhide value: invalid");
              });

              when("`panel.visibility` is set to `Visibility.HIDDEN`", () => {
                beforeEach(() => {
                  panel.visibility = Visibility.HIDDEN;
                });

                then("`panel.onhide` is still called", () => {
                  expect(onhide).toHaveBeenCalled();
                });
              });
            });

            and("`panel.onhide` is set to a new listener", () => {
              let onhide2: jasmine.Spy;
              beforeEach(() => {
                onhide2 = jasmine.createSpy("onhide2");
                panel.onhide = onhide2;
              });
              afterEach(() => {
                panel.onhide = null;
              });

              when("`panel.visibility` is set to `Visibility.HIDDEN`", () => {
                beforeEach(() => {
                  panel.visibility = Visibility.HIDDEN;
                });

                then("old `panel.onhide` is not called", () => {
                  expect(onhide).not.toHaveBeenCalled();
                });

                then("new `panel.onhide` is called", () => {
                  expect(onhide2).toHaveBeenCalled();
                });
              });
            });

            when("invoking `panel.hide`", () => {
              beforeEach(() => {
                panel.hide();
              });

              then("`panel.onhide` is called once", () => {
                expect(onhide).toHaveBeenCalledTimes(1);
              });
            });

            when("`visibility` attribute is set to `Visibility.HIDDEN`", () => {
              beforeEach(() => {
                panel.setAttribute(Attributes.VISIBILITY, Visibility.HIDDEN);
              });

              then("`panel.visibility` is `Visibility.HIDDEN`", () => {
                expect(panel.visibility).toBe(Visibility.HIDDEN);
              });

              then("`panel.onhide` is called once", () => {
                expect(onhide).toHaveBeenCalledTimes(1);
              });
            });
          });
        });
      });
    });
  });
});

events(Event.ON_SHOW, () => {
  and("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("a HTML Template is added to DOM", () => {
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

        then("`panel.onshow` setter exists", () => {
          expect(hasSetter(panel, Event.ON_SHOW)).toBeTrue();
        });

        and("`panel.onshow` setter exists", () => {
          and("`panel.visibility` is set to `Visibility.HIDDEN`", () => {
            beforeEach(() => {
              panel.visibility = Visibility.HIDDEN;
            });

            and("`panel.onshow` is set to a listener", () => {
              let onshow: jasmine.Spy;
              beforeEach(() => {
                onshow = jasmine.createSpy("onshow");
                panel.onshow = onshow;
              });
              afterEach(() => {
                panel.onshow = null;
              });

              when("`panel.visibility` is set to `Visibility.VISIBLE`", () => {
                beforeEach(() => {
                  panel.visibility = Visibility.VISIBLE;
                });

                then("`panel.onshow` is called", () => {
                  expect(onshow).toHaveBeenCalled();
                });

                then(
                  "`panel.onshow` is called with `{ detail: { visibility: Visibility.VISIBLE } }`",
                  () => {
                    const message = {
                      detail: { visibility: Visibility.VISIBLE }
                    };
                    expect(onshow).toHaveBeenCalledWith(
                      jasmine.objectContaining(message)
                    );
                  }
                );
              });

              when("`panel.visibility` is set to `Visibility.VISIBLE` twice", () => {
                beforeEach(() => {
                  panel.visibility = Visibility.VISIBLE;
                  panel.visibility = Visibility.VISIBLE;
                });

                then("`panel.onshow` is called once", () => {
                  expect(onshow).toHaveBeenCalledTimes(1);
                });
              });

              when("`panel.onshow` is set to `invalid`", () => {
                let error: Error;
                beforeEach(() => {
                  try {
                    // @ts-expect-error
                    panel.onshow = "invalid";
                  } catch (err) {
                    error = err as Error;
                  }
                });

                then("an error is thrown", () => {
                  expect(error).toBeDefined();
                });

                then("error message contains 'Invalid onshow value: invalid'", () => {
                  expect(error.message).toBe("Invalid onshow value: invalid");
                });

                when("`panel.visibility` is set to `Visibility.VISIBLE`", () => {
                  beforeEach(() => {
                    panel.visibility = Visibility.VISIBLE;
                  });

                  then("`panel.onshow` is still called", () => {
                    expect(onshow).toHaveBeenCalled();
                  });
                });
              });

              and("`panel.onshow` is set to a new listener", () => {
                let onshow2: jasmine.Spy;
                beforeEach(() => {
                  onshow2 = jasmine.createSpy("onshow2");
                  panel.onshow = onshow2;
                });
                afterEach(() => {
                  panel.onshow = null;
                });

                when("`panel.visibility` is set to `Visibility.VISIBLE`", () => {
                  beforeEach(() => {
                    panel.visibility = Visibility.VISIBLE;
                  });

                  then("old `panel.onshow` is not called", () => {
                    expect(onshow).not.toHaveBeenCalled();
                  });

                  then("new `panel.onshow` is called", () => {
                    expect(onshow2).toHaveBeenCalled();
                  });
                });
              });

              when("invoking `panel.show`", () => {
                beforeEach(() => {
                  panel.show();
                });

                then("`panel.onshow` is called once", () => {
                  expect(onshow).toHaveBeenCalledTimes(1);
                });
              });

              when("`visibility` attribute is removed", () => {
                beforeEach(() => {
                  panel.removeAttribute(Attributes.VISIBILITY);
                });

                then("`panel.visibility` is `Visibility.VISIBLE`", () => {
                  expect(panel.visibility).toBe(Visibility.VISIBLE);
                });

                then("`panel.onshow` is called once", () => {
                  expect(onshow).toHaveBeenCalledTimes(1);
                });
              });
            });
          });
        });
      });
    });
  });
});

events(Event.ON_PIN, () => {
  and("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("a HTML Template is added to DOM", () => {
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

        then("`panel.onpin` setter exists", () => {
          expect(hasSetter(panel, Event.ON_PIN)).toBeTrue();
        });

        and("`panel.onpin` setter exists", () => {
          and("`panel.onpin` is set to a listener", () => {
            let onpin: jasmine.Spy;
            beforeEach(() => {
              onpin = jasmine.createSpy("onpin");
              panel.onpin = onpin;
            });
            afterEach(() => {
              panel.onpin = null;
            });

            when("`panel.status` is set to `Status.PINNED`", () => {
              beforeEach(() => {
                panel.status = Status.PINNED;
              });

              then("`panel.onpin` is called", () => {
                expect(onpin).toHaveBeenCalled();
              });

              then(
                "`panel.onpin` is called with `{ detail: { status: Status.PINNED } }`",
                () => {
                  const message = {
                    detail: { status: Status.PINNED }
                  };
                  expect(onpin).toHaveBeenCalledWith(
                    jasmine.objectContaining(message)
                  );
                }
              );
            });

            when("`panel.status` is set to `Status.PINNED` twice", () => {
              beforeEach(() => {
                panel.status = Status.PINNED;
                panel.status = Status.PINNED;
              });

              then("`panel.onpin` is called once", () => {
                expect(onpin).toHaveBeenCalledTimes(1);
              });
            });

            when("`panel.onpin` is set to `invalid`", () => {
              let error: Error;
              beforeEach(() => {
                try {
                  // @ts-expect-error
                  panel.onpin = "invalid";
                } catch (err) {
                  error = err as Error;
                }
              });

              then("an error is thrown", () => {
                expect(error).toBeDefined();
              });

              then("error message contains 'Invalid onpin value: invalid'", () => {
                expect(error.message).toBe("Invalid onpin value: invalid");
              });

              when("`panel.status` is set to `Status.PINNED`", () => {
                beforeEach(() => {
                  panel.status = Status.PINNED;
                });

                then("`panel.onpin` is still called", () => {
                  expect(onpin).toHaveBeenCalled();
                });
              });
            });

            and("`panel.onpin` is set to a new listener", () => {
              let onpin2: jasmine.Spy;
              beforeEach(() => {
                onpin2 = jasmine.createSpy("onpin2");
                panel.onpin = onpin2;
              });
              afterEach(() => {
                panel.onpin = null;
              });

              when("`panel.status` is set to `Status.PINNED`", () => {
                beforeEach(() => {
                  panel.status = Status.PINNED;
                });

                then("old `panel.onpin` is not called", () => {
                  expect(onpin).not.toHaveBeenCalled();
                });

                then("new `panel.onpin` is called", () => {
                  expect(onpin2).toHaveBeenCalled();
                });
              });
            });

            when("invoking `panel.pin`", () => {
              beforeEach(() => {
                panel.pin();
              });

              then("`panel.onpin` is called once", () => {
                expect(onpin).toHaveBeenCalledTimes(1);
              });
            });

            when("`status` attribute is set to `Status.PINNED`", () => {
              beforeEach(() => {
                panel.setAttribute(Attributes.STATUS, Status.PINNED);
              });

              then("`panel.status` is `Status.PINNED`", () => {
                expect(panel.status).toBe(Status.PINNED);
              });

              then("`panel.onpin` is called once", () => {
                expect(onpin).toHaveBeenCalledTimes(1);
              });
            });

            when("the end user clicks the pin in the taskbar", () => {
              beforeEach(() => {
                clickPin(panel);
              });

              then("`panel.status` is `Status.PINNED`", () => {
                expect(panel.status).toBe(Status.PINNED);
              });

              then("`panel.onpin` is called once", () => {
                expect(onpin).toHaveBeenCalledTimes(1);
              });

              then("the pin in the taskbar is pinned", () => {
                expect(pinOf(panel).status).toBe(PinStatus.PINNED);
              });
            });

            and("the panel is removed from DOM and added again", () => {
              beforeEach(() => {
                panel.remove();
                document.body.appendChild(panel);
              });

              when("the end user clicks the pin in the taskbar", () => {
                beforeEach(() => {
                  clickPin(panel);
                });

                then("`panel.onpin` is called once", () => {
                  expect(onpin).toHaveBeenCalledTimes(1);
                });
              });
            });

            when("invoking `panel.pin` twice", () => {
              beforeEach(() => {
                panel.pin();
                panel.pin();
              });

              then("`panel.status` is `Status.PINNED`", () => {
                expect(panel.status).toBe(Status.PINNED);
              });

              then("`panel.onpin` is called once", () => {
                expect(onpin).toHaveBeenCalledTimes(1);
              });
            });
          });
        });
      });
    });
  });
});

events(Event.ON_UNPIN, () => {
  and("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("a HTML Template is added to DOM", () => {
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

        then("`panel.onunpin` setter exists", () => {
          expect(hasSetter(panel, Event.ON_UNPIN)).toBeTrue();
        });

        and("`panel.onunpin` setter exists", () => {
          and("`panel.status` is set to `Status.PINNED`", () => {
            beforeEach(() => {
              panel.status = Status.PINNED;
            });

            and("`panel.onunpin` is set to a listener", () => {
              let onunpin: jasmine.Spy;
              beforeEach(() => {
                onunpin = jasmine.createSpy("onunpin");
                panel.onunpin = onunpin;
              });
              afterEach(() => {
                panel.onunpin = null;
              });

              when("`panel.status` is set to `Status.UNPINNED`", () => {
                beforeEach(() => {
                  panel.status = Status.UNPINNED;
                });

                then("`panel.onunpin` is called", () => {
                  expect(onunpin).toHaveBeenCalled();
                });

                then(
                  "`panel.onunpin` is called with `{ detail: { status: Status.UNPINNED } }`",
                  () => {
                    const message = {
                      detail: { status: Status.UNPINNED }
                    };
                    expect(onunpin).toHaveBeenCalledWith(
                      jasmine.objectContaining(message)
                    );
                  }
                );
              });

              when("`panel.status` is set to `Status.UNPINNED` twice", () => {
                beforeEach(() => {
                  panel.status = Status.UNPINNED;
                  panel.status = Status.UNPINNED;
                });

                then("`panel.onunpin` is called once", () => {
                  expect(onunpin).toHaveBeenCalledTimes(1);
                });
              });

              when("`panel.onunpin` is set to `invalid`", () => {
                let error: Error;
                beforeEach(() => {
                  try {
                    // @ts-expect-error
                    panel.onunpin = "invalid";
                  } catch (err) {
                    error = err as Error;
                  }
                });

                then("an error is thrown", () => {
                  expect(error).toBeDefined();
                });

                then("error message contains 'Invalid onunpin value: invalid'", () => {
                  expect(error.message).toBe("Invalid onunpin value: invalid");
                });

                when("`panel.status` is set to `Status.UNPINNED`", () => {
                  beforeEach(() => {
                    panel.status = Status.UNPINNED;
                  });

                  then("`panel.onunpin` is still called", () => {
                    expect(onunpin).toHaveBeenCalled();
                  });
                });
              });

              and("`panel.onunpin` is set to a new listener", () => {
                let onunpin2: jasmine.Spy;
                beforeEach(() => {
                  onunpin2 = jasmine.createSpy("onunpin2");
                  panel.onunpin = onunpin2;
                });
                afterEach(() => {
                  panel.onunpin = null;
                });

                when("`panel.status` is set to `Status.UNPINNED`", () => {
                  beforeEach(() => {
                    panel.status = Status.UNPINNED;
                  });

                  then("old `panel.onunpin` is not called", () => {
                    expect(onunpin).not.toHaveBeenCalled();
                  });

                  then("new `panel.onunpin` is called", () => {
                    expect(onunpin2).toHaveBeenCalled();
                  });
                });
              });

              when("invoking `panel.unpin`", () => {
                beforeEach(() => {
                  panel.unpin();
                });

                then("`panel.onunpin` is called once", () => {
                  expect(onunpin).toHaveBeenCalledTimes(1);
                });
              });

              when("`status` attribute is removed", () => {
                beforeEach(() => {
                  panel.removeAttribute(Attributes.STATUS);
                });

                then("`panel.status` is `Status.UNPINNED`", () => {
                  expect(panel.status).toBe(Status.UNPINNED);
                });

                then("`panel.onunpin` is called once", () => {
                  expect(onunpin).toHaveBeenCalledTimes(1);
                });
              });

              when("the end user clicks the pin in the taskbar", () => {
                beforeEach(() => {
                  clickPin(panel);
                });

                then("`panel.status` is `Status.UNPINNED`", () => {
                  expect(panel.status).toBe(Status.UNPINNED);
                });

                then("`panel.onunpin` is called once", () => {
                  expect(onunpin).toHaveBeenCalledTimes(1);
                });

                then("the pin in the taskbar is unpinned", () => {
                  expect(pinOf(panel).status).toBe(PinStatus.UNPINNED);
                });
              });

              and("the panel is removed from DOM and added again", () => {
                beforeEach(() => {
                  panel.remove();
                  document.body.appendChild(panel);
                });

                when("the end user clicks the pin in the taskbar", () => {
                  beforeEach(() => {
                    clickPin(panel);
                  });

                  then("`panel.onunpin` is called once", () => {
                    expect(onunpin).toHaveBeenCalledTimes(1);
                  });
                });
              });

              when("invoking `panel.unpin` twice", () => {
                beforeEach(() => {
                  panel.unpin();
                  panel.unpin();
                });

                then("`panel.status` is `Status.UNPINNED`", () => {
                  expect(panel.status).toBe(Status.UNPINNED);
                });

                then("`panel.onunpin` is called once", () => {
                  expect(onunpin).toHaveBeenCalledTimes(1);
                });
              });
            });
          });
        });
      });
    });
  });
});

events(Event.ON_MINIMIZE, () => {
  and("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("a HTML Template is added to DOM", () => {
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

        then("`panel.onminimize` setter exists", () => {
          expect(hasSetter(panel, Event.ON_MINIMIZE)).toBeTrue();
        });

        and("`panel.onminimize` setter exists", () => {
          and("`panel.onminimize` is set to a listener", () => {
            let onminimize: jasmine.Spy;
            beforeEach(() => {
              onminimize = jasmine.createSpy("onminimize");
              panel.onminimize = onminimize;
            });
            afterEach(() => {
              panel.onminimize = null;
            });

            when("`panel.condition` is set to `Condition.MINIMIZED`", () => {
              beforeEach(() => {
                panel.condition = Condition.MINIMIZED;
              });

              then("`panel.onminimize` is called", () => {
                expect(onminimize).toHaveBeenCalled();
              });

              then(
                "`panel.onminimize` is called with `{ detail: { condition: Condition.MINIMIZED } }`",
                () => {
                  const message = {
                    detail: { condition: Condition.MINIMIZED }
                  };
                  expect(onminimize).toHaveBeenCalledWith(
                    jasmine.objectContaining(message)
                  );
                }
              );
            });

            when("`panel.condition` is set to `Condition.MINIMIZED` twice", () => {
              beforeEach(() => {
                panel.condition = Condition.MINIMIZED;
                panel.condition = Condition.MINIMIZED;
              });

              then("`panel.onminimize` is called once", () => {
                expect(onminimize).toHaveBeenCalledTimes(1);
              });
            });

            when("`panel.onminimize` is set to `invalid`", () => {
              let error: Error;
              beforeEach(() => {
                try {
                  // @ts-expect-error
                  panel.onminimize = "invalid";
                } catch (err) {
                  error = err as Error;
                }
              });

              then("an error is thrown", () => {
                expect(error).toBeDefined();
              });

              then("error message contains 'Invalid onminimize value: invalid'", () => {
                expect(error.message).toBe("Invalid onminimize value: invalid");
              });

              when("`panel.condition` is set to `Condition.MINIMIZED`", () => {
                beforeEach(() => {
                  panel.condition = Condition.MINIMIZED;
                });

                then("`panel.onminimize` is still called", () => {
                  expect(onminimize).toHaveBeenCalled();
                });
              });
            });

            and("`panel.onminimize` is set to a new listener", () => {
              let onminimize2: jasmine.Spy;
              beforeEach(() => {
                onminimize2 = jasmine.createSpy("onminimize2");
                panel.onminimize = onminimize2;
              });
              afterEach(() => {
                panel.onminimize = null;
              });

              when("`panel.condition` is set to `Condition.MINIMIZED`", () => {
                beforeEach(() => {
                  panel.condition = Condition.MINIMIZED;
                });

                then("old `panel.onminimize` is not called", () => {
                  expect(onminimize).not.toHaveBeenCalled();
                });

                then("new `panel.onminimize` is called", () => {
                  expect(onminimize2).toHaveBeenCalled();
                });
              });
            });

            when("invoking `panel.minimize`", () => {
              beforeEach(() => {
                panel.minimize();
              });

              then("`panel.onminimize` is called once", () => {
                expect(onminimize).toHaveBeenCalledTimes(1);
              });
            });

            when("`condition` attribute is set to `Condition.MINIMIZED`", () => {
              beforeEach(() => {
                panel.setAttribute(Attributes.CONDITION, Condition.MINIMIZED);
              });

              then("`panel.condition` is `Condition.MINIMIZED`", () => {
                expect(panel.condition).toBe(Condition.MINIMIZED);
              });

              then("`panel.onminimize` is called once", () => {
                expect(onminimize).toHaveBeenCalledTimes(1);
              });
            });

            when("the end user clicks `minimize` in the taskbar", () => {
              beforeEach(() => {
                click(panel, Control.MINIMIZE);
              });

              then("`panel.condition` is `Condition.MINIMIZED`", () => {
                expect(panel.condition).toBe(Condition.MINIMIZED);
              });

              then("`panel.onminimize` is called once", () => {
                expect(onminimize).toHaveBeenCalledTimes(1);
              });

              then("the taskbar shows `maximize`, `restore`, `close`", () => {
                expect(shown(panel)).toEqual([
                  Control.MAXIMIZE,
                  Control.RESTORE,
                  Control.CLOSE
                ]);
              });
            });

            and("the panel is removed from DOM and added again", () => {
              beforeEach(() => {
                panel.remove();
                document.body.appendChild(panel);
              });

              when("the end user clicks `minimize` in the taskbar", () => {
                beforeEach(() => {
                  click(panel, Control.MINIMIZE);
                });

                then("`panel.onminimize` is called once", () => {
                  expect(onminimize).toHaveBeenCalledTimes(1);
                });
              });
            });

            when("invoking `panel.minimize` twice", () => {
              beforeEach(() => {
                panel.minimize();
                panel.minimize();
              });

              then("`panel.condition` is `Condition.MINIMIZED`", () => {
                expect(panel.condition).toBe(Condition.MINIMIZED);
              });

              then("`panel.onminimize` is called once", () => {
                expect(onminimize).toHaveBeenCalledTimes(1);
              });
            });

            and("`panel.condition` is set to `Condition.MAXIMIZED`", () => {
              let heard: jasmine.Spy;
              beforeEach(() => {
                panel.condition = Condition.MAXIMIZED;
                heard = jasmine.createSpy("heard");
                panel.onminimize = heard;
              });

              when("invoking `panel.minimize`", () => {
                beforeEach(() => {
                  panel.minimize();
                });

                then("`panel.condition` is `Condition.MINIMIZED`", () => {
                  expect(panel.condition).toBe(Condition.MINIMIZED);
                });

                then("`panel.onminimize` is called once", () => {
                  expect(heard).toHaveBeenCalledTimes(1);
                });
              });
            });
          });
        });
      });
    });
  });
});

events(Event.ON_MAXIMIZE, () => {
  and("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("a HTML Template is added to DOM", () => {
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

        then("`panel.onmaximize` setter exists", () => {
          expect(hasSetter(panel, Event.ON_MAXIMIZE)).toBeTrue();
        });

        and("`panel.onmaximize` setter exists", () => {
          and("`panel.onmaximize` is set to a listener", () => {
            let onmaximize: jasmine.Spy;
            beforeEach(() => {
              onmaximize = jasmine.createSpy("onmaximize");
              panel.onmaximize = onmaximize;
            });
            afterEach(() => {
              panel.onmaximize = null;
            });

            when("`panel.condition` is set to `Condition.MAXIMIZED`", () => {
              beforeEach(() => {
                panel.condition = Condition.MAXIMIZED;
              });

              then("`panel.onmaximize` is called", () => {
                expect(onmaximize).toHaveBeenCalled();
              });

              then(
                "`panel.onmaximize` is called with `{ detail: { condition: Condition.MAXIMIZED } }`",
                () => {
                  const message = {
                    detail: { condition: Condition.MAXIMIZED }
                  };
                  expect(onmaximize).toHaveBeenCalledWith(
                    jasmine.objectContaining(message)
                  );
                }
              );
            });

            when("`panel.condition` is set to `Condition.MAXIMIZED` twice", () => {
              beforeEach(() => {
                panel.condition = Condition.MAXIMIZED;
                panel.condition = Condition.MAXIMIZED;
              });

              then("`panel.onmaximize` is called once", () => {
                expect(onmaximize).toHaveBeenCalledTimes(1);
              });
            });

            when("`panel.onmaximize` is set to `invalid`", () => {
              let error: Error;
              beforeEach(() => {
                try {
                  // @ts-expect-error
                  panel.onmaximize = "invalid";
                } catch (err) {
                  error = err as Error;
                }
              });

              then("an error is thrown", () => {
                expect(error).toBeDefined();
              });

              then("error message contains 'Invalid onmaximize value: invalid'", () => {
                expect(error.message).toBe("Invalid onmaximize value: invalid");
              });

              when("`panel.condition` is set to `Condition.MAXIMIZED`", () => {
                beforeEach(() => {
                  panel.condition = Condition.MAXIMIZED;
                });

                then("`panel.onmaximize` is still called", () => {
                  expect(onmaximize).toHaveBeenCalled();
                });
              });
            });

            and("`panel.onmaximize` is set to a new listener", () => {
              let onmaximize2: jasmine.Spy;
              beforeEach(() => {
                onmaximize2 = jasmine.createSpy("onmaximize2");
                panel.onmaximize = onmaximize2;
              });
              afterEach(() => {
                panel.onmaximize = null;
              });

              when("`panel.condition` is set to `Condition.MAXIMIZED`", () => {
                beforeEach(() => {
                  panel.condition = Condition.MAXIMIZED;
                });

                then("old `panel.onmaximize` is not called", () => {
                  expect(onmaximize).not.toHaveBeenCalled();
                });

                then("new `panel.onmaximize` is called", () => {
                  expect(onmaximize2).toHaveBeenCalled();
                });
              });
            });

            when("invoking `panel.maximize`", () => {
              beforeEach(() => {
                panel.maximize();
              });

              then("`panel.onmaximize` is called once", () => {
                expect(onmaximize).toHaveBeenCalledTimes(1);
              });
            });

            when("`condition` attribute is set to `Condition.MAXIMIZED`", () => {
              beforeEach(() => {
                panel.setAttribute(Attributes.CONDITION, Condition.MAXIMIZED);
              });

              then("`panel.condition` is `Condition.MAXIMIZED`", () => {
                expect(panel.condition).toBe(Condition.MAXIMIZED);
              });

              then("`panel.onmaximize` is called once", () => {
                expect(onmaximize).toHaveBeenCalledTimes(1);
              });
            });

            when("the end user clicks `maximize` in the taskbar", () => {
              beforeEach(() => {
                click(panel, Control.MAXIMIZE);
              });

              then("`panel.condition` is `Condition.MAXIMIZED`", () => {
                expect(panel.condition).toBe(Condition.MAXIMIZED);
              });

              then("`panel.onmaximize` is called once", () => {
                expect(onmaximize).toHaveBeenCalledTimes(1);
              });

              then("the taskbar shows `minimize`, `restore`, `close`", () => {
                expect(shown(panel)).toEqual([
                  Control.MINIMIZE,
                  Control.RESTORE,
                  Control.CLOSE
                ]);
              });
            });

            and("the panel is removed from DOM and added again", () => {
              beforeEach(() => {
                panel.remove();
                document.body.appendChild(panel);
              });

              when("the end user clicks `maximize` in the taskbar", () => {
                beforeEach(() => {
                  click(panel, Control.MAXIMIZE);
                });

                then("`panel.onmaximize` is called once", () => {
                  expect(onmaximize).toHaveBeenCalledTimes(1);
                });
              });
            });

            when("invoking `panel.maximize` twice", () => {
              beforeEach(() => {
                panel.maximize();
                panel.maximize();
              });

              then("`panel.condition` is `Condition.MAXIMIZED`", () => {
                expect(panel.condition).toBe(Condition.MAXIMIZED);
              });

              then("`panel.onmaximize` is called once", () => {
                expect(onmaximize).toHaveBeenCalledTimes(1);
              });
            });

            and("`panel.condition` is set to `Condition.MINIMIZED`", () => {
              let heard: jasmine.Spy;
              beforeEach(() => {
                panel.condition = Condition.MINIMIZED;
                heard = jasmine.createSpy("heard");
                panel.onmaximize = heard;
              });

              when("invoking `panel.maximize`", () => {
                beforeEach(() => {
                  panel.maximize();
                });

                then("`panel.condition` is `Condition.MAXIMIZED`", () => {
                  expect(panel.condition).toBe(Condition.MAXIMIZED);
                });

                then("`panel.onmaximize` is called once", () => {
                  expect(heard).toHaveBeenCalledTimes(1);
                });
              });

              when("the end user clicks `maximize` in the taskbar", () => {
                beforeEach(() => {
                  click(panel, Control.MAXIMIZE);
                });

                then("`panel.condition` is `Condition.MAXIMIZED`", () => {
                  expect(panel.condition).toBe(Condition.MAXIMIZED);
                });

                then("`panel.onmaximize` is called once", () => {
                  expect(heard).toHaveBeenCalledTimes(1);
                });
              });
            });
          });
        });
      });
    });
  });
});

events(Event.ON_RESTORE, () => {
  and("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("a HTML Template is added to DOM", () => {
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

        then("`panel.onrestore` setter exists", () => {
          expect(hasSetter(panel, Event.ON_RESTORE)).toBeTrue();
        });

        and("`panel.onrestore` setter exists", () => {
          and("`panel.condition` is set to `Condition.MAXIMIZED`", () => {
            beforeEach(() => {
              panel.condition = Condition.MAXIMIZED;
            });

            and("`panel.onrestore` is set to a listener", () => {
              let onrestore: jasmine.Spy;
              beforeEach(() => {
                onrestore = jasmine.createSpy("onrestore");
                panel.onrestore = onrestore;
              });
              afterEach(() => {
                panel.onrestore = null;
              });

              when("`panel.condition` is set to `Condition.NORMAL`", () => {
                beforeEach(() => {
                  panel.condition = Condition.NORMAL;
                });

                then("`panel.onrestore` is called", () => {
                  expect(onrestore).toHaveBeenCalled();
                });

                then(
                  "`panel.onrestore` is called with `{ detail: { condition: Condition.NORMAL } }`",
                  () => {
                    const message = {
                      detail: { condition: Condition.NORMAL }
                    };
                    expect(onrestore).toHaveBeenCalledWith(
                      jasmine.objectContaining(message)
                    );
                  }
                );
              });

              when("`panel.condition` is set to `Condition.NORMAL` twice", () => {
                beforeEach(() => {
                  panel.condition = Condition.NORMAL;
                  panel.condition = Condition.NORMAL;
                });

                then("`panel.onrestore` is called once", () => {
                  expect(onrestore).toHaveBeenCalledTimes(1);
                });
              });

              when("`panel.onrestore` is set to `invalid`", () => {
                let error: Error;
                beforeEach(() => {
                  try {
                    // @ts-expect-error
                    panel.onrestore = "invalid";
                  } catch (err) {
                    error = err as Error;
                  }
                });

                then("an error is thrown", () => {
                  expect(error).toBeDefined();
                });

                then("error message contains 'Invalid onrestore value: invalid'", () => {
                  expect(error.message).toBe("Invalid onrestore value: invalid");
                });

                when("`panel.condition` is set to `Condition.NORMAL`", () => {
                  beforeEach(() => {
                    panel.condition = Condition.NORMAL;
                  });

                  then("`panel.onrestore` is still called", () => {
                    expect(onrestore).toHaveBeenCalled();
                  });
                });
              });

              and("`panel.onrestore` is set to a new listener", () => {
                let onrestore2: jasmine.Spy;
                beforeEach(() => {
                  onrestore2 = jasmine.createSpy("onrestore2");
                  panel.onrestore = onrestore2;
                });
                afterEach(() => {
                  panel.onrestore = null;
                });

                when("`panel.condition` is set to `Condition.NORMAL`", () => {
                  beforeEach(() => {
                    panel.condition = Condition.NORMAL;
                  });

                  then("old `panel.onrestore` is not called", () => {
                    expect(onrestore).not.toHaveBeenCalled();
                  });

                  then("new `panel.onrestore` is called", () => {
                    expect(onrestore2).toHaveBeenCalled();
                  });
                });
              });

              when("invoking `panel.restore`", () => {
                beforeEach(() => {
                  panel.restore();
                });

                then("`panel.onrestore` is called once", () => {
                  expect(onrestore).toHaveBeenCalledTimes(1);
                });
              });

              when("`condition` attribute is removed", () => {
                beforeEach(() => {
                  panel.removeAttribute(Attributes.CONDITION);
                });

                then("`panel.condition` is `Condition.NORMAL`", () => {
                  expect(panel.condition).toBe(Condition.NORMAL);
                });

                then("`panel.onrestore` is called once", () => {
                  expect(onrestore).toHaveBeenCalledTimes(1);
                });
              });

              when("the end user clicks `restore` in the taskbar", () => {
                beforeEach(() => {
                  click(panel, Control.RESTORE);
                });

                then("`panel.condition` is `Condition.NORMAL`", () => {
                  expect(panel.condition).toBe(Condition.NORMAL);
                });

                then("`panel.onrestore` is called once", () => {
                  expect(onrestore).toHaveBeenCalledTimes(1);
                });

                then("the taskbar shows `minimize`, `maximize`, `close`", () => {
                  expect(shown(panel)).toEqual([
                    Control.MINIMIZE,
                    Control.MAXIMIZE,
                    Control.CLOSE
                  ]);
                });
              });

              and("the panel is removed from DOM and added again", () => {
                beforeEach(() => {
                  panel.remove();
                  document.body.appendChild(panel);
                });

                when("the end user clicks `restore` in the taskbar", () => {
                  beforeEach(() => {
                    click(panel, Control.RESTORE);
                  });

                  then("`panel.onrestore` is called once", () => {
                    expect(onrestore).toHaveBeenCalledTimes(1);
                  });
                });
              });

              when("invoking `panel.restore` twice", () => {
                beforeEach(() => {
                  panel.restore();
                  panel.restore();
                });

                then("`panel.condition` is `Condition.NORMAL`", () => {
                  expect(panel.condition).toBe(Condition.NORMAL);
                });

                then("`panel.onrestore` is called once", () => {
                  expect(onrestore).toHaveBeenCalledTimes(1);
                });
              });

              and("the panel is minimized, and listened to again", () => {
                let heard: jasmine.Spy;
                let onmaximize: jasmine.Spy;
                beforeEach(() => {
                  panel.minimize();
                  heard = jasmine.createSpy("heard");
                  onmaximize = jasmine.createSpy("onmaximize");
                  panel.onrestore = heard;
                  panel.onmaximize = onmaximize;
                });
                afterEach(() => {
                  panel.onmaximize = null;
                });

                when("invoking `panel.restore`", () => {
                  beforeEach(() => {
                    panel.restore();
                  });

                  then("`panel.condition` is `Condition.MAXIMIZED`", () => {
                    expect(panel.condition).toBe(Condition.MAXIMIZED);
                  });

                  then("`panel.onmaximize` is called once", () => {
                    expect(onmaximize).toHaveBeenCalledTimes(1);
                  });

                  then("`panel.onrestore` is not called", () => {
                    expect(heard).not.toHaveBeenCalled();
                  });
                });
              });

              and("the panel is restored, and listened to again", () => {
                let heard: jasmine.Spy;
                beforeEach(() => {
                  panel.restore();
                  heard = jasmine.createSpy("heard");
                  panel.onrestore = heard;
                });

                when("invoking `panel.restore`", () => {
                  beforeEach(() => {
                    panel.restore();
                  });

                  then("`panel.condition` is `Condition.NORMAL`", () => {
                    expect(panel.condition).toBe(Condition.NORMAL);
                  });

                  then("`panel.onrestore` is not called", () => {
                    expect(heard).not.toHaveBeenCalled();
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

events(Event.ON_CLOSE, () => {
  and("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("a HTML Template is added to DOM", () => {
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

        then("`panel.onclose` setter exists", () => {
          expect(hasSetter(panel, Event.ON_CLOSE)).toBeTrue();
        });

        and("`panel.onclose` setter exists", () => {
          and("`panel.onclose` is set to a listener", () => {
            let onclose: jasmine.Spy;
            let connected: boolean[];
            beforeEach(() => {
              connected = [];
              onclose = jasmine
                .createSpy("onclose")
                .and.callFake(() => connected.push(panel.isConnected));
              panel.onclose = onclose;
            });
            afterEach(() => {
              panel.onclose = null;
            });

            when("invoking `panel.close`", () => {
              beforeEach(() => {
                panel.close();
              });

              then("`panel.onclose` is called", () => {
                expect(onclose).toHaveBeenCalled();
              });

              then("the panel was still in the page when `panel.onclose` was called", () => {
                expect(connected).toEqual([true]);
              });

              then("the panel is removed from the page", () => {
                expect(panel.isConnected).toBeFalse();
              });
            });

            when("invoking `panel.close` twice", () => {
              beforeEach(() => {
                panel.close();
                panel.close();
              });

              then("`panel.onclose` is called once", () => {
                expect(onclose).toHaveBeenCalledTimes(1);
              });
            });

            when("`panel.onclose` is set to `invalid`", () => {
              let error: Error;
              beforeEach(() => {
                try {
                  // @ts-expect-error
                  panel.onclose = "invalid";
                } catch (err) {
                  error = err as Error;
                }
              });

              then("an error is thrown", () => {
                expect(error).toBeDefined();
              });

              then("error message contains 'Invalid onclose value: invalid'", () => {
                expect(error.message).toBe("Invalid onclose value: invalid");
              });

              when("invoking `panel.close`", () => {
                beforeEach(() => {
                  panel.close();
                });

                then("`panel.onclose` is still called", () => {
                  expect(onclose).toHaveBeenCalled();
                });
              });
            });

            and("`panel.onclose` is set to a new listener", () => {
              let onclose2: jasmine.Spy;
              beforeEach(() => {
                onclose2 = jasmine.createSpy("onclose2");
                panel.onclose = onclose2;
              });
              afterEach(() => {
                panel.onclose = null;
              });

              when("invoking `panel.close`", () => {
                beforeEach(() => {
                  panel.close();
                });

                then("old `panel.onclose` is not called", () => {
                  expect(onclose).not.toHaveBeenCalled();
                });

                then("new `panel.onclose` is called", () => {
                  expect(onclose2).toHaveBeenCalled();
                });
              });
            });

            when("the end user clicks `close` in the taskbar", () => {
              beforeEach(() => {
                click(panel, Control.CLOSE);
              });

              then("`panel.onclose` is called once", () => {
                expect(onclose).toHaveBeenCalledTimes(1);
              });

              then("the panel is removed from the page", () => {
                expect(panel.isConnected).toBeFalse();
              });

              then("the panel was still in the page when `panel.onclose` was called", () => {
                expect(connected).toEqual([true]);
              });

              and("the closed panel is added to the page again", () => {
                beforeEach(() => {
                  document.body.appendChild(panel);
                });

                when("the end user clicks `close` in the taskbar", () => {
                  beforeEach(() => {
                    click(panel, Control.CLOSE);
                  });

                  then("`panel.onclose` is called a second time, and no more", () => {
                    expect(onclose).toHaveBeenCalledTimes(2);
                  });

                  then("the panel is removed from the page", () => {
                    expect(panel.isConnected).toBeFalse();
                  });
                });
              });
            });

            and("the panel is removed from the page by the host", () => {
              beforeEach(() => {
                panel.remove();
              });

              then("`panel.onclose` is not called", () => {
                expect(onclose).not.toHaveBeenCalled();
              });

              when("invoking `panel.close`", () => {
                beforeEach(() => {
                  panel.close();
                });

                then("`panel.onclose` is not called", () => {
                  expect(onclose).not.toHaveBeenCalled();
                });
              });
            });
          });
        });
      });
    });
  });
});

events(Event.ON_MOVE, () => {
  and("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("a HTML Template is added to DOM", () => {
      beforeEach(async () => {
        await Panel.Template.load("panel.template.html");
      });
      afterEach(() => {
        remove(Panel.Tag);
      });

      and("a new panel, 480 wide and 320 high, is added to DOM", () => {
        let panel: Panel;
        beforeEach(async () => {
          panel = place(SIZED);
          await styled(panel);
        });
        afterEach(() => {
          panel.remove();
        });

        then("`panel.onmove` setter exists", () => {
          expect(hasSetter(panel, Event.ON_MOVE)).toBeTrue();
        });

        and("`panel.onmove` setter exists", () => {
          and("`panel.onmove` is set to a listener", () => {
            let onmove: jasmine.Spy;
            beforeEach(() => {
              onmove = jasmine.createSpy("onmove");
              panel.onmove = onmove;
            });
            afterEach(() => {
              panel.onmove = null;
            });

            and("the end user presses on the taskbar", () => {
              let origin: Position;
              let start: { x: number; y: number };
              beforeEach(() => {
                origin = { left: panel.offsetLeft, top: panel.offsetTop };
                start = onBar(panel);
                pointer(panel, Gesture.POINTERDOWN, start.x, start.y);
              });
              afterEach(() => {
                pointer(panel, Gesture.POINTERUP, start.x, start.y);
              });

              then("`panel.onmove` is not called", () => {
                expect(onmove).not.toHaveBeenCalled();
              });

              when("the pointer moves 25 to the right and 15 down", () => {
                beforeEach(() => {
                  pointer(panel, Gesture.POINTERMOVE, start.x + 25, start.y + 15);
                });

                then("`panel.onmove` is called once", () => {
                  expect(onmove).toHaveBeenCalledTimes(1);
                });

                then("`panel.onmove` is called with the new position in `detail`", () => {
                  const message = {
                    detail: { position: { left: origin.left + 25, top: origin.top + 15 } }
                  };
                  expect(onmove).toHaveBeenCalledWith(jasmine.objectContaining(message));
                });

                then("the position in `detail` is `panel.position` itself, and frozen", () => {
                  const { detail } = onmove.calls.mostRecent().args[0];
                  expect(detail.position).toBe(panel.position);
                  expect(Object.isFrozen(detail.position)).toBeTrue();
                });

                when("the pointer moves 25 further to the right", () => {
                  beforeEach(() => {
                    pointer(panel, Gesture.POINTERMOVE, start.x + 50, start.y + 15);
                  });

                  then("`panel.onmove` is called a second time", () => {
                    expect(onmove).toHaveBeenCalledTimes(2);
                  });
                });
              });
            });

            when("`panel.position` is set to `{ left: 120, top: 80 }`", () => {
              beforeEach(() => {
                panel.position = { left: 120, top: 80 };
              });

              then("`panel.onmove` is not called", () => {
                expect(onmove).not.toHaveBeenCalled();
              });
            });

            when("`panel.onmove` is set to `invalid`", () => {
              let error: Error;
              beforeEach(() => {
                try {
                  // @ts-expect-error
                  panel.onmove = "invalid";
                } catch (err) {
                  error = err as Error;
                }
              });

              then("an error is thrown", () => {
                expect(error).toBeDefined();
              });

              then("error message contains 'Invalid onmove value: invalid'", () => {
                expect(error.message).toBe("Invalid onmove value: invalid");
              });

              when("the end user drags the taskbar", () => {
                beforeEach(() => {
                  drag(panel, 25, 15);
                });

                then("`panel.onmove` is still called", () => {
                  expect(onmove).toHaveBeenCalled();
                });
              });
            });

            and("`panel.onmove` is set to a new listener", () => {
              let onmove2: jasmine.Spy;
              beforeEach(() => {
                onmove2 = jasmine.createSpy("onmove2");
                panel.onmove = onmove2;
              });
              afterEach(() => {
                panel.onmove = null;
              });

              when("the end user drags the taskbar", () => {
                beforeEach(() => {
                  drag(panel, 25, 15);
                });

                then("old `panel.onmove` is not called", () => {
                  expect(onmove).not.toHaveBeenCalled();
                });

                then("new `panel.onmove` is called", () => {
                  expect(onmove2).toHaveBeenCalled();
                });
              });
            });

            and("the panel is removed from DOM and added again", () => {
              beforeEach(async () => {
                panel.remove();
                document.body.appendChild(panel);
                await styled(panel);
              });

              when("the end user drags the taskbar", () => {
                beforeEach(() => {
                  drag(panel, 25, 15);
                });

                then("`panel.onmove` is called once", () => {
                  expect(onmove).toHaveBeenCalledTimes(1);
                });
              });
            });
          });
        });
      });
    });
  });
});

events(Event.ON_RESIZE, () => {
  and("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("a HTML Template is added to DOM", () => {
      beforeEach(async () => {
        await Panel.Template.load("panel.template.html");
      });
      afterEach(() => {
        remove(Panel.Tag);
      });

      and("a new panel, 480 wide and 320 high, is added to DOM", () => {
        let panel: Panel;
        beforeEach(async () => {
          panel = place(SIZED);
          await styled(panel);
        });
        afterEach(() => {
          panel.remove();
        });

        then("`panel.onresize` setter exists", () => {
          expect(hasSetter(panel, Event.ON_RESIZE)).toBeTrue();
        });

        and("`panel.onresize` setter exists", () => {
          and("`panel.onresize` is set to a listener", () => {
            let onresize: jasmine.Spy;
            beforeEach(() => {
              onresize = jasmine.createSpy("onresize");
              panel.onresize = onresize;
            });
            afterEach(() => {
              panel.onresize = null;
            });

            and("the end user presses on the grip", () => {
              let origin: Dimensions;
              let start: { x: number; y: number };
              beforeEach(() => {
                origin = { width: panel.offsetWidth, height: panel.offsetHeight };
                start = onGrip(panel);
                gripPointer(panel, Gesture.POINTERDOWN, start.x, start.y);
              });
              afterEach(() => {
                gripPointer(panel, Gesture.POINTERUP, start.x, start.y);
              });

              then("`panel.onresize` is not called", () => {
                expect(onresize).not.toHaveBeenCalled();
              });

              when("the pointer moves 25 to the right and 15 down", () => {
                beforeEach(() => {
                  gripPointer(panel, Gesture.POINTERMOVE, start.x + 25, start.y + 15);
                });

                then("`panel.onresize` is called once", () => {
                  expect(onresize).toHaveBeenCalledTimes(1);
                });

                then("`panel.onresize` is called with the new dimensions in `detail`", () => {
                  const message = {
                    detail: { dimensions: { width: origin.width + 25, height: origin.height + 15 } }
                  };
                  expect(onresize).toHaveBeenCalledWith(jasmine.objectContaining(message));
                });

                then("the dimensions in `detail` is `panel.dimensions` itself, and frozen", () => {
                  const { detail } = onresize.calls.mostRecent().args[0];
                  expect(detail.dimensions).toBe(panel.dimensions);
                  expect(Object.isFrozen(detail.dimensions)).toBeTrue();
                });

                when("the pointer moves 25 further to the right", () => {
                  beforeEach(() => {
                    gripPointer(panel, Gesture.POINTERMOVE, start.x + 50, start.y + 15);
                  });

                  then("`panel.onresize` is called a second time", () => {
                    expect(onresize).toHaveBeenCalledTimes(2);
                  });
                });
              });
            });

            when("`panel.dimensions` is set to `{ width: 120, height: 80 }`", () => {
              beforeEach(() => {
                panel.dimensions = { width: 120, height: 80 };
              });

              then("`panel.onresize` is not called", () => {
                expect(onresize).not.toHaveBeenCalled();
              });
            });

            when("`panel.onresize` is set to `invalid`", () => {
              let error: Error;
              beforeEach(() => {
                try {
                  // @ts-expect-error
                  panel.onresize = "invalid";
                } catch (err) {
                  error = err as Error;
                }
              });

              then("an error is thrown", () => {
                expect(error).toBeDefined();
              });

              then("error message contains 'Invalid onresize value: invalid'", () => {
                expect(error.message).toBe("Invalid onresize value: invalid");
              });

              when("the end user drags the grip", () => {
                beforeEach(() => {
                  stretch(panel, 25, 15);
                });

                then("`panel.onresize` is still called", () => {
                  expect(onresize).toHaveBeenCalled();
                });
              });
            });

            and("`panel.onresize` is set to a new listener", () => {
              let onresize2: jasmine.Spy;
              beforeEach(() => {
                onresize2 = jasmine.createSpy("onresize2");
                panel.onresize = onresize2;
              });
              afterEach(() => {
                panel.onresize = null;
              });

              when("the end user drags the grip", () => {
                beforeEach(() => {
                  stretch(panel, 25, 15);
                });

                then("old `panel.onresize` is not called", () => {
                  expect(onresize).not.toHaveBeenCalled();
                });

                then("new `panel.onresize` is called", () => {
                  expect(onresize2).toHaveBeenCalled();
                });
              });
            });

            and("the panel is removed from DOM and added again", () => {
              beforeEach(async () => {
                panel.remove();
                document.body.appendChild(panel);
                await styled(panel);
              });

              when("the end user drags the grip", () => {
                beforeEach(() => {
                  stretch(panel, 25, 15);
                });

                then("`panel.onresize` is called once", () => {
                  expect(onresize).toHaveBeenCalledTimes(1);
                });
              });
            });
          });
        });
      });
    });
  });
});

// Gesture

gesture(Gesture.POINTERDOWN, () => {
  and("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("a HTML Template is added to DOM", () => {
      beforeEach(async () => {
        await Panel.Template.load("panel.template.html");
      });
      afterEach(() => {
        remove(Panel.Tag);
      });

      and("a new panel, 480 wide and 320 high, is added to DOM", () => {
        let panel: Panel;
        beforeEach(async () => {
          panel = place(SIZED);
          await styled(panel);
        });
        afterEach(() => {
          panel.remove();
        });

        and("`panel.onmove` is set to a listener", () => {
          let onmove: jasmine.Spy;
          beforeEach(() => {
            onmove = jasmine.createSpy("onmove");
            panel.onmove = onmove;
          });
          afterEach(() => {
            panel.onmove = null;
          });

          when("the end user presses on the taskbar", () => {
            let start: { x: number; y: number };
            beforeEach(() => {
              start = onBar(panel);
              pointer(panel, Gesture.POINTERDOWN, start.x, start.y);
            });
            afterEach(() => {
              pointer(panel, Gesture.POINTERUP, start.x, start.y);
            });

            then("`panel.position` is `null`", () => {
              expect(panel.position).toBeNull();
            });

            then("`panel.onmove` is not called", () => {
              expect(onmove).not.toHaveBeenCalled();
            });
          });

          and("`panel.status` is `Status.PINNED`", () => {
            beforeEach(() => {
              panel.status = Status.PINNED;
            });

            when("the end user drags the taskbar", () => {
              beforeEach(() => {
                drag(panel, 25, 15);
              });

              then("`panel.position` is `null`", () => {
                expect(panel.position).toBeNull();
              });

              then("`panel.onmove` is not called", () => {
                expect(onmove).not.toHaveBeenCalled();
              });
            });

            and("`panel.status` is set to `Status.UNPINNED` again", () => {
              beforeEach(() => {
                panel.status = Status.UNPINNED;
              });

              when("the end user drags the taskbar", () => {
                beforeEach(() => {
                  drag(panel, 25, 15);
                });

                then("`panel.onmove` is called once", () => {
                  expect(onmove).toHaveBeenCalledTimes(1);
                });
              });
            });
          });

          and("`panel.condition` is `Condition.MAXIMIZED`", () => {
            beforeEach(() => {
              panel.condition = Condition.MAXIMIZED;
            });

            when("the end user drags the taskbar", () => {
              beforeEach(() => {
                drag(panel, 25, 15);
              });

              then("`panel.position` is `null`", () => {
                expect(panel.position).toBeNull();
              });

              then("`panel.onmove` is not called", () => {
                expect(onmove).not.toHaveBeenCalled();
              });
            });
          });

          when("the end user presses on `minimize` in the taskbar, and moves the pointer", () => {
            beforeEach(() => {
              const start = onControl(panel, Control.MINIMIZE);
              pointer(panel, Gesture.POINTERDOWN, start.x, start.y);
              pointer(panel, Gesture.POINTERMOVE, start.x + 25, start.y + 15);
              pointer(panel, Gesture.POINTERUP, start.x + 25, start.y + 15);
            });

            then("`panel.position` is `null`", () => {
              expect(panel.position).toBeNull();
            });

            then("`panel.onmove` is not called", () => {
              expect(onmove).not.toHaveBeenCalled();
            });
          });

          when("the end user presses on `pin` in the taskbar, and moves the pointer", () => {
            beforeEach(() => {
              const start = onControl(panel, Control.PIN);
              pointer(panel, Gesture.POINTERDOWN, start.x, start.y);
              pointer(panel, Gesture.POINTERMOVE, start.x + 25, start.y + 15);
              pointer(panel, Gesture.POINTERUP, start.x + 25, start.y + 15);
            });

            then("`panel.position` is `null`", () => {
              expect(panel.position).toBeNull();
            });

            then("`panel.onmove` is not called", () => {
              expect(onmove).not.toHaveBeenCalled();
            });
          });

          when("the end user presses on `maximize` in the taskbar, and moves the pointer", () => {
            beforeEach(() => {
              const start = onControl(panel, Control.MAXIMIZE);
              pointer(panel, Gesture.POINTERDOWN, start.x, start.y);
              pointer(panel, Gesture.POINTERMOVE, start.x + 25, start.y + 15);
              pointer(panel, Gesture.POINTERUP, start.x + 25, start.y + 15);
            });

            then("`panel.position` is `null`", () => {
              expect(panel.position).toBeNull();
            });

            then("`panel.onmove` is not called", () => {
              expect(onmove).not.toHaveBeenCalled();
            });
          });

          when("the end user presses on `close` in the taskbar, and moves the pointer", () => {
            beforeEach(() => {
              const start = onControl(panel, Control.CLOSE);
              pointer(panel, Gesture.POINTERDOWN, start.x, start.y);
              pointer(panel, Gesture.POINTERMOVE, start.x + 25, start.y + 15);
              pointer(panel, Gesture.POINTERUP, start.x + 25, start.y + 15);
            });

            then("`panel.position` is `null`", () => {
              expect(panel.position).toBeNull();
            });

            then("`panel.onmove` is not called", () => {
              expect(onmove).not.toHaveBeenCalled();
            });
          });

          and("`panel.condition` is `Condition.MINIMIZED`", () => {
            beforeEach(() => {
              panel.condition = Condition.MINIMIZED;
            });

            when("the end user drags the taskbar 25 to the right and 15 down", () => {
              let origin: Position;
              beforeEach(() => {
                origin = { left: panel.offsetLeft, top: panel.offsetTop };
                drag(panel, 25, 15);
              });

              then("`panel.position` is 25 further to the right and 15 further down", () => {
                expect(panel.position).toEqual({ left: origin.left + 25, top: origin.top + 15 });
              });

              then("`panel.onmove` is called once", () => {
                expect(onmove).toHaveBeenCalledTimes(1);
              });

              when("invoking `panel.restore`", () => {
                beforeEach(() => {
                  panel.restore();
                });

                then("`panel.condition` is `Condition.NORMAL`", () => {
                  expect(panel.condition).toBe(Condition.NORMAL);
                });

                then("the panel is where it was moved to", () => {
                  expect(panel.position).toEqual({ left: origin.left + 25, top: origin.top + 15 });
                  expect([panel.offsetLeft, panel.offsetTop]).toEqual([
                    origin.left + 25,
                    origin.top + 15
                  ]);
                });
              });
            });
          });
        });

        and("`panel.onresize` is set to a listener", () => {
          let onresize: jasmine.Spy;
          beforeEach(() => {
            onresize = jasmine.createSpy("onresize");
            panel.onresize = onresize;
          });
          afterEach(() => {
            panel.onresize = null;
          });

          when("the end user presses on the grip", () => {
            let start: { x: number; y: number };
            beforeEach(() => {
              start = onGrip(panel);
              gripPointer(panel, Gesture.POINTERDOWN, start.x, start.y);
            });
            afterEach(() => {
              gripPointer(panel, Gesture.POINTERUP, start.x, start.y);
            });

            then("`panel.dimensions` is `null`", () => {
              expect(panel.dimensions).toBeNull();
            });

            then("`panel.onresize` is not called", () => {
              expect(onresize).not.toHaveBeenCalled();
            });
          });

          and("`panel.condition` is `Condition.MINIMIZED`", () => {
            beforeEach(() => {
              panel.condition = Condition.MINIMIZED;
            });

            when("the end user drags the grip", () => {
              beforeEach(() => {
                stretch(panel, 25, 15);
              });

              then("`panel.dimensions` is `null`", () => {
                expect(panel.dimensions).toBeNull();
              });

              then("`panel.onresize` is not called", () => {
                expect(onresize).not.toHaveBeenCalled();
              });
            });
          });

          and("`panel.condition` is `Condition.MAXIMIZED`", () => {
            beforeEach(() => {
              panel.condition = Condition.MAXIMIZED;
            });

            when("the end user drags the grip", () => {
              beforeEach(() => {
                stretch(panel, 25, 15);
              });

              then("`panel.dimensions` is `null`", () => {
                expect(panel.dimensions).toBeNull();
              });

              then("`panel.onresize` is not called", () => {
                expect(onresize).not.toHaveBeenCalled();
              });
            });
          });

          and("`panel.status` is `Status.PINNED`", () => {
            beforeEach(() => {
              panel.status = Status.PINNED;
            });

            when("the end user drags the grip 25 to the right and 15 down", () => {
              beforeEach(() => {
                stretch(panel, 25, 15);
              });

              then("`panel.dimensions` is 25 wider and 15 higher", () => {
                expect(panel.dimensions).toEqual({ width: 505, height: 335 });
              });

              then("`panel.onresize` is called once", () => {
                expect(onresize).toHaveBeenCalledTimes(1);
              });
            });
          });
        });
      });
    });
  });
});

gesture(Gesture.POINTERMOVE, () => {
  and("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("a HTML Template is added to DOM", () => {
      beforeEach(async () => {
        await Panel.Template.load("panel.template.html");
      });
      afterEach(() => {
        remove(Panel.Tag);
      });

      and("a new panel, 480 wide and 320 high, is added to DOM", () => {
        let panel: Panel;
        beforeEach(async () => {
          panel = place(SIZED);
          await styled(panel);
        });
        afterEach(() => {
          panel.remove();
        });

        and("`panel.onmove` is set to a listener", () => {
          let onmove: jasmine.Spy;
          beforeEach(() => {
            onmove = jasmine.createSpy("onmove");
            panel.onmove = onmove;
          });
          afterEach(() => {
            panel.onmove = null;
          });

          when("the pointer moves over the taskbar without a press", () => {
            beforeEach(() => {
              const start = onBar(panel);
              pointer(panel, Gesture.POINTERMOVE, start.x + 25, start.y + 15);
            });

            then("`panel.position` is `null`", () => {
              expect(panel.position).toBeNull();
            });

            then("`panel.onmove` is not called", () => {
              expect(onmove).not.toHaveBeenCalled();
            });
          });

          and("the end user presses on the taskbar", () => {
            let origin: Position;
            let start: { x: number; y: number };
            beforeEach(() => {
              origin = { left: panel.offsetLeft, top: panel.offsetTop };
              start = onBar(panel);
              pointer(panel, Gesture.POINTERDOWN, start.x, start.y);
            });
            afterEach(() => {
              pointer(panel, Gesture.POINTERUP, start.x, start.y);
            });

            when("the pointer moves 25 to the right and 15 down", () => {
              beforeEach(() => {
                pointer(panel, Gesture.POINTERMOVE, start.x + 25, start.y + 15);
              });

              then("`panel.position` is 25 further to the right and 15 further down", () => {
                expect(panel.position).toEqual({ left: origin.left + 25, top: origin.top + 15 });
              });

              then("the panel has followed the pointer", () => {
                expect([panel.offsetLeft, panel.offsetTop]).toEqual([
                  origin.left + 25,
                  origin.top + 15
                ]);
              });

              then("`panel.onmove` is called once", () => {
                expect(onmove).toHaveBeenCalledTimes(1);
              });

              when("the pointer moves 40 to the left and 30 up from where the press started", () => {
                beforeEach(() => {
                  pointer(panel, Gesture.POINTERMOVE, start.x - 40, start.y - 30);
                });

                then("`panel.position` is 40 to the left and 30 up from where it started", () => {
                  expect(panel.position).toEqual({ left: origin.left - 40, top: origin.top - 30 });
                });
              });
            });
          });

          and("`panel.position` is set to `{ left: 120, top: 80 }`", () => {
            beforeEach(() => {
              panel.position = { left: 120, top: 80 };
            });

            when("the end user drags the taskbar 25 to the right and 15 down", () => {
              beforeEach(() => {
                drag(panel, 25, 15);
              });

              then("`panel.position` is `{ left: 145, top: 95 }`", () => {
                expect(panel.position).toEqual({ left: 145, top: 95 });
              });

              when("the end user drags the taskbar 5 to the left and 5 up", () => {
                beforeEach(() => {
                  drag(panel, -5, -5);
                });

                then("`panel.position` is `{ left: 140, top: 90 }`", () => {
                  expect(panel.position).toEqual({ left: 140, top: 90 });
                });
              });
            });
          });
        });

        and("`panel.onresize` is set to a listener", () => {
          let onresize: jasmine.Spy;
          beforeEach(() => {
            onresize = jasmine.createSpy("onresize");
            panel.onresize = onresize;
          });
          afterEach(() => {
            panel.onresize = null;
          });

          when("the pointer moves over the grip without a press", () => {
            beforeEach(() => {
              const start = onGrip(panel);
              gripPointer(panel, Gesture.POINTERMOVE, start.x + 25, start.y + 15);
            });

            then("`panel.dimensions` is `null`", () => {
              expect(panel.dimensions).toBeNull();
            });

            then("`panel.onresize` is not called", () => {
              expect(onresize).not.toHaveBeenCalled();
            });
          });

          and("the end user presses on the grip", () => {
            let start: { x: number; y: number };
            beforeEach(() => {
              start = onGrip(panel);
              gripPointer(panel, Gesture.POINTERDOWN, start.x, start.y);
            });
            afterEach(() => {
              gripPointer(panel, Gesture.POINTERUP, start.x, start.y);
            });

            when("the pointer moves 25 to the right and 15 down", () => {
              beforeEach(() => {
                gripPointer(panel, Gesture.POINTERMOVE, start.x + 25, start.y + 15);
              });

              then("`panel.dimensions` is 25 wider and 15 higher", () => {
                expect(panel.dimensions).toEqual({ width: 505, height: 335 });
              });

              then("the lower right of the panel has followed the pointer", () => {
                expect([panel.offsetWidth, panel.offsetHeight]).toEqual([505, 335]);
              });

              then("`panel.onresize` is called once", () => {
                expect(onresize).toHaveBeenCalledTimes(1);
              });

              then("`panel.position` is `null` still", () => {
                expect(panel.position).toBeNull();
              });

              then("the panel is where it was", () => {
                expect([panel.offsetLeft, panel.offsetTop]).toEqual([40, 30]);
              });

              when("the pointer moves 40 to the left and 30 up from where the press started", () => {
                beforeEach(() => {
                  gripPointer(panel, Gesture.POINTERMOVE, start.x - 40, start.y - 30);
                });

                then("`panel.dimensions` is 40 narrower and 30 lower than it started", () => {
                  expect(panel.dimensions).toEqual({ width: 440, height: 290 });
                });
              });
            });

            when("the pointer moves 1000 to the left and 1000 up", () => {
              beforeEach(() => {
                gripPointer(panel, Gesture.POINTERMOVE, start.x - 1000, start.y - 1000);
              });

              then("the panel is still as high as its taskbar, and as wide as it needs", () => {
                const taskbar = (panel.root.querySelector(Taskbar.Tag) as Taskbar).getBoundingClientRect();
                const box = panel.getBoundingClientRect();
                expect(taskbar.height).toBeGreaterThan(0);
                expect(box.bottom).toBeGreaterThanOrEqual(taskbar.bottom);
                expect(box.width).toBeGreaterThanOrEqual(160);
              });

              then("`panel.dimensions` holds the size the panel is shown at", () => {
                expect(panel.dimensions).toEqual({
                  width: panel.offsetWidth,
                  height: panel.offsetHeight
                });
              });

              when("the pointer moves back to where the press started", () => {
                beforeEach(() => {
                  gripPointer(panel, Gesture.POINTERMOVE, start.x, start.y);
                });

                then("`panel.dimensions` is `{ width: 480, height: 320 }`", () => {
                  expect(panel.dimensions).toEqual({ width: 480, height: 320 });
                });
              });
            });
          });

          and("`panel.dimensions` is set to `{ width: 400, height: 300 }`", () => {
            beforeEach(() => {
              panel.dimensions = { width: 400, height: 300 };
            });

            when("the end user drags the grip 25 to the right and 15 down", () => {
              beforeEach(() => {
                stretch(panel, 25, 15);
              });

              then("`panel.dimensions` is `{ width: 425, height: 315 }`", () => {
                expect(panel.dimensions).toEqual({ width: 425, height: 315 });
              });

              when("the end user drags the grip 5 to the left and 5 up", () => {
                beforeEach(() => {
                  stretch(panel, -5, -5);
                });

                then("`panel.dimensions` is `{ width: 420, height: 310 }`", () => {
                  expect(panel.dimensions).toEqual({ width: 420, height: 310 });
                });
              });
            });
          });

          and("the end user has moved the panel by its taskbar", () => {
            beforeEach(() => {
              drag(panel, 25, 15);
            });

            when("the end user drags the grip 25 to the right and 15 down", () => {
              beforeEach(() => {
                stretch(panel, 25, 15);
              });

              then("`panel.position` is as the move left it", () => {
                expect(panel.position).toEqual({ left: 65, top: 45 });
              });

              then("`panel.dimensions` is 25 wider and 15 higher", () => {
                expect(panel.dimensions).toEqual({ width: 505, height: 335 });
              });
            });
          });
        });
      });
    });
  });
});

gesture(Gesture.POINTERUP, () => {
  and("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("a HTML Template is added to DOM", () => {
      beforeEach(async () => {
        await Panel.Template.load("panel.template.html");
      });
      afterEach(() => {
        remove(Panel.Tag);
      });

      and("a new panel, 480 wide and 320 high, is added to DOM", () => {
        let panel: Panel;
        beforeEach(async () => {
          panel = place(SIZED);
          await styled(panel);
        });
        afterEach(() => {
          panel.remove();
        });

        and("`panel.onmove` is set to a listener", () => {
          let onmove: jasmine.Spy;
          beforeEach(() => {
            onmove = jasmine.createSpy("onmove");
            panel.onmove = onmove;
          });
          afterEach(() => {
            panel.onmove = null;
          });

          and("the end user presses on the taskbar", () => {
            let start: { x: number; y: number };
            beforeEach(() => {
              start = onBar(panel);
              pointer(panel, Gesture.POINTERDOWN, start.x, start.y);
            });
            afterEach(() => {
              pointer(panel, Gesture.POINTERUP, start.x, start.y);
            });

            when("the end user lifts the pointer, and the pointer moves", () => {
              beforeEach(() => {
                pointer(panel, Gesture.POINTERUP, start.x, start.y);
                pointer(panel, Gesture.POINTERMOVE, start.x + 25, start.y + 15);
              });

              then("`panel.position` is `null`", () => {
                expect(panel.position).toBeNull();
              });

              then("`panel.onmove` is not called", () => {
                expect(onmove).not.toHaveBeenCalled();
              });
            });
          });
        });

        and("`panel.onresize` is set to a listener", () => {
          let onresize: jasmine.Spy;
          beforeEach(() => {
            onresize = jasmine.createSpy("onresize");
            panel.onresize = onresize;
          });
          afterEach(() => {
            panel.onresize = null;
          });

          and("the end user presses on the grip", () => {
            let start: { x: number; y: number };
            beforeEach(() => {
              start = onGrip(panel);
              gripPointer(panel, Gesture.POINTERDOWN, start.x, start.y);
            });
            afterEach(() => {
              gripPointer(panel, Gesture.POINTERUP, start.x, start.y);
            });

            when("the end user lifts the pointer, and the pointer moves", () => {
              beforeEach(() => {
                gripPointer(panel, Gesture.POINTERUP, start.x, start.y);
                gripPointer(panel, Gesture.POINTERMOVE, start.x + 25, start.y + 15);
              });

              then("`panel.dimensions` is `null`", () => {
                expect(panel.dimensions).toBeNull();
              });

              then("`panel.onresize` is not called", () => {
                expect(onresize).not.toHaveBeenCalled();
              });
            });
          });
        });
      });
    });
  });
});

gesture(Gesture.POINTERCANCEL, () => {
  and("Panel is defined in custom element registry", () => {
    beforeEach(() => {
      define(Panel.Tag, Panel);
    });

    and("a HTML Template is added to DOM", () => {
      beforeEach(async () => {
        await Panel.Template.load("panel.template.html");
      });
      afterEach(() => {
        remove(Panel.Tag);
      });

      and("a new panel, 480 wide and 320 high, is added to DOM", () => {
        let panel: Panel;
        beforeEach(async () => {
          panel = place(SIZED);
          await styled(panel);
        });
        afterEach(() => {
          panel.remove();
        });

        and("`panel.onmove` is set to a listener", () => {
          let onmove: jasmine.Spy;
          beforeEach(() => {
            onmove = jasmine.createSpy("onmove");
            panel.onmove = onmove;
          });
          afterEach(() => {
            panel.onmove = null;
          });

          and("the end user presses on the taskbar", () => {
            let start: { x: number; y: number };
            beforeEach(() => {
              start = onBar(panel);
              pointer(panel, Gesture.POINTERDOWN, start.x, start.y);
            });
            afterEach(() => {
              pointer(panel, Gesture.POINTERUP, start.x, start.y);
            });

            when("the browser ends the press, and the pointer moves", () => {
              beforeEach(() => {
                pointer(panel, Gesture.POINTERCANCEL, start.x, start.y);
                pointer(panel, Gesture.POINTERMOVE, start.x + 25, start.y + 15);
              });

              then("`panel.position` is `null`", () => {
                expect(panel.position).toBeNull();
              });

              then("`panel.onmove` is not called", () => {
                expect(onmove).not.toHaveBeenCalled();
              });
            });
          });
        });

        and("`panel.onresize` is set to a listener", () => {
          let onresize: jasmine.Spy;
          beforeEach(() => {
            onresize = jasmine.createSpy("onresize");
            panel.onresize = onresize;
          });
          afterEach(() => {
            panel.onresize = null;
          });

          and("the end user presses on the grip", () => {
            let start: { x: number; y: number };
            beforeEach(() => {
              start = onGrip(panel);
              gripPointer(panel, Gesture.POINTERDOWN, start.x, start.y);
            });
            afterEach(() => {
              gripPointer(panel, Gesture.POINTERUP, start.x, start.y);
            });

            when("the browser ends the press, and the pointer moves", () => {
              beforeEach(() => {
                gripPointer(panel, Gesture.POINTERCANCEL, start.x, start.y);
                gripPointer(panel, Gesture.POINTERMOVE, start.x + 25, start.y + 15);
              });

              then("`panel.dimensions` is `null`", () => {
                expect(panel.dimensions).toBeNull();
              });

              then("`panel.onresize` is not called", () => {
                expect(onresize).not.toHaveBeenCalled();
              });
            });
          });
        });
      });
    });
  });
});
