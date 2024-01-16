type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

interface GetSetters<T extends {}> {
  set<Key extends keyof NonFunctionProperties<T>>(
    key: Key,
    value: NonFunctionProperties<T>[Key]
  ): T;
}

type Constructor = new (...args: any[]) => {};

export function withSetters<T extends Constructor>(t: T): T {
  return t;
}

function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
          Object.create(null)
      );
    });
  });
}
