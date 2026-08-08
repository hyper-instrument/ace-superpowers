import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RiverMap } from './components/RiverMap'
import { DetailPanel } from './components/DetailPanel'
import { TimelineBar } from './components/TimelineBar'
import { MobileJourney } from './components/MobileJourney'
import { MobileTimeline } from './components/MobileTimeline'
import { useIsMobile } from './hooks/useIsMobile'
import { locations } from './data/locations'
import { events } from './data/events'
import { eventIntensity, posToYear, yearToPos } from './data/timeScale'
import { UI, useLang, type Lang } from './i18n'
import type { EventCategory, L10n, RiverEvent } from './data/types'

export type ViewMode = 'explore' | 'timeline'

export const CATEGORY_COLORS: Record<EventCategory, string> = {
  治水史: 'var(--cat-water)',
  工程史: 'var(--cat-eng)',
  文明史: 'var(--cat-civ)',
  战争史: 'var(--cat-war)',
}

export const CATEGORY_LABELS: Record<EventCategory, L10n> = {
  治水史: UI.catWater,
  工程史: UI.catEng,
  文明史: UI.catCiv,
  战争史: UI.catWar,
}

const LANGS: Array<{ code: Lang; label: string }> = [
  { code: 'zh', label: '中' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: '日' },
]

export interface ActiveEvent {
  event: RiverEvent
  intensity: number
}

export default function App() {
  const [mode, setMode] = useState<ViewMode>('explore')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [year, setYear] = useState(-256)
  const [playing, setPlaying] = useState(false)
  const rafRef = useRef(0)
  const isMobile = useIsMobile()
  const { lang, setLang, t } = useLang()

  const selected = useMemo(
    () => locations.find((l) => l.id === selectedId) ?? null,
    [selectedId],
  )

  const activeEvents: ActiveEvent[] = useMemo(() => {
    if (mode !== 'timeline') return []
    return events
      .map((event) => ({ event, intensity: eventIntensity(year, event.year, event.endYear) }))
      .filter((a) => a.intensity > 0)
  }, [mode, year])

  // 播放：以时间轴位置匀速前进（非线性比例尺下自动"远古快、近代慢"）
  useEffect(() => {
    if (!playing) return
    let last = performance.now()
    const step = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      setYear((y) => {
        const pos = yearToPos(y) + dt * 0.035
        if (pos >= 1) {
          setPlaying(false)
          return posToYear(1)
        }
        return posToYear(pos)
      })
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing])

  const jumpToEvent = useCallback(
    (event: RiverEvent) => {
      setPlaying(false)
      setMode('timeline')
      setYear(event.year)
      setSelectedId(null)
      if (isMobile) {
        setTimeout(() => {
          document.getElementById(`ev-${event.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 120)
      }
    },
    [isMobile],
  )

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <h1>{t(UI.brandTitle)}</h1>
          <span>{t(UI.brandSub)}</span>
        </div>
        <nav className="switcher" aria-label="view switcher">
          <button
            className={mode === 'explore' ? 'active' : ''}
            onClick={() => {
              setMode('explore')
              setPlaying(false)
            }}
          >
            {t(UI.viewMap)}
          </button>
          <button className={mode === 'timeline' ? 'active' : ''} onClick={() => setMode('timeline')}>
            {t(UI.viewTimeline)}
          </button>
        </nav>
        {mode === 'timeline' ? (
          <div className="legend">
            {(Object.keys(CATEGORY_COLORS) as EventCategory[]).map((c) => (
              <span key={c}>
                <i style={{ background: CATEGORY_COLORS[c] }} />
                {t(CATEGORY_LABELS[c])}
              </span>
            ))}
          </div>
        ) : (
          <div className="legend">
            <span>
              <i style={{ background: 'var(--nature)' }} />
              {t(UI.nature)}
            </span>
            <span>
              <i style={{ background: 'var(--history)' }} />
              {t(UI.history)}
            </span>
            <span>
              <i style={{ background: 'var(--culture)' }} />
              {t(UI.culture)}
            </span>
          </div>
        )}
        <nav className="lang-switch" aria-label="language">
          {LANGS.map(({ code, label }) => (
            <button key={code} className={lang === code ? 'active' : ''} onClick={() => setLang(code)}>
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="canvas-wrap">
        {isMobile ? (
          mode === 'explore' ? (
            <MobileJourney onSelect={setSelectedId} />
          ) : (
            <MobileTimeline onSelectLocation={setSelectedId} />
          )
        ) : (
          <>
            <RiverMap mode={mode} selectedId={selectedId} onSelect={setSelectedId} activeEvents={activeEvents} />
            <div className="hint">{mode === 'explore' ? t(UI.hintExplore) : t(UI.hintTimeline)}</div>
          </>
        )}
      </main>

      {mode === 'timeline' && !isMobile && (
        <TimelineBar
          year={year}
          onYearChange={(y) => {
            setPlaying(false)
            setYear(y)
          }}
          playing={playing}
          onTogglePlay={() => setPlaying((p) => !p)}
          activeEvents={activeEvents}
        />
      )}

      <DetailPanel location={selected} onClose={() => setSelectedId(null)} onJumpToEvent={jumpToEvent} />
    </div>
  )
}
