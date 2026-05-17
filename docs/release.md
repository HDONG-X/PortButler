# Release Notes

Current release track: `0.2.0`.

Before publishing:

- Run `bun test packages/cli/src packages/config/src packages/core/src packages/detector/src packages/platform/src`.
- Run `bun run typecheck`.
- Run `bun run build`.
- Run `bun run release:local` to create compiled binaries.
- Verify Windows and macOS behavior with `pbt doctor`, `pbt ls`, `pbt why <port>`, and a dry-run kill.

Distribution targets:

- npm package with the `pbt` binary entry.
- GitHub Releases binaries for macOS arm64/x64 and Windows arm64/x64.
- Future installer channels: Homebrew and Scoop.
