import { events } from '../data/events'
import { eras } from '../data/eras'
import { locations } from '../data/locations'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../App'
import { UI, useLang, formatYear } from '../i18n'

const locName = new Map(locations.map((loc) => [loc.id, loc.name]))

const sorted = [...events].sort((a, b) => a.year - b.year)

interface Props {
  onSelectLocation: (id: string) => void
}

export function MobileTimeline({ onSelectLocation }: Props) {
  const { lang, t } = useLang()
  return (
    <div className="mtl">
      <div className="journey-hero">
        <h2 className="serif">{t(UI.tlHeroTitle)}</h2>
        <p>{t(UI.tlHeroText)}</p>
      </div>
      {eras.map((era) => {
        const eraEvents = sorted.filter((e) => e.year >= era.start && e.year < era.end)
        if (eraEvents.length === 0) return null
        return (
          <section key={era.name.zh} className="mtl-era-block">
            <h3 className="mtl-era serif">
              {t(era.name)}
              <span>
                {formatYear(era.start, lang)} – {formatYear(era.end, lang)}
              </span>
            </h3>
            {eraEvents.map((e) => (
              <article key={e.id} id={`ev-${e.id}`} className="mtl-card" style={{ borderLeftColor: CATEGORY_COLORS[e.category] }}>
                <div className="mtl-card-head">
                  <span className="mtl-year">{formatYear(e.year, lang)}</span>
                  <span className="mtl-cat" style={{ color: CATEGORY_COLORS[e.category] }}>
                    {t(CATEGORY_LABELS[e.category])}
                  </span>
                </div>
                <h4>{t(e.title)}</h4>
                <p>{t(e.description)}</p>
                <button className="mtl-loc" onClick={() => onSelectLocation(e.locationId)}>
                  📍 {t(locName.get(e.locationId)!)}
                </button>
              </article>
            ))}
          </section>
        )
      })}
      <div className="journey-end serif">{t(UI.today)}</div>
    </div>
  )
}
