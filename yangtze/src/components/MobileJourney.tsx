import { locations } from '../data/locations'
import type { FacetKey, RiverLocation } from '../data/types'

const FACET_CHIPS: Array<{ key: FacetKey; label: string; cls: string }> = [
  { key: 'nature', label: '自然', cls: 'c-nature' },
  { key: 'history', label: '历史', cls: 'c-history' },
  { key: 'culture', label: '人文', cls: 'c-culture' },
]

const REACHES: Array<{ title: string; sub: string; ids: string[] }> = [
  {
    title: '上游',
    sub: '雪山 · 峡谷 · 山城',
    ids: ['tuotuohe', 'tongtianhe', 'jinshajiang', 'hutiaoxia', 'panxi', 'sanxingdui', 'dujiangyan', 'baihetan', 'chongqing', 'sanxia'],
  },
  {
    title: '中游',
    sub: '江湖之间',
    ids: ['yichang-jingzhou', 'dongting', 'wuhan', 'poyang'],
  },
  {
    title: '下游',
    sub: '奔向大海',
    ids: ['nanjing', 'guazhou', 'jiangnan', 'shanghai'],
  },
]

const byId = new Map(locations.map((l) => [l.id, l]))

interface Props {
  onSelect: (id: string) => void
}

export function MobileJourney({ onSelect }: Props) {
  return (
    <div className="journey">
      <div className="journey-hero">
        <h2 className="serif">从雪山到海洋</h2>
        <p>沿着 6300 公里的大江顺流而下，点开每一站，看它的自然、历史与人文。</p>
        <div className="journey-meta">
          <span>6300+ 公里</span>
          <span>穿越 11 省市</span>
          <span>上下五千年</span>
        </div>
      </div>
      {REACHES.map((reach) => (
        <section key={reach.title} className="reach">
          <h3 className="reach-title serif">
            {reach.title}
            <span>{reach.sub}</span>
          </h3>
          <ul className="reach-list">
            {reach.ids.map((id) => {
              const loc = byId.get(id) as RiverLocation
              return (
                <li key={id}>
                  <button className="stop-card" onClick={() => onSelect(id)}>
                    <span className="stop-name">{loc.name}</span>
                    <span className="stop-sub">{loc.subtitle}</span>
                    <span className="stop-chips">
                      {FACET_CHIPS.filter((c) => loc.facets[c.key]).map((c) => (
                        <i key={c.key} className={c.cls}>
                          {c.label}
                        </i>
                      ))}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
      <div className="journey-end serif">—— 入 海 ——</div>
    </div>
  )
}
