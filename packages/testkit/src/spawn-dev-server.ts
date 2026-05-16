/**
 * 启动临时 HTTP 服务，供基础集成测试验证 why/kill 流程。
 */
export function spawnDevServer(port: number) {
  const server = Bun.serve({
    port,
    fetch() {
      return new Response("ok");
    },
  });
  return {
    port: server.port,
    stop: () => server.stop(true),
  };
}
