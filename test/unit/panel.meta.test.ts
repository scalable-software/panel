import {
  Tag,
  Attributes,
  State,
  Datum,
  Visibility,
  Status,
  Condition,
  Operation,
  Event,
  Gesture
} from "@scalable.software/panel";

// Tag
metadata(Metadata.TAG, () => {
  when("Tag imported", () => {
    then("Tag is defined", () => {
      expect(Tag).toBeDefined();
    });

    then("Tag is `window-panel`", () => {
      expect(Tag).toBe("window-panel");
    });
  });
});

// Attributes
metadata(Metadata.ATTRIBUTES, () => {
  and("Attribute imported", () => {
    then("Attributes is defined", () => {
      expect(Attributes).toBeDefined();
    });

    and("Attributes is defined", () => {
      then("Attributes is an object", () => {
        expect(typeof Attributes).toBe("object");
      });

      when("Attributes is an object", () => {
        then("`Attributes.CONDITION` exists", () => {
          expect(Attributes.CONDITION).toBeDefined();
        });

        then("`Attributes.CONDITION` is `condition`", () => {
          expect(Attributes.CONDITION).toBe("condition");
        });

        then("`Attributes.STATUS` exists", () => {
          expect(Attributes.STATUS).toBeDefined();
        });

        then("`Attributes.STATUS` is `status`", () => {
          expect(Attributes.STATUS).toBe("status");
        });

        then("`Attributes.VISIBILITY` exists", () => {
          expect(Attributes.VISIBILITY).toBeDefined();
        });

        then("`Attributes.VISIBILITY` is `visibility`", () => {
          expect(Attributes.VISIBILITY).toBe("visibility");
        });
      });
    });
  });
});

// State
metadata(Metadata.STATE, () => {
  and("State imported", () => {
    then("State is defined", () => {
      expect(State).toBeDefined();
    });

    and("State is defined", () => {
      then("State is an object", () => {
        expect(typeof State).toBe("object");
      });

      when("State is an object", () => {
        then("`State.CONDITION` exists", () => {
          expect(State.CONDITION).toBeDefined();
        });

        then("`State.CONDITION` is `condition`", () => {
          expect(State.CONDITION).toBe("condition");
        });

        then("`State.STATUS` exists", () => {
          expect(State.STATUS).toBeDefined();
        });

        then("`State.STATUS` is `status`", () => {
          expect(State.STATUS).toBe("status");
        });

        then("`State.VISIBILITY` exists", () => {
          expect(State.VISIBILITY).toBeDefined();
        });

        then("`State.VISIBILITY` is `visibility`", () => {
          expect(State.VISIBILITY).toBe("visibility");
        });
      });
    });
  });
});

metadata(State.CONDITION, () => {
  and("Condition imported", () => {
    then("Condition is defined", () => {
      expect(Condition).toBeDefined();
    });

    and("Condition is defined", () => {
      then("Condition is an object", () => {
        expect(typeof Condition).toBe("object");
      });

      when("Condition is an object", () => {
        then("`Condition.NORMAL` exists", () => {
          expect(Condition.NORMAL).toBeDefined();
        });

        then("`Condition.NORMAL` is `normal`", () => {
          expect(Condition.NORMAL).toBe("normal");
        });

        then("`Condition.MINIMIZED` exists", () => {
          expect(Condition.MINIMIZED).toBeDefined();
        });

        then("`Condition.MINIMIZED` is `minimized`", () => {
          expect(Condition.MINIMIZED).toBe("minimized");
        });

        then("`Condition.MAXIMIZED` exists", () => {
          expect(Condition.MAXIMIZED).toBeDefined();
        });

        then("`Condition.MAXIMIZED` is `maximized`", () => {
          expect(Condition.MAXIMIZED).toBe("maximized");
        });
      });
    });
  });
});

metadata(State.STATUS, () => {
  and("Status imported", () => {
    then("Status is defined", () => {
      expect(Status).toBeDefined();
    });

    and("Status is defined", () => {
      then("Status is an object", () => {
        expect(typeof Status).toBe("object");
      });

      when("Status is an object", () => {
        then("`Status.UNPINNED` exists", () => {
          expect(Status.UNPINNED).toBeDefined();
        });

        then("`Status.UNPINNED` is `unpinned`", () => {
          expect(Status.UNPINNED).toBe("unpinned");
        });

        then("`Status.PINNED` exists", () => {
          expect(Status.PINNED).toBeDefined();
        });

        then("`Status.PINNED` is `pinned`", () => {
          expect(Status.PINNED).toBe("pinned");
        });
      });
    });
  });
});

metadata(State.VISIBILITY, () => {
  and("Visibility imported", () => {
    then("Visibility is defined", () => {
      expect(Visibility).toBeDefined();
    });

    and("Visibility is defined", () => {
      then("Visibility is an object", () => {
        expect(typeof Visibility).toBe("object");
      });

      when("Visibility is an object", () => {
        then("`Visibility.VISIBLE` exists", () => {
          expect(Visibility.VISIBLE).toBeDefined();
        });

        then("`Visibility.VISIBLE` is `visible`", () => {
          expect(Visibility.VISIBLE).toBe("visible");
        });

        then("`Visibility.HIDDEN` exists", () => {
          expect(Visibility.HIDDEN).toBeDefined();
        });

        then("`Visibility.HIDDEN` is `hidden`", () => {
          expect(Visibility.HIDDEN).toBe("hidden");
        });
      });
    });
  });
});

// Datum
metadata(Metadata.DATUM, () => {
  and("Datum imported", () => {
    then("Datum is defined", () => {
      expect(Datum).toBeDefined();
    });

    and("Datum is defined", () => {
      then("Datum is an object", () => {
        expect(typeof Datum).toBe("object");
      });

      when("Datum is an object", () => {
        then("no data name is taken by the platform", () => {
          const taken = Object.values(Datum).filter(
            (name) => name in HTMLElement.prototype
          );
          expect(taken).toEqual([]);
        });

        then("`Datum.POSITION` exists", () => {
          expect(Datum.POSITION).toBeDefined();
        });

        then("`Datum.POSITION` is `position`", () => {
          expect(Datum.POSITION).toBe("position");
        });
      });
    });
  });
});

// Operation
metadata(Metadata.OPERATION, () => {
  and("Operation imported", () => {
    then("Operation is defined", () => {
      expect(Operation).toBeDefined();
    });

    and("Operation is defined", () => {
      then("Operation is an object", () => {
        expect(typeof Operation).toBe("object");
      });

      when("Operation is an object", () => {
        then("no operation name is taken by the platform", () => {
          const taken = Object.values(Operation).filter(
            (name) => name in HTMLElement.prototype
          );
          expect(taken).toEqual([]);
        });

        then("`Operation.HIDE` exists", () => {
          expect(Operation.HIDE).toBeDefined();
        });

        then("`Operation.HIDE` is `hide`", () => {
          expect(Operation.HIDE).toBe("hide");
        });

        then("`Operation.SHOW` exists", () => {
          expect(Operation.SHOW).toBeDefined();
        });

        then("`Operation.SHOW` is `show`", () => {
          expect(Operation.SHOW).toBe("show");
        });

        then("`Operation.PIN` exists", () => {
          expect(Operation.PIN).toBeDefined();
        });

        then("`Operation.PIN` is `pin`", () => {
          expect(Operation.PIN).toBe("pin");
        });

        then("`Operation.UNPIN` exists", () => {
          expect(Operation.UNPIN).toBeDefined();
        });

        then("`Operation.UNPIN` is `unpin`", () => {
          expect(Operation.UNPIN).toBe("unpin");
        });

        then("`Operation.MINIMIZE` exists", () => {
          expect(Operation.MINIMIZE).toBeDefined();
        });

        then("`Operation.MINIMIZE` is `minimize`", () => {
          expect(Operation.MINIMIZE).toBe("minimize");
        });

        then("`Operation.MAXIMIZE` exists", () => {
          expect(Operation.MAXIMIZE).toBeDefined();
        });

        then("`Operation.MAXIMIZE` is `maximize`", () => {
          expect(Operation.MAXIMIZE).toBe("maximize");
        });

        then("`Operation.RESTORE` exists", () => {
          expect(Operation.RESTORE).toBeDefined();
        });

        then("`Operation.RESTORE` is `restore`", () => {
          expect(Operation.RESTORE).toBe("restore");
        });

        then("`Operation.CLOSE` exists", () => {
          expect(Operation.CLOSE).toBeDefined();
        });

        then("`Operation.CLOSE` is `close`", () => {
          expect(Operation.CLOSE).toBe("close");
        });
      });
    });
  });
});

// Event
metadata(Metadata.EVENT, () => {
  and("Event imported", () => {
    then("Event is defined", () => {
      expect(Event).toBeDefined();
    });

    and("Event is defined", () => {
      then("Event is an object", () => {
        expect(typeof Event).toBe("object");
      });

      when("Event is an object", () => {
        then("only `onclose` is taken by the platform, deliberately", () => {
          const taken = Object.values(Event).filter(
            (name) => name in HTMLElement.prototype
          );
          expect(taken).toEqual(["onclose"]);
        });

        then("`Event.ON_HIDE` exists", () => {
          expect(Event.ON_HIDE).toBeDefined();
        });

        then("`Event.ON_HIDE` is `onhide`", () => {
          expect(Event.ON_HIDE).toBe("onhide");
        });

        then("`Event.ON_SHOW` exists", () => {
          expect(Event.ON_SHOW).toBeDefined();
        });

        then("`Event.ON_SHOW` is `onshow`", () => {
          expect(Event.ON_SHOW).toBe("onshow");
        });

        then("`Event.ON_PIN` exists", () => {
          expect(Event.ON_PIN).toBeDefined();
        });

        then("`Event.ON_PIN` is `onpin`", () => {
          expect(Event.ON_PIN).toBe("onpin");
        });

        then("`Event.ON_UNPIN` exists", () => {
          expect(Event.ON_UNPIN).toBeDefined();
        });

        then("`Event.ON_UNPIN` is `onunpin`", () => {
          expect(Event.ON_UNPIN).toBe("onunpin");
        });

        then("`Event.ON_MINIMIZE` exists", () => {
          expect(Event.ON_MINIMIZE).toBeDefined();
        });

        then("`Event.ON_MINIMIZE` is `onminimize`", () => {
          expect(Event.ON_MINIMIZE).toBe("onminimize");
        });

        then("`Event.ON_MAXIMIZE` exists", () => {
          expect(Event.ON_MAXIMIZE).toBeDefined();
        });

        then("`Event.ON_MAXIMIZE` is `onmaximize`", () => {
          expect(Event.ON_MAXIMIZE).toBe("onmaximize");
        });

        then("`Event.ON_RESTORE` exists", () => {
          expect(Event.ON_RESTORE).toBeDefined();
        });

        then("`Event.ON_RESTORE` is `onrestore`", () => {
          expect(Event.ON_RESTORE).toBe("onrestore");
        });

        then("`Event.ON_CLOSE` exists", () => {
          expect(Event.ON_CLOSE).toBeDefined();
        });

        then("`Event.ON_CLOSE` is `onclose`", () => {
          expect(Event.ON_CLOSE).toBe("onclose");
        });
      });
    });
  });
});

// Gesture
metadata(Metadata.GESTURE, () => {
  and("Gesture imported", () => {
    then("Gesture is defined", () => {
      expect(Gesture).toBeDefined();
    });

    when("Gesture is defined", () => {
      then("Gesture is an object", () => {
        expect(typeof Gesture).toBe("object");
      });
    });
  });
});
