import { describe, expect, test } from "bun:test";
import { defaultConfig } from "@port-butler/config";
import { isProtectedPort, resolveKillRisk } from "./protection";

describe("protection policy", () => {
  test("默认保护关键端口", () => {
    expect(isProtectedPort(22, defaultConfig)).toBe(true);
    expect(isProtectedPort(5432, defaultConfig)).toBe(true);
  });

  test("保护端口阻止 kill", () => {
    const risk = resolveKillRisk({
      protected: true,
      neverKill: false,
      detection: {
        kind: "vite",
        confidence: 95,
        isInfrastructure: false,
        isDevServer: true,
        reasons: [],
      },
    });
    expect(risk).toBe("blocked");
  });
});
