import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { events } from '../data/events'
import { formatYear } from '../data/eras'
import type { FacetKey, RiverEvent, RiverLocation } from '../data/types'

const FACET_META: Record<FacetKey, { label: string; color: string; cls: string }> = {
  nature: { label: '自然', color: 'var(--nature)', cls: 't-nature' },
  history: { label: '历史', color: 'var(--history)', cls: 't-history' },
  culture: { label: '人文', color: 'var(--culture)', cls: 't-culture' },
}

const FACET_ORDER: FacetKey[] = ['nature', 'history', 'culture']

interface Props {
  location: RiverLocation | null
  onClose: () => void
  onJumpToEvent: (event: RiverEvent) => void
}

export function DetailPanel({ location, onClose, onJumpToEvent }: Props) {
  const facetKeys = useMemo(
    () => (location ? FACET_ORDER.filter((k) => location.facets[k]) : []),
    [location],
  )
  const [tab, setTab] = useState<FacetKey>('nature')

  useEffect(() => {
    if (facetKeys.length > 0 && !facetKeys.includes(tab)) setTab(facetKeys[0])
  }, [facetKeys, tab])

  const relatedEvents = useMemo(
    () => (location ? events.filter((e) => e.locationId === location.id) : []),
    [location],
  )

  const open = location !== null
  const facet = location?.facets[tab]
  const meta = FACET_META[tab]

  return (
    <>
      <div className={`drawer-backdrop${open ? ' open' : ''}`} onClick={onClose} />
      <aside className={`drawer${open ? ' open' : ''}`} aria-hidden={!open}>
        {location && (
          <>
            <div className="drawer-head">
              <button className="close" onClick={onClose} aria-label="关闭">
                ✕
              </button>
              <h2>{location.name}</h2>
              <p>{location.subtitle}</p>
            </div>
            <div className="tabs">
              {facetKeys.map((k) => (
                <button
                  key={k}
                  className={`${FACET_META[k].cls}${tab === k ? ' active' : ''}`}
                  onClick={() => setTab(k)}
                >
                  {FACET_META[k].label}
                </button>
              ))}
            </div>
            <div className="drawer-body" style={{ '--facet-color': meta.color } as CSSProperties}>
              {facet && (
                <>
                  <div className="facet-title">看 点</div>
                  <ul className="facet-list">
                    {facet.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                  {facet.meaning && (
                    <div className="meaning">
                      <em>意 义</em>
                      {facet.meaning}
                    </div>
                  )}
                </>
              )}
              {relatedEvents.length > 0 && (
                <div className="loc-events">
                  <h3>这里的时间轴事件</h3>
                  {relatedEvents.map((e) => (
                    <button key={e.id} onClick={() => onJumpToEvent(e)} title="在时间轴上查看">
                      <span className="yr">{formatYear(e.year)}</span>
                      <span>{e.title} →</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  )
}
