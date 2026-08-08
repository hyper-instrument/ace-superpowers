import { useEffect, useMemo, useRef, useState } from 'react'
import { line, curveCatmullRom } from 'd3-shape'
import { select } from 'd3-selection'
import { zoom, zoomIdentity, type ZoomTransform } from 'd3-zoom'
import { locations, riverWaypoints } from '../data/locations'
import { CATEGORY_COLORS, type ActiveEvent, type ViewMode } from '../App'

const riverLine = line<[number, number]>().curve(curveCatmullRom.alpha(0.72))

// 干流分段加宽，模拟"上游细、下游宽"
const FULL = riverLine(riverWaypoints)!
const MID = riverLine(riverWaypoints.slice(11))! // 重庆以下
const LOWER = riverLine(riverWaypoints.slice(16))! // 武汉以下

interface Props {
  mode: ViewMode
  selectedId: string | null
  onSelect: (id: string | null) => void
  activeEvents: ActiveEvent[]
}

export function RiverMap({ mode, selectedId, onSelect, activeEvents }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [transform, setTransform] = useState<ZoomTransform>(zoomIdentity)

  useEffect(() => {
    const svg = select(svgRef.current!)
    const behavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.65, 5])
      .translateExtent([
        [-300, -250],
        [1900, 1250],
      ])
      .on('zoom', (ev) => setTransform(ev.transform))
    svg.call(behavior)
    svg.on('dblclick.zoom', null)
    return () => {
      svg.on('.zoom', null)
    }
  }, [])

  const activeByLocation = useMemo(() => {
    const map = new Map<string, ActiveEvent[]>()
    for (const a of activeEvents) {
      const list = map.get(a.event.locationId) ?? []
      list.push(a)
      map.set(a.event.locationId, list)
    }
    return map
  }, [activeEvents])

  return (
    <svg ref={svgRef} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="riverGrad" gradientUnits="userSpaceOnUse" x1="90" y1="200" x2="1530" y2="430">
          <stop offset="0%" stopColor="#c7f9ff" />
          <stop offset="30%" stopColor="#67e8f9" />
          <stop offset="65%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <filter id="riverGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      <g transform={transform.toString()}>
        {/* 江面辉光 */}
        <path d={FULL} fill="none" stroke="#38bdf8" strokeWidth={26} strokeLinecap="round" opacity={0.28} filter="url(#riverGlow)" />
        {/* 分段加宽的江体 */}
        <path d={LOWER} fill="none" stroke="url(#riverGrad)" strokeWidth={17} strokeLinecap="round" />
        <path d={MID} fill="none" stroke="url(#riverGrad)" strokeWidth={13} strokeLinecap="round" />
        <path d={FULL} fill="none" stroke="url(#riverGrad)" strokeWidth={9} strokeLinecap="round" />
        {/* 流动的水纹 */}
        <path className="flow-line" d={FULL} fill="none" stroke="rgba(224,242,254,0.65)" strokeWidth={2} strokeLinecap="round" strokeDasharray="4 25" />

        {/* 起终点文字 */}
        <text x={52} y={158} fontSize={13} fill="var(--text-dim)" letterSpacing={2}>
          青藏高原 · 源
        </text>
        <text x={1478} y={492} fontSize={13} fill="var(--text-dim)" letterSpacing={2}>
          东海 · 入海口
        </text>

        {/* 地点节点 */}
        {locations.map((loc) => {
          const actives = activeByLocation.get(loc.id)
          const dimmed = mode === 'timeline' && !actives
          const labelY = loc.labelSide === 'top' ? loc.y - 22 : loc.y + 34
          return (
            <g
              key={loc.id}
              className={`node${selectedId === loc.id ? ' selected' : ''}${dimmed ? ' dim' : ''}`}
              onClick={() => onSelect(loc.id === selectedId ? null : loc.id)}
            >
              {loc.anchor && (
                <line
                  x1={loc.anchor.x}
                  y1={loc.anchor.y}
                  x2={loc.x}
                  y2={loc.y}
                  stroke="rgba(103,232,249,0.4)"
                  strokeWidth={2}
                  strokeDasharray="2 6"
                  strokeLinecap="round"
                />
              )}
              <circle className="halo" cx={loc.x} cy={loc.y} r={15} fill="none" stroke="rgba(165,243,252,0.55)" strokeWidth={2} />
              <circle
                className="core"
                cx={loc.x}
                cy={loc.y}
                r={selectedId === loc.id ? 8.5 : 6.5}
                fill={selectedId === loc.id ? '#7dd3fc' : '#0b1220'}
                stroke="#7dd3fc"
                strokeWidth={2.5}
              />
              <text x={loc.x + (loc.labelDx ?? 0)} y={labelY} textAnchor="middle">
                {loc.name}
              </text>
            </g>
          )
        })}

        {/* 时间轴模式：事件在江上亮起 */}
        {mode === 'timeline' &&
          locations.map((loc) => {
            const actives = activeByLocation.get(loc.id)
            if (!actives) return null
            const color = CATEGORY_COLORS[actives[0].event.category]
            const cardW = 240
            const cardX = loc.x + cardW + 30 > 1600 ? loc.x - cardW - 24 : loc.x + 24
            const cardH = 30 + actives.length * 62
            const cardY = Math.max(10, loc.y - cardH / 2 - 10)
            return (
              <g key={`ev-${loc.id}`} pointerEvents="none">
                <circle className="pulse" cx={loc.x} cy={loc.y} r={10} fill="none" stroke={color} strokeWidth={2.5} />
                <circle className="pulse p2" cx={loc.x} cy={loc.y} r={10} fill="none" stroke={color} strokeWidth={2.5} />
                <circle cx={loc.x} cy={loc.y} r={7} fill={color} opacity={0.5 + 0.5 * actives[0].intensity} />
                <foreignObject x={cardX} y={cardY} width={cardW} height={cardH + 30} style={{ overflow: 'visible' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {actives.map(({ event, intensity }) => (
                      <div
                        key={event.id}
                        className="event-card"
                        style={{ borderLeftColor: CATEGORY_COLORS[event.category], opacity: 0.35 + 0.65 * intensity }}
                      >
                        <b>{event.title}</b>
                        <span className="meta">
                          {event.year < 0 ? `公元前 ${-event.year}` : event.year}
                          {event.endYear ? ` – ${event.endYear < 0 ? `前 ${-event.endYear}` : event.endYear}` : ''} · {event.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </foreignObject>
              </g>
            )
          })}
      </g>
    </svg>
  )
}
