export type Fixture = () => void;

/**
 * A fixture that captures the environment and resets it every time it is being called.
 *
 * @example
 * afterEach("reset environment", resetEnvFixture()); *
 * @param env - The environment to clone. Defaults to process.env.
 *
 * @return A fixture to be used in a test hook.
 */
export function resetEnvFixture(
  env?: Record<string, string | undefined>
): Fixture {
  const environment = env || process.env;
  const clone = { ...environment };
  return () => {
    process.env = { ...clone };
  };
}
