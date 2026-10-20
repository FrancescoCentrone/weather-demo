# Repository Guidelines

Weather Demo is a local browser demo using Vite, React, TypeScript, and npm. The source currently displays the starter screen; weather lookup is not implemented.

## Scope and commands

- Follow @context/foundation/prd.md and @context/foundation/tech-stack.md. Keep OpenWeather calls in the browser; do not add a backend, hosting, deployment, or CI/CD configuration.
- Preserve the agreed scope: current weather in Celsius, first location match with country/region, and distinct unknown-location versus service-failure messages. Exclude accounts, forecasts, favorites, device geolocation, and unit switching.
- Run `npm run dev` for local development. Run `npm run build` and `npm run lint` after application changes; build includes TypeScript checking, and lint uses Oxlint. Scripts are defined in @package.json.

## Structure and sources

- @src/main.tsx mounts the app and imports global styles from @src/index.css. @src/App.tsx is the root component, with styles in @src/App.css; imported assets live in `src/assets/`, public assets in `public/`.
- The root README documents inherited Oracle skills, not weather-app setup. @README.md.scaffold contains starter documentation; foundation documents define this app.
- Keep change-specific plans and reviews under `context/changes/`; completed records belong in `context/archive/`, read-only by convention. See @context/foundation/README.md for living-document conventions.

## Coding conventions and API boundary

- Match the inspected TSX style: two-space indentation, single-quoted imports, no semicolons, and a default-exported PascalCase root component.
- Keep API request/response handling separate from presentation when adding weather lookup, as required by the stack hand-off. No API module exists yet; document its chosen location in the implementation plan.
- Preserve the compiler checks in @tsconfig.app.json and @tsconfig.node.json and the React rules in @.oxlintrc.json.

## Verification and commits

- No test runner, test script, coverage threshold, or CI gate is configured. Report build/lint results separately from manual checks of the PRD acceptance criteria; do not claim automated weather tests exist.
- Recent history uses `chore:` and `docs:` prefixes. Keep workflow commits scoped to the current phase; @README.md documents the inherited workflow’s commit-approval rules.
