# Live Current Weather — Plan Brief

> Full plan: [plan.md](plan.md)

## What & Why

Deliver the successful weather-search path for the local presentation demo. The presenter enters a location and sees the first matching place's live current Celsius temperature and conditions, with its country and available region.

## Starting Point

The application still displays the React/Vite starter screen. F-01 has confirmed both Open-Meteo requests from the local browser; its probe did not implement a reusable API module or weather UI.

Issue #2 still mentions OpenWeather and blocked access. The updated foundation documents establish Open-Meteo and ready access; the plan follows those decisions.

## Desired End State

A labelled search form and simple weather card replace the starter. Submitting clears old weather, shows loading, and prevents overlapping searches. A successful response shows place identity, Celsius temperature, and conditions, with attribution and a note that current conditions are model-derived.

Unsuccessful searches stop safely and permit another attempt. No-match and service failure stay distinct internally; their distinct visible messages remain in S-02 by explicit user decision.

## Key Decisions Made

| Decision | Choice | Why |
|---|---|---|
| Service and architecture | Open-Meteo directly from the browser | Foundation documents and F-01 already establish this. |
| API boundary | New `src/weather.ts` | Separates requests, validation, and WMO descriptions from presentation. |
| Failure scope | Neutral feedback now; distinct messages in S-02 | Preserves the agreed slice boundary; FR-003 remains incomplete until S-02. |
| Previous result | Clear when a new search starts | Avoids presenting old weather as the new result. |
| Concurrent submissions | One search at a time | Keeps the demo predictable and prevents overlapping work. |
| Visible detail | Place, country/region, Celsius, conditions, attribution | Matches the requested scope; no visible timestamp. |
| Visual treatment | Simple readable form and card | Keeps attention on the live lookup. |
| Timeout | 30 seconds per request; manual resubmission | Bounds loading without automatic retries. |
| Verification | Build/lint and recorded browser checks | Proves the flow without adding a test framework. |

## Scope

**In scope:** explicit free-text submission, first-match identity, live current weather, loading, minimal safe recovery, responsive styling, attribution, and evidence.

**Out of scope:** distinct failure messages, forecasts, location selection, accounts, favorites, device location, unit switching, backend, hosting, deployment, CI/CD, polling, automatic retries, and new test tooling.

## Architecture / Approach

`App.tsx` owns form and presentation state. The new `src/weather.ts` performs geocoding, selects its first result, fetches current weather using those coordinates, and returns validated normalized data. Styling lives in `App.css` and `index.css`; `index.html` receives the Weather Demo title. No new dependency is needed.

## Phases at a Glance

| Phase | What it delivers | Key risk |
|---|---|---|
| 1. Build the live search flow | API boundary, complete UI, attribution, build/lint | Incorrect response handling or stale state. |
| 2. Verify and record browser behavior | Live-flow and safe-recovery evidence in `verification.md` | Network or browser tooling may prevent verification. |

**Prerequisites:** existing npm setup, internet access, and a supported local browser. F-01 access is confirmed.

**Estimated effort:** a small frontend change across two phases, expected to fit one implementation session plus presenter review; external service/tooling interruptions may extend it.

## Open Risks & Assumptions

- Public-service availability can interrupt the demo; never substitute fixed sample data.
- The approved timeout is per request, so the full two-request operation may approach 60 seconds.
- Distinct failure messages are deliberately deferred despite the full PRD requirement; S-01 does not finish FR-003.
- Existing public-service use restrictions and attribution remain applicable to the local evaluation/prototype.
- No unresolved product decisions remain. Unsupported browser checks must be recorded and handed off, not marked passed.

## Success Criteria (Summary)

- A known search displays actual current Celsius weather and conditions for the first match, clearly identified by country/available region.
- Repeated searches replace the previous result; loading and unsuccessful searches recover without stale or fabricated weather.
- Build and lint pass, and separate browser evidence is recorded and reviewed by the presenter.
