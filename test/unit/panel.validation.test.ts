import { State, Condition, Status } from "@scalable.software/panel";

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
