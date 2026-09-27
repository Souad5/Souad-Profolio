import fs from "node:fs";
import path from "node:path";
import app from "../src/app.js";

// Build-time nft trigger: forces Vercel's Node file tracer to bundle the
// Prisma client-engine query compiler (.wasm), which is otherwise loaded via a
// dynamic import that nft does not follow. Harmless at runtime.
fs.readFileSync(
  path.resolve(process.cwd(), "node_modules/.prisma/client/query_compiler_bg.wasm")
);

export default app;