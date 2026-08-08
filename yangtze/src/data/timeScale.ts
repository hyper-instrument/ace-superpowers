import { scaleLinear } from 'd3-scale'
import { TIME_MIN, TIME_MAX } from './eras'

/**
 * 分段线性时间比例尺：年份 → [0,1] 位置。
 * "上下五千年"里近现代事件密集，因此远古压缩、近 200 年拉伸。
 */
export const timeScale = scaleLinear<number>()
  .domain([TIME_MIN, -1000, 0, 1000, 1600, 1900, TIME_MAX])
  .range([0, 0.14, 0.3, 0.48, 0.62, 0.8, 1])
  .clamp(true)

export function yearToPos(year: number): number {
  return timeScale(year)
}

export function posToYear(pos: number): number {
  return timeScale.invert(Math.min(1, Math.max(0, pos)))
}

/** 事件激活窗口（按时间轴位置的比例距离，而非年数，天然适配非线性比例尺） */
export const ACTIVE_WINDOW = 0.022

/**
 * 事件在当前年份下的激活强度 [0,1]；跨度事件在区间内恒为 1。
 */
export function eventIntensity(
  cursorYear: number,
  startYear: number,
  endYear?: number,
): number {
  const p = yearToPos(cursorYear)
  const a = yearToPos(startYear)
  const b = yearToPos(endYear ?? startYear)
  const dist = p < a ? a - p : p > b ? p - b : 0
  return Math.max(0, 1 - dist / ACTIVE_WINDOW)
}
