import * as sinon from "sinon";
import { expect, fake, Faker, fakerFor } from "../../src/index.js";

describe("fake", function () {
  describe("fakerFor", function () {
    interface GrosToto {
      getToto(): string;
    }

    it("should work in the provided example", function () {
      const fakeGrosToto = fakerFor<GrosToto>();
      const grosToto = fakeGrosToto({ getToto: sinon.fake.returns("TOTO") });

      expect(grosToto.getToto()).to.equal("TOTO");
      expect(grosToto.getToto).to.have.been.calledOnce;
    });
  });

  describe("fake", function () {
    interface Stuff {
      money: number; // Depends on last album success.
      methodMan(wut: string): string; // Returns rap stuff.
    }

    const fakeStuff: Faker<Stuff> = fake;

    it("should complain when calling an unimplemented method", function () {
      // Faking the wrong call on purpose.
      const stuff = fakeStuff({ money: 5000000000 });

      expect(() => stuff.methodMan("The M-E-T-H-O-D man")).to.throw();
    });

    it("should throw when calling an method when no stub was provided", function () {
      const stuff = fakeStuff();
      expect(() => stuff.methodMan("here I am, here I am")).to.throw();
    });

    it("should dispatch when calling an implemented method", function () {
      const result = "Here I am! Here I am! The Method Man!";
      const stuff = fakeStuff({ methodMan: sinon.fake.returns(result) });

      expect(stuff.methodMan("The M-E-T-H-O-D man")).to.equal(result);
      expect(stuff.methodMan).to.have.been.calledWith("The M-E-T-H-O-D man");
    });

    it("it supports explicit undefined property", function () {
      // Faking the wrong call on purpose.
      const stuff = fakeStuff({ money: undefined });

      expect(stuff.money).to.be.undefined;
    });
  });
});
