import {
  TestContextHookFn,
  TestContext,
  HookOptions,
  HookFn,
  afterEach as suiteAfterEach,
} from "node:test";

/**
 * Registers an `afterEach` hook function.
 *
 * Registers on the {@link TestContext} if not null, otherwise
 * registers it as a suite hook function.
 *
 * @param fn - The function to register.
 * @param options - The hook function options.
 */
export function afterEach(
  fn: TestContextHookFn | HookFn,
  t?: TestContext,
  options?: HookOptions
): void {
  if (t != null) {
    t.afterEach(fn as TestContextHookFn, options);
  } else {
    suiteAfterEach(fn as HookFn, options);
  }
}
