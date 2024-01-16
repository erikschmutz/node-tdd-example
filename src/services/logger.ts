import { BaseService } from "../libs/service";
import Application from "../application";
import { EventSource, SimpleEventSource } from "../utils/events";

class LoggerService implements BaseService {
  private events = new SimpleEventSource<"log", {}>("log");

  register(): void {
    Application()
      .events.when("http")
      .then((payload) => {});

    Application()
      .events.when("errors")
      .then((payload) => {
        console.log(payload);
      });
  }

  getEventSource?() {
    return this.events;
  }
}

export default new LoggerService();
