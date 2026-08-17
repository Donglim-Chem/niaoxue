import BirdPhoto from './BirdPhoto'
import { ResidencyBadge, ProtectionBadge, EndemicBadge } from './Badges'

export default function BirdCard({ bird, learned, onClick }) {
  return (
    <button type="button" className={`card ${learned ? 'is-learned' : ''}`} onClick={() => onClick(bird)}>
      <BirdPhoto bird={bird} ratio="4 / 3" />
      <div className="card-body">
        <div className="card-title-row">
          <h3 className="card-name">{bird.name}</h3>
          {learned && (
            <span className="card-check" title="已认识">
              ✓
            </span>
          )}
        </div>
        <p className="card-sci">
          <i>{bird.sci}</i>
        </p>
        <p className="card-family muted small">{bird.family}</p>
        <div className="card-badges">
          <ResidencyBadge value={bird.residency} />
          {bird.protection !== 'common' && <ProtectionBadge value={bird.protection} />}
          <EndemicBadge value={bird.endemic} />
        </div>
      </div>
    </button>
  )
}
