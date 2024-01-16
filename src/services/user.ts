import application from "../application";
import { BaseService, EventService } from "../libs/service";
import User from "../models/user";
import { EventSource, SimpleEventSource } from "../utils/events";

type UserEvent = {
  event: "login" | "logout" | "created";
  user: User;
};

class UserService implements BaseService, EventService {
  register(): void {}

  private setupMeta() {}

  getEventSource() {
    return this.events;
  }

  private events = new SimpleEventSource<"users", UserEvent>("users");
}

export default new UserService();
