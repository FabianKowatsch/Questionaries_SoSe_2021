import { User } from "../src/classes/User";

let user: User = User.getInstance();

describe("This is a simple unit test", () => {
  test("Check the Username function", () => {
    expect(user.isValidUsername("Username1234")).toBe(true);
  });
});
