import { useMemo, useState } from 'react'
import { monthGrid, dateKey, dayNumber } from '../services/daily'

const WEEK_HEADS = ['一', '二', '三', '四', '五', '六', '日']

export default function CalendarView({ progress, onOpenBird }) {
  const today = useMemo(() => new Date(), [])
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const region = progress.region

  const cells = useMemo(
    () => monthGrid(cursor.getFullYear(), cursor.getMonth(), region),
    [cursor, region],
  )

  const todayKey = dateKey(today)
  const todayNum = dayNumber(today)

  const monthDone = cells.filter((c) => c && progress.checkins[c.key]).length
  const monthTotal = cells.filter(Boolean).length

  function shift(delta) {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1))
  }

  return (
    <div className="calendar">
      <header className="cal-head">
        <div className="cal-nav">
          <button type="button" onClick={() => shift(-1)} aria-label="上个月">
            ‹
          </button>
          <h2>
            {cursor.getFullYear()} 年 {cursor.getMonth() + 1} 月
          </h2>
          <button type="button" onClick={() => shift(1)} aria-label="下个月">
            ›
          </button>
        </div>
        <div className="cal-summary muted">
          本月打卡 {monthDone} / {monthTotal} 天
          {cursor.getMonth() !== today.getMonth() || cursor.getFullYear() !== today.getFullYear() ? (
            <button
              type="button"
              className="text-link cal-today-btn"
              onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}
            >
              回到本月
            </button>
          ) : null}
        </div>
      </header>

      <div className="cal-grid">
        {WEEK_HEADS.map((w) => (
          <div key={w} className="cal-weekhead">
            {w}
          </div>
        ))}

        {cells.map((cell, i) => {
          if (!cell) return <div key={`pad-${i}`} className="cal-cell is-pad" />
          const done = Boolean(progress.checkins[cell.key])
          const isToday = cell.key === todayKey
          // 未来的鸟种照常展示——提前预习没有坏处，只是不给打卡态
          const isFuture = dayNumber(cell.date) > todayNum
          return (
            <button
              key={cell.key}
              type="button"
              className={`cal-cell ${done ? 'is-done' : ''} ${isToday ? 'is-today' : ''} ${
                isFuture ? 'is-future' : ''
              }`}
              onClick={() => onOpenBird(cell.bird, cell.date)}
              title={`${cell.key} · ${cell.bird.name}`}
            >
              <span className="cal-day">{cell.day}</span>
              <span className="cal-bird">{cell.bird.name}</span>
              {done && <span className="cal-dot" aria-label="已打卡" />}
            </button>
          )
        })}
      </div>

      <p className="muted small cal-note">
        每天的鸟种由日期确定性推出，换设备、清缓存都不会变。整轮学完后会自动换一套新顺序。
      </p>
    </div>
  )
}
