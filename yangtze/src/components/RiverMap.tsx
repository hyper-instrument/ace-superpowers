import { useEffect, useMemo, useRef, useState } from 'react'
import { line, curveCatmullRom, curveCatmullRomClosed } from 'd3-shape'
import { geoMercator, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import type { Topology, GeometryCollection } from 'topojson-specification'
import { select } from 'd3-selection'
import { zoom, zoomIdentity, type ZoomTransform } from 'd3-zoom'
import worldData from 'world-atlas/countries-50m.json'
import { locations } from '../data/locations'
import {
  yangtzeStem,
  tributaries,
  grandCanal,
  lakes,
  basinBounds,
  STEM_MID_IDX,
  STEM_LOWER_IDX,
  type LonLat,
} from '../data/geo'
import { CATEGORY_COLORS, type ActiveEvent, type ViewMode } from '../App'

// ---- 静态地理计算（模块级，只算一次） ----

const projection = geoMercator().fitExtent(
  [
    [20, 16],
    [1580, 984],
  ],
  basinBounds as GeoJSON.MultiPoint,
)
const geoPathGen = geoPath(projection)

const world = worldData as unknown as Topology
const countries = (
  feature(world, world.objects.countries as GeometryCollection) as unknown as GeoJSON.FeatureCollection
).features
const chinaFeature = countries.find((f) => f.id === '156')!
const neighborFeatures = countries.filter((f) => f.id !== '156')

const CHINA_PATH = geoPathGen(chinaFeature as never) ?? ''
const NEIGHBORS_PATH = neighborFeatures
  .map((f) => geoPathGen(f as never) ?? '')
  .join(' ')

const project = (p: LonLat): [number, number] => projection(p)!

const openLine = line<[number, number]>().curve(curveCatmullRom.alpha(0.7))
const closedLine = line<[number, number]>().curve(curveCatmullRomClosed.alpha(0.7))

const stemPx = yangtzeStem.map(project)
const STEM_FULL = openLine(stemPx)!
const STEM_MID = openLine(stemPx.slice(STEM_MID_IDX))!
const STEM_LOWER = openLine(stemPx.slice(STEM_LOWER_IDX))!
const TRIBUTARY_PATHS = tributaries.map((t) => openLine(t.points.map(project))!)
const CANAL_PATH = openLine(grandCanal.map(project))!
const LAKE_PATHS = lakes.map((l) => closedLine(l.ring.map(project))! + 'Z')

// ---- 组件 ----

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
      .scaleExtent([1, 6])
      .translateExtent([
        [-120, -100],
        [1720, 1100],
      ])
      .on('zoom', (ev) => setTransform(ev.transform))
    svg.call(behavior)
    svg.on('dblclick.zoom', null)
    return () => {
      svg.on('.zoom', null)
    }
  }, [])

  const nodePx = useMemo(
    () =>
      locations.map((loc) => ({
        loc,
        p: project([loc.lon, loc.lat]),
        anchorP: loc.anchor ? project([loc.anchor.lon, loc.anchor.lat]) : null,
      })),
    [],
  )

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
    <svg ref={svgRef} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="riverGrad" gradientUnits="userSpaceOnUse" x1="90" y1="200" x2="1560" y2="620">
          <stop offset="0%" stopColor="#8fc3d9" />
          <stop offset="45%" stopColor="#5d9fc0" />
          <stop offset="100%" stopColor="#3f7fae" />
        </linearGradient>
      </defs>

      <g transform={transform.toString()}>
        {/* 海洋 */}
        <rect x={-400} y={-300} width={2400} height={1600} fill="var(--sea)" />
        {/* 周边国家与中国陆地 */}
        <path d={NEIGHBORS_PATH} fill="var(--land-far)" stroke="var(--border-line)" strokeWidth={1} />
        <path d={CHINA_PATH} fill="var(--land)" stroke="var(--coast-line)" strokeWidth={1.4} />

        {/* 湖泊 */}
        {LAKE_PATHS.map((d, i) => (
          <path key={lakes[i].name} d={d} fill="var(--lake)" stroke="var(--lake-edge)" strokeWidth={1} />
        ))}
        {/* 支流与运河 */}
        {TRIBUTARY_PATHS.map((d, i) => (
          <path
            key={tributaries[i].name}
            d={d}
            fill="none"
            stroke="var(--tributary)"
            strokeWidth={2.4}
            strokeLinecap="round"
            opacity={0.85}
          />
        ))}
        <path
          d={CANAL_PATH}
          fill="none"
          stroke="var(--tributary)"
          strokeWidth={2.2}
          strokeDasharray="7 6"
          strokeLinecap="round"
          opacity={0.9}
        />

        {/* 长江干流：柔和衬底 + 分段加宽 + 流动水纹 */}
        <path d={STEM_FULL} fill="none" stroke="var(--river-under)" strokeWidth={15} strokeLinecap="round" opacity={0.45} />
        <path d={STEM_LOWER} fill="none" stroke="url(#riverGrad)" strokeWidth={11} strokeLinecap="round" />
        <path d={STEM_MID} fill="none" stroke="url(#riverGrad)" strokeWidth={8.5} strokeLinecap="round" />
        <path d={STEM_FULL} fill="none" stroke="url(#riverGrad)" strokeWidth={6} strokeLinecap="round" />
        <path
          className="flow-line"
          d={STEM_FULL}
          fill="none"
          stroke="rgba(250, 250, 245, 0.75)"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeDasharray="4 25"
        />

        {/* 地理注记 */}
        <text x={100} y={130} fontSize={14} fill="var(--map-note)" letterSpacing={4}>
          青 藏 高 原
        </text>
        <text x={1400} y={640} fontSize={14} fill="var(--map-note)" letterSpacing={4}>
          东 海
        </text>

        {/* 地点节点 */}
        {nodePx.map(({ loc, p, anchorP }) => {
          const actives = activeByLocation.get(loc.id)
          const dimmed = mode === 'timeline' && !actives
          const labelY = loc.labelSide === 'top' ? p[1] - 20 : p[1] + 32
          return (
            <g
              key={loc.id}
              className={`node${selectedId === loc.id ? ' selected' : ''}${dimmed ? ' dim' : ''}`}
              onClick={() => onSelect(loc.id === selectedId ? null : loc.id)}
            >
              {anchorP && (
                <line
                  x1={anchorP[0]}
                  y1={anchorP[1]}
                  x2={p[0]}
                  y2={p[1]}
                  stroke="var(--tributary)"
                  strokeWidth={1.8}
                  strokeDasharray="2 6"
                  strokeLinecap="round"
                />
              )}
              <circle className="halo" cx={p[0]} cy={p[1]} r={14} fill="none" stroke="var(--node-ring)" strokeWidth={2} />
              <circle
                className="core"
                cx={p[0]}
                cy={p[1]}
                r={selectedId === loc.id ? 8 : 6}
                fill={selectedId === loc.id ? 'var(--node-active)' : 'var(--node-fill)'}
                stroke="var(--node-stroke)"
                strokeWidth={2.4}
              />
              <text x={p[0] + (loc.labelDx ?? 0)} y={labelY} textAnchor="middle">
                {loc.name}
              </text>
            </g>
          )
        })}

        {/* 时间轴模式：事件在江上亮起 */}
        {mode === 'timeline' &&
          nodePx.map(({ loc, p }) => {
            const actives = activeByLocation.get(loc.id)
            if (!actives) return null
            const color = CATEGORY_COLORS[actives[0].event.category]
            const cardW = 240
            const cardX = p[0] + cardW + 30 > 1600 ? p[0] - cardW - 24 : p[0] + 24
            const cardH = 30 + actives.length * 62
            const cardY = Math.max(10, p[1] - cardH / 2 - 10)
            return (
              <g key={`ev-${loc.id}`} pointerEvents="none">
                <circle className="pulse" cx={p[0]} cy={p[1]} r={10} fill="none" stroke={color} strokeWidth={2.5} />
                <circle className="pulse p2" cx={p[0]} cy={p[1]} r={10} fill="none" stroke={color} strokeWidth={2.5} />
                <circle cx={p[0]} cy={p[1]} r={7} fill={color} opacity={0.5 + 0.5 * actives[0].intensity} />
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
