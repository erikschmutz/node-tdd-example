import { BaseService, EventService } from "../libs/service";
import { SimpleEventSource } from "../utils/events";

type HTTPEvent = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  payload?: string;
};

class HTTPService implements BaseService, EventService {
  private events = new SimpleEventSource<"http", HTTPEvent>("http");

  register(): void {}

  getEventSource() {
    return this.events;
  }
}

export default new HTTPService();
