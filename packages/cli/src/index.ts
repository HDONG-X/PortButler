#!/usr/bin/env bun
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
