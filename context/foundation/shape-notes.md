---
project: "Weather Demo"
context_type: greenfield
created: 2026-10-20
updated: 2026-10-20
product_type: web-app
target_scale:
  users: small
  # qps and data_volume were not specified.
timeline_budget:
  hard_deadline: 2026-10-22
  # TODO: after_hours_only — see Open Questions
  mvp_weeks: 1
  # User target: 2 days; rounded up to the schema’s integer week unit.
checkpoint:
  current_phase: 8
  phases_completed: [1, 2, 3, 4, 5, 6, 7]
  gray_areas_resolved:
    - topic: project context
      decision: From scratch — new app.
    - topic: project purpose and primary persona
      decision: A presenter demonstrating development skills through location search and weather display.
    - topic: weather scope
      decision: Current temperature and conditions only.
    - topic: access
      decision: Use without logging in.
  frs_drafted: 3
  quality_check_status: accepted
---

## Seed idea

> i want to create a simple browser application, no login, just search location and show the weather. No backend, just use open weather api.

## Vision & Problem Statement

Weather Demo is a demo for a development skill presentation. It demonstrates searching for a location and displaying its current temperature and conditions.

The intended audience is the presenter or a handful of people. The user confirmed that the same simple weather-lookup rule would apply at 100 times that audience size.

## User & Persona

The primary persona is a presenter demonstrating development skills through the location-search-to-weather flow.

## Success Criteria

### Primary

- Open the page, type a city/location, submit the search, and see that location’s current temperature and conditions.
- Delivery target stated by the user: 2 days, with a hard deadline of 22 October 2026.

### Secondary

- Not specified.

### Guardrails

- An unknown location produces a clear message distinct from a weather-service failure.

## User Stories

### US-01: Presenter searches for weather

- **Given** the page is open without login
- **When** the presenter submits a known location
- **Then** they see its current temperature in Celsius and conditions

#### Acceptance Criteria

- A known location displays its current temperature in Celsius and conditions.
- An unknown location displays a clear message distinct from a weather-service failure.
- Multiple matches use the first match and clearly display its country/region.

## Functional Requirements

- FR-001: Presenter can search by city/location using free text, using the first match and clearly showing its country/region. Priority: must-have
  > Socrates: Preset locations could reduce ambiguity. Resolution: keep free-text search; ambiguity needs a clear outcome.
- FR-002: Presenter can view the matched location’s live current temperature in Celsius and conditions. Priority: must-have
  > Socrates: Live data could be unpredictable during a presentation. Resolution: keep real weather; live data is part of the demo.
- FR-003: Presenter can receive distinct clear messages for an unknown location and a weather-service failure. Priority: must-have
  > Socrates: Calling service failures unknown locations would mislead the presenter. Resolution: distinguish unknown locations from service failures.

## Non-Functional Requirements

- No additional browser, device, or response-time targets for this demo were requested.

## Business Logic

Show live current temperature in Celsius and conditions for the first matching location, clearly display its country/region, and distinguish missing locations from service failures.

The input is the submitted city/location text. If multiple places match, use the first match. The output is that place’s live current temperature in Celsius and conditions, with country/region identifying the result.

## Access Control

The presenter can search a location and view weather without logging in.


## Non-Goals

- No accounts or login: the demo flow is accessible without signing in.
- No forecasts: scope is current temperature and conditions only.
- No saved or favorite locations: the confirmed flow searches a location each time.
- No automatic device-location lookup: the presenter enters the location manually.
- No unit switching: temperature is Celsius only.

## Open Questions

1. **Is this day-job or after-hours work?** — Owner: user. Not specified; no resolution date supplied.
2. **What are the expected request rate and data volume?** — Owner: user. Not specified beyond an audience of a handful; no resolution date supplied.
3. **Is a secondary success criterion needed?** — Owner: user. None specified; no resolution date supplied.

## Discovery progress

Phases 1–6 are complete. The user accepted the closing cross-check and chose to keep remaining details as open questions. Ready for /10x-prd.

## Quality cross-check

- Access Control: present — use without logging in.
- Business Logic: present — first matching location, live current weather in Celsius, distinct failure outcomes.
- Project artifacts: present — shape-notes.md includes the checkpoint.
- Timeline-cost acknowledgment: present — two-day target, within three weeks; hard deadline 2026-10-22.
- Non-Goals: present — five confirmed exclusions.
- Preserved behavior: not applicable to this greenfield app.
- No required cross-check gaps. The user accepted completion with remaining details recorded in Open Questions.

## Forward: tech-stack

User constraints: no backend; use OpenWeather API.
