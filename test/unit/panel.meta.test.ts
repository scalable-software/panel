import {
  Tag,
  Attributes,
  State,
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

// Operation
metadata(Metadata.OPERATION, () => {
  and("Operation imported", () => {
    then("Operation is defined", () => {
      expect(Operation).toBeDefined();
    });

    when("Operation is defined", () => {
      then("Operation is an object", () => {
        expect(typeof Operation).toBe("object");
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

    when("Event is defined", () => {
      then("Event is an object", () => {
        expect(typeof Event).toBe("object");
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
