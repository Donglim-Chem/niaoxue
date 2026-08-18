// 素材层（离线版）
//
// 图片、鸣声与百科简介都已由 scripts/fetch-assets.mjs 下载到 public/media/，
// 索引存在 media-manifest.json 里。站点运行时不发任何外部请求，
// 因此在中国大陆可以正常访问，也不受维基媒体限流影响。
//
// 素材来自 Wikimedia Commons / 维基百科，采用 CC 协议或属于公有领域。
// 本地化分发后，「链接到原文件页」不再能满足 CC 的署名义务
//（那些链接在大陆打不开），所以作者与许可证随清单一起存下并在页面上显示。
//
// 外链一律换成大陆可访问的站点。这些是用户点击后跳转，不是页面发起的请求，
// 因此不受同源策略与防盗链影响。

import manifest from '../data/media-manifest.json'

/** 站点部署在子路径时（如 GitHub Pages），资源前缀要跟着变 */
const BASE = import.meta.env?.BASE_URL || '/'
let activeManifest = manifest
let runtimeManifestPromise = null
const runtimeManifestListeners = new Set()

function withBase(src) {
  if (!src) return null
  return BASE.replace(/\/$/, '') + src
}

export function subscribeMediaManifest(listener) {
  runtimeManifestListeners.add(listener)
  return () => runtimeManifestListeners.delete(listener)
}

export function loadRuntimeManifest() {
  if (runtimeManifestPromise || typeof fetch !== 'function') return runtimeManifestPromise
  runtimeManifestPromise = fetch(withBase('/media-manifest.runtime.json'), { cache: 'no-store' })
    .then((response) => (response.ok ? response.json() : null))
    .then((runtimeManifest) => {
      if (runtimeManifest && typeof runtimeManifest === 'object') {
        activeManifest = runtimeManifest
        runtimeManifestListeners.forEach((listener) => listener())
      }
    })
    .catch(() => {})
  return runtimeManifestPromise
}

/**
 * 取一只鸟的照片与百科简介。同步返回——素材已在本地，没有加载态可言。
 * 缺素材的鸟返回 src: null，界面显示占位块。
 */
export function getPhoto(bird) {
  const entry = activeManifest[bird.id]
  if (!entry?.photo?.src) {
    return { src: null, extract: entry?.extract || null, wikiUrl: entry?.wikiUrl || null }
  }
  return {
    src: withBase(entry.photo.src),
    author: entry.photo.author || null,
    license: entry.photo.license || null,
    licenseUrl: entry.photo.licenseUrl || null,
    filePage: entry.photo.filePage || null,
    extract: entry.extract || null,
    extractLang: entry.extractLang || 'zh',
    wikiUrl: entry.wikiUrl || null,
  }
}

/** 取鸣声录音列表，同样是本地文件 */
export function getClips(bird) {
  const clips = activeManifest[bird.id]?.clips || []
  return clips.map((c) => ({ ...c, src: withBase(c.src) }))
}

/** 有多少种鸟备齐了素材——设置页用来告诉用户离线包的完整度 */
export function mediaStats(birds) {
  let photo = 0
  let audio = 0
  for (const b of birds) {
    const e = activeManifest[b.id]
    if (e?.photo?.src) photo += 1
    if (e?.clips?.length) audio += 1
  }
  return { photo, audio, total: birds.length }
}

// ---------- 外部链接：全部选用中国大陆可访问的站点 ----------

/** 百科：百度百科没有开放 API，但按词条名跳转是完全可用的 */
export function baikeUrl(bird) {
  return `https://baike.baidu.com/item/${encodeURIComponent(bird.name)}`
}

function birdReportSearch(bird) {
  const payload = JSON.stringify({ taxonname: bird.name })
  const bytes = new TextEncoder().encode(payload)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

export function videoLinks(bird) {
  return [
    {
      label: '哔哩哔哩',
      hint: '观鸟视频与鸣声实录',
      url: `https://search.bilibili.com/all?keyword=${encodeURIComponent(bird.name + ' 鸟')}`,
    },
    {
      label: '百度百科',
      hint: '中文词条：形态、分布与保护现状',
      url: baikeUrl(bird),
    },
    {
      label: '中国观鸟记录中心',
      hint: '国内实际观测记录与分布',
      url: `https://www.birdreport.cn/home/search/report.html?search=${encodeURIComponent(birdReportSearch(bird))}`,
    },
    {
      label: '百度图片',
      hint: '更多角度与不同季节的羽色',
      url: `https://image.baidu.com/search/index?tn=baiduimage&word=${encodeURIComponent(bird.name)}`,
    },
  ]
}
