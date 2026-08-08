import { events } from '../data/events'
import { eras, formatYear } from '../data/eras'
import { locations } from '../data/locations'
import { CATEGORY_COLORS } from '../App'

const locName = new Map(locations.map((l) => [l.id, l.name]))

const sorted = [...events].sort((a, b) => a.year - b.year)

interface Props {
  onSelectLocation: (id: string) => void
}

export function MobileTimeline({ onSelectLocation }: Props) {
  return (
    <div className="mtl">
      <div className="journey-hero">
        <h2 className="serif">上下五千年</h2>
        <p>从良渚的堤坝到白鹤滩的大坝，向下滚动，沿时间顺流而下。</p>
      </div>
      {eras.map((era) => {
        const eraEvents = sorted.filter((e) => e.year >= era.start && e.year < era.end)
        if (eraEvents.length === 0) return null
        return (
          <section key={era.name} className="mtl-era-block">
            <h3 className="mtl-era serif">
              {era.name}
              <span>
                {formatYear(era.start)} – {formatYear(era.end)}
              </span>
            </h3>
            {eraEvents.map((e) => (
              <article key={e.id} id={`ev-${e.id}`} className="mtl-card" style={{ borderLeftColor: CATEGORY_COLORS[e.category] }}>
                <div className="mtl-card-head">
                  <span className="mtl-year">{formatYear(e.year)}</span>
                  <span className="mtl-cat" style={{ color: CATEGORY_COLORS[e.category] }}>
                    {e.category}
                  </span>
                </div>
                <h4>{e.title}</h4>
                <p>{e.description}</p>
                <button className="mtl-loc" onClick={() => onSelectLocation(e.locationId)}>
                  📍 {locName.get(e.locationId)}
                </button>
              </article>
            ))}
          </section>
        )
      })}
      <div className="journey-end serif">—— 今 天 ——</div>
    </div>
  )
}
