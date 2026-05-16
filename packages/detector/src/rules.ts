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
  "serve",
];

/**
 * 数据库和基础设施进程名关键字。默认高风险，clean 不会处理。
 */
export const infrastructureNameHints = ["docker", "postgres", "postmaster", "redis-server", "redis"];
