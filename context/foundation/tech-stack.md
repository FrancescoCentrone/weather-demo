---
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
---

## Why this stack

A solo developer delivering Weather Demo in two days, by 22 October 2026, chose the official Vite React TypeScript template with npm for a small browser application. It will search locations and fetch live current weather directly from OpenWeather, without an application backend. The user explicitly chose local use only: do not configure hosting, deployment, or CI/CD; the three `none` values override the hand-off schema’s hosting and CI defaults. The registry rates scaffolding support as verified. The user accepted the registry’s project-conventions gap and confirmed all five self-check statements. During bootstrap, document the folder layout, API-call boundaries, and error-handling pattern in the agent instructions to compensate. Authentication, payments, push updates, AI, and background jobs are out of scope.
