# Safety Model

Port Butler treats port ownership as a clue, not permission to kill.

Rules:

- Listening-port scans are read-only.
- `kill` creates a plan by default and executes only with `--yes`.
- High-risk targets require both `--yes` and `--force`.
- Protected ports always block kill and clean until removed from config.
- Never-kill process names block kill even when a port looks like a dev server.
- `clean` previews first and excludes Docker, Postgres, Redis, and protected targets by default.

Default protected ports:

```text
22 80 443 5432 6379 3306 27017
```

Default never-kill process examples include `system`, `launchd`, `kernel_task`, `explorer.exe`, `svchost.exe`, `lsass.exe`, `wininit.exe`, and `services.exe`.
