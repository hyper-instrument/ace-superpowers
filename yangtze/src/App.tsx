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
import type { EventCategory, RiverEvent } from './data/types'

export type ViewMode = 'explore' | 'timeline'

export const CATEGORY_COLORS: Record<EventCategory, string> = {
  治水史: 'var(--cat-water)',
  工程史: 'var(--cat-eng)',
  文明史: 'var(--cat-civ)',
  战争史: 'var(--cat-war)',
}

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
          <h1>万里长江</h1>
          <span>从雪山到海洋 · 一条江，半部中国史</span>
        </div>
        <nav className="switcher" aria-label="视图切换">
          <button
            className={mode === 'explore' ? 'active' : ''}
            onClick={() => {
              setMode('explore')
              setPlaying(false)
            }}
          >
            脑图视图
          </button>
          <button className={mode === 'timeline' ? 'active' : ''} onClick={() => setMode('timeline')}>
            时间轴视图
          </button>
        </nav>
        {mode === 'timeline' ? (
          <div className="legend">
            {(Object.keys(CATEGORY_COLORS) as EventCategory[]).map((c) => (
              <span key={c}>
                <i style={{ background: CATEGORY_COLORS[c] }} />
                {c}
              </span>
            ))}
          </div>
        ) : (
          <div className="legend">
            <span>
              <i style={{ background: 'var(--nature)' }} />
              自然
            </span>
            <span>
              <i style={{ background: 'var(--history)' }} />
              历史
            </span>
            <span>
              <i style={{ background: 'var(--culture)' }} />
              人文
            </span>
          </div>
        )}
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
            <div className="hint">
              {mode === 'explore'
                ? '点击沿江节点，查看该地的自然 · 历史 · 人文 ｜ 滚轮缩放，拖拽平移'
                : '拖动下方时间轴穿越五千年，事件将在江上亮起'}
            </div>
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
