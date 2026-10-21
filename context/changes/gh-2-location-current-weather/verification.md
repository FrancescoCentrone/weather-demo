# Phase 2 Browser Verification

## Context

- Date: 2026-10-21. Checks performed approximately 11:16–11:24 Europe/Warsaw (09:16–09:24 UTC); record finalized at 11:23:54 Europe/Warsaw.
- Application revision: `1ad6f5b`, phase 1 implementation. No application source changes were needed during phase 2.
- Actual app origin: `http://localhost:5173/`; title: Weather Demo. Existing Vite development server.
- Browser: Google Chrome on macOS. Full version unavailable: browser policy blocked navigation to `chrome://version/`; no workaround attempted. Owner: presenter, who can supply the version if required for the final record.
- Method: actual form submissions, browser accessibility/DOM inspection, and Chrome DevTools Network request/response and Timing panels. No backend, proxy, fabricated weather, or installed test framework.
- This record describes the implemented app, separately from F-01's disposable browser probe.

## Automated Results

- Phase 1 `npm run build`: passed (TypeScript checking and Vite production build), before commit `1ad6f5b`.
- Phase 1 `npm run lint`: passed (Oxlint), before commit `1ad6f5b`.
- No source changes since those checks; they were not rerun merely to repeat prior results.
- Phase 2 record structure and `git diff --check`: passed.
- No automated weather test suite exists or was added. The scenarios below are browser checks performed by the agent, awaiting presenter confirmation.

## Manual Scenarios

| Scenario | Observation | Agent result |
|---|---|---|
| Known location | Submitting Warsaw displayed Warsaw / Mazovia, Poland, 13.6 °C, Mainly clear. Loading showed disabled input/button and no weather card. | Passed |
| Ambiguous name and response agreement | Submitting Springfield made exactly two requests, both HTTP 200. The first returned match was Springfield, Missouri, United States; the card showed 10.3 °C and Clear sky, matching the current-weather payload. | Passed |
| Whitespace | Replaced the input with spaces and pressed Enter. Search remained disabled and the Network log stayed at the same two requests. Previous valid card remained because no valid new search began. | Passed |
| No-match | Submitted `zzzznonexistent987654321`. Geocoding returned HTTP 200 with `{"generationtime_ms":0.20337105}` and no results. Only one request was added. Weather card disappeared; neutral feedback appeared; submission was restored. | Passed |
| Controlled offline failure | Enabled the DevTools Offline preset and submitted Paris using native UI controls. The geocoding request failed; no weather request was added. Neutral feedback appeared and controls recovered. This was a simulated browser failure, not an observed provider outage. | Passed |
| Recovery and replacement | Restored No throttling and manually submitted Paris. The card displayed Paris / Île-de-France Region, France, 12.8 °C, Overcast, replacing previous content without login. | Passed |
| Loading and duplicate prevention | Applied a temporary custom 35,000ms latency profile and submitted Warsaw after the Paris success. The card was cleared, input and button were disabled, and two additional Enter presses did not add requests: log increased from eight to nine total requests only. | Passed |
| Timeout | Under that delay, the ninth request failed and DevTools Timing showed 30.00 seconds total (29.99 seconds initial connection). Neutral feedback appeared and controls were restored. No follow-up weather request or automatic retry appeared. | Passed |
| Recovery after timeout | Restored No throttling and manually retried Warsaw. Exactly two requests were added (eleven total); Warsaw / Mazovia, Poland, 13.6 °C, Mainly clear returned. | Passed |
| Narrow layout | Set viewport to 375 × 812. DOM reported both viewport and document content width as 375px; screenshot showed readable form, result, and attribution with no horizontal overflow. Restored default viewport afterward. | Passed |

### Captured Response Details

Springfield geocoding request:

`https://geocoding-api.open-meteo.com/v1/search?name=Springfield&count=1&language=en&format=json`

HTTP 200; first match: Springfield, Missouri, United States (US), latitude 37.21533, longitude -93.29824. The weather request used those exact selected coordinates:

`https://api.open-meteo.com/v1/forecast?latitude=37.21533&longitude=-93.29824&current=temperature_2m%2Cweather_code&temperature_unit=celsius&timezone=auto`

HTTP 200; current temperature 10.3, unit °C, WMO weather code 0, locally interpreted as Clear sky. Data time `2026-10-21T04:15`, timezone `America/Chicago`, UTC offset -18000 seconds. Response grid coordinates were 37.2072 / -93.30584; those differ from search coordinates because the service returns its weather grid location. The app correctly requested the geocoding coordinates and displayed the matched place identity.

The Warsaw and Paris card values above were read from the implemented UI during this run. They are observations, not fixed expected temperatures. The detailed payload-to-card comparison was performed on Springfield, which also proves that weather code zero is accepted.

## Focused Code Review

- `src/weather.ts` accepts finite numeric zero temperature and integer code zero. Zero code was additionally observed live for Springfield; zero temperature was not observed live.
- Region is optional; country code is an identity fallback. These branches were reviewed, not exercised with synthetic payloads.
- Non-array location results, invalid first matches, invalid coordinates, HTTP/provider errors, malformed current fields, non-Celsius units, and unknown codes fail safely. Missing/empty result arrays remain a distinct internal no-match outcome.
- Request timeouts cover fetch and JSON body reading; timers/listeners are removed in `finally`. UI unmount cancels active work, while the ref guard prevents overlapping submissions and abandoned state updates.
- No automated or synthetic payload tests are claimed for these reviewed branches.

## Tooling Notes and Cleanup

- The original user tab became unavailable after the first Warsaw success. Continued in a dedicated local verification tab.
- A first attempt using browser automation immediately after selecting Offline still returned a successful Warsaw result. That attempt did not establish offline behavior. The documented offline failure was subsequently reproduced using native controls with the preset visibly active.
- Network simulations were scoped to the verification tab. No operating-system network settings or security protections were changed.
- Restored No throttling, removed the disposable “Weather demo temporary timeout” profile, closed DevTools, and reset the temporary viewport override.
- Responsive screenshot is available for presenter review at `/private/tmp/weather-demo-phase-2.jpg`; it is not a source asset or an automated test artifact committed to the repository.
- The local weather tab remains available for presenter review. No source changes, browser security bypass, or additional tooling were required.

## Presenter Acceptance

The presenter reviewed this record and confirmed phase 2 checks and S-01 acceptance on 2026-10-21 (“looks good”). Criteria 2.2–2.6 are now confirmed. Distinct unknown-location versus service-failure messages remain explicitly deferred to S-02; S-01 does not complete FR-003.

Full browser version remains unrecorded as described above; it does not invalidate the observed behavior. No unresolved application behavior failures were found in these checks.
