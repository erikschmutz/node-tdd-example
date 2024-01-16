import LoggerService from "./services/logger";
import HTTPService from "./services/http";
import ModelService from "./services/models";
import ErrorService from "./services/error";
import UserService from "./services/user";
import EventStore, { SimpleEventSource } from "./utils/events";
import { cache } from "./utils/common";

type Env = {
  PORT?: string;
};

type EntityEvent = {
  type: "user" | "document";
  event: "created";
};

const eventSource = new SimpleEventSource<"entity", EntityEvent>("entity");

function application() {
  const events = new EventStore()
    .register(eventSource)
    .register(LoggerService.getEventSource?.()!)
    .register(ModelService.getEventSource?.()!)
    .register(HTTPService.getEventSource?.()!)
    .register(ErrorService.getEventSource?.()!);

  const env = process.env as Env;

  return { events, env };
}

export default cache(application);
