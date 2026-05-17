# Detector Rules

The detector uses process name and command line as primary evidence. Port numbers are auxiliary signals only.

Recognized kinds:

- `vite`: command line contains `vite`, or the process listens on common Vite dev ports.
- `next`: command line contains `next dev` or a clear `next` token.
- `node`: process is Node and may include a known dev command hint.
- `bun`: process name or command line references Bun.
- `docker`, `postgres`, `redis`: infrastructure services and high-risk by default.
- `unknown`: no known rule matched.

Zombie score signals:

- Development server classification.
- Runtime longer than `zombieThresholdMinutes`.
- Missing or system-owned parent process.
- Missing working directory.
- Command line contains dev-service tokens.
- Common development port.
- Infrastructure and protected ports subtract heavily from the score.

Keep rules conservative. False negatives are safer than false positives for a tool that can terminate processes.
