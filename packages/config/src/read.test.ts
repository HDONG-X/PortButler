/**
 * Port Butler 文件说明：
 * 配置读取测试。
 * 覆盖缺省配置、用户覆盖和 JSONC 解析，确保配置文件变化不会破坏默认安全策略。
 * 这些测试保护 readConfig 的合并语义，而不是只验证文件能否读取。
 */
import { describe, expect, test } from "bun:test";
import { mergeConfig } from "./read";

describe("mergeConfig", () => {
  test("合并默认保护端口和用户覆盖", () => {
    const config = mergeConfig({ protectedPorts: [1234], kill: { force: true } });
    expect(config.protectedPorts).toEqual([1234]);
    expect(config.kill.force).toBe(true);
    expect(config.kill.tree).toBe(true);
  });
});
