# Architecture

Port Butler is a Bun + Turborepo TypeScript monorepo. The packages keep platform facts, business policy, command routing, and terminal UI separated:

- `packages/platform` collects raw system facts and executes already-approved process actions.
- `packages/detector` classifies processes and computes zombie-development-process scores.
- `packages/config` reads and writes JSONC configuration.
- `packages/core` combines platform data, detector output, config, protection rules, kill plans, and clean plans.
- `packages/cli` parses arguments and renders table or JSON output.
- `packages/tui` provides the OpenTUI/Solid slash-command interface.
- `packages/theme` stores shared terminal theme tokens.
- `packages/testkit` stores fixtures and integration helpers.

The most important boundary is that scanning never terminates a process. Destructive work only flows through `createKillPlan` followed by `executeKillPlan`.
