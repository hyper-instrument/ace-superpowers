import type { Era } from './types'

export const TIME_MIN = -3400
export const TIME_MAX = 2026

export const eras: Era[] = [
  { name: '史前', start: -3400, end: -2070 },
  { name: '夏商周', start: -2070, end: -221 },
  { name: '秦汉', start: -221, end: 220 },
  { name: '三国两晋南北朝', start: 220, end: 589 },
  { name: '隋唐', start: 589, end: 907 },
  { name: '宋元', start: 907, end: 1368 },
  { name: '明清', start: 1368, end: 1840 },
  { name: '近代', start: 1840, end: 1949 },
  { name: '现代', start: 1949, end: 2026 },
]

export function eraOf(year: number): Era | undefined {
  return eras.find((e) => year >= e.start && year < e.end) ?? eras[eras.length - 1]
}

export function formatYear(year: number): string {
  const y = Math.round(year)
  return y < 0 ? `公元前 ${-y} 年` : `公元 ${y} 年`
}
