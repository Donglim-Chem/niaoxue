// 「今日鸟种」的日期映射
//
// 要求：同一天打开永远是同一种鸟；一个周期内不重复；周期结束后换一套新顺序。
// 做法：以纪元日为起点算出天数序号，用「周期号」作种子对鸟种表做确定性洗牌，
// 再按周期内的位置取鸟。纯函数，不依赖任何存储，换设备也一致。

import { BIRDS, birdsOfRegion } from '../data/birds/index.js'

const EPOCH = { y: 2026, m: 0, d: 1 } // 2026-01-01 为第 0 天
const MS_PER_DAY = 24 * 60 * 60 * 1000

/** 只取本地日期的年月日，避免时区与夏令时把序号算歪 */
function toLocalMidnight(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function dayNumber(date = new Date()) {
  const epoch = new Date(EPOCH.y, EPOCH.m, EPOCH.d)
  return Math.round((toLocalMidnight(date) - epoch) / MS_PER_DAY)
}

export function dateKey(date = new Date()) {
  const d = toLocalMidnight(date)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

export function parseDateKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(date, n) {
  const d = toLocalMidnight(date)
  d.setDate(d.getDate() + n)
  return d
}

export function isSameDay(a, b) {
  return dateKey(a) === dateKey(b)
}

/** mulberry32：小巧的确定性伪随机数发生器，同一种子必得同一序列 */
function mulberry32(seed) {
  let a = seed >>> 0
  return function next() {
    a += 0x6d2b79f5
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffled(list, seed) {
  const arr = [...list]
  const rand = mulberry32(seed)
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// 洗牌结果按 (地区, 周期) 缓存，避免每次渲染都重排一百多个元素
const orderCache = new Map()

function seedOf(regionKey, cycle) {
  const regionSalt = regionKey ? [...regionKey].reduce((s, c) => s + c.charCodeAt(0), 0) : 0
  // 地区不同则种子不同，否则各地区的排序会出现相同的相对次序
  return cycle * 7919 + regionSalt * 104729
}

/** 交界处的保护宽度：保证任意连续 guard+1 天内不会看到重复的鸟 */
export function guardWidth(poolSize) {
  return Math.min(20, Math.floor(poolSize / 3))
}

function orderFor(regionKey, cycle) {
  const cacheKey = `${regionKey || 'all'}#${cycle}`
  const hit = orderCache.get(cacheKey)
  if (hit) return hit

  const pool = birdsOfRegion(regionKey)
  const n = pool.length
  const base = shuffled(pool, seedOf(regionKey, cycle))
  const w = guardWidth(n)

  let arr = base
  if (w > 0) {
    // 周期交界处的坑：上一轮最后几天的鸟，可能正好排在这一轮开头，
    // 于是隔一两天就重复出现。把这一轮开头 w 个换成上一轮尾部没出现过的鸟。
    const prevTail = new Set(
      shuffled(pool, seedOf(regionKey, cycle - 1))
        .slice(n - w)
        .map((b) => b.id),
    )
    // 关键：只重排前 n-w 个，末尾 w 个保持洗牌原样。
    // 这样每一轮的尾部都只由自己的种子决定，上面那行才能不必递归就算准，
    // 否则调整会层层回溯到第 0 轮。
    const head = base.slice(0, n - w)
    const tail = base.slice(n - w)
    const safe = head.filter((b) => !prevTail.has(b.id))
    const risky = head.filter((b) => prevTail.has(b.id))
    arr = [...safe.slice(0, w), ...risky, ...safe.slice(w), ...tail]
  }

  orderCache.set(cacheKey, arr)
  return arr
}

/** 指定日期（与可选地区）对应的鸟种 */
export function birdOfDay(date = new Date(), regionKey = null) {
  const pool = birdsOfRegion(regionKey)
  if (!pool.length) return BIRDS[0]
  const n = dayNumber(date)
  // 纪元之前的日期会得到负数，用取模后补正保证落在合法区间
  const cycle = Math.floor(n / pool.length)
  const pos = ((n % pool.length) + pool.length) % pool.length
  return orderFor(regionKey, cycle)[pos]
}

/** 某鸟在当前周期里被安排在哪一天，用于详情页显示「将于 X 月 X 日复习」 */
export function nextDateForBird(birdId, regionKey = null, from = new Date()) {
  const pool = birdsOfRegion(regionKey)
  if (!pool.length) return null
  for (let i = 0; i < pool.length * 2; i += 1) {
    const d = addDays(from, i)
    if (birdOfDay(d, regionKey).id === birdId) return d
  }
  return null
}

/** 最近 n 天（含今天）的日期列表，由远及近 */
export function recentDays(n, regionKey = null, endDate = new Date()) {
  return Array.from({ length: n }, (_, i) => {
    const d = addDays(endDate, i - n + 1)
    return { date: d, key: dateKey(d), bird: birdOfDay(d, regionKey) }
  })
}

/** 生成某个月的日历格子，前面补齐空位让 1 号落在正确的星期几（周一为一周之始） */
export function monthGrid(year, month, regionKey = null) {
  const first = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const leading = (first.getDay() + 6) % 7
  const cells = Array.from({ length: leading }, () => null)
  for (let d = 1; d <= daysInMonth; d += 1) {
    const date = new Date(year, month, d)
    cells.push({ date, key: dateKey(date), day: d, bird: birdOfDay(date, regionKey) })
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}
