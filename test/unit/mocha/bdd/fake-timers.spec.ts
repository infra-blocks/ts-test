import { expect } from "../../../../src/index.js";
import { injectFakeTimersFixtures } from "../../../../src/mocha/bdd/index.js";

describe("mocha/bdd/fake-timers", () => {
  describe(injectFakeTimersFixtures.name, () => {
    injectFakeTimersFixtures();

    it("should have fake timers set up", function () {
      const christmas2025 = new Date("2025-12-25T00:00:00Z");
      this.clock.setSystemTime(christmas2025);
      expect(new Date().toISOString()).to.equal(christmas2025.toISOString());
    });
  });
});
