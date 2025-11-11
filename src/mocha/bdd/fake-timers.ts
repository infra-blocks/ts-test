import sinon from "sinon";

/**
 * Extend the Mocha Context object to type the `clock` property.
 */
declare module "mocha" {
  interface Context {
    clock: sinon.SinonFakeTimers;
  }
}

/**
 * Initializes fake timers on the Mocha context.
 *
 * @param this The mocha context.
 */
export function setUpFakeTimers(this: Mocha.Context) {
  this.clock = sinon.useFakeTimers();
}

/**
 * Restores the real timers and reset the fake timers on the context.
 *
 * @param this The mocha context.
 */
export function tearDownFakeTimers(this: Mocha.Context) {
  this.clock.restore();
}

/**
 * Registers `beforeEach` and `afterEach` hooks within a mocha BDD suite to automalically
 * set up and tear down fake timers.
 *
 * The fake timers are available on the Mocha context as `this.clock`.
 */
export function injectFakeTimersFixtures() {
  beforeEach(setUpFakeTimers);
  afterEach(tearDownFakeTimers);
}
