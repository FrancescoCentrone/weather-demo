# Confirm Open-Meteo Access for the Local Demo — Implementation Plan

## Overview

Validate that the existing local browser demo can obtain a location match and live current weather from Open-Meteo, or record a concrete access blocker. This is roadmap foundation F-01, linked to GitHub issue #1, and precedes S-01 weather-search implementation.

On 2026-10-21, the user selected Open-Meteo after difficulty obtaining Xweather credentials. This supersedes both the previous Xweather plan and the issue body's OpenWeather requirement. The user approved two phases: prepare provider references and a browser-check runbook, then validate Warsaw, PL and record the result. Complexity is LOW. No unresolved product or implementation choices remain; service access is the runtime fact this foundation must establish.

## Current State Analysis

- `src/App.tsx:1` contains the starter page and counter; there is no weather UI or API module.
- `vite.config.ts:5` enables React without a proxy. Calls must originate in the browser, per `AGENTS.md:7` and the stack hand-off.
- `package.json:6` defines dev, build, lint, and preview commands. No test runner is configured (`AGENTS.md:25`).
- `context/foundation/roadmap.md:49` defines F-01 as confirmed access or a concrete blocker. S-01 is blocked on this outcome at line 71.
- `AGENTS.md:7` and `context/foundation/tech-stack.md:31` still name OpenWeather. The active forward hand-off in `context/foundation/shape-notes.md:128` also needs alignment.
- The roadmap uses `validate-weather-access` as its original F-01 change ID. This issue-linked record is `gh-1-live-weather-access`; phase 2 will make that mapping explicit.
- Open-Meteo removes the credential prerequisite: its public non-commercial API requires no signup, API key, or credit card. Actual localhost browser access and Warsaw data availability have not been verified. Documentation research is not evidence of live access.

## Desired End State

The change folder contains a repeatable browser-check runbook and a sanitized validation record. The record establishes either confirmed access to both required operations or the precise blocker, affected operation, owner, and next action. Project instructions consistently name Open-Meteo for future implementation.

S-01 becomes ready only when both location lookup and current conditions succeed from the actual local browser origin, with the required fields available. A recorded blocker completes the investigation outcome but does not demonstrate live access or satisfy unperformed issue acceptance checks.

### Key Discoveries

- Open-Meteo offers public access without credentials. Its free service is for non-commercial use; [pricing](https://open-meteo.com/en/pricing) also describes evaluation/prototyping. Record applicable limits and attribution from the official terms before use.
- [Geocoding](https://open-meteo.com/en/docs/geocoding-api) returns a `results` array with identity, country, optional administrative region, and coordinates.
- [Weather documentation](https://open-meteo.com/en/docs) describes current temperature and WMO weather codes. Current conditions are model-derived, not direct station observations; the user selected this provider after that distinction was explained.
- Successful weather data uses `current.temperature_2m`, `current.weather_code`, `current.time`, and `current_units`. Error responses use `error` and `reason`, not Xweather's success envelope.
- The public API needs neither a registered application namespace nor credential activation. CORS/readability from the actual local browser still requires live verification.

## Scope Boundaries

In scope: provider-reference alignment, public-access setup instructions, two real browser requests, sanitized evidence, and the F-01/S-01 readiness hand-off.

Excluded: weather UI, reusable API/data layer, backend or proxy, SDK/dependency additions, hosting, deployment, CI/CD, account creation automation, paid subscription changes, forecasts, saved locations, device geolocation, and unit switching. Failure UX and a comprehensive negative-case test matrix belong to S-02.

## Implementation Approach

Keep the existing application intact. Prepare a documentation-only browser-console probe, run from the Vite page on localhost. Use public unauthenticated endpoints: no key, account, credit card, environment file, or namespace setup. Prefer agent execution through available supported browser tooling; if that tooling cannot execute the requests, the user runs the same documented console steps and supplies the results. Tooling failure must not be mislabeled as provider failure.

Use HTTPS to Open-Meteo's geocoding and weather hosts. First search Warsaw with country filtering, then use `results[0]` coordinates for current weather. Retain the returned country and optional `admin1`; a missing optional region is acceptable when country identifies the result. Translate the returned WMO code into a phrase for the evidence using the official table, without adding a production mapping module. No production API module location is chosen because this foundation creates none; S-01 must choose that boundary in its own plan.

## Critical Implementation Details

### Browser origin and public access

Use the actual origin printed by `npm run dev`. The requests must be readable by browser JavaScript from that page. Do not bypass a restriction using a proxy, `no-cors`, or a disabled browser security setting. Keep provider attribution and applicable free-use restrictions in the runbook and hand-off; no paid plan or account setup is part of this change.

### Sequential requests and result validation

Stop after failed or unusable location lookup; do not replace its coordinates with hard-coded Warsaw coordinates. Weather must target the selected match. Request `current=temperature_2m,weather_code` and `temperature_unit=celsius`; the endpoint path is `/v1/forecast`, but this probe requests current fields only, not a forecast feature. Require a finite temperature (including zero), a valid documented WMO code (including clear-sky code zero), and a current timestamp. Record the Celsius unit and derived condition phrase. Do not treat null/missing values as success, use an unknown code as confirmed conditions, or invent a freshness target absent from the PRD.

## Phase 1: Align Provider References and Prepare the Runbook

### Overview

Make the Open-Meteo decision discoverable to future work and define a reproducible check without changing application code or obtaining credentials.

### Changes Required

#### 1. Active provider references

**Files:** `AGENTS.md`, `context/foundation/tech-stack.md`, `context/foundation/shape-notes.md`

**Intent:** Replace active OpenWeather requirements with Open-Meteo while preserving browser-only calls and the existing product scope. Preserve the original verbatim seed quote and historical bootstrap reports.

**Contract:** Update the AGENTS scope bullet, stack architecture paragraph, and shape-notes forward hand-off. Set the shape-notes updated date to the implementation date and add a dated decision showing that Open-Meteo supersedes the original provider and the intermediate Xweather choice. Do not add application authentication or change PRD acceptance criteria. The provider-neutral PRD needs no rename.

#### 2. Browser-check runbook

**File:** `context/changes/gh-1-live-weather-access/access-runbook.md` (new)

**Intent:** Give the agent or presenter repeatable instructions to exercise the public browser path without prebuilding S-01.

**Contract:** Include setup, execution, expected fields, failure classification, cleanup, and official documentation links. Specify:

- Document public no-key access, non-commercial free-use limits, model-derived current data, and attribution links for Open-Meteo and the GeoNames-based location data. Treat the local demo as an evaluation/prototype; if its intended use is outside the free terms, record a usage blocker with the project owner rather than silently switching to paid service.
- Start `npm run dev`, open its localhost page, and record the actual origin and browser. No provider account, key, or namespace registration is required.
- Resolve `https://geocoding-api.open-meteo.com/v1/search?name=Warsaw&countryCode=PL&count=1&language=en&format=json`. Require HTTP success, no provider error, and usable `results[0]` with `name`, `country_code` = PL (case-insensitive), finite `latitude`/`longitude`, plus `country` and optional `admin1` for identification.
- Query `https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current=temperature_2m,weather_code&temperature_unit=celsius&timezone=auto` using that result. Require HTTP success, no provider error, finite `current.temperature_2m`, a documented integer `current.weather_code`, nonempty `current.time`, and Celsius in `current_units.temperature_2m`. Record returned timezone/UTC offset alongside local-format time. Convert the code to its documented phrase in the disposable probe or evidence, keeping both values.
- Use bounded requests (30 seconds per operation), no polling or automatic retry loop. Retry manually only after an identified setup correction, recording each attempt.
- Print a focused summary of location identity, coordinates, statuses, current fields, units, time, and derived condition phrase. Public request URLs may be recorded for reproducibility; omit unrelated browser/account information and avoid raw browser/network dumps.
- Identify free-use/setup, transport/CORS, quota, provider response, empty lookup, and missing-data outcomes separately. A rejected fetch has no observable HTTP status; record that explicitly instead of inventing one.
- Provide the supported-browser-tooling execution path and a human console fallback. Neither a shell request nor opening an API URL directly proves that browser JavaScript can read the response from localhost.

### Success Criteria

#### Automated Verification

- Provider references are aligned in active instructions and the historical seed quote is preserved; inspect `git diff -- AGENTS.md context/foundation/tech-stack.md context/foundation/shape-notes.md`.
- The runbook exists and whitespace checks pass: `test -s context/changes/gh-1-live-weather-access/access-runbook.md` and `git diff --check`.

#### Manual Verification

- Review confirms that the runbook is repeatable, has no literal credentials, and covers both required operations and the agreed browser fallback.

**Checkpoint:** Obtain manual review of the prepared runbook before phase 2. There is no credential-acquisition gate.

## Phase 2: Validate Browser Access and Record the Readiness Decision

### Overview

Attempt the documented public-endpoint check, record what actually happened, and update the downstream readiness consistently.

### Changes Required

#### 1. Sanitized validation record

**File:** `context/changes/gh-1-live-weather-access/access-validation.md` (new)

**Intent:** Preserve auditable evidence of both operations or a specific prerequisite/access blocker. The agent executes browser requests where supported, with human console execution as the agreed fallback.

**Contract:** Record date/time with timezone, browser, actual localhost origin, provider, searched place, executed/not-executed state per operation, observed HTTP status when available, provider error/reason when present, selected identity and coordinates, current time with timezone/offset, Celsius value/unit, WMO code, and its condition phrase. Capture only an allowlisted summary and sanitized diagnostic details. Include applicable free-use restrictions, attribution, and the model-derived nature of current conditions and the final `confirmed` or `blocked` outcome.

No credentials are needed or requested. If local browser execution is unavailable, use the agreed human-console fallback; if that is also unavailable, record both operations as `not executed`, with an owner and concrete recheck action. If geocoding fails, mark current weather not executed; if current weather fails, retain the successful location evidence. A blocker record names the affected operation, observed response or missing prerequisite, next action, owner, and recheck trigger. Never report live access confirmed when an operation is unperformed or required data is absent.

#### 2. Roadmap hand-off

**Files:** `context/foundation/roadmap.md`, `context/changes/gh-1-live-weather-access/change.md`

**Intent:** Tie this issue-derived change to F-01 and propagate the actual access outcome to S-01.

**Contract:** Add the explicit F-01 mapping to `gh-1-live-weather-access` and its evidence path, consistently updating the table, F-01 detail, and backlog hand-off. Preserve the original `validate-weather-access` identifier as an alias note. Update the roadmap date and summarize the Open-Meteo decision and observed access result. On confirmed access, mark F-01 done, mark S-01 ready, clear its access blocker, and make its planning readiness consistent. On blocked access, keep S-01 blocked/not ready and identify the unresolved access prerequisite; F-01 may be recorded as an investigation with a blocker but must not claim successful validation. Record the outcome link in change.md; let the implementation workflow manage lifecycle status. Do not close or edit the GitHub issue automatically. Unperformed live acceptance checks remain explicitly unsatisfied.

### Success Criteria

#### Automated Verification

- Evidence and runbook files exist and whitespace checks pass: `test -s context/changes/gh-1-live-weather-access/access-validation.md`, `test -s context/changes/gh-1-live-weather-access/access-runbook.md`, and `git diff --check`.
- Only intended documentation paths changed; inspect `git status --short` and the scoped diff, leaving existing unrelated work untouched.

#### Manual Verification

- The evidence accurately records both browser operations or explicitly identifies unexecuted operations, a concrete blocker, owner, and next action; retained output contains no credentials.
- Roadmap and change-record review confirms S-01 is ready only after complete successful access evidence; blocked or partial validation remains blocked.

## Testing Strategy

This change adds documentation and conducts a live manual integration check; it does not add an automated weather test suite. File/whitespace checks verify artifacts, not external service access. Review new untracked documents as well as Git diffs, since `git diff --check` alone does not inspect untracked file contents.

Run build and lint separately if implementation unexpectedly changes application code; such changes require scope review because they are not part of this plan. Do not report build/lint as proof of live weather access. No additional test runner or E2E framework is needed.

Manual execution follows the runbook: start the local app, resolve Warsaw, request its current conditions, inspect the sanitized summary, then record the readiness decision. Provider documentation examples and shell requests cannot replace live browser evidence.

## Performance and Recovery

Two sequential requests per normal attempt, with a 30-second timeout each and no polling. Document the published free-use limits and any observed quota/service restriction; no account, billing, or subscription changes are part of implementation. Record a specific next action and recheck trigger for failed attempts rather than retrying indefinitely. A failed attempt does not authorize a backend, a provider fallback, or fake weather.

## Risks and Assumptions

- Open-Meteo public access removes the key-acquisition blocker. The free API has usage restrictions and no uptime guarantee; document relevant terms for the planned demo.
- Localhost CORS/readability and Warsaw data availability remain unverified runtime dependencies. Their validation is the purpose of phase 2.
- Current values are model-derived. Weather conditions arrive as numeric WMO codes; an evidence phrase must come from the documented code table, not a fabricated provider description.
- User-selected browser execution depends on available tooling; the documented human fallback preserves the same origin and sanitization requirements.
- The issue body still names OpenWeather. The user's latest 2026-10-21 Open-Meteo decision is authoritative and is retained in this change record; the issue is not silently edited.

## Migration and Rollback

No application or data migration. Preserve existing source, configs, dependencies, historical reports, and original discovery quotes. No provider credentials are created or migrated. Preserve previous provider decisions as dated history where useful without leaving them as active requirements. Do not reset unrelated working-tree changes.

## References

- GitHub issue: https://github.com/FrancescoCentrone/weather-demo/issues/1
- `AGENTS.md:7`, `AGENTS.md:20`, `AGENTS.md:25`
- `context/foundation/prd.md` — FR-001, FR-002, and current-weather scope
- `context/foundation/tech-stack.md:31`, `context/foundation/shape-notes.md:128`
- `context/foundation/roadmap.md:49`, `context/foundation/roadmap.md:64`
- `package.json:6`, `src/App.tsx:1`, `vite.config.ts:5`, `.gitignore:13`
- [Open-Meteo overview](https://open-meteo.com/)
- [Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
- [Weather API, current fields, errors, and WMO code table](https://open-meteo.com/en/docs)
- [Pricing and public-use limits](https://open-meteo.com/en/pricing), [terms and attribution](https://open-meteo.com/en/terms)

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: Align Provider References and Prepare the Runbook

#### Automated

- [x] 1.1 Provider references are aligned in active instructions and the historical seed quote is preserved — 0f893d4
- [x] 1.2 The runbook exists and whitespace checks pass — 0f893d4

#### Manual

- [x] 1.3 Review confirms that the runbook is repeatable, has no literal credentials, and covers both required operations and the agreed browser fallback — 0f893d4

### Phase 2: Validate Browser Access and Record the Readiness Decision

#### Automated

- [x] 2.1 Evidence and runbook files exist and whitespace checks pass — 7145f10
- [x] 2.2 Only intended documentation paths changed — 7145f10

#### Manual

- [x] 2.3 The evidence accurately records both browser operations or explicitly identifies unexecuted operations, a concrete blocker, owner, and next action; retained output contains no credentials — 7145f10
- [x] 2.4 Roadmap and change-record review confirms S-01 is ready only after complete successful access evidence; blocked or partial validation remains blocked — 7145f10
