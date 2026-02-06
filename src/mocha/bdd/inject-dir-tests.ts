import * as fs from "node:fs/promises";
import * as path from "node:path";
import { isFunction, Predicate } from "@infra-blocks/types";
import { Dirent } from "node:fs";

const defaultSkip = (entry: Dirent) => entry.name === "index.spec.ts";

/**
 * A function to load and nest all tests in the same directory as the caller.
 *
 * It is meant to be called within a `describe` call to embed all peer level files
 * within the current test block.
 *
 * For example, it is expected to be called like this:
 * ```typescript
 * // Happens in index.spec.ts.
 * describe("root", async () => {
 *  await injectDirTests(import.meta.dirname);
 * })
 * ```
 *
 * Because the expectation is to be called from a file called index.spec.ts, the
 * code also skips importing that file by default. Which files are skipped can
 * be controlled by passing the `skip` parameter.
 *
 * Finally, the way modules are imported is by using a dynamic `import` statement.
 * Once the module is loaded, we look for an injecter property, which defaults to
 * "inject", can call that if it is a function. The property can be overridden
 * by setting the `injecter` option.
 *
 * @param directory
 * @param options
 */
export async function injectDirTests(
  directory: string,
  options?: { skip?: Predicate<Dirent>; injecter?: string }
) {
  const { skip = defaultSkip, injecter = "inject" } = options || {};

  const entries = await fs.readdir(directory, {
    recursive: false,
    withFileTypes: true,
  });
  for (const entry of entries) {
    if (skip(entry)) {
      console.log("skipping %s", entry.path);
      continue;
    }

    if (entry.isDirectory()) {
      const index = path.join(entry.path, "index.ts");
      console.log("loading subdir %s", index);
      try {
        await fs.access(index, fs.constants.R_OK);
        await injectFileTests(index, { injecter });
      } catch (e) {
        console.log("error occurred %s", e);
        // Swallow on purpose if the file doesn't exist or cannot be opened.
      }
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    await injectFileTests(entry.path, { injecter });
  }
}

export async function injectFileTests(
  filePath: string,
  options?: { injecter?: string }
) {
  const { injecter = "inject" } = options || {};
  console.log("injecting test file %s", filePath);
  const module = (await import(filePath)) as Record<string, unknown>;
  if (injecter in module && isFunction(module[injecter])) {
    await module[injecter]();
  }
}
