import EventEmitter from "events";

export interface EventSource<Name extends string, T> {
  __name?: Name;
  __payload?: T;

  register(store: EventStore<Record<Name, T>>): void;
}

type EventStoreEmitType<T> = keyof T;
type EventStoreListenType<T> = keyof T;
type EventStoreListenFilterStatement<T> = keyof T;
type EventStoreListenFilterOperator<T> = `= ${string}`;

type EventStoreListenFilterExpression<T extends any> = `$${string &
  keyof T} ${EventStoreListenFilterOperator<T>}`;

type PromiseReturnType<T> = T extends EventSource<infer Return, any>
  ? Return
  : never;

class EventListener<T extends Record<string, any>, Value extends any> {
  private expr?: EventStoreListenFilterExpression<T>;
  private callback?: (data: Value) => void;

  constructor(
    private event: EventStoreListenType<T>,
    private store: EventStore<T>,
    private _once: boolean = false
  ) {}

  private skip(payload: any) {
    if (!this.expr) return false;
    const key = this.expr.split("=")[0].trim().slice(1);
    const value = this.expr.split("=")[1].trim();

    return payload[key] !== value;
  }

  private _invoke(payload: any) {
    if (this.skip(payload)) return;
    this.callback!(payload);
  }

  once() {
    this._once = true;
    return this;
  }

  then(callback: (data: Value) => void): void {
    this.callback = callback;
    const cb = async (payload: any) => {
      if (this._once) {
        emittor.removeListener(this.event as string, cb);
      }
      await this._invoke(payload);
    };

    const emittor = this.store.emittor.addListener(this.event as string, cb);
  }

  retry<P extends EventStoreListenType<T>>(n: number) {
    return this;
  }

  where(expr: EventStoreListenFilterExpression<Value>): this {
    this.expr = expr;
    return this;
  }

  promise() {
    return new Promise<Value>((res, rej) => {
      this.then(res);
    });
  }
}

class EventStore<T extends Record<string, any> = {}> {
  emittor = new EventEmitter();
  record: T = {} as T;

  emit(name: EventStoreListenType<T>, ...args: any[]): boolean {
    this.emittor.emit(name as string, ...args);
    return true;
  }

  when<P extends EventStoreListenType<T>>(event: P) {
    return new EventListener<T, T[P]>(event, this);
  }

  waitFor<P extends EventStoreListenType<T>>(event: P) {
    // When waiting for a request we only want to wait once
    return new EventListener<T, T[P]>(event, this, true);
  }

  addEvent<Name extends string, Value>(name: Name, value: Value) {
    return this as EventStore<T & Record<Name, Value>>;
  }

  register<O extends EventSource<P, any>, P extends string, G>(emittor: O) {
    emittor.register(
      this as any as EventStore<
        Record<NonNullable<O["__name"]>, NonNullable<O["__payload"]>>
      >
    );

    return this as any as EventStore<
      T & Record<NonNullable<O["__name"]>, NonNullable<O["__payload"]>>
    >;
  }
}

export class SimpleEventSource<
  Name extends Readonly<string>,
  Value extends Readonly<Record<any, any>>
> implements EventSource<Name, Value>
{
  private store?: EventStore<Record<Name, Value>>;

  register(store: EventStore<Record<Name, Value>>): void {
    this.store = store;
  }

  constructor(public name: Name) {}

  public __name?: Name;
  public __payload?: Value;

  emit(payload: Value) {
    this.store?.emit(this.name, payload);
  }
}

export default EventStore;
