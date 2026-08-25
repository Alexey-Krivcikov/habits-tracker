import { describe, expect, it } from "vitest";
import { queryKeys } from "./index";

describe("queryKeys", () => {
  it("matches snapshot for regression protection", () => {
    expect(queryKeys).toMatchInlineSnapshot(`
      {
        "auth": {
          "login": [
            "auth",
            "login",
          ],
          "register": [
            "auth",
            "register",
          ],
        },
        "entries": {
          "all": [
            "entries",
          ],
          "create": [
            "entries",
            "create",
          ],
          "delete": [
            "entries",
            "delete",
          ],
          "paginated": [Function],
          "update": [
            "entries",
            "update",
          ],
        },
      }
    `);
  });

  it("builds paginated keys with page and pageSize", () => {
    expect(queryKeys.entries.paginated(1, 12)).toEqual(["entries", "paginated", 1, 12]);
    expect(queryKeys.entries.paginated(2, 10)).toEqual(["entries", "paginated", 2, 10]);
  });
});
