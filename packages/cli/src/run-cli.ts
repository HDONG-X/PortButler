import { Effect } from "effect";
import { cleanCommand } from "./commands/clean";
import { doctorCommand } from "./commands/doctor";
import { killCommand } from "./commands/kill";
import { lsCommand } from "./commands/ls";
import { openCommand } from "./commands/open";
import { protectCommand } from "./commands/protect";
import { uiCommand } from "./commands/ui";
import { unprotectCommand } from "./commands/unprotect";
import { whyCommand } from "./commands/why";
import { parseArgs, parsePort } from "./options";

/**
 * CLI 主分发函数。入口文件只负责捕获错误，这里负责命令解析和业务调用。
 */
export function runCli(args: string[]): Effect.Effect<string, Error> {
  return Effect.gen(function* () {
    if (args.length === 0) {
      return yield* uiCommand({
        json: false,
        verbose: false,
        dryRun: false,
        yes: false,
        force: false,
        includeInfra: false,
      });
    }
    const parsed = parseArgs(args);
    switch (parsed.command) {
      case "ls":
        return yield* lsCommand(parsed.options);
      case "why":
        return yield* whyCommand(parsePort(parsed.positionals[0]), parsed.options);
      case "kill":
        return yield* killCommand(parsePort(parsed.positionals[0]), parsed.options);
      case "protect":
        return yield* protectCommand(parsePort(parsed.positionals[0]), parsed.options);
      case "unprotect":
        return yield* unprotectCommand(parsePort(parsed.positionals[0]), parsed.options);
      case "clean":
        return yield* cleanCommand(parsed.options);
      case "open":
        return yield* openCommand(parsePort(parsed.positionals[0]), parsed.options);
      case "doctor":
        return yield* doctorCommand(parsed.options);
      case "ui":
        return yield* uiCommand(parsed.options);
      case "help":
      case "--help":
      case "-h":
        return helpText();
      default:
        throw new Error(`未知命令：${parsed.command}。下一步：执行 pbt help 查看可用命令。`);
    }
  });
}

function helpText(): string {
  return [
    "Port Butler 本地端口管家",
    "",
    "用法：pbt [命令] [参数]",
    "",
    "命令：ls, why <port>, kill <port>, protect <port>, unprotect <port>, clean, open <port>, doctor, ui",
    "选项：--json --verbose --dry-run --yes/-y --force --include-infra --config <path>",
  ].join("\n");
}
