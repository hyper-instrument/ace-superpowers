import { locations } from '../data/locations'
import { UI, useLang } from '../i18n'
import type { FacetKey, L10n, RiverLocation } from '../data/types'

const FACET_CHIPS: Array<{ key: FacetKey; label: L10n; cls: string }> = [
  { key: 'nature', label: UI.nature, cls: 'c-nature' },
  { key: 'history', label: UI.history, cls: 'c-history' },
  { key: 'culture', label: UI.culture, cls: 'c-culture' },
]

const REACHES: Array<{ title: L10n; sub: L10n; ids: string[] }> = [
  {
    title: UI.reachUp,
    sub: UI.reachUpSub,
    ids: ['tuotuohe', 'tongtianhe', 'jinshajiang', 'hutiaoxia', 'panxi', 'sanxingdui', 'dujiangyan', 'baihetan', 'chongqing', 'sanxia'],
  },
  {
    title: UI.reachMid,
    sub: UI.reachMidSub,
    ids: ['yichang-jingzhou', 'dongting', 'wuhan', 'poyang'],
  },
  {
    title: UI.reachLow,
    sub: UI.reachLowSub,
    ids: ['nanjing', 'guazhou', 'jiangnan', 'shanghai'],
  },
]

const byId = new Map(locations.map((l) => [l.id, l]))

interface Props {
  onSelect: (id: string) => void
}

export function MobileJourney({ onSelect }: Props) {
  const { t } = useLang()
  return (
    <div className="journey">
      <div className="journey-hero">
        <h2 className="serif">{t(UI.heroTitle)}</h2>
        <p>{t(UI.heroText)}</p>
        <div className="journey-meta">
          <span>{t(UI.metaKm)}</span>
          <span>{t(UI.metaProvinces)}</span>
          <span>{t(UI.meta5000)}</span>
        </div>
      </div>
      {REACHES.map((reach) => (
        <section key={reach.title.zh} className="reach">
          <h3 className="reach-title serif">
            {t(reach.title)}
            <span>{t(reach.sub)}</span>
          </h3>
          <ul className="reach-list">
            {reach.ids.map((id) => {
              const loc = byId.get(id) as RiverLocation
              return (
                <li key={id}>
                  <button className="stop-card" onClick={() => onSelect(id)}>
                    <span className="stop-name">{t(loc.name)}</span>
                    <span className="stop-sub">{t(loc.subtitle)}</span>
                    <span className="stop-chips">
                      {FACET_CHIPS.filter((c) => loc.facets[c.key]).map((c) => (
                        <i key={c.key} className={c.cls}>
                          {t(c.label)}
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
      <div className="journey-end serif">{t(UI.toSea)}</div>
    </div>
  )
}
