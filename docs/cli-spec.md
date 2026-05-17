# CLI Spec

Primary command:

```bash
pbt [command] [args]
```

Commands:

- `pbt` and `pbt ui`: start the terminal UI.
- `pbt ls`: list local listening ports.
- `pbt why <port>`: explain a port owner and detection reasons.
- `pbt kill <port>`: show a kill plan.
- `pbt kill <port> --yes`: execute the plan after review.
- `pbt clean`: preview zombie development-process candidates.
- `pbt clean --yes`: execute the clean plan.
- `pbt protect <port>` and `pbt unprotect <port>`: edit protected ports.
- `pbt config path`, `pbt config show`, `pbt config init`: inspect or initialize config.
- `pbt open <port>`: open the configured localhost URL.
- `pbt doctor`: check platform support and commands.
- `pbt version`, `pbt --version`, `pbt -v`: print the current version.

Global options:

- `--json`: force JSON output.
- `--verbose`: include diagnostics in fatal errors.
- `--dry-run`: preview dangerous work.
- `--yes` or `-y`: confirm an execution plan.
- `--force`: allow high-risk kill targets after confirmation.
- `--include-infra`: allow `clean` to consider infrastructure candidates.
- `--no-color`: disable color where supported.
- `--config <path>`: use a specific config file.
