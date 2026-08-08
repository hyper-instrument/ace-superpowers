export type FacetKey = 'nature' | 'history' | 'culture'

/** 三语文案 */
export interface L10n {
  zh: string
  en: string
  ja: string
}

export interface Facet {
  /** 看点：这一维度下值得看/值得讲的内容 */
  highlights: L10n[]
  /** 意义：为什么重要 */
  meaning?: L10n
}

export interface RiverLocation {
  id: string
  name: L10n
  /** 一句话定位 */
  subtitle: L10n
  /** 真实经纬度 */
  lon: number
  lat: number
  /** 标签相对节点的方位 */
  labelSide: 'top' | 'bottom'
  /** 标签水平偏移（屏幕像素），用于避开河道 */
  labelDx?: number
  /** 不在干流上的节点（如三星堆、都江堰），画一条细连接线到水系锚点 */
  anchor?: { lon: number; lat: number }
  facets: Partial<Record<FacetKey, Facet>>
}

export type EventCategory = '治水史' | '工程史' | '文明史' | '战争史'

export interface RiverEvent {
  id: string
  /** 公元纪年，公元前为负数 */
  year: number
  /** 时代跨度事件的结束年（可选） */
  endYear?: number
  title: L10n
  locationId: string
  category: EventCategory
  description: L10n
}

export interface Era {
  name: L10n
  start: number
  end: number
}
