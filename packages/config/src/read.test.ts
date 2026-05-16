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
