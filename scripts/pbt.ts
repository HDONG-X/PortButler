/**
 * Port Butler 文件说明：
 * 开发态 pbt 启动脚本。
 * 它在启动 TUI 前检查 packages/tui/dist 是否缺失或过期，必要时自动构建，然后把参数透传给 CLI。
 * 这样 fresh clone 后只需要 bun install 和 bun run pbt，同时普通 ls/help/version 命令不被 TUI 构建拖慢。
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const rootDir = join(import.meta.dir, "..");
const tuiDir = join(rootDir, "packages", "tui");
const tuiDistEntry = join(tuiDir, "dist", "index.js");

// 这些目录里的源码变化会影响 TUI 运行结果；修改后下一次启动 UI 应自动重建。
const sourceRoots = [
  join(rootDir, "packages", "cli", "src"),
  join(rootDir, "packages", "config", "src"),
  join(rootDir, "packages", "core", "src"),
  join(rootDir, "packages", "detector", "src"),
  join(rootDir, "packages", "platform", "src"),
  join(rootDir, "packages", "theme", "src"),
  join(rootDir, "packages", "tui", "src"),
  join(rootDir, "packages", "tui", "scripts"),
];

// 包元数据和 lockfile 变化可能改变依赖解析，也应让 TUI 构建失效。
const sourceFiles = [
  join(rootDir, "bun.lock"),
  join(rootDir, "package.json"),
  join(rootDir, "packages", "cli", "package.json"),
  join(rootDir, "packages", "config", "package.json"),
  join(rootDir, "packages", "core", "package.json"),
  join(rootDir, "packages", "detector", "package.json"),
  join(rootDir, "packages", "platform", "package.json"),
  join(rootDir, "packages", "theme", "package.json"),
  join(rootDir, "packages", "tui", "package.json"),
];

const cliArgs = Bun.argv.slice(2);
const globalFlags = new Set([
  "--json",
  "--verbose",
  "--dry-run",
  "--yes",
  "-y",
  "--force",
  "--include-infra",
  "--no-color",
]);

// 只有真正会进入 TUI 的命令才触发构建，ls/help/version 等快速命令保持轻量。
if (shouldPrepareTui(cliArgs) && shouldBuildTui()) {
  console.log("Preparing Port Butler terminal UI...");
  const build = Bun.spawnSync(["bun", "run", "build"], {
    cwd: tuiDir,
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });

  if (build.exitCode !== 0) {
    process.exit(build.exitCode);
  }
}

const cli = Bun.spawn(["bun", "packages/cli/src/index.ts", ...cliArgs], {
  cwd: rootDir,
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
});

process.exit(await cli.exited);

function shouldPrepareTui(args: string[]): boolean {
  const command = firstCommand(args);
  return args.length === 0 || command === "ui";
}

function firstCommand(args: string[]): string | undefined {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--config") {
      // --config 后面是路径，不是命令名，需要跳过它的值。
      index += 1;
    } else if (globalFlags.has(arg)) {
      continue;
    } else {
      return arg;
    }
  }
  return undefined;
}

function shouldBuildTui(): boolean {
  if (!existsSync(tuiDistEntry)) return true;

  const distMtime = statSync(tuiDistEntry).mtimeMs;
  // 只比较 mtime，避免每次启动都读取和哈希整个源码树。
  return Math.max(...sourceFiles.map(fileMtime), ...sourceRoots.map(latestMtime)) > distMtime;
}

function latestMtime(path: string): number {
  if (!existsSync(path)) return 0;

  const stats = statSync(path);
  if (!stats.isDirectory()) return stats.mtimeMs;

  let latest = stats.mtimeMs;
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    const childPath = join(path, entry.name);
    latest = Math.max(latest, entry.isDirectory() ? latestMtime(childPath) : fileMtime(childPath));
  }
  return latest;
}

function fileMtime(path: string): number {
  return existsSync(path) ? statSync(path).mtimeMs : 0;
}
