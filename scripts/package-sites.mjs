import {
  cpSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

function materializeLinks(directory) {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (lstatSync(path).isSymbolicLink()) {
      const target = realpathSync(path);
      const directoryTarget = statSync(target).isDirectory();
      rmSync(path, { recursive: directoryTarget, force: true });
      cpSync(target, path, { recursive: directoryTarget, dereference: true });
    }
    if (lstatSync(path).isDirectory()) materializeLinks(path);
  }
}

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist/server", { recursive: true });
mkdirSync("dist/.openai", { recursive: true });
cpSync(".open-next", "dist/server", { recursive: true, dereference: true });
cpSync(".open-next/assets", "dist/assets", { recursive: true, dereference: true });
materializeLinks("dist");
writeFileSync("dist/.openai/hosting.json", readFileSync(".openai/hosting.json"));
writeFileSync(
  "dist/server/index.js",
  'export { default } from "./worker.js";\nexport * from "./worker.js";\n',
);
