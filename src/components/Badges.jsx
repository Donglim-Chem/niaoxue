import { RESIDENCY, PROTECTION, REGION_MAP } from '../data/regions'

export function ResidencyBadge({ value }) {
  const r = RESIDENCY[value]
  if (!r) return null
  return (
    <span className="badge" style={{ '--badge-color': r.color }} title={r.desc}>
      {r.label}
    </span>
  )
}

export function ProtectionBadge({ value }) {
  const p = PROTECTION[value]
  if (!p) return null
  // 三有保护数量众多，弱化显示，把视觉重量留给一级二级
  return (
    <span className={`badge ${value === 'common' ? 'badge-muted' : ''}`} style={{ '--badge-color': p.color }}>
      {p.label}
    </span>
  )
}

export function EndemicBadge({ value }) {
  if (!value) return null
  return (
    <span className="badge" style={{ '--badge-color': '#a0522d' }} title="仅分布于中国">
      中国特有
    </span>
  )
}

export function RegionChips({ regions, active = null, onPick = null }) {
  return (
    <div className="region-chips">
      {regions.map((key) => {
        const r = REGION_MAP[key]
        if (!r) return null
        const isActive = active === key
        const Tag = onPick ? 'button' : 'span'
        return (
          <Tag
            key={key}
            type={onPick ? 'button' : undefined}
            className={`region-chip ${isActive ? 'is-active' : ''} ${onPick ? 'is-clickable' : ''}`}
            style={{ '--chip-color': r.color }}
            onClick={onPick ? () => onPick(key) : undefined}
            title={r.area}
          >
            {r.short}
          </Tag>
        )
      })}
    </div>
  )
}
