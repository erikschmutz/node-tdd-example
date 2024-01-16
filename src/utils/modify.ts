type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

interface GetSetters<T extends {}> {
  set<Key extends keyof NonFunctionProperties<T>>(
    key: Key,
    value: NonFunctionProperties<T>[Key]
  ): T & GetSetters<T>;
}

function modify<T extends Object>(target: T) {
  return Object.assign(target, {
    set: (key: string, value: any) => {
      (target as any)[key] = value;
      return target as any as T;
    },
  }) as T & GetSetters<T>;
}

export default modify