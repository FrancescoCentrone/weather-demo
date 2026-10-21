# Open-Meteo Browser Access Check

Prepared on 2026-10-21 for F-01 / GitHub issue #1. This runbook prepares the phase 2 check; it is not evidence that access has succeeded. The application remains the starter screen.

## Prerequisites and Use Limits

Use the existing npm installation, internet access, and a browser with developer tools. No provider signup, API key, credit card, environment file, or application namespace is needed for these public endpoints. Do not use the paid `customer-` endpoints.

This is the local evaluation/prototype described in the project documents. The public service is restricted to non-commercial use and has no uptime guarantee. Check the intended presentation against the provider's [terms](https://open-meteo.com/en/terms) and [pricing](https://open-meteo.com/en/pricing). If the intended use falls outside the free terms, record that specific usage blocker with the project owner and a next action; do not purchase access or silently change providers.

Published limits checked on 2026-10-21: stay below 10,000 calls/day, 5,000/hour, and 600/minute; the pricing page also lists 300,000/month. A normal probe makes two sequential requests. Do not poll or automatically retry. Respect limits even when repeated attempts share the same IP address.

Data attribution: [Weather data by Open-Meteo](https://open-meteo.com/), under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); location data is based on [GeoNames](https://www.geonames.org/), as documented by the [Geocoding API](https://open-meteo.com/en/docs/geocoding-api). Retain those links with the evidence and carry attribution into the later weather UI. Any condition phrase in the summary is a local interpretation of the numeric WMO code, not text supplied by the weather response.

Current weather is derived from weather-model data rather than a direct station reading. Request only the current temperature and weather code. The weather endpoint is named `/v1/forecast`, but using its `current` fields does not add a forecast feature to this demo.

## Start the Local Page

From the repository root:

```bash
npm run dev
```

Open the localhost URL Vite prints, including its actual port. Keep that page selected for the entire check. Record the browser name/version and the actual origin, not an assumed port. No source edit is needed.

## Execution Options

**Agent execution:** Use available, supported browser tooling only if it can execute the probe from the local page and return the focused summary. Read that tooling's instructions first. Do not assume that arbitrary JavaScript execution is available. If unsupported, use the human fallback below rather than introducing another automation framework or bypassing browser restrictions.

**Human console fallback:** On the local Vite page, open Developer Tools → Console. Read the snippet below, paste it, and run it once. Use the browser's normal console controls; do not disable security protections. Copy only the JSON summary printed by the snippet. If pasting is disallowed, use the browser's supported workflow or record the tooling limitation.

Neither `curl`, opening a remote API URL directly, nor a provider documentation example verifies that JavaScript on the localhost page can read both responses. A browser result must originate on the local demo page. Do not use a proxy, `no-cors`, a backend, or disabled browser security.

## Disposable Browser Probe

This snippet performs the agreed known-location check only. It creates no UI, API module, storage, or persistent page state. Each request, including response-body reading, has a 30-second timeout. It prints no unrelated page or account information.

```javascript
void (async () => {
  const report = {
    checkedAt: new Date().toISOString(),
    origin: location.origin,
    provider: 'Open-Meteo',
    search: 'Warsaw, PL',
    dataKind: 'Model-derived current conditions',
    geocoding: { state: 'not executed', httpStatus: null },
    weather: { state: 'not executed', httpStatus: null },
    outcome: 'blocked'
  }
  const stop = (entry, category, reason) => {
    Object.assign(entry, { state: 'failed', category, reason })
    throw new Error('Probe stopped')
  }
  const text = value => typeof value === 'string' && value.trim().length > 0
  const request = async (url, entry) => {
    entry.state = 'attempted'
    entry.url = String(url)
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 30000)
    let response
    let body
    try {
      response = await fetch(url, {
        signal: controller.signal,
        credentials: 'omit',
        cache: 'no-store'
      })
      entry.httpStatus = response.status
      body = await response.json()
    } catch {
      const category = controller.signal.aborted ? 'timeout' :
        response ? 'response-body' : 'transport/CORS'
      stop(entry, category, 'Response unavailable, unreadable, or timed out; inspect locally')
    } finally {
      clearTimeout(timer)
    }
    if (!response.ok || body?.error) {
      const category = response.status === 429 ? 'quota' : 'provider-response'
      const reason = typeof body?.reason === 'string' ? body.reason.slice(0, 240) : 'HTTP failure'
      stop(entry, category, reason)
    }
    return body
  }
  try {
    if (!['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) ||
        !['http:', 'https:'].includes(location.protocol)) {
      report.setupBlocker = 'Run from the local Vite page; no requests were made'
      throw new Error('Wrong origin')
    }
    const geoUrl = 'https://geocoding-api.open-meteo.com/v1/search?name=Warsaw&countryCode=PL&count=1&language=en&format=json'
    const geo = await request(geoUrl, report.geocoding)
    const place = geo?.results?.[0]
    if (!place) stop(report.geocoding, 'empty-lookup', 'No first result for the known location')
    if (!text(place.name) || !text(place.country) ||
        place.country_code?.toUpperCase() !== 'PL' ||
        !Number.isFinite(place.latitude) || !Number.isFinite(place.longitude)) {
      stop(report.geocoding, 'missing-data', 'First match lacks the required location fields')
    }
    Object.assign(report.geocoding, {
      state: 'passed',
      name: place.name,
      country: place.country,
      countryCode: place.country_code,
      region: text(place.admin1) ? place.admin1 : null,
      latitude: place.latitude,
      longitude: place.longitude
    })
    const weatherUrl = new URL('https://api.open-meteo.com/v1/forecast')
    weatherUrl.search = new URLSearchParams({
      latitude: String(place.latitude),
      longitude: String(place.longitude),
      current: 'temperature_2m,weather_code',
      temperature_unit: 'celsius',
      timezone: 'auto'
    }).toString()
    const weather = await request(weatherUrl, report.weather)
    const current = weather?.current
    // WMO descriptions from Open-Meteo's documented code table.
    const descriptions = {
      0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Fog', 48: 'Depositing rime fog',
      51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
      56: 'Light freezing drizzle', 57: 'Dense freezing drizzle',
      61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
      66: 'Light freezing rain', 67: 'Heavy freezing rain',
      71: 'Slight snowfall', 73: 'Moderate snowfall', 75: 'Heavy snowfall',
      77: 'Snow grains', 80: 'Slight rain showers', 81: 'Moderate rain showers',
      82: 'Violent rain showers', 85: 'Slight snow showers', 86: 'Heavy snow showers',
      95: 'Thunderstorm', 96: 'Thunderstorm with slight hail',
      97: 'Heavy thunderstorm', 99: 'Thunderstorm with heavy hail'
    }
    if (!Number.isFinite(current?.temperature_2m) ||
        !Number.isInteger(current?.weather_code) || !descriptions[current.weather_code] ||
        !text(current?.time) || weather?.current_units?.temperature_2m !== '°C' ||
        !text(weather?.timezone) || !Number.isFinite(weather?.utc_offset_seconds)) {
      stop(report.weather, 'missing-data', 'Current fields, documented code, Celsius unit, or timezone missing')
    }
    Object.assign(report.weather, {
      state: 'passed',
      temperatureC: current.temperature_2m,
      unit: weather.current_units.temperature_2m,
      weatherCode: current.weather_code,
      conditions: descriptions[current.weather_code],
      currentTime: current.time,
      timezone: weather.timezone,
      utcOffsetSeconds: weather.utc_offset_seconds
    })
    report.outcome = 'confirmed'
  } catch {
    // Only the focused diagnostics above are retained, never a raw exception.
    if (!report.setupBlocker && report.geocoding.state !== 'failed' && report.weather.state !== 'failed') {
      report.setupBlocker = 'Unexpected probe/tooling failure; review locally before retrying'
    }
  } finally {
    console.log(JSON.stringify(report, null, 2))
  }
})()
```

## Interpret the Result

Both operations must be `passed` and `outcome` must be `confirmed`. Check that the identity describes Warsaw in Poland, with the returned region if available. Confirm a numeric Celsius value, documented weather code and phrase, and current time with its timezone/offset. Zero Celsius and clear-sky code zero are valid. Record the returned time without imposing an unstated freshness target; clearly historical or unusable data is not sufficient proof of current access.

The local page must be the Vite demo, not merely any page hosted at localhost. Add the browser name/version manually to the saved record. A console result of `undefined` after running the snippet is normal; use the printed JSON summary.

| Outcome | Interpretation and next action |
|---|---|
| Both passed | Preserve summary, inspect identity/time/units, and record confirmed access in phase 2. |
| Setup/tooling failure | Record operations not executed or their actual partial state. Agent/user restores the local browser workflow; do not call it provider failure. |
| Timeout or transport/CORS | Status is null if no response was exposed; a status may remain if body reading failed. Inspect the browser locally for offline, DNS, CORS, or timeout evidence. Do not infer CORS from every failed fetch. Owner: project owner; correct the observed cause and rerun. |
| HTTP 429 | Record quota restriction. Owner: project owner; wait for the applicable window or reduce other use before a manual retry. |
| HTTP/provider failure | Retain observed status and safe reason. Owner: project owner; correct request parameters or check provider service status before rechecking. |
| Empty lookup | No known-location success was established. Verify name/country settings; retain failed geocoding and unexecuted weather. |
| Missing fields or unknown code | Keep partial success evidence. Owner: project owner; inspect the current API contract/data and document the required correction; do not fabricate weather or map unknown values to success. |
| Intended use outside free terms | Record a usage blocker before making requests. Owner: project owner; resolve suitable access or revise intended use separately. |

No hard-coded fallback coordinates, alternate provider, automatic retry loop, or fake weather. After a concrete correction, run a new manual attempt and retain the earlier attempt with its timestamp.

## Phase 2 Evidence and Cleanup

Create `access-validation.md` beside this runbook during phase 2. Record:

- Attempt timestamp/timezone, browser name/version, actual Vite origin, provider, and searched place.
- Both operations' execution state and observed status (or explicitly unavailable status), including the public URLs if useful.
- First-match name, country, region when present, and coordinates; returned Celsius value/unit, WMO code/phrase, and time/timezone/offset.
- Model-derived nature of current data, applicable free-use restrictions, and attribution links above.
- Final confirmed/blocked outcome. Each blocker needs the failing operation or missing prerequisite, observation, owner, next action, and recheck trigger.

Copy only the focused summary and necessary diagnostic text, not screenshots or network exports containing unrelated browser information. The snippet stores no local/session storage, cookies, files, or globals; close Developer Tools when finished. Stop the Vite server with Ctrl+C if you started it only for this check.

Only phase 2 updates roadmap readiness. S-01 stays blocked until both actual browser operations and required fields are confirmed. File checks, a syntax check of this snippet, or build/lint results do not establish live access.

## References

- [Open-Meteo public API](https://open-meteo.com/)
- [Geocoding parameters, response fields, errors, and attribution](https://open-meteo.com/en/docs/geocoding-api)
- [Current weather fields and WMO code descriptions](https://open-meteo.com/en/docs)
- [Pricing and limits](https://open-meteo.com/en/pricing), [terms](https://open-meteo.com/en/terms)
- [Implementation plan](plan.md), [plan brief](plan-brief.md)
