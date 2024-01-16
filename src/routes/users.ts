import { BaseCrudRoute } from "../libs/route";
import User from "../models/user";
import UserService from "../services/user";

export default new BaseCrudRoute("/users", User, undefined, {
  async afterCreate(model) {
    UserService.getEventSource().emit({
      event: "created",
      user: model as User,
    });
  },
});
