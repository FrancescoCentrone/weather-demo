# Confirm Open-Meteo Access — Plan Brief

> Full plan: [plan.md](plan.md)

## What & Why

Prove that the local demo can resolve a location and retrieve live current weather from Open-Meteo, or record the concrete blocker before building the weather-search feature. This implements roadmap F-01 and GitHub issue #1. The user's latest 2026-10-21 decision replaces the intermediate Xweather choice and the issue's original OpenWeather assumption.

## Starting Point

The Vite/React/TypeScript starter exists; weather lookup does not. Open-Meteo public access needs no key, account, or credit card; actual browser access has not been tested. Current project instructions still name OpenWeather.

## Desired End State

The change folder contains a repeatable browser-check runbook and sanitized evidence for Warsaw, PL. Future project instructions name Open-Meteo. S-01 becomes ready only when both location and current-weather requests succeed from the local browser; otherwise its blocker has an owner and next action.

## Key Decisions Made

| Decision | Choice | Why |
|---|---|---|
| Provider | Open-Meteo public API | Explicit user decision removes the Xweather key-acquisition blocker. |
| Scope | Access validation only | Weather UI and a reusable API layer belong to S-01. |
| Requests | Geocoding, then current weather for the returned coordinates | Verifies location identity and current weather together. |
| Example | Warsaw, PL | User-selected known location with explicit country. |
| Credentials | None | Public endpoints need no signup, API key, or credit card. |
| Conditions | Model-derived current temperature and WMO code | Map the numeric code to the documented condition phrase. |
| Execution | Agent browser tooling where supported; human console fallback | Both preserve the actual localhost browser origin. |
| Evidence | Repeatable runbook plus sanitized results | Supports rechecking before the presentation. |
| Failure | Specific blocker; S-01 stays blocked | Partial or unexecuted checks do not prove readiness. |

## Scope

**In scope:**

- Align active provider references, preserving historical discovery quotes.
- Document public-access terms, attribution, and two browser requests.
- Record actual access results, restrictions, and the roadmap hand-off.

**Out of scope:**

- Weather UI, reusable API layer, backend/proxy, SDKs, or new dependencies.
- Hosting, deployment, CI/CD, automated weather-test infrastructure, or paid subscription changes.
- Forecasts, login, saved locations, device geolocation, and unit switching.

## Architecture / Approach

Use the existing local Vite page as the browser origin. A disposable console probe requests Open-Meteo geocoding, then current temperature and weather code for the first match. Inspect HTTP status, location identity, Celsius units, current timestamp/timezone, and the WMO code with its documented phrase. Current conditions are model-derived, not direct station measurements. Retain a focused evidence summary. No application source changes are planned.

## Phases at a Glance

| Phase | What it delivers | Key risk |
|---|---|---|
| 1. Provider references and runbook | Consistent Open-Meteo instructions and repeatable browser-check procedure | Free-use restrictions and attribution must be documented. |
| 2. Validation and readiness | Sanitized results or concrete blocker; consistent F-01/S-01 hand-off | CORS, service availability, or missing data may prevent browser access. |

**Prerequisites:** Existing npm dependencies, internet access, and a local browser. Use the public non-commercial API for this evaluation/prototype; record a usage blocker if the intended use falls outside its free terms.

**Estimated effort:** One short implementation session if the public service is reachable; no credential setup is needed.

## Open Risks & Assumptions

- Localhost browser readability and current Warsaw data must be verified during implementation.
- The free API is restricted to non-commercial use and has no uptime guarantee; retain the applicable terms and attribution links.
- If tooling or service access is unavailable, record unexecuted operations honestly. Browser security restrictions do not authorize adding a backend.
- Documentation research establishes the proposed API contracts, not successful access. No real weather requests have been made during planning.

## Success Criteria (Summary)

- The runbook can repeat the check without embedding credentials or changing the application.
- The evidence proves both operations from localhost, or records the exact blocker, owner, and next action.
- S-01 is ready only after successful access; application tests, builds, or documentation checks are not substitutes for browser evidence.
