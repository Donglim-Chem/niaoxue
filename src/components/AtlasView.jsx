import { useMemo, useState } from 'react'
import BirdCard from './BirdCard'
import { BIRDS, FAMILIES } from '../data/birds'
import { REGIONS, REGION_MAP, RESIDENCY } from '../data/regions'

const FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'learned', label: '已认识' },
  { key: 'unlearned', label: '未认识' },
  { key: 'protected', label: '国家重点保护' },
  { key: 'endemic', label: '中国特有' },
]

export default function AtlasView({ progress, onOpenBird }) {
  const [region, setRegion] = useState(null)
  const [family, setFamily] = useState('')
  const [residency, setResidency] = useState('')
  const [filter, setFilter] = useState('all')
  const [q, setQ] = useState('')

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return BIRDS.filter((b) => {
      if (region && !b.regions.includes(region)) return false
      if (family && b.family !== family) return false
      if (residency && b.residency !== residency) return false
      if (filter === 'learned' && !progress.isLearned(b.id)) return false
      if (filter === 'unlearned' && progress.isLearned(b.id)) return false
      if (filter === 'protected' && b.protection === 'common') return false
      if (filter === 'endemic' && !b.endemic) return false
      if (needle) {
        const hay = [b.name, b.alias, b.sci, b.en, b.family, b.order].filter(Boolean).join(' ').toLowerCase()
        if (!hay.includes(needle)) return false
      }
      return true
    })
  }, [region, family, residency, filter, q, progress])

  const activeRegion = region ? REGION_MAP[region] : null

  function reset() {
    setRegion(null)
    setFamily('')
    setResidency('')
    setFilter('all')
    setQ('')
  }

  const hasFilters = region || family || residency || filter !== 'all' || q

  return (
    <div className="atlas">
      <header className="atlas-head">
        <h2>图鉴</h2>
        <input
          type="search"
          className="search"
          placeholder="搜索中文名、学名、英文名或科…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </header>

      <div className="region-tabs">
        <button
          type="button"
          className={`region-tab ${!region ? 'is-active' : ''}`}
          onClick={() => setRegion(null)}
        >
          全国
        </button>
        {REGIONS.map((r) => (
          <button
            key={r.key}
            type="button"
            className={`region-tab ${region === r.key ? 'is-active' : ''}`}
            style={{ '--tab-color': r.color }}
            onClick={() => setRegion(region === r.key ? null : r.key)}
          >
            {r.name}
          </button>
        ))}
      </div>

      {activeRegion && (
        <aside className="region-intro" style={{ '--intro-color': activeRegion.color }}>
          <h3>
            {activeRegion.name}
            <span className="muted small"> · {activeRegion.realm}</span>
          </h3>
          <p className="muted small">{activeRegion.area}</p>
          <p>{activeRegion.highlight}</p>
          <p className="muted small">
            典型生境：{activeRegion.landscape}　最佳观鸟期：{activeRegion.bestSeason}
          </p>
        </aside>
      )}

      <div className="filter-bar">
        <div className="chip-row">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`chip ${filter === f.key ? 'is-active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="select-row">
          <select value={residency} onChange={(e) => setResidency(e.target.value)} aria-label="按居留型筛选">
            <option value="">全部居留型</option>
            {Object.entries(RESIDENCY).map(([key, r]) => (
              <option key={key} value={key}>
                {r.label}
              </option>
            ))}
          </select>

          <select value={family} onChange={(e) => setFamily(e.target.value)} aria-label="按科筛选">
            <option value="">全部科</option>
            {FAMILIES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          {hasFilters && (
            <button type="button" className="text-link" onClick={reset}>
              清除筛选
            </button>
          )}
        </div>
      </div>

      <p className="muted small atlas-count">
        共 {list.length} 种
        {list.length > 0 && (
          <> · 已认识 {list.filter((b) => progress.isLearned(b.id)).length} 种</>
        )}
      </p>

      {list.length === 0 ? (
        <p className="empty">没有符合条件的鸟种，试着放宽筛选。</p>
      ) : (
        <div className="grid">
          {list.map((b) => (
            <BirdCard key={b.id} bird={b} learned={progress.isLearned(b.id)} onClick={onOpenBird} />
          ))}
        </div>
      )}
    </div>
  )
}
