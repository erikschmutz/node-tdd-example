import { EventService } from "../libs/service";
import { EventSource, SimpleEventSource } from "../utils/events";

type ModelEvent = {
  event: "created" | "updated" | "deleted";
  type: "User";
};

class ModelService implements EventService {
  getEventSource() {
    return this.events;
  }

  private events = new SimpleEventSource<"models", ModelEvent>("models");
}

export default new ModelService();
