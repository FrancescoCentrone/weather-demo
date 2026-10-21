# Location Search and Live Current Weather Implementation Plan

## Overview

Deliver S-01 / GitHub issue #2: replace the starter screen with a free-text search that displays the first matching place's live current temperature in Celsius and conditions, identified by country and available region. Keep requests in the browser and separate API handling from presentation.

The user approved medium complexity, all seven recommended decisions, and the two-phase structure on 2026-10-21. This document plans implementation; it does not report completed application work or successful verification.

## Current State Analysis

- `src/App.tsx:1` contains only starter imports, a counter, and starter links. There is no weather UI or API module.
- `src/App.css:1` and `src/index.css:1` style the starter; the root layout also needs adapting.
- `src/main.tsx:1` already mounts the app under React StrictMode and imports global styles. Preserve this entry point.
- `package.json:6` defines development, TypeScript/Vite build, Oxlint, and preview commands. There is no test runner or automated weather suite.
- F-01 confirmed both live browser requests with HTTP 200 and required fields; see `../gh-1-live-weather-access/access-validation.md`, attempt 3. The roadmap marks S-01 ready.
- Issue #2's OpenWeather constraint and blocked-readiness statements are stale. The updated stack hand-off and roadmap establish Open-Meteo and confirmed access. No GitHub issue edit is part of this plan.
- S-02 owns distinct unknown-location and service-failure messages. The user explicitly approved deferring those messages while preserving separate internal outcomes and using neutral failure feedback in S-01. This is an agreed, temporary exception to the full PRD/repository error-message requirement; S-01 alone does not complete FR-003.

## Desired End State

The presenter opens the local app without login, enters a city/location, and submits with the button or Enter. Loading clears the previous weather result and prevents another submission until the operation finishes. Success shows the first match's name, country, available region, numeric Celsius temperature, and a readable condition phrase. A simple form and weather card carry Open-Meteo and GeoNames attribution.

Blank input makes no request. An unsuccessful lookup clears loading and allows another attempt without showing fabricated or stale success. No-match and service-failure outcomes remain distinguishable within the API boundary; the UI uses the same neutral message for both until S-02. Each network request, including body reading, has a 30-second timeout. There is no automatic retry.

### Key Discoveries

- `AGENTS.md:20` requires request/response handling separate from presentation; use the new `src/weather.ts` module.
- `context/foundation/roadmap.md:78` assigns distinct unsuccessful-search messages to S-02.
- `context/changes/gh-1-live-weather-access/access-runbook.md:91` uses a Poland filter only for its Warsaw probe. Production free-text lookup must not impose that filter or fixed coordinates.
- Open-Meteo's geocoding endpoint supports a submitted name and a result count of one. Optional administrative fields can be absent; do not require a region to succeed.
- Current conditions require local interpretation of the provider's WMO weather code. Temperature zero and code zero are valid values.

## Scope Boundaries

Include free-text submitted search, first-match identity, live current Celsius temperature and conditions, loading, minimal safe recovery, attribution, and focused verification.

Exclude forecasts, place selection, accounts, saved locations, device geolocation, unit switching, backend/proxy, hosting, deployment, CI/CD, polling, caching infrastructure, automatic retries, new test tooling, and decorative weather dashboards. Do not display a provider timestamp. Distinct failure messages and comprehensive negative-case testing remain in S-02.

## Implementation Approach

Use one small API module and React component state. `App` owns input and idle/loading/success/unsuccessful presentation. `src/weather.ts` owns URL construction, sequential requests, runtime response validation, normalization, condition descriptions, and timeout cleanup. No additional runtime package is needed.

### API Contract

Export `lookupCurrentWeather(query: string, signal?: AbortSignal): Promise<WeatherLookupResult>` from `src/weather.ts`. The discriminated result has `status: 'found'` with normalized place `{ name, country, region? }`, `temperatureC`, and `conditions`, or `status: 'not-found'` without weather. Transport, HTTP, provider-error, timeout, and malformed-data failures reject separately from no-match. Cancellation must not become a visible error after unmount.

- Geocode using `https://geocoding-api.open-meteo.com/v1/search` with the trimmed submitted `name`, `count=1`, `language=en`, and `format=json`. Construct encoded parameters with URL APIs. Use only the first result; do not search subsequent results for a more convenient match.
- A successful response with omitted `results` or an empty results array means no match. A present non-array `results`, invalid first entry, provider error object, unreadable JSON, or unsuccessful HTTP status means service failure.
- Require a nonempty name, country (country code may serve as identity fallback), and valid finite latitude/longitude within geographic ranges. Include nonempty `admin1` as optional region. Do not fabricate missing identity or coordinates.
- Fetch `https://api.open-meteo.com/v1/forecast` with returned coordinates, `current=temperature_2m,weather_code`, `temperature_unit=celsius`, and `timezone=auto`. Do not request hourly or daily forecast fields.
- Require finite numeric temperature, Celsius units, and an integer code present in the current official WMO table. Normalize documented codes into English descriptions; unknown codes fail safely rather than invent conditions. Check the official table when implementing rather than copying the disposable probe uncritically.
- Use one 30-second timeout per request covering fetch and response-body reading; clear timers and abort listeners on every exit. Preserve the optional caller cancellation signal. Do not retry or fall back to fixed data.

### State and Lifecycle Constraints

Use an explicit submission guard as well as disabled form controls so rapid Enter/click events cannot start overlapping work. Clear prior weather and feedback when a valid new search starts. Restore the form after any completed outcome. Abort pending work on unmount and prevent late updates from an abandoned request; requests start only on form submission, never in a mount effect.

## Phase 1: Build the Live Search Flow

### Overview

Deliver a complete local search-to-weather flow and the API boundary that S-02 can extend.

### Changes Required

#### 1. Browser API Boundary

**File:** `src/weather.ts` (new).

**Intent:** Keep provider details outside TSX, validate external data, and return only usable current weather or an explicit no-match result.

**Contract:** Implement the API contract above, including WMO mapping, timeout/cancellation cleanup, first-result selection, and separate no-match versus service-failure outcomes.

#### 2. Search and Result Presentation

**File:** `src/App.tsx`.

**Intent:** Replace the counter, logos, and starter links with the agreed form and weather card. Keep the experience readable and usable with a keyboard.

**Contract:** A visible input label, explicit submit button, trimmed blank-input guard, one active search, loading status, and a success region with matched name/country/optional region, Celsius temperature, and conditions. Clear previous results during loading. Render neutral unsuccessful-search feedback such as “Could not show weather for this search. Try again.” for no-match and service failure. Keep form input available after completion, announce status accessibly, and retain visible focus styles. Add links for weather data by Open-Meteo, CC BY 4.0, and location data by GeoNames, with a concise note that current conditions are model-derived. No visible data timestamp.

#### 3. Styling and Browser Metadata

**Files:** `src/App.css`, `src/index.css`, `index.html`.

**Intent:** Remove starter layout assumptions and make the form/result easy to read on the presenter's screen and a narrow viewport. Give the browser tab the Weather Demo title.

**Contract:** A simple responsive form/card layout, readable contrast, visible keyboard focus, clear disabled/loading states, and no horizontal overflow at a 375px viewport. Preserve TSX conventions, compiler checks, and React lint rules. Remove unused starter imports; deleting unreferenced assets is unnecessary.

### Success Criteria

#### Automated Verification

- TypeScript and production build pass: `npm run build`.
- Oxlint passes: `npm run lint`.

#### Manual Verification

- The presenter confirms the initial search screen, keyboard submission, loading state, weather card, attribution, and narrow layout are readable and usable.

**Implementation checkpoint:** Complete automated checks and obtain the phase 1 manual confirmation before phase 2. Do not mark manual criteria complete from source inspection alone.

## Phase 2: Verify and Record Browser Behavior

### Overview

Demonstrate that the implemented UI uses real browser-readable service responses and that repeated and unsuccessful searches recover safely.

### Changes Required

#### 1. Verification Record

**File:** `context/changes/gh-2-location-current-weather/verification.md` (new during implementation).

**Intent:** Preserve focused evidence of the actual local app flow, separately from compilation and lint results.

**Contract:** Record timestamp/timezone, browser/version, actual local origin, build/lint outcomes from phase 1, each manual scenario and outcome, observed first-match identity and weather values, network statuses when available, and any blockers. Distinguish prior F-01 access evidence from this new app verification. Record synthetic network-failure checks as controlled checks, never as real provider outages. Store no unrelated browser data. If source fixes are required, rerun build and lint after those fixes before sign-off.

### Success Criteria

#### Automated Verification

- The verification record exists and contains separate automated-results and manual-scenario sections.

#### Manual Verification

- A known location submitted from the local app displays live current Celsius temperature and readable conditions without login; observed browser responses and displayed values agree.
- An ambiguous location uses the first returned match and clearly displays country and region when supplied; a second successful search replaces the first result without stale output.
- Empty input makes no request; loading clears previous weather, prevents duplicate submissions, and ends after completion.
- No-match and a controlled network failure show neutral feedback, leave no stale weather, and permit a subsequent successful manual search; a delayed request times out after approximately 30 seconds and restores submission.
- The presenter reviews the recorded browser evidence and confirms S-01 acceptance, with distinct failure messages explicitly deferred to S-02.

## Testing Strategy

No test runner or weather test suite is introduced. Build verifies types and bundling; lint verifies configured static rules. Neither proves live service access or UI correctness. Manual checks run against the app opened from the URL printed by `npm run dev`, using supported browser tooling or a human handoff.

1. Start the local app and inspect the simple form, attribution, tab title, focus order, and a 375px viewport.
2. Search `Warsaw` and inspect the app's actual geocoding/current-weather responses and rendered values. Do not compare to the historical 12.7 °C probe value; weather changes.
3. Search an ambiguous name such as `Springfield`; compare the rendered identity with the first actual geocoding result. Then search a different known city and verify replacement.
4. Submit whitespace and confirm no requests. During a deliberately slowed search, try repeated Enter/click submissions and confirm only one lookup chain occurs and old weather is cleared.
5. Search an unlikely nonexistent name and inspect its actual empty result. Then use normal browser offline/request-blocking controls to induce a failure and restore connectivity. Confirm neutral feedback and recovery without falsely calling the service failure an unknown location.
6. Use supported browser request delay tooling, if available, to hold a request beyond 30 seconds; confirm bounded loading and successful manual resubmission afterward. If tooling cannot do this, record it as unverified and hand off rather than claiming success or installing a framework.
7. Check zero temperature/code handling, optional region, malformed data, and unknown-code behavior by focused code review; these are not claimed as automated tests or observed live conditions.

## Performance Considerations

A successful search makes two sequential requests; an empty lookup makes only the geocoding request. There is no polling or automatic retry. The two independent request deadlines mean a full lookup can approach 60 seconds in the worst case; the approved 30 seconds is per request. No additional response-time target is imposed.

## Risks and Recovery

- Public service availability and network conditions can interrupt a presentation. Keep explicit manual resubmission and neutral failure feedback; never substitute fake data.
- Optional identity fields and provider schema changes can make a response unusable. Validate before rendering and preserve no-match versus failure internally for S-02.
- Live browser evidence is required. Unsupported tooling is a verification blocker with an owner and next action, not a passing result.
- F-01 records non-commercial public-service restrictions and attribution. This plan retains that local evaluation/prototype scope and does not purchase or change service access.

## Migration and Rollback

No persistent data or migration exists. The scoped application change can be reverted through normal reviewed Git changes if needed; do not reset or force-push. Keep the established branch and scope phase commits to their actual files. Planning and later implementation commits follow their respective approval rules.

## References

- [GitHub issue #2](https://github.com/FrancescoCentrone/weather-demo/issues/2).
- `AGENTS.md`; `context/foundation/prd.md`; `context/foundation/tech-stack.md`; `context/foundation/roadmap.md`.
- `context/changes/gh-1-live-weather-access/access-validation.md` and `access-runbook.md` in that folder.
- [Open-Meteo geocoding contract](https://open-meteo.com/en/docs/geocoding-api) and [current-weather fields/WMO codes](https://open-meteo.com/en/docs), consulted during planning on 2026-10-21.
- [Open-Meteo attribution](https://open-meteo.com/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), and [GeoNames](https://www.geonames.org/).

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: Build the Live Search Flow

#### Automated

- [x] 1.1 TypeScript and production build pass: `npm run build`. — 1ad6f5b
- [x] 1.2 Oxlint passes: `npm run lint`. — 1ad6f5b

#### Manual

- [x] 1.3 The presenter confirms the initial search screen, keyboard submission, loading state, weather card, attribution, and narrow layout are readable and usable. — 1ad6f5b

### Phase 2: Verify and Record Browser Behavior

#### Automated

- [x] 2.1 The verification record exists and contains separate automated-results and manual-scenario sections.

#### Manual

- [x] 2.2 A known location submitted from the local app displays live current Celsius temperature and readable conditions without login; observed browser responses and displayed values agree.
- [x] 2.3 An ambiguous location uses the first returned match and clearly displays country and region when supplied; a second successful search replaces the first result without stale output.
- [x] 2.4 Empty input makes no request; loading clears previous weather, prevents duplicate submissions, and ends after completion.
- [x] 2.5 No-match and a controlled network failure show neutral feedback, leave no stale weather, and permit a subsequent successful manual search; a delayed request times out after approximately 30 seconds and restores submission.
- [x] 2.6 The presenter reviews the recorded browser evidence and confirms S-01 acceptance, with distinct failure messages explicitly deferred to S-02.
