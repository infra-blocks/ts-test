import { expect, resetEnvFixture } from "../../src/index.js";

describe("fixtures", function () {
  const currentEnv = { ...process.env };
  afterEach("reset env", () => {
    process.env = { ...currentEnv };
  });

  describe(resetEnvFixture.name, function () {
    it("should work with empty environment and nothing being done", function () {
      process.env = {};
      const fixture = resetEnvFixture();
      fixture();
      expect(process.env).to.deep.equal({});
    });
    it("should work with several environment variables and nothing being done", function () {
      process.env = {
        PATH: "/bin",
        HOME: "/home/somewherez",
        EDITOR: "vim", //of course
      };
      const fixture = resetEnvFixture();
      fixture();
      expect(process.env).to.deep.equal({
        PATH: "/bin",
        HOME: "/home/somewherez",
        EDITOR: "vim",
      });
    });
    it("should make a clone and not work on references", function () {
      process.env = {
        PATH: "/bin",
        HOME: "/home/somewherez",
        EDITOR: "vim", //of course
      };
      const fixture = resetEnvFixture();
      process.env = {};
      fixture();
      expect(process.env).to.deep.equal({
        PATH: "/bin",
        HOME: "/home/somewherez",
        EDITOR: "vim",
      });
    });
    it("should remove added elements", function () {
      process.env = {};
      const fixture = resetEnvFixture();
      process.env.NEW_FIELD = "toto";
      fixture();
      expect(process.env).to.deep.equal({});
    });
    it("should put back removed elements", function () {
      process.env = {
        REMOVED_FIELD: "byebye",
      };
      const fixture = resetEnvFixture();
      delete process.env.REMOVED_FIELD;
      fixture();
      expect(process.env).to.deep.equal({
        REMOVED_FIELD: "byebye",
      });
    });
  });
});
