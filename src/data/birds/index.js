import waterbirds from './waterbirds.js'
import raptorsGalliformes from './raptors-galliformes.js'
import nonpasserines from './nonpasserines.js'
import passerinesA from './passerines-a.js'
import passerinesB from './passerines-b.js'

const RAW = [...waterbirds, ...raptorsGalliformes, ...nonpasserines, ...passerinesA, ...passerinesB]

// 开发期校验：重复 id 会让打卡记录与今日鸟种的映射错乱，必须尽早暴露
if (import.meta.env?.DEV) {
  const seen = new Set()
  const dup = RAW.filter((b) => (seen.has(b.id) ? true : (seen.add(b.id), false)))
  if (dup.length) console.error('[niaoxue] 重复的鸟种 id：', dup.map((b) => b.id))
}

// 按中文名排序，保证图鉴浏览顺序稳定
export const BIRDS = [...RAW].sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'))

export const BIRD_MAP = Object.fromEntries(BIRDS.map((b) => [b.id, b]))

export const FAMILIES = [...new Set(BIRDS.map((b) => b.family))].sort((a, b) =>
  a.localeCompare(b, 'zh-Hans-CN'),
)

export const ORDERS = [...new Set(BIRDS.map((b) => b.order))].sort((a, b) =>
  a.localeCompare(b, 'zh-Hans-CN'),
)

export function birdsOfRegion(regionKey) {
  if (!regionKey) return BIRDS
  return BIRDS.filter((b) => b.regions.includes(regionKey))
}

export default BIRDS
