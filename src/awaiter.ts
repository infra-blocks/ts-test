/**
 * Instruments an asynchronous function such that it can be awaited on outside the context
 * of where it is being called.
 *
 * For example, let's say you have an asynchronous handler that you pass to a synchronous
 * function that handles your handler's promise with callbacks. How do you test that it's been called?
 *
 * This utility is meant to solve this problem:
 * @example
 * const { func, promise } = awaiter(() => Promise.resolve("hello"));
 * synchronousFunction(func)
 * // Will resolve once your handler has been called, or not if it hasn't been called.
 * await promise;
 *
 * @param func - The function to wrap
 * @param options.callCount - The amount of time we expect func to be called, and
 *  after which the promise will resolve. Defaults to 1.
 *
 * @returns An object with two fields: func and promise. func is the instrumented function that you should
 * use instead of your handler. promise is the promise that can be awaited on to enforce that func has been
 * called the provided amount of times. The promise also holds the results of the calls, in order.
 */
export function awaiter<A, R>(
  func: (...args: A[]) => Promise<R>,
  options?: {
    callCount: number;
  }
): { func: (...arg: A[]) => Promise<R>; promise: Promise<R[]> } {
  const { callCount = 1 } = options || {};

  let success: (result: R[]) => void;
  let failure: (err: unknown) => void;
  const promise: Promise<R[]> = new Promise((resolve, reject) => {
    success = resolve;
    failure = reject;
  });

  let effectiveCount = 0;
  const results: R[] = [];

  return {
    func: async (...args): Promise<R> => {
      try {
        effectiveCount++;
        const result = await func(...args);
        results.push(result);

        if (effectiveCount === callCount) {
          /*
           Let the function return and the current event loop iteration end first before resolving the promise.
           This is useful when the caller has synchronous code to run after promise resolution. If we do it eagerly,
           then the promise awaiter resolves *before* the caller's synchronous code in a then block has finished.
           This could lead to surprises. Note that it doesn't solve for the case where the caller's code is
           asynchronous.
           */
          setImmediate(() => {
            success(results);
          });
        }
        return result;
      } catch (err) {
        failure(err);
        throw err;
      }
    },
    promise,
  };
}
