import { awaiter, expect } from "../../src/index.js";
import { range } from "@infra-blocks/iter";
import * as sinon from "sinon";

describe("awaiter", function () {
  type ResolveFn<T> = (value: T | PromiseLike<T>) => void;

  describe(awaiter.name, function () {
    it("should resolve only when inner resolves", async function () {
      let innerResolve: ResolveFn<string> | undefined;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const inner = (arg: number): Promise<string> =>
        new Promise((resolve) => (innerResolve = resolve));
      const fakeInner = sinon.fake(inner);

      const { func, promise } = awaiter(fakeInner);
      let awaiterResolved = false;
      void promise.then(() => (awaiterResolved = true));

      // Check that we haven't called the inner func yet, and that the awaiter is not resolved.
      expect(fakeInner).to.not.have.been.called;
      expect(awaiterResolved).to.be.false;

      const outerPromise = func(5);
      let outerResolved = false;
      void outerPromise.then(() => {
        outerResolved = true;
      });

      // Should have called the inner func, but not be resolved yet.
      expect(fakeInner).to.have.been.calledOnceWith(5);
      expect(awaiterResolved).to.be.false;
      expect(outerResolved).to.be.false;

      innerResolve && innerResolve("SECRET!");

      // Now everything should be resolved.
      const outerValue = await outerPromise;
      expect(outerValue).to.be.equal("SECRET!");

      expect(await promise).to.deep.equal(["SECRET!"]);
    });

    it("should take into account the number of calls", async function () {
      const callCount = 5;
      let innerResolve: ResolveFn<string> | undefined;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const inner = (arg: number): Promise<string> =>
        new Promise((resolve) => (innerResolve = resolve));
      const fakeInner = sinon.fake(inner);

      const { func, promise } = awaiter(fakeInner, { callCount });
      let awaiterResolved = false;
      void promise.then(() => (awaiterResolved = true));

      const results = [];
      for (const i of range(callCount)) {
        // Reset func internal state to ignore last iteration.
        fakeInner.resetHistory();

        const outerPromise = func(i);
        let outerResolved = false;
        void outerPromise.then(() => {
          outerResolved = true;
        });

        // Should have called the inner func, but not be resolved yet.
        expect(fakeInner).to.have.been.calledOnceWith(i);
        expect(awaiterResolved).to.be.false;
        expect(outerResolved).to.be.false;

        const result = `secret: ${i}`;
        results.push(result);
        innerResolve && innerResolve(result);

        // Now everything should be resolved.
        const outerValue = await outerPromise;
        expect(outerResolved).to.be.true;
        expect(outerValue).to.be.equal(result);
        // Awaiter only resolves on the last run.
        if (i < callCount - 1) {
          expect(awaiterResolved).to.be.false;
        } else {
          expect(await promise).to.be.deep.equal(results);
        }
      }
    });

    it("should reject when inner rejects", async function () {
      const err = new Error("toasty!");
      const fake = sinon.fake.rejects(err);

      const { func, promise } = awaiter(fake);
      await expect(func()).to.be.rejectedWith(err);
      await expect(promise).to.be.rejectedWith(err);
    });
  });
});
