import {
  TestContextHookFn,
  TestContext,
  HookOptions,
  HookFn,
  beforeEach as suiteBeforeEach,
} from "node:test";

/**
 * Registers an `beforeEach` hook function.
 *
 * Registers on the {@link TestContext} if not null, otherwise
 * registers it as a suite hook function.
 *
 * @param fn - The function to register.
 * @param options - The hook function options.
 */
export function beforeEach(
  fn: TestContextHookFn | HookFn,
  t?: TestContext,
  options?: HookOptions
): void {
  if (t != null) {
    t.beforeEach(fn as TestContextHookFn, options);
  } else {
    suiteBeforeEach(fn as HookFn, options);
  }
}
