export type WeatherLookupResult =
  | { status: 'not-found' }
  | {
      status: 'found'
      place: { name: string; country: string; region?: string }
      temperatureC: number
      conditions: string
    }

// Open-Meteo WMO table: https://open-meteo.com/en/docs#weathervariables
const conditions = new Map<number, string>([
  [0, 'Clear sky'], [1, 'Mainly clear'], [2, 'Partly cloudy'], [3, 'Overcast'],
  [45, 'Fog'], [48, 'Depositing rime fog'],
  [51, 'Light drizzle'], [53, 'Moderate drizzle'], [55, 'Dense drizzle'],
  [56, 'Light freezing drizzle'], [57, 'Dense freezing drizzle'],
  [61, 'Slight rain'], [63, 'Moderate rain'], [65, 'Heavy rain'],
  [66, 'Light freezing rain'], [67, 'Heavy freezing rain'],
  [71, 'Slight snowfall'], [73, 'Moderate snowfall'], [75, 'Heavy snowfall'],
  [77, 'Snow grains'], [80, 'Slight rain showers'], [81, 'Moderate rain showers'],
  [82, 'Violent rain showers'], [85, 'Slight snow showers'], [86, 'Heavy snow showers'],
  [95, 'Thunderstorm'], [96, 'Thunderstorm with slight hail'],
  [97, 'Heavy thunderstorm'], [99, 'Thunderstorm with heavy hail'],
])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function text(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function finite(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

async function request(url: URL, signal?: AbortSignal): Promise<Record<string, unknown>> {
  signal?.throwIfAborted()
  const controller = new AbortController()
  const cancel = () => controller.abort(signal?.reason)
  signal?.addEventListener('abort', cancel, { once: true })
  const timer = setTimeout(() => controller.abort(), 30_000)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      credentials: 'omit',
      cache: 'no-store',
    })
    if (!response.ok) throw new Error('Weather service request failed')
    const data: unknown = await response.json()
    controller.signal.throwIfAborted()
    if (!isRecord(data) || data.error) throw new Error('Invalid weather service response')
    return data
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', cancel)
  }
}

export async function lookupCurrentWeather(
  query: string,
  signal?: AbortSignal,
): Promise<WeatherLookupResult> {
  const name = query.trim()
  if (!name) throw new Error('A location is required')
  const geoUrl = new URL('https://geocoding-api.open-meteo.com/v1/search')
  geoUrl.search = new URLSearchParams({ name, count: '1', language: 'en', format: 'json' }).toString()
  const geo = await request(geoUrl, signal)
  if (geo.results === undefined) return { status: 'not-found' }
  if (!Array.isArray(geo.results)) throw new Error('Invalid location results')
  if (geo.results.length === 0) return { status: 'not-found' }

  const first: unknown = geo.results[0]
  if (!isRecord(first)) throw new Error('Invalid first location')
  const placeName = text(first.name)
  const country = text(first.country) ?? text(first.country_code)
  const region = text(first.admin1)
  if (!placeName || !country ||
      !finite(first.latitude) || Math.abs(first.latitude) > 90 ||
      !finite(first.longitude) || Math.abs(first.longitude) > 180) {
    throw new Error('Incomplete location data')
  }

  const weatherUrl = new URL('https://api.open-meteo.com/v1/forecast')
  weatherUrl.search = new URLSearchParams({
    latitude: String(first.latitude),
    longitude: String(first.longitude),
    current: 'temperature_2m,weather_code',
    temperature_unit: 'celsius',
    timezone: 'auto',
  }).toString()
  const weather = await request(weatherUrl, signal)
  const current = weather.current
  const units = weather.current_units
  if (!isRecord(current) || !isRecord(units) ||
      !finite(current.temperature_2m) || units.temperature_2m !== '°C' ||
      !finite(current.weather_code) || !Number.isInteger(current.weather_code)) {
    throw new Error('Incomplete current weather data')
  }
  const description = conditions.get(current.weather_code)
  if (!description) throw new Error('Unknown weather code')

  return {
    status: 'found',
    place: { name: placeName, country, ...(region ? { region } : {}) },
    temperatureC: current.temperature_2m,
    conditions: description,
  }
}
