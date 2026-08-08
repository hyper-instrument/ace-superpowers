import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { events } from '../data/events'
import { UI, useLang, formatYear } from '../i18n'
import type { FacetKey, L10n, RiverEvent, RiverLocation } from '../data/types'

const FACET_META: Record<FacetKey, { label: L10n; color: string; cls: string }> = {
  nature: { label: UI.nature, color: 'var(--nature)', cls: 't-nature' },
  history: { label: UI.history, color: 'var(--history)', cls: 't-history' },
  culture: { label: UI.culture, color: 'var(--culture)', cls: 't-culture' },
}

const FACET_ORDER: FacetKey[] = ['nature', 'history', 'culture']

interface Props {
  location: RiverLocation | null
  onClose: () => void
  onJumpToEvent: (event: RiverEvent) => void
}

export function DetailPanel({ location, onClose, onJumpToEvent }: Props) {
  const { lang, t } = useLang()
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
              <button className="close" onClick={onClose} aria-label={t(UI.close)}>
                ✕
              </button>
              <h2>{t(location.name)}</h2>
              <p>{t(location.subtitle)}</p>
            </div>
            <div className="tabs">
              {facetKeys.map((k) => (
                <button
                  key={k}
                  className={`${FACET_META[k].cls}${tab === k ? ' active' : ''}`}
                  onClick={() => setTab(k)}
                >
                  {t(FACET_META[k].label)}
                </button>
              ))}
            </div>
            <div className="drawer-body" style={{ '--facet-color': meta.color } as CSSProperties}>
              {facet && (
                <>
                  <div className="facet-title">{t(UI.highlights)}</div>
                  <ul className="facet-list">
                    {facet.highlights.map((h, i) => (
                      <li key={i}>{t(h)}</li>
                    ))}
                  </ul>
                  {facet.meaning && (
                    <div className="meaning">
                      <em>{t(UI.meaning)}</em>
                      {t(facet.meaning)}
                    </div>
                  )}
                </>
              )}
              {relatedEvents.length > 0 && (
                <div className="loc-events">
                  <h3>{t(UI.eventsHere)}</h3>
                  {relatedEvents.map((e) => (
                    <button key={e.id} onClick={() => onJumpToEvent(e)}>
                      <span className="yr">{formatYear(e.year, lang)}</span>
                      <span>{t(e.title)} →</span>
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
