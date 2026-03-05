import {
  TestContextHookFn,
  TestContext,
  HookOptions,
  HookFn,
  after as suiteAfter,
} from "node:test";

/**
 * Registers an `after` hook function.
 *
 * Registers on the {@link TestContext} if not null, otherwise
 * registers it as a suite hook function.
 *
 * @param fn - The function to register.
 * @param options - The hook function options.
 */
export function after(
  fn: TestContextHookFn | HookFn,
  t?: TestContext,
  options?: HookOptions
): void {
  if (t != null) {
    t.after(fn as TestContextHookFn, options);
  } else {
    suiteAfter(fn as HookFn, options);
  }
}
