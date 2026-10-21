---
project: Weather Demo
version: 1
status: draft
created: 2026-10-20
updated: 2026-10-21
prd_version: 1
main_goal: speed
top_blocker: external
---

# Roadmap: Weather Demo

> Derived from the PRD (v1), stack hand-off, and inspected, user-confirmed codebase baseline. Edit in place; archive when superseded. Items are ordered by dependency rather than calendar.

## Vision recap

Weather Demo is a demo for a development skill presentation. It demonstrates searching for a location and displaying its current temperature and conditions. The intended audience is the presenter or a handful of people.

## North star

Here, “north star” means the smallest end-to-end user flow that proves the demo works.

**S-01: Search a location and see live weather** — this directly delivers US-01’s successful search path and the primary success criterion, so it follows only the prerequisite that verifies external access.

## At a glance

| ID | Change ID | Outcome (user can …) | Prerequisites | PRD refs | Status |
|---|---|---|---|---|---|
| F-01 | gh-1-live-weather-access | (foundation) Live weather access is confirmed for the local demo, or a concrete access blocker is recorded. | — | FR-001, FR-002 | done |
| S-01 | search-current-weather | Presenter can enter a location and see the first match’s live current temperature in Celsius and conditions, with its country/region clearly shown and without logging in. | F-01 | US-01, FR-001, FR-002 | ready |
| S-02 | explain-weather-search-failures | Presenter can distinguish an unknown location from a weather-service failure after submitting a search. | S-01 | US-01, FR-003 | proposed |

## Baseline

Inspected and user-confirmed on 2026-10-20. Existing foundations are not re-scaffolded.

- **Frontend:** present as a runnable starter; weather lookup is absent. Evidence: `src/App.tsx`, `package.json`; the stack choice is recorded in the stack hand-off.
- **Backend / API:** backend absent by design, per stack hand-off; external weather integration is not wired.
- **Data:** absent — no persistent data layer; only starter counter state. Evidence: `src/App.tsx`, `package.json`.
- **Auth:** absent by design, per stack hand-off and PRD Access Control.
- **Deploy / infra:** absent by design, per stack hand-off; no deployment or CI/CD is required.
- **Observability:** absent — no logging, metrics, or error-tracking integration found. Evidence: `package.json`, `src/main.tsx`, `src/App.tsx`.

The runnable starter and repository instructions already exist. Absent layers do not automatically require foundations: only live service access needs an explicit prerequisite. Keep frontend, backend, data, and infrastructure investment simple because the chosen goal is a working demo and the PRD sets no additional quality targets. No parallel streams are proposed: this is one dependency chain.

## Foundations

### F-01: Confirm live weather access

- **Outcome:** (foundation) Live weather access is confirmed for the local demo, or a concrete access blocker is recorded.
- **Change ID:** gh-1-live-weather-access (original roadmap alias: `validate-weather-access`)
- **PRD refs:** FR-001, FR-002
- **Unlocks:** S-01: verified access for its live location-search and weather-display acceptance path.
- **Prerequisites:** —
- **Parallel with:** —
- **Blockers:** —
- **Unknowns:** Access resolved on 2026-10-21: both Open-Meteo requests succeeded from the local browser with HTTP 200 and required location/current-weather fields.
- **Risk:** Access uncertainty is checked before committing to the first live-weather demo.
- **Status:** done — live access confirmed. See [access-validation.md](../changes/gh-1-live-weather-access/access-validation.md), attempt 3. Manual review confirmed; implementation workflow commit remains pending.

Provider decision on 2026-10-21: Open-Meteo replaces the intermediate Xweather choice and original OpenWeather assumption. Browser access from `http://127.0.0.1:5173` resolved Warsaw, Poland, Mazovia and retrieved model-derived current conditions in Celsius. Initial tooling interruptions were resolved through user handoff; attempt history is retained in the evidence above.

## Slices

### S-01: Search a location and see live weather

- **Outcome:** Presenter can enter a location and see the first match’s live current temperature in Celsius and conditions, with its country/region clearly shown and without logging in.
- **Change ID:** search-current-weather
- **PRD refs:** US-01, FR-001, FR-002
- **Prerequisites:** F-01
- **Parallel with:** —
- **Blockers:** —
- **Unknowns:** Live access prerequisite resolved by F-01; see its browser evidence. The UI and reusable API boundary still require S-01 planning and implementation.
- **Risk:** An unusable live-data dependency would prevent the core presentation flow.
- **Status:** ready

### S-02: Understand unsuccessful weather searches

- **Outcome:** Presenter can distinguish an unknown location from a weather-service failure after submitting a search.
- **Change ID:** explain-weather-search-failures
- **PRD refs:** US-01, FR-003
- **Prerequisites:** S-01
- **Parallel with:** —
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Misclassifying a service failure as an unknown location would mislead the presenter.
- **Status:** proposed

## Backlog Handoff

| Roadmap ID | Change ID | Suggested issue title | Ready for `/10x-plan` | Notes |
|---|---|---|---|---|
| F-01 | gh-1-live-weather-access | Confirm live weather access for the demo | not needed | Original alias: `validate-weather-access`. Live access confirmed in access-validation.md; manual review confirmed; workflow commit pending. |
| S-01 | search-current-weather | Search a location and display live current weather | yes | F-01 confirmed browser access on 2026-10-21; ready to plan the search flow. |
| S-02 | explain-weather-search-failures | Distinguish unknown locations from weather-service failures | no | Plan after S-01 delivers the search flow. |

## Open Roadmap Questions

1. **Is this day-job or after-hours work?** — Owner: user. Not specified; no resolution date supplied.
2. **What are the expected request rate and data volume?** — Owner: user. Not specified beyond an audience of a handful; no resolution date supplied.
3. **Is a secondary success criterion needed?** — Owner: user. None specified; no resolution date supplied.

These inherited questions do not block the declared primary workflow: work schedule and secondary success criteria remain unspecified, and usage is already bounded to a handful. No slice is added for an unspecified secondary criterion. The access question is tracked in F-01 and S-01 because it directly affects their readiness.

## Parked

- **No accounts or login** — PRD Non-Goals: the demo flow is accessible without signing in.
- **No forecasts** — PRD Non-Goals: scope is current temperature and conditions only.
- **No saved or favorite locations** — PRD Non-Goals: the confirmed flow searches a location each time.
- **No automatic device-location lookup** — PRD Non-Goals: the presenter enters the location manually.
- **No unit switching** — PRD Non-Goals: temperature is Celsius only.
- **No backend, hosting, deployment, or CI/CD** — stack hand-off: explicit local-only scope.

## Done

- F-01: live Open-Meteo location/current-weather access confirmed on 2026-10-21; evidence in `context/changes/gh-1-live-weather-access/access-validation.md`. This records the access outcome, not closure of the implementation workflow or GitHub issue.
