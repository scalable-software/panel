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
  Event
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
      });
    });
  });
});

// Gesture
