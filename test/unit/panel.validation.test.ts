import { State, Condition } from "@scalable.software/panel";

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
    });
  });
});
