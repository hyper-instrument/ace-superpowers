import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { L10n } from '../data/types'

export type Lang = 'zh' | 'en' | 'ja'

export const l = (zh: string, en: string, ja: string): L10n => ({ zh, en, ja })

/** 界面文案 */
export const UI = {
  docTitle: l('万里长江 · 交互脑图', 'The Yangtze · Interactive River Map', '万里長江 · インタラクティブ地図'),
  brandTitle: l('万里长江', 'The Yangtze', '万里長江'),
  brandSub: l(
    '从雪山到海洋 · 一条江，半部中国史',
    'From snow peaks to the sea — one river, half of China’s story',
    '雪山から海へ ・ 一本の川に、中国史の半分',
  ),
  viewMap: l('脑图视图', 'River Map', 'マップ'),
  viewTimeline: l('时间轴视图', 'Timeline', '年表'),
  nature: l('自然', 'Nature', '自然'),
  history: l('历史', 'History', '歴史'),
  culture: l('人文', 'Culture', '人文'),
  catWater: l('治水史', 'Water Control', '治水史'),
  catEng: l('工程史', 'Engineering', '土木史'),
  catCiv: l('文明史', 'Civilization', '文明史'),
  catWar: l('战争史', 'War', '戦争史'),
  hintExplore: l(
    '点击沿江节点，查看该地的自然 · 历史 · 人文 ｜ 滚轮缩放，拖拽平移',
    'Click a stop to see its nature, history & culture · Scroll to zoom, drag to pan',
    '川沿いの地点をクリックすると自然・歴史・人文が見られます ｜ ホイールで拡大、ドラッグで移動',
  ),
  hintTimeline: l(
    '拖动下方时间轴穿越五千年，事件将在江上亮起',
    'Drag the timeline to travel 5,000 years — events light up along the river',
    '下の年表をドラッグして五千年を旅すると、川の上に出来事が灯ります',
  ),
  play: l('▶ 沿时间航行', '▶ Sail through time', '▶ 時の航海へ'),
  pause: l('⏸ 暂停', '⏸ Pause', '⏸ 一時停止'),
  highlights: l('看 点', 'HIGHLIGHTS', '見どころ'),
  meaning: l('意 义', 'WHY IT MATTERS', '意 義'),
  eventsHere: l('这里的时间轴事件', 'Events at this stop', 'この地の出来事'),
  close: l('关闭', 'Close', '閉じる'),
  heroTitle: l('从雪山到海洋', 'From Snow Peaks to the Sea', '雪山から海へ'),
  heroText: l(
    '沿着 6300 公里的大江顺流而下，点开每一站，看它的自然、历史与人文。',
    'Drift 6,300 km downstream — tap each stop for its nature, history and culture.',
    '6300 キロの大河を下りながら、各地の自然・歴史・人文をたどりましょう。',
  ),
  metaKm: l('6300+ 公里', '6,300+ km', '6300+ km'),
  metaProvinces: l('穿越 11 省市', 'Across 11 provinces', '11 の省市を貫く'),
  meta5000: l('上下五千年', '5,000 years of history', '五千年の歴史'),
  reachUp: l('上游', 'Upper Reaches', '上流'),
  reachUpSub: l('雪山 · 峡谷 · 山城', 'Snow · Gorges · Mountain cities', '雪山・峡谷・山城'),
  reachMid: l('中游', 'Middle Reaches', '中流'),
  reachMidSub: l('江湖之间', 'Between rivers and lakes', '江と湖のあいだ'),
  reachLow: l('下游', 'Lower Reaches', '下流'),
  reachLowSub: l('奔向大海', 'Racing to the sea', '海へ'),
  toSea: l('—— 入 海 ——', '— To the Sea —', '—— 海 へ ——'),
  today: l('—— 今 天 ——', '— Today —', '—— 現 在 ——'),
  tlHeroTitle: l('上下五千年', '5,000 Years Downstream', '悠久の五千年'),
  tlHeroText: l(
    '从良渚的堤坝到白鹤滩的大坝，向下滚动，沿时间顺流而下。',
    'From the dams of Liangzhu to Baihetan — scroll down to drift through time.',
    '良渚の堤から白鶴灘のダムまで、下へスクロールして時をくだりましょう。',
  ),
  tibetPlateau: l('青 藏 高 原', 'TIBETAN  PLATEAU', 'チベット高原'),
  eastSea: l('东 海', 'EAST CHINA SEA', '東シナ海'),
} satisfies Record<string, L10n>

interface LangState {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (text: L10n) => string
}

const LangContext = createContext<LangState>({ lang: 'zh', setLang: () => {}, t: (x) => x.zh })

const STORAGE_KEY = 'yangtze-lang'

function initialLang(): Lang {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'zh' || saved === 'en' || saved === 'ja') return saved
  const nav = (navigator.language || 'zh').toLowerCase()
  if (nav.startsWith('ja')) return 'ja'
  if (nav.startsWith('zh')) return 'zh'
  return 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang
    document.title = UI.docTitle[lang]
  }, [lang])

  const t = (text: L10n) => text[lang]
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang(): LangState {
  return useContext(LangContext)
}

/** 完整年份，如 公元前 208 年 / 208 BCE / 紀元前208年 */
export function formatYear(year: number, lang: Lang): string {
  const y = Math.round(year)
  if (lang === 'en') return y < 0 ? `${-y} BCE` : `${y} CE`
  if (lang === 'ja') return y < 0 ? `紀元前 ${-y} 年` : `西暦 ${y} 年`
  return y < 0 ? `公元前 ${-y} 年` : `公元 ${y} 年`
}

/** 短年份（时间轴刻度、事件卡），如 前208 / 208 BC / 前208 */
export function formatYearShort(year: number, lang: Lang): string {
  const y = Math.round(year)
  if (lang === 'en') return y < 0 ? `${-y} BC` : `${y}`
  return y < 0 ? `前${-y}` : `${y}`
}
