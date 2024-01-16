import { sleep } from "./common";
import EventStore, { EventSource } from "./events";

class SimpleEventSource<
  Name extends Readonly<string>,
  Value extends Readonly<Record<any, any>>
> implements EventSource<Name, Value>
{
  private store?: EventStore<Record<Name, Value>>;

  register(store: EventStore<Record<Name, Value>>): void {
    this.store = store;
  }

  public __name?: Name;
  public __payload?: Value;

  emit(name: Name, payload: { message: string }) {
    this.store!.emit(name, payload);
  }
}

describe("events", () => {
  it("Should work with a simple example", () => {
    const eventSource = new SimpleEventSource<"hello", { message: "" }>();
    const eventStore = new EventStore().register(eventSource);
    const cb = jest.fn(() => {});

    eventStore.when("hello").then(cb);
    eventSource.emit("hello", { message: "world" });

    expect(cb).toBeCalledWith({ message: "world" });
  });

  it("Should work with with two events example", () => {
    const eventSource = new SimpleEventSource<
      "hello" | "world",
      { message: "" }
    >();
    const eventStore = new EventStore().register(eventSource);
    const cb = jest.fn(() => {});

    eventStore.when("hello").then(cb);
    eventStore.when("world").then(cb);

    eventSource.emit("hello", { message: "world" });
    eventSource.emit("world", { message: "world" });

    expect(cb).toHaveBeenCalledTimes(2);
  });

  it("Should work with with filtering example", () => {
    const eventSource = new SimpleEventSource<"hello", { message: "test" }>();
    const eventStore = new EventStore().register(eventSource);
    const cb = jest.fn(() => {});

    eventStore.when("hello").where("$message = test").then(cb);

    eventSource.emit("hello", { message: "test" });
    eventSource.emit("hello", { message: "not test" });

    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("Should work with with two sources", () => {
    const eventSource1 = new SimpleEventSource<"hello1", { message: "test" }>();
    const eventSource2 = new SimpleEventSource<"hello2", { message: "test" }>();

    const eventStore = new EventStore()
      .register(eventSource1)
      .register(eventSource2);

    const cb = jest.fn(() => {});

    eventStore.when("hello1").then(cb);
    eventStore.when("hello2").then(cb);

    eventSource1.emit("hello1", { message: "test" });
    eventSource2.emit("hello2", { message: "not test" });

    expect(cb).toHaveBeenCalledTimes(2);
  });

  it("Should be able to only listen to once for message", () => {
    const eventSource = new SimpleEventSource<"hello1", { message: "test" }>();
    const eventStore = new EventStore().register(eventSource);

    const cb = jest.fn(() => {});

    eventStore.when("hello1").once().then(cb);

    eventSource.emit("hello1", { message: "test" });
    eventSource.emit("hello1", { message: "test" });

    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("Should be able to listen to for a message", async () => {
    const eventSource = new SimpleEventSource<"hello1", { message: "test" }>();
    const eventStore = new EventStore().register(eventSource);

    const start = Date.now();
    let end = 0;
    eventStore
      .waitFor("hello1")
      .promise()
      .then((v) => {
        end = Date.now();
      });

    await sleep(100);
    eventSource.emit("hello1", { message: "test" });
    await sleep(10);

    expect(end - start).toBeGreaterThan(100);
  });

  it("Should only be invoked once when waiting for a message", async () => {
    const eventSource = new SimpleEventSource<"hello1", { message: "test" }>();
    const eventStore = new EventStore().register(eventSource);

    const start = Date.now();
    const cb = jest.fn(() => {});

    eventStore.waitFor("hello1").promise().then(cb);

    eventSource.emit("hello1", { message: "test" });
    eventSource.emit("hello1", { message: "test" });

    await sleep(1);

    expect(cb).toBeCalledTimes(1);
  });
});
