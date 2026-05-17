/**
 * Port Butler 文件说明：
 * CLI 参数解析测试。
 * 覆盖全局选项、位置参数和端口校验，确保命令层收到结构化输入。
 * 参数解析是所有命令共享入口，因此这里的测试能保护多个子命令。
 */
import { describe, expect, test } from "bun:test";
import { parseArgs, parsePort } from "./options";

describe("cli options", () => {
  test("解析全局选项", () => {
    const parsed = parseArgs(["kill", "3000", "--dry-run", "-y", "--force"]);
    expect(parsed.command).toBe("kill");
    expect(parsed.options.dryRun).toBe(true);
    expect(parsed.options.yes).toBe(true);
    expect(parsed.options.force).toBe(true);
  });

  test("校验端口", () => {
    expect(parsePort("3000")).toBe(3000);
    expect(() => parsePort("70000")).toThrow();
  });
});
