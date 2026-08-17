import BirdPhoto from './BirdPhoto'
import VoicePlayer from './VoicePlayer'
import { ResidencyBadge, ProtectionBadge, EndemicBadge, RegionChips } from './Badges'
import { usePhoto } from '../hooks/useMedia'
import { videoLinks, baikeUrl } from '../services/media'
import { REGION_MAP } from '../data/regions'

function Section({ title, children }) {
  if (!children) return null
  return (
    <section className="detail-section">
      <h4>{title}</h4>
      {children}
    </section>
  )
}

export default function BirdDetail({ bird, learned, onToggleLearned, onPickRegion }) {
  const photo = usePhoto(bird)

  if (!bird) return null

  return (
    <article className="detail">
      <header className="detail-head">
        <div>
          <h2 className="detail-name">
            {bird.name}
            {bird.alias && <span className="detail-alias">俗名 {bird.alias}</span>}
          </h2>
          <p className="detail-sci">
            <i>{bird.sci}</i> · {bird.en}
          </p>
          <p className="detail-taxon">
            {bird.order} › {bird.family} · {bird.size}
          </p>
        </div>
        <button
          type="button"
          className={`learn-btn ${learned ? 'is-learned' : ''}`}
          onClick={() => onToggleLearned(bird)}
        >
          {learned ? '✓ 已认识' : '标记为已认识'}
        </button>
      </header>

      <div className="detail-badges">
        <ResidencyBadge value={bird.residency} />
        <ProtectionBadge value={bird.protection} />
        <EndemicBadge value={bird.endemic} />
      </div>

      <BirdPhoto bird={bird} ratio="3 / 2" showCredit className="detail-photo" />

      <Section title="怎么认">
        <p>{bird.idTips}</p>
        {bird.confuse && <p className="callout">易混：{bird.confuse}</p>}
      </Section>

      <Section title="在哪儿看">
        <p className="habitat">{bird.habitat}</p>
        <RegionChips regions={bird.regions} onPick={onPickRegion} />
        <ul className="region-notes">
          {bird.regions.map((key) => {
            const r = REGION_MAP[key]
            if (!r) return null
            return (
              <li key={key}>
                <strong style={{ color: r.color }}>{r.name}</strong>
                <span className="muted small"> {r.bestSeason}</span>
              </li>
            )
          })}
        </ul>
      </Section>

      <Section title="习性">
        <p>{bird.behavior}</p>
      </Section>

      <Section title="听声音">
        <VoicePlayer bird={bird} />
      </Section>

      {photo?.extract && (
        <Section title="百科简介">
          <p className="extract">{photo.extract}</p>
          <p className="muted small">
            摘自维基百科，依 CC BY-SA 协议使用
            {photo.extractLang === 'en' && '（英文词条）'}
          </p>
        </Section>
      )}

      <Section title="了解更多">
        <div className="link-grid">
          {videoLinks(bird).map((l) => (
            <a key={l.url} className="link-card" href={l.url} target="_blank" rel="noreferrer noopener">
              <strong>{l.label}</strong>
              <span className="muted small">{l.hint}</span>
            </a>
          ))}
        </div>
        <p className="muted small link-note">
          以上均为站外链接，点击后在新标签页打开。
          <a href={baikeUrl(bird)} target="_blank" rel="noreferrer noopener">
            百度百科「{bird.name}」→
          </a>
        </p>
      </Section>
    </article>
  )
}
