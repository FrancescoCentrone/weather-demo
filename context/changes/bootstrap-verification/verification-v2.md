---
bootstrapped_at: 2026-10-20T17:29:37.063036+00:00
starter_id: vite-react
starter_name: Vite + React
project_name: weather-demo
language_family: js
package_manager: npm
cwd_strategy: subdir-then-move
bootstrapper_confidence: verified
phase_3_status: ok
audit_command: npm audit --json
---

## Hand-off

```yaml
starter_id: vite-react
package_manager: npm
project_name: weather-demo
hints:
  language_family: js
  team_size: solo
  # Explicit user override of schema defaults: local use only, no hosting or deployment.
  deployment_target: none
  # Explicit user override of schema enums: no CI/CD and no deployment flow.
  ci_provider: none
  ci_default_flow: none
  bootstrapper_confidence: verified
  path_taken: custom
  quality_override: true
  self_check_answers:
    typed: true
    from_official_starter: true
    conventions: true
    docs_current: true
    can_judge_agent: true
  has_auth: false
  has_payments: false
  has_realtime: false
  has_ai: false
  has_background_jobs: false
```

**Why this stack**

A solo developer delivering Weather Demo in two days, by 22 October 2026, chose the official Vite React TypeScript template with npm for a small browser application. It will search locations and fetch live current weather directly from OpenWeather, without an application backend. The user explicitly chose local use only: do not configure hosting, deployment, or CI/CD; the three `none` values override the hand-off schema’s hosting and CI defaults. The registry rates scaffolding support as verified. The user accepted the registry’s project-conventions gap and confirmed all five self-check statements. During bootstrap, document the folder layout, API-call boundaries, and error-handling pattern in the agent instructions to compensate. Authentication, payments, push updates, AI, and background jobs are out of scope.

## Pre-scaffold verification

| Signal | Value | Severity | Notes |
| --- | --- | --- | --- |
| npm package | create-vite v9.3.1; modified 2026-10-20T03:02:49.788Z | fresh | Resolved from command template. Initial DNS/timeout failures; recheck succeeded after user requested retry. |
| GitHub repo | not run | n/a | Card docs URL is not a GitHub repository. |

Local tools: Node v22.14.0, npm 10.9.2. Prior failed attempt preserved in verification.md. This log records the successful retry.

## Scaffold log

**Resolved invocation**: `npm create vite@latest .bootstrap-scaffold -- --template react-ts`
**Strategy**: subdir-then-move
**Exit code**: 0
**Files moved**: 18, including the preserved starter README as a sibling
**Conflicts (.scaffold siblings)**: README.md.scaffold
**.gitignore handling**: moved silently
**.bootstrap-scaffold cleanup**: deleted

The generated temporary package name was normalized to the user-confirmed `weather-demo`. Original context files were checked by SHA-256 before and after merging and remained unchanged. No deployment, CI/CD, backend, or git initialization was added.

| File | Action |
| --- | --- |
| .gitignore | moved |
| .oxlintrc.json | moved |
| README.md | saved as README.md.scaffold |
| index.html | moved |
| package.json | moved |
| public/favicon.svg | moved |
| public/icons.svg | moved |
| src/App.css | moved |
| src/App.tsx | moved |
| src/assets/hero.png | moved |
| src/assets/react.svg | moved |
| src/assets/vite.svg | moved |
| src/index.css | moved |
| src/main.tsx | moved |
| tsconfig.app.json | moved |
| tsconfig.json | moved |
| tsconfig.node.json | moved |
| vite.config.ts | moved |

**Captured CLI stdout**:

```text
> npx
> cva .bootstrap-scaffold --template react-ts


create-vite v9.3.1

│
◇  Scaffolding project in /Users/francescocentrone/projects/weather-demo/.bootstrap-scaffold...
│
└  Done. Now run:

  cd .bootstrap-scaffold
  npm install
  npm run dev
```

**Captured CLI stderr**: empty

Dependencies installed using `npm install --cache /tmp/weather-demo-npm-cache --fetch-retries=0 --fetch-timeout=20000` (exit 0); generated package-lock.json. The registry command only generates files, so installation was needed to make the starter runnable and permit verification.

**Build**: `npm run build` passed (exit 0), including TypeScript compilation and Vite production build.
**Lint**: `npm run lint` passed (exit 0; starter uses oxlint).

## Post-scaffold audit

**Tool**: npm audit --json
**Exit code**: 0
**Summary**: 0 CRITICAL, 0 HIGH, 0 MODERATE, 0 LOW, 0 INFO
**Direct vs transitive**: no vulnerable direct or transitive packages.

**Raw audit output**:

```json
{
  "auditReportVersion": 2,
  "vulnerabilities": {},
  "metadata": {
    "vulnerabilities": {"info": 0, "low": 0, "moderate": 0, "high": 0, "critical": 0, "total": 0},
    "dependencies": {"prod": 4, "dev": 67, "optional": 46, "peer": 0, "peerOptional": 0, "total": 70}
  }
}
```

## Hints recorded but not acted on

```yaml
  language_family: js
  team_size: solo
  # Explicit user override of schema defaults: local use only, no hosting or deployment.
  deployment_target: none
  # Explicit user override of schema enums: no CI/CD and no deployment flow.
  ci_provider: none
  ci_default_flow: none
  bootstrapper_confidence: verified
  path_taken: custom
  quality_override: true
  self_check_answers:
    typed: true
    from_official_starter: true
    conventions: true
    docs_current: true
    can_judge_agent: true
  has_auth: false
  has_payments: false
  has_realtime: false
  has_ai: false
  has_background_jobs: false
```

All surfaced hints are copied above. The three `none` values are deliberate user overrides of the schema’s deployment/CI defaults. No fallback hosting or CI values were applied. The accepted project-conventions gap is recorded but not compensated by an AGENTS.md or CLAUDE.md file in this bootstrapper version.

## Next steps

Run `npm run dev` to open the starter locally. The generated app is the official starter screen; the weather feature has not been implemented. Review README.md.scaffold for the starter documentation. Agent instructions covering folder layout, API-call boundaries, and error handling remain a follow-up; this bootstrapper does not generate them.
