#!/usr/bin/env bun
/**
 * Port Butler 文件说明：
 * CLI 进程入口文件。
 * 这里只负责捕获 runCli 的成功输出或错误输出，并把错误映射为非零退出码。
 * 业务分发、参数解析和安全策略都放在其他模块，避免入口文件变成隐藏的控制中心。
 */
import { Effect } from "effect";
import { runCli } from "./run-cli";
import { formatFatalError } from "./output/errors";

/**
 * CLI 程序入口。这里只处理 Effect 执行、输出和退出码，不写业务逻辑。
 */
const program = runCli(process.argv.slice(2));

try {
  const output = await Effect.runPromise(program);
  if (output) console.log(output);
} catch (error) {
  const verbose = process.argv.includes("--verbose");
  const formatted = formatFatalError(error, verbose);
  console.error(formatted.text);
  process.exit(formatted.exitCode);
}
