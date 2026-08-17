import { useState } from 'react'
import { REGIONS } from '../data/regions'
import { BIRDS } from '../data/birds'
import { mediaStats } from '../services/media'

export default function SettingsView({ progress }) {
  const [confirmReset, setConfirmReset] = useState(false)
  const stats = mediaStats(BIRDS)

  return (
    <div className="settings">
      <h2>设置</h2>

      <section className="setting-block">
        <h3>学习范围</h3>
        <p className="muted small">
          选定一个区后，「今日鸟种」与日历只从该区的鸟种中安排，更贴近你身边真正能看到的鸟。图鉴仍可浏览全部。
        </p>
        <div className="region-tabs">
          <button
            type="button"
            className={`region-tab ${!progress.region ? 'is-active' : ''}`}
            onClick={() => progress.setRegion(null)}
          >
            全国（{BIRDS.length} 种）
          </button>
          {REGIONS.map((r) => {
            const n = BIRDS.filter((b) => b.regions.includes(r.key)).length
            return (
              <button
                key={r.key}
                type="button"
                className={`region-tab ${progress.region === r.key ? 'is-active' : ''}`}
                style={{ '--tab-color': r.color }}
                onClick={() => progress.setRegion(r.key)}
              >
                {r.name}（{n}）
              </button>
            )
          })}
        </div>
      </section>

      <section className="setting-block">
        <h3>学习进度</h3>
        <p className="muted small">
          进度只存在这台设备的浏览器里，没有账号也没有服务器，清除浏览器数据即清空。
        </p>
        <p>
          已认识 <strong>{progress.learnedCount}</strong> / {BIRDS.length} 种，连续打卡{' '}
          <strong>{progress.streak}</strong> 天。
        </p>
        <div className="btn-row">
          {confirmReset ? (
            <>
              <button
                type="button"
                className="danger"
                onClick={() => {
                  progress.reset()
                  setConfirmReset(false)
                }}
              >
                确认清空
              </button>
              <button type="button" onClick={() => setConfirmReset(false)}>
                取消
              </button>
            </>
          ) : (
            <button type="button" className="danger" onClick={() => setConfirmReset(true)}>
              重置学习进度
            </button>
          )}
        </div>
      </section>

      <section className="setting-block">
        <h3>关于素材</h3>
        <p className="muted small">
          图片与鸣声已全部下载到本地，站点运行时不发任何外部请求，无需联网也能正常浏览。
          当前 {stats.total} 种鸟中，{stats.photo} 种有照片、{stats.audio} 种有鸣声录音。
        </p>
        <p className="muted small">
          素材取自 Wikimedia Commons、Macaulay Library 与维基百科，作者、来源与许可证信息标注在每张图片与每条录音旁。
          百科简介依 CC BY-SA 协议使用。
        </p>
        <p className="muted small">
          详情页的「了解更多」为站外链接（哔哩哔哩、百度百科、中国观鸟记录中心、百度图片），点击才会跳转，均可在国内正常访问。
        </p>
      </section>

      <section className="setting-block">
        <h3>使用提醒</h3>
        <p className="muted small">
          物种描述、识别要点与分布为本站编写，仅供学习参考。实地鉴定请以专业图鉴与当地观测记录为准；
          保护级别依据《国家重点保护野生动物名录》（2021）。
        </p>
        <p className="muted small">
          观鸟守则：不惊扰、不诱拍、不投喂、不在繁殖期用回放声诱鸟，与鸟保持距离。
        </p>
      </section>
    </div>
  )
}
