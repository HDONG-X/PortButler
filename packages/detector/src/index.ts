/**
 * Port Butler 文件说明：
 * detector 包公共导出面。
 * core 通过这里获得分类和僵尸评分能力，避免依赖内部规则文件。
 * 新增检测能力时从这里暴露稳定 API。
 */
export * from "./classify";
export * from "./model";
export * from "./rules";
export * from "./zombie-score";
