import { User } from "../src/classes/User";

let user: User = User.getInstance();

describe("This is a simple unit test", () => {
  test("Check the Username function with valid username", () => {
    expect(user.isValidUsername("Username1234")).toBe(true);
  });
  test("Check the Username function with invalid username", () => {
    expect(user.isValidUsername("Username_1234")).toBe(false);
  });
});
