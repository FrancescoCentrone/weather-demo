import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { lookupCurrentWeather } from './weather'
import type { WeatherLookupResult } from './weather'
import './App.css'

type SearchState =
  | { status: 'idle' | 'loading' | 'unsuccessful' }
  | Extract<WeatherLookupResult, { status: 'found' }>

function App() {
  const [query, setQuery] = useState('')
  const [state, setState] = useState<SearchState>({ status: 'idle' })
  const pending = useRef<AbortController | null>(null)

  useEffect(() => () => {
    pending.current?.abort()
    pending.current = null
  }, [])

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!query.trim() || pending.current) return

    const controller = new AbortController()
    pending.current = controller
    setState({ status: 'loading' })
    try {
      const result = await lookupCurrentWeather(query, controller.signal)
      if (pending.current !== controller || controller.signal.aborted) return
      setState(result.status === 'found' ? result : { status: 'unsuccessful' })
    } catch {
      if (pending.current === controller && !controller.signal.aborted) {
        setState({ status: 'unsuccessful' })
      }
    } finally {
      if (pending.current === controller) pending.current = null
    }
  }

  const loading = state.status === 'loading'

  return (
    <main className="weather-app">
      <header>
        <p className="eyebrow">A little look outside</p>
        <h1>Weather Demo</h1>
        <p className="intro">Find the current weather for a city or location.</p>
      </header>

      <form onSubmit={search} className="search-form">
        <label htmlFor="location">City or location</label>
        <div className="search-controls">
          <input
            id="location"
            name="location"
            type="text"
            placeholder="Try Warsaw or Paris, France"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            disabled={loading}
            required
          />
          <button type="submit" disabled={loading || !query.trim()}>
            {loading ? 'Searching…' : 'Search'}
          </button>
        </div>
      </form>

      <div className="result-area" aria-live="polite" aria-atomic="true">
        {state.status === 'idle' && (
          <p className="hint">Enter a place to see its temperature and conditions.</p>
        )}
        {loading && <p className="hint" role="status">Looking up the current weather…</p>}
        {state.status === 'unsuccessful' && (
          <p className="feedback">Could not show weather for this search. Try again.</p>
        )}
        {state.status === 'found' && (
          <section className="weather-card" aria-labelledby="place-name">
            <p className="eyebrow">Current weather</p>
            <h2 id="place-name">{state.place.name}</h2>
            <p className="place-detail">
              {[state.place.region, state.place.country].filter(Boolean).join(', ')}
            </p>
            <p className="temperature">{state.temperatureC}<span> °C</span></p>
            <p className="conditions">{state.conditions}</p>
          </section>
        )}
      </div>

      <footer>
        <p>Current conditions are model-derived.</p>
        <p>
          Weather data by <a href="https://open-meteo.com/">Open-Meteo</a>
          {' · '}<a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>
          {' · '}Location data by <a href="https://www.geonames.org/">GeoNames</a>
        </p>
      </footer>
    </main>
  )
}

export default App
