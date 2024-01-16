import application from "../application";
import { BaseService, EventService } from "../libs/service";
import { EventSource, SimpleEventSource } from "../utils/events";

type UserEvent = {
  event: "login" | "logout";
};

class UserService implements BaseService, EventService {
  register(): void {
    // Sends out email when the user is created
    application()
      .events.when("models")
      .where("$event = create && $type = model")
      .then(() => {});

    // Sends out email for invitation
    application()
      .events.when("users")
      .where("$event = create && $user.invited = true")
      .then(() => {});

    // Sends out email for invitation
    application()
      .events.when("users")
      .where("$event = create && $user.invited = true")
      .then(() => {});
  }

  getEventSource() {
    return this.events;
  }

  private events = new SimpleEventSource<"users", UserEvent>("users");
}

export default new UserService();
