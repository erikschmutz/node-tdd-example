export async function sleep(ms: number) {
  await new Promise<void>((res) =>
    setTimeout(() => {
      res();
    }, ms)
  );
}

let cacheResult: Record<number, any> = {};

export function cache<T extends Function>(cb: T): T {
  let id = Math.random();
  return ((...args: any[]) => {
    if (cacheResult[id]) return cacheResult[id];
    cacheResult[id] = cb(...args);
    return cacheResult[id];
  }) as any;
}
