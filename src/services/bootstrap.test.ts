import application from "../application";
import User from "../models/user";
import userService from "../services/user";
import { withSetters } from "../utils/mixins";
import modify from "../utils/modify";

describe("Bootrap", () => {
  it("Should be called when a user is created", () => {
    userService.getEventSource().emit({
      event: "created",
      user: modify(new User())
        .set("id", "abc")
        .set("createdAt", new Date())
        .set("valid", true),
    });
  });
});
