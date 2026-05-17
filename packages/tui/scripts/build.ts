/**
 * Port Butler 文件说明：
 * TUI 构建脚本。
 * 使用 OpenTUI 的 Solid Bun 插件把 TSX 入口打包到 dist，供 CLI 动态 import。
 * OpenTUI 的平台原生包保持 external，避免打包时把不相关平台二进制卷入产物。
 */
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
