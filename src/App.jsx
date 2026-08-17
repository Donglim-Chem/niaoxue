import { useCallback, useEffect, useRef, useState } from 'react'
import TodayView from './components/TodayView'
import CalendarView from './components/CalendarView'
import AtlasView from './components/AtlasView'
import SettingsView from './components/SettingsView'
import BirdDetail from './components/BirdDetail'
import Modal from './components/Modal'
import { useProgress } from './hooks/useProgress'
import { BIRDS } from './data/birds'

const TABS = [
  { key: 'today', label: '今日' },
  { key: 'calendar', label: '日历' },
  { key: 'atlas', label: '图鉴' },
  { key: 'settings', label: '设置' },
]

export default function App() {
  const progress = useProgress()
  const [tab, setTab] = useState('today')
  // 弹窗里打卡要记到它所属的那一天，而不是今天，所以连日期一起存
  const [detail, setDetail] = useState(null)
  const restoringHistory = useRef(false)

  const makeHistoryState = useCallback((nextTab, nextDetail, depth) => {
    return {
      niaoxue: true,
      niaoxueDepth: depth,
      tab: nextTab,
      detail: nextDetail
        ? {
            birdId: nextDetail.bird.id,
            date: nextDetail.date.toISOString(),
          }
        : null,
    }
  }, [])

  const pushAppState = useCallback(
    (nextTab, nextDetail) => {
      if (restoringHistory.current) return
      const currentDepth = window.history.state?.niaoxueDepth ?? 0
      window.history.pushState(makeHistoryState(nextTab, nextDetail, currentDepth + 1), '')
    },
    [makeHistoryState],
  )

  const applyHistoryState = useCallback((state) => {
    const nextTab = state?.tab || 'today'
    const nextBird = BIRDS.find((bird) => bird.id === state?.detail?.birdId)
    restoringHistory.current = true
    setTab(nextTab)
    setDetail(nextBird ? { bird: nextBird, date: new Date(state.detail.date) } : null)
    window.setTimeout(() => {
      restoringHistory.current = false
    }, 0)
  }, [])

  useEffect(() => {
    const initialState = makeHistoryState('today', null, 0)
    if (!window.history.state?.niaoxue) {
      window.history.replaceState(initialState, '')
    }

    const handlePopState = (event) => {
      applyHistoryState(event.state?.niaoxue ? event.state : initialState)
    }

    window.niaoxueGoBack = () => {
      if ((window.history.state?.niaoxueDepth ?? 0) > 0) {
        window.history.back()
        return true
      }
      return false
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
      delete window.niaoxueGoBack
    }
  }, [applyHistoryState, makeHistoryState])

  const selectTab = useCallback(
    (key) => {
      if (key === tab && !detail) return
      setTab(key)
      setDetail(null)
      pushAppState(key, null)
    },
    [detail, pushAppState, tab],
  )

  const openBird = useCallback(
    (bird, date = new Date()) => {
      const nextDetail = { bird, date }
      setDetail(nextDetail)
      pushAppState(tab, nextDetail)
    },
    [pushAppState, tab],
  )

  const closeBird = useCallback(() => {
    if ((window.history.state?.niaoxueDepth ?? 0) > 0) {
      window.history.back()
    } else {
      setDetail(null)
    }
  }, [])

  const pickRegion = useCallback(
    (key) => {
      progress.setRegion(key)
      setDetail(null)
      setTab('atlas')
      pushAppState('atlas', null)
    },
    [progress, pushAppState],
  )

  return (
    <div className="app">
      <nav className="nav">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            🕊
          </span>
          <span className="brand-text">
            鸟学
            <span className="brand-sub">中国常见鸟种 · 一日一鸟</span>
          </span>
        </div>
        <div className="tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`tab ${tab === t.key ? 'is-active' : ''}`}
              onClick={() => selectTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="main">
        {tab === 'today' && (
          <TodayView progress={progress} onOpenBird={openBird} onPickRegion={pickRegion} />
        )}
        {tab === 'calendar' && <CalendarView progress={progress} onOpenBird={openBird} />}
        {tab === 'atlas' && <AtlasView progress={progress} onOpenBird={openBird} />}
        {tab === 'settings' && <SettingsView progress={progress} />}
      </main>

      <Modal open={Boolean(detail)} onClose={closeBird}>
        {detail && (
          <BirdDetail
            bird={detail.bird}
            learned={progress.isLearned(detail.bird.id)}
            onToggleLearned={(b) => progress.toggleLearned(b, detail.date)}
            onPickRegion={pickRegion}
          />
        )}
      </Modal>

      <footer className="footer">
        <span>
          收录 {BIRDS.length} 种中国常见鸟 · 图片与鸣声取自 Wikimedia Commons（CC 协议 / 公有领域），已本地收录
        </span>
        <span className="muted small">观鸟请保持距离，不惊扰、不诱拍、不投喂。</span>
      </footer>
    </div>
  )
}
