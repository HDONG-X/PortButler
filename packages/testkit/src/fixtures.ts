/**
 * Port Butler 文件说明：
 * 测试 fixture 读取工具。
 * 统一从包内 fixture 目录加载文本或 JSON 样本，减少测试文件里的路径拼接。
 * fixture 是平台解析器测试的重要输入，应尽量贴近真实命令输出。
 */
/**
 * Windows Get-NetTCPConnection fixture。
 */
export const windowsGetNetTcpConnectionFixture = JSON.stringify([
  { LocalAddress: "127.0.0.1", LocalPort: 3000, OwningProcess: 1234, State: "Listen" },
]);

/**
 * macOS lsof fixture。
 */
export const macosLsofFixture = `COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node    1234 user   22u  IPv4  12345      0t0  TCP 127.0.0.1:3000 (LISTEN)`;
