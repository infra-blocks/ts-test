/**
 * Fake factory function definition.
 */
export type Faker<T> = (stub?: Partial<T>) => T;

/**
 * Convenience function to generate a typed faker.
 *
 * It basically just returns the typed {@link fake} function.
 *
 * @example
 * interface GrosToto {
 *   getToto(): string;
 * }
 * const fakeGrosToto = fakerFor<GrosToto>();
 * const grosToto = fakeGrosToto({getToto: sinon.fake.returns("TOTO")});
 *
 * @return A typed faker function
 */
export function fakerFor<T>(): Faker<T> {
  return fake;
}

/**
 * Fake factory.
 *
 * This function generate typed fakes.
 *
 * The single argument is stub representing the faked object. Each
 * key needs to be a known key of the type and all of them can be omitted.
 *
 * The object returned when creating a fake checks to see if the properties being accessed
 * were provided in the stub, if not, it throws immediately. This is to avoid returning "undefined"
 * only to figure out later that the stub was missing a field.
 *
 * It is possible to return undefined for a given property, the user just needs to be explicit
 * about it.
 *
 * An important note is that sinon.fakes can be used in place of any function.
 * The exported type {@link Faker} can be used to easily type and map a specific faker
 * factory to a function variable.
 *
 * @example
 * interface Bling {
 *   cents: number;
 *   dollaz: number;
 *   getTotal(): number;
 * }
 * const fakeBling: Faker<Bling> = fake;
 * const bling = fakeBling({cents: undefined, getTotal: sinon.fake.returns("a lot!")});
 * bling.getTotal(); // Returns a lot!
 * bling.cents; // Returns undefined;
 * bling.dollaz; // BOOM! Throws an error.
 *
 * @param stub The stub of the object, containing default behaviour.
 *
 * @return A typed fake using the argument as a stub.
 */
export function fake<T>(stub?: Partial<T>): T {
  stub = stub || {};
  const handler = {
    get(object: { [key: string]: unknown }, property: string): unknown {
      if (property in object) {
        return object[property];
      }

      throw new Error(
        `property ${property} not implemented by stub ${JSON.stringify(stub)}`
      );
    },
  };

  return new Proxy(stub, handler) as unknown as T;
}
