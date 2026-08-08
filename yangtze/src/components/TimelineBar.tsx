import { useCallback, useRef, type PointerEvent } from 'react'
import { events } from '../data/events'
import { eras, eraOf, formatYear } from '../data/eras'
import { posToYear, yearToPos } from '../data/timeScale'
import { CATEGORY_COLORS, type ActiveEvent } from '../App'

const ERA_TINTS = [
  'rgba(181, 138, 86, 0.2)',
  'rgba(63, 127, 174, 0.16)',
  'rgba(125, 107, 158, 0.16)',
  'rgba(185, 138, 46, 0.18)',
  'rgba(74, 124, 89, 0.17)',
]

const AXIS_YEARS = [-3000, -2000, -1000, 0, 500, 1000, 1500, 1800, 1900, 2000]

interface Props {
  year: number
  onYearChange: (year: number) => void
  playing: boolean
  onTogglePlay: () => void
  activeEvents: ActiveEvent[]
}

export function TimelineBar({ year, onYearChange, playing, onTogglePlay, activeEvents }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const yearFromPointer = useCallback((clientX: number) => {
    const rect = trackRef.current!.getBoundingClientRect()
    return posToYear((clientX - rect.left) / rect.width)
  }, [])

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true
    trackRef.current!.setPointerCapture(e.pointerId)
    onYearChange(yearFromPointer(e.clientX))
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) onYearChange(yearFromPointer(e.clientX))
  }
  const onPointerUp = () => {
    dragging.current = false
  }

  const activeIds = new Set(activeEvents.map((a) => a.event.id))
  const era = eraOf(year)

  return (
    <section className="timeline" aria-label="历史时间轴">
      <div className="tl-readout">
        <span className="year">{formatYear(year)}</span>
        {era && <span className="era">{era.name}</span>}
        <button className="play" onClick={onTogglePlay}>
          {playing ? '⏸ 暂停' : '▶ 沿时间航行'}
        </button>
      </div>
      <div
        ref={trackRef}
        className="tl-track"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div className="tl-eras">
          {eras.map((e, i) => {
            const left = yearToPos(e.start) * 100
            const width = (yearToPos(e.end) - yearToPos(e.start)) * 100
            return (
              <div
                key={e.name}
                className="tl-era"
                style={{ left: `${left}%`, width: `${width}%`, background: ERA_TINTS[i % ERA_TINTS.length] }}
              >
                {width > 5.5 ? e.name : ''}
              </div>
            )
          })}
        </div>
        {events.map((e) => (
          <span
            key={e.id}
            className={`tl-tick${activeIds.has(e.id) ? ' active' : ''}`}
            style={{ left: `${yearToPos(e.year) * 100}%`, background: CATEGORY_COLORS[e.category], color: CATEGORY_COLORS[e.category] }}
            title={`${formatYear(e.year)} · ${e.title}`}
            onClick={(ev) => {
              ev.stopPropagation()
              onYearChange(e.year)
            }}
          />
        ))}
        {AXIS_YEARS.map((y) => (
          <span key={y} className="tl-axis-year" style={{ left: `${yearToPos(y) * 100}%` }}>
            {y < 0 ? `前${-y}` : y}
          </span>
        ))}
        <div className="tl-cursor" style={{ left: `${yearToPos(year) * 100}%` }} />
      </div>
    </section>
  )
}
