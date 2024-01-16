import { BaseService, EventService } from "../libs/service";
import Application from "../application";
import { EventSource, SimpleEventSource } from "../utils/events";

class ErrorService implements BaseService, EventService {
  private events = new SimpleEventSource<"errors", Error>("errors");

  register(): void {}

  getEventSource() {
    return this.events;
  }
}

export default new ErrorService();
