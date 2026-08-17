import { useMemo } from 'react'
import BirdDetail from './BirdDetail'
import { birdOfDay, recentDays, dateKey } from '../services/daily'
import { BIRDS } from '../data/birds'
import { REGION_MAP } from '../data/regions'

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

function Stat({ value, label }) {
  return (
    <div className="stat">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

export default function TodayView({ progress, onOpenBird, onPickRegion }) {
  const today = useMemo(() => new Date(), [])
  const region = progress.region
  const bird = useMemo(() => birdOfDay(today, region), [today, region])
  const week = useMemo(() => recentDays(7, region, today), [today, region])
  const poolSize = region ? BIRDS.filter((b) => b.regions.includes(region)).length : BIRDS.length
  const todayKey = dateKey(today)

  return (
    <div className="today">
      <header className="today-head">
        <div>
          <p className="today-date">
            {today.getFullYear()} 年 {today.getMonth() + 1} 月 {today.getDate()} 日 · {WEEKDAYS[today.getDay()]}
          </p>
          <h1 className="today-title">今日鸟种</h1>
          <p className="muted">
            {region ? (
              <>
                当前学习范围：<strong style={{ color: REGION_MAP[region]?.color }}>{REGION_MAP[region]?.name}</strong>
                ，共 {poolSize} 种
              </>
            ) : (
              <>当前学习范围：全国 {poolSize} 种常见鸟</>
            )}
          </p>
        </div>
        <div className="stat-row">
          <Stat value={progress.learnedCount} label="已认识" />
          <Stat value={progress.streak} label="连续打卡" />
          <Stat value={`${Math.round((progress.learnedCount / BIRDS.length) * 100)}%`} label="总进度" />
        </div>
      </header>

      <section className="week-strip" aria-label="最近七天">
        {week.map(({ date, key, bird: b }) => {
          const isToday = key === todayKey
          const done = Boolean(progress.checkins[key])
          return (
            <button
              key={key}
              type="button"
              className={`week-cell ${isToday ? 'is-today' : ''} ${done ? 'is-done' : ''}`}
              onClick={() => onOpenBird(b)}
              title={`${key} · ${b.name}`}
            >
              <span className="week-day">{WEEKDAYS[date.getDay()].slice(1)}</span>
              <span className="week-num">{date.getDate()}</span>
              <span className="week-bird">{b.name}</span>
            </button>
          )
        })}
      </section>

      <BirdDetail
        bird={bird}
        learned={progress.isLearned(bird.id)}
        onToggleLearned={(b) => progress.toggleLearned(b, today)}
        onPickRegion={onPickRegion}
      />
    </div>
  )
}
