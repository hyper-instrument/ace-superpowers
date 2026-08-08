import type { Era } from './types'
import { l } from '../i18n'

export const TIME_MIN = -3400
export const TIME_MAX = 2026

export const eras: Era[] = [
  { name: l('史前', 'Prehistory', '先史'), start: -3400, end: -2070 },
  { name: l('夏商周', 'Xia–Shang–Zhou', '夏殷周'), start: -2070, end: -221 },
  { name: l('秦汉', 'Qin–Han', '秦漢'), start: -221, end: 220 },
  { name: l('三国两晋南北朝', 'Three Kingdoms–Southern & Northern', '三国南北朝'), start: 220, end: 589 },
  { name: l('隋唐', 'Sui–Tang', '隋唐'), start: 589, end: 907 },
  { name: l('宋元', 'Song–Yuan', '宋元'), start: 907, end: 1368 },
  { name: l('明清', 'Ming–Qing', '明清'), start: 1368, end: 1840 },
  { name: l('近代', 'Modern Era', '近代'), start: 1840, end: 1949 },
  { name: l('现代', 'Contemporary', '現代'), start: 1949, end: 2026 },
]

export function eraOf(year: number): Era | undefined {
  return eras.find((e) => year >= e.start && year < e.end) ?? eras[eras.length - 1]
}
