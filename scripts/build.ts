/**
 * Port Butler 文件说明：
 * 本地发布产物构建脚本。
 * 它为 macOS 和 Windows 的不同架构编译独立 pbt 可执行文件，输出到根 dist。
 * 该脚本用于 release:local，不参与日常 bun run pbt 的开发启动。
 */
const targets = [
  ["bun-darwin-arm64", "dist/pbt-darwin-arm64"],
  ["bun-darwin-x64", "dist/pbt-darwin-x64"],
  ["bun-windows-x64", "dist/pbt-windows-x64.exe"],
  ["bun-windows-arm64", "dist/pbt-windows-arm64.exe"],
] as const;

await Bun.$`mkdir -p dist`;

for (const [target, outfile] of targets) {
  await Bun.$`bun build packages/cli/src/index.ts --compile --target=${target} --outfile=${outfile}`;
}

console.log("Port Butler 本地发布产物已生成。");
