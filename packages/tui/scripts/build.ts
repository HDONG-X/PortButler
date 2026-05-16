import solidPlugin from "@opentui/solid/bun-plugin";

const result = await Bun.build({
  entrypoints: ["./src/index.ts"],
  target: "bun",
  outdir: "./dist",
  external: [
    "@opentui/core",
    "@opentui/core-darwin-arm64",
    "@opentui/core-darwin-x64",
    "@opentui/core-linux-arm64",
    "@opentui/core-linux-x64",
    "@opentui/core-win32-arm64",
    "@opentui/core-win32-x64",
  ],
  plugins: [solidPlugin],
});

if (!result.success) {
  for (const log of result.logs) console.error(log);
  process.exit(1);
}

console.log("TUI Solid 构建完成。");
