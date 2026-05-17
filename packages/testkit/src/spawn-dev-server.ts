/**
 * Port Butler 文件说明：
 * 测试用临时开发服务器启动器。
 * 用于需要真实监听端口的集成测试，返回进程句柄和端口信息。
 * 测试结束必须由调用方清理进程，避免留下占用端口。
 */
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
