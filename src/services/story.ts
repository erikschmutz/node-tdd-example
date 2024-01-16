import application from "../application";
import { BaseService, EventService } from "../libs/service";
import { EventSource, SimpleEventSource } from "../utils/events";

type StoryEvent = {};

class StoryService implements BaseService, EventService {
  private setupTutorial() {}

  register(): void {
    application()
      .events.when("models")
      .where("$type = User && $event = created")
      .then(() => {});

    application()
      .events.when("users")
      .where("$event = login")
      .then(() => {});
  }

  getEventSource() {
    return this.events;
  }

  private events = new SimpleEventSource<"models", StoryEvent>("models");
}

export default new StoryService();
