export type FacetKey = 'nature' | 'history' | 'culture'

export interface Facet {
  /** 看点：这一维度下值得看/值得讲的内容 */
  highlights: string[]
  /** 意义：为什么重要 */
  meaning?: string
}

export interface RiverLocation {
  id: string
  name: string
  /** 一句话定位 */
  subtitle: string
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
  title: string
  locationId: string
  category: EventCategory
  description: string
}

export interface Era {
  name: string
  start: number
  end: number
}
