import {
  TestContextHookFn,
  TestContext,
  HookOptions,
  HookFn,
  before as suiteBefore,
} from "node:test";

/**
 * Registers an `before` hook function.
 *
 * Registers on the {@link TestContext} if not null, otherwise
 * registers it as a suite hook function.
 *
 * @param fn - The function to register.
 * @param options - The hook function options.
 */
export function before(
  fn: TestContextHookFn | HookFn,
  t?: TestContext,
  options?: HookOptions
): void {
  if (t != null) {
    t.before(fn as TestContextHookFn, options);
  } else {
    suiteBefore(fn as HookFn, options);
  }
}
