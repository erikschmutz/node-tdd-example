import { EventSource } from "../utils/events";

export interface BaseService {
  register(): void;
}

export interface EventService {
  getEventSource(): EventSource<any, any>;
}
