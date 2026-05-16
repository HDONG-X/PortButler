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
