import { State, Datum, Condition, Status, Visibility } from "@scalable.software/panel";

import { Validate } from "@scalable.software/panel";

validation(State.CONDITION, () => {
  given("Validate imported", () => {
    then("Validate is defined", () => {
      expect(Validate).toBeDefined();
    });

    and("Validate is defined", () => {
      then("`Validate.condition` static method exists", () => {
        expect(Validate.condition).toBeDefined();
      });

      and("`value` is `Condition.NORMAL`", () => {
        let value: any;
        beforeEach(() => {
          value = Condition.NORMAL;
        });

        when("`Validate.condition(value)` is called", () => {
          let error: unknown | undefined;
          let result: any;
          beforeEach(() => {
            try {
              result = Validate.condition(value);
            } catch (err) {
              error = err;
            }
          });

          then("no error is thrown", () => {
            expect(error).toBeUndefined();
          });

          then("result is `Condition.NORMAL`", () => {
            expect(result).toBe(Condition.NORMAL);
          });
        });
      });

      and("`value` is `Condition.MINIMIZED`", () => {
        let value: any;
        beforeEach(() => {
          value = Condition.MINIMIZED;
        });

        when("`Validate.condition(value)` is called", () => {
          let error: unknown | undefined;
          let result: any;
          beforeEach(() => {
            try {
              result = Validate.condition(value);
            } catch (err) {
              error = err;
            }
          });

          then("no error is thrown", () => {
            expect(error).toBeUndefined();
          });

          then("result is `Condition.MINIMIZED`", () => {
            expect(result).toBe(Condition.MINIMIZED);
          });
        });
      });

      and("`value` is `Condition.MAXIMIZED`", () => {
        let value: any;
        beforeEach(() => {
          value = Condition.MAXIMIZED;
        });

        when("`Validate.condition(value)` is called", () => {
          let error: unknown | undefined;
          let result: any;
          beforeEach(() => {
            try {
              result = Validate.condition(value);
            } catch (err) {
              error = err;
            }
          });

          then("no error is thrown", () => {
            expect(error).toBeUndefined();
          });

          then("result is `Condition.MAXIMIZED`", () => {
            expect(result).toBe(Condition.MAXIMIZED);
          });
        });
      });

      and("`value` is `invalid`", () => {
        let value: any;
        beforeEach(() => {
          value = "invalid";
        });

        when("`Validate.condition(value)` is called", () => {
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              Validate.condition(value);
            } catch (err) {
              error = err;
            }
          });

          then("an error is thrown", () => {
            expect(error).not.toBeUndefined();
          });

          then("error message contains 'Invalid condition value: invalid'", () => {
            expect((error as Error).message).toEqual(
              "Invalid condition value: invalid"
            );
          });
        });
      });
    });
  });
});

validation(State.STATUS, () => {
  given("Validate imported", () => {
    then("Validate is defined", () => {
      expect(Validate).toBeDefined();
    });

    and("Validate is defined", () => {
      then("`Validate.status` static method exists", () => {
        expect(Validate.status).toBeDefined();
      });

      and("`value` is `Status.UNPINNED`", () => {
        let value: any;
        beforeEach(() => {
          value = Status.UNPINNED;
        });

        when("`Validate.status(value)` is called", () => {
          let error: unknown | undefined;
          let result: any;
          beforeEach(() => {
            try {
              result = Validate.status(value);
            } catch (err) {
              error = err;
            }
          });

          then("no error is thrown", () => {
            expect(error).toBeUndefined();
          });

          then("result is `Status.UNPINNED`", () => {
            expect(result).toBe(Status.UNPINNED);
          });
        });
      });

      and("`value` is `Status.PINNED`", () => {
        let value: any;
        beforeEach(() => {
          value = Status.PINNED;
        });

        when("`Validate.status(value)` is called", () => {
          let error: unknown | undefined;
          let result: any;
          beforeEach(() => {
            try {
              result = Validate.status(value);
            } catch (err) {
              error = err;
            }
          });

          then("no error is thrown", () => {
            expect(error).toBeUndefined();
          });

          then("result is `Status.PINNED`", () => {
            expect(result).toBe(Status.PINNED);
          });
        });
      });

      and("`value` is `invalid`", () => {
        let value: any;
        beforeEach(() => {
          value = "invalid";
        });

        when("`Validate.status(value)` is called", () => {
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              Validate.status(value);
            } catch (err) {
              error = err;
            }
          });

          then("an error is thrown", () => {
            expect(error).not.toBeUndefined();
          });

          then("error message contains 'Invalid status value: invalid'", () => {
            expect((error as Error).message).toEqual(
              "Invalid status value: invalid"
            );
          });
        });
      });
    });
  });
});

validation(State.VISIBILITY, () => {
  given("Validate imported", () => {
    then("Validate is defined", () => {
      expect(Validate).toBeDefined();
    });

    and("Validate is defined", () => {
      then("`Validate.visibility` static method exists", () => {
        expect(Validate.visibility).toBeDefined();
      });

      and("`value` is `Visibility.VISIBLE`", () => {
        let value: any;
        beforeEach(() => {
          value = Visibility.VISIBLE;
        });

        when("`Validate.visibility(value)` is called", () => {
          let error: unknown | undefined;
          let result: any;
          beforeEach(() => {
            try {
              result = Validate.visibility(value);
            } catch (err) {
              error = err;
            }
          });

          then("no error is thrown", () => {
            expect(error).toBeUndefined();
          });

          then("result is `Visibility.VISIBLE`", () => {
            expect(result).toBe(Visibility.VISIBLE);
          });
        });
      });

      and("`value` is `Visibility.HIDDEN`", () => {
        let value: any;
        beforeEach(() => {
          value = Visibility.HIDDEN;
        });

        when("`Validate.visibility(value)` is called", () => {
          let error: unknown | undefined;
          let result: any;
          beforeEach(() => {
            try {
              result = Validate.visibility(value);
            } catch (err) {
              error = err;
            }
          });

          then("no error is thrown", () => {
            expect(error).toBeUndefined();
          });

          then("result is `Visibility.HIDDEN`", () => {
            expect(result).toBe(Visibility.HIDDEN);
          });
        });
      });

      and("`value` is `invalid`", () => {
        let value: any;
        beforeEach(() => {
          value = "invalid";
        });

        when("`Validate.visibility(value)` is called", () => {
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              Validate.visibility(value);
            } catch (err) {
              error = err;
            }
          });

          then("an error is thrown", () => {
            expect(error).not.toBeUndefined();
          });

          then("error message contains 'Invalid visibility value: invalid'", () => {
            expect((error as Error).message).toEqual(
              "Invalid visibility value: invalid"
            );
          });
        });
      });
    });
  });
});

validation(Datum.POSITION, () => {
  given("Validate imported", () => {
    then("Validate is defined", () => {
      expect(Validate).toBeDefined();
    });

    and("Validate is defined", () => {
      then("`Validate.position` static method exists", () => {
        expect(Validate.position).toBeDefined();
      });

      and("`value` is `{ left: 120, top: 80 }`", () => {
        let value: any;
        beforeEach(() => {
          value = { left: 120, top: 80 };
        });

        when("`Validate.position(value)` is called", () => {
          let error: unknown | undefined;
          let result: any;
          beforeEach(() => {
            try {
              result = Validate.position(value);
            } catch (err) {
              error = err;
            }
          });

          then("no error is thrown", () => {
            expect(error).toBeUndefined();
          });

          then("result is `value`", () => {
            expect(result).toBe(value);
          });
        });
      });

      and("`value` is `invalid`", () => {
        let value: any;
        beforeEach(() => {
          value = "invalid";
        });

        when("`Validate.position(value)` is called", () => {
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              Validate.position(value);
            } catch (err) {
              error = err;
            }
          });

          then("an error is thrown", () => {
            expect(error).not.toBeUndefined();
          });

          then("error message contains 'Invalid position value: invalid'", () => {
            expect((error as Error).message).toEqual("Invalid position value: invalid");
          });
        });
      });

      and("`value` is `null`", () => {
        let value: any;
        beforeEach(() => {
          value = null;
        });

        when("`Validate.position(value)` is called", () => {
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              Validate.position(value);
            } catch (err) {
              error = err;
            }
          });

          then("an error is thrown", () => {
            expect(error).not.toBeUndefined();
          });

          then("error message contains 'Invalid position value: null'", () => {
            expect((error as Error).message).toEqual("Invalid position value: null");
          });
        });
      });

      and("`value` is a list", () => {
        let value: any;
        beforeEach(() => {
          value = [120, 80];
        });

        when("`Validate.position(value)` is called", () => {
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              Validate.position(value);
            } catch (err) {
              error = err;
            }
          });

          then("an error is thrown", () => {
            expect(error).not.toBeUndefined();
          });

          then("error message contains 'Invalid position value: 120,80'", () => {
            expect((error as Error).message).toEqual("Invalid position value: 120,80");
          });
        });
      });

      and("`value` is a position with an undeclared `right`", () => {
        let value: any;
        beforeEach(() => {
          value = { left: 120, top: 80, right: 4 };
        });

        when("`Validate.position(value)` is called", () => {
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              Validate.position(value);
            } catch (err) {
              error = err;
            }
          });

          then("an error is thrown", () => {
            expect(error).not.toBeUndefined();
          });

          then("error message contains 'Invalid position value: right is not declared'", () => {
            expect((error as Error).message).toEqual("Invalid position value: right is not declared");
          });
        });
      });

      and("`value` is a position without `left`", () => {
        let value: any;
        beforeEach(() => {
          value = { top: 80 };
        });

        when("`Validate.position(value)` is called", () => {
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              Validate.position(value);
            } catch (err) {
              error = err;
            }
          });

          then("an error is thrown", () => {
            expect(error).not.toBeUndefined();
          });

          then("error message contains 'Invalid position value: left is required'", () => {
            expect((error as Error).message).toEqual("Invalid position value: left is required");
          });
        });
      });

      and("`value` is a position whose `left` is not a number", () => {
        let value: any;
        beforeEach(() => {
          value = { left: "120", top: 80 };
        });

        when("`Validate.position(value)` is called", () => {
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              Validate.position(value);
            } catch (err) {
              error = err;
            }
          });

          then("an error is thrown", () => {
            expect(error).not.toBeUndefined();
          });

          then("error message contains 'Invalid position value: left is invalid'", () => {
            expect((error as Error).message).toEqual("Invalid position value: left is invalid");
          });
        });
      });

      and("`value` is a position whose `left` is not finite", () => {
        let value: any;
        beforeEach(() => {
          value = { left: Infinity, top: 80 };
        });

        when("`Validate.position(value)` is called", () => {
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              Validate.position(value);
            } catch (err) {
              error = err;
            }
          });

          then("an error is thrown", () => {
            expect(error).not.toBeUndefined();
          });

          then("error message contains 'Invalid position value: left is invalid'", () => {
            expect((error as Error).message).toEqual("Invalid position value: left is invalid");
          });
        });
      });

      and("`value` is a position without `top`", () => {
        let value: any;
        beforeEach(() => {
          value = { left: 120 };
        });

        when("`Validate.position(value)` is called", () => {
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              Validate.position(value);
            } catch (err) {
              error = err;
            }
          });

          then("an error is thrown", () => {
            expect(error).not.toBeUndefined();
          });

          then("error message contains 'Invalid position value: top is required'", () => {
            expect((error as Error).message).toEqual("Invalid position value: top is required");
          });
        });
      });

      and("`value` is a position whose `top` is not a number", () => {
        let value: any;
        beforeEach(() => {
          value = { left: 120, top: NaN };
        });

        when("`Validate.position(value)` is called", () => {
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              Validate.position(value);
            } catch (err) {
              error = err;
            }
          });

          then("an error is thrown", () => {
            expect(error).not.toBeUndefined();
          });

          then("error message contains 'Invalid position value: top is invalid'", () => {
            expect((error as Error).message).toEqual("Invalid position value: top is invalid");
          });
        });
      });
    });
  });
});

validation(Datum.DIMENSIONS, () => {
  given("Validate imported", () => {
    then("Validate is defined", () => {
      expect(Validate).toBeDefined();
    });

    and("Validate is defined", () => {
      then("`Validate.dimensions` static method exists", () => {
        expect(Validate.dimensions).toBeDefined();
      });

      and("`value` is `{ width: 120, height: 80 }`", () => {
        let value: any;
        beforeEach(() => {
          value = { width: 120, height: 80 };
        });

        when("`Validate.dimensions(value)` is called", () => {
          let error: unknown | undefined;
          let result: any;
          beforeEach(() => {
            try {
              result = Validate.dimensions(value);
            } catch (err) {
              error = err;
            }
          });

          then("no error is thrown", () => {
            expect(error).toBeUndefined();
          });

          then("result is `value`", () => {
            expect(result).toBe(value);
          });
        });
      });

      and("`value` is `invalid`", () => {
        let value: any;
        beforeEach(() => {
          value = "invalid";
        });

        when("`Validate.dimensions(value)` is called", () => {
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              Validate.dimensions(value);
            } catch (err) {
              error = err;
            }
          });

          then("an error is thrown", () => {
            expect(error).not.toBeUndefined();
          });

          then("error message contains 'Invalid dimensions value: invalid'", () => {
            expect((error as Error).message).toEqual("Invalid dimensions value: invalid");
          });
        });
      });

      and("`value` is `null`", () => {
        let value: any;
        beforeEach(() => {
          value = null;
        });

        when("`Validate.dimensions(value)` is called", () => {
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              Validate.dimensions(value);
            } catch (err) {
              error = err;
            }
          });

          then("an error is thrown", () => {
            expect(error).not.toBeUndefined();
          });

          then("error message contains 'Invalid dimensions value: null'", () => {
            expect((error as Error).message).toEqual("Invalid dimensions value: null");
          });
        });
      });

      and("`value` is a list", () => {
        let value: any;
        beforeEach(() => {
          value = [120, 80];
        });

        when("`Validate.dimensions(value)` is called", () => {
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              Validate.dimensions(value);
            } catch (err) {
              error = err;
            }
          });

          then("an error is thrown", () => {
            expect(error).not.toBeUndefined();
          });

          then("error message contains 'Invalid dimensions value: 120,80'", () => {
            expect((error as Error).message).toEqual("Invalid dimensions value: 120,80");
          });
        });
      });

      and("`value` is dimensions with an undeclared `depth`", () => {
        let value: any;
        beforeEach(() => {
          value = { width: 120, height: 80, depth: 4 };
        });

        when("`Validate.dimensions(value)` is called", () => {
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              Validate.dimensions(value);
            } catch (err) {
              error = err;
            }
          });

          then("an error is thrown", () => {
            expect(error).not.toBeUndefined();
          });

          then("error message contains 'Invalid dimensions value: depth is not declared'", () => {
            expect((error as Error).message).toEqual("Invalid dimensions value: depth is not declared");
          });
        });
      });

      and("`value` is dimensions without `width`", () => {
        let value: any;
        beforeEach(() => {
          value = { height: 80 };
        });

        when("`Validate.dimensions(value)` is called", () => {
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              Validate.dimensions(value);
            } catch (err) {
              error = err;
            }
          });

          then("an error is thrown", () => {
            expect(error).not.toBeUndefined();
          });

          then("error message contains 'Invalid dimensions value: width is required'", () => {
            expect((error as Error).message).toEqual("Invalid dimensions value: width is required");
          });
        });
      });

      and("`value` is dimensions whose `width` is not a number", () => {
        let value: any;
        beforeEach(() => {
          value = { width: "120", height: 80 };
        });

        when("`Validate.dimensions(value)` is called", () => {
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              Validate.dimensions(value);
            } catch (err) {
              error = err;
            }
          });

          then("an error is thrown", () => {
            expect(error).not.toBeUndefined();
          });

          then("error message contains 'Invalid dimensions value: width is invalid'", () => {
            expect((error as Error).message).toEqual("Invalid dimensions value: width is invalid");
          });
        });
      });

      and("`value` is dimensions whose `width` is negative", () => {
        let value: any;
        beforeEach(() => {
          value = { width: -1, height: 80 };
        });

        when("`Validate.dimensions(value)` is called", () => {
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              Validate.dimensions(value);
            } catch (err) {
              error = err;
            }
          });

          then("an error is thrown", () => {
            expect(error).not.toBeUndefined();
          });

          then("error message contains 'Invalid dimensions value: width is invalid'", () => {
            expect((error as Error).message).toEqual("Invalid dimensions value: width is invalid");
          });
        });
      });

      and("`value` is dimensions without `height`", () => {
        let value: any;
        beforeEach(() => {
          value = { width: 120 };
        });

        when("`Validate.dimensions(value)` is called", () => {
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              Validate.dimensions(value);
            } catch (err) {
              error = err;
            }
          });

          then("an error is thrown", () => {
            expect(error).not.toBeUndefined();
          });

          then("error message contains 'Invalid dimensions value: height is required'", () => {
            expect((error as Error).message).toEqual("Invalid dimensions value: height is required");
          });
        });
      });

      and("`value` is dimensions whose `height` is not a number", () => {
        let value: any;
        beforeEach(() => {
          value = { width: 120, height: NaN };
        });

        when("`Validate.dimensions(value)` is called", () => {
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              Validate.dimensions(value);
            } catch (err) {
              error = err;
            }
          });

          then("an error is thrown", () => {
            expect(error).not.toBeUndefined();
          });

          then("error message contains 'Invalid dimensions value: height is invalid'", () => {
            expect((error as Error).message).toEqual("Invalid dimensions value: height is invalid");
          });
        });
      });
    });
  });
});
