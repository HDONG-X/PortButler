/**
 * Port Butler 文件说明：
 * 进程分类规则表。
 * 用声明式规则描述常见开发服务和基础设施服务，减少 classify.ts 中的硬编码分支。
 * 规则顺序会影响优先级，新增规则时要把更具体的匹配放在前面。
 */
/**
 * 常见 Node 开发命令关键字。命令行命中这些片段时，会提高开发服务器置信度。
 */
export const nodeDevCommandHints = [
  " vite",
  "vite ",
  "next dev",
  "webpack-dev-server",
  "webpack serve",
  "npm run dev",
  "pnpm dev",
  "yarn dev",
  "bun --hot",
  "bun run dev",
  "tsx",
  " serve ",
];

/**
 * 数据库和基础设施进程名关键字。默认高风险，clean 不会处理。
 */
export const infrastructureNameHints = [
  "docker",
  "postgres",
  "postmaster",
  "redis-server",
  "redis",
];
