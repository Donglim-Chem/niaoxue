// 学习进度：已认识的鸟、每日打卡记录、连续天数
// 全部存在 localStorage，无账号、无后端，清缓存即清空。

import { useCallback, useEffect, useState } from 'react'
import { dateKey, addDays } from '../services/daily'

const STORAGE_KEY = 'niaoxue:progress:v1'

const EMPTY = { learned: {}, checkins: {}, region: null }

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...EMPTY }
    const parsed = JSON.parse(raw)
    return {
      learned: parsed.learned || {},
      checkins: parsed.checkins || {},
      region: parsed.region ?? null,
    }
  } catch {
    return { ...EMPTY }
  }
}

function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // 隐私模式下 localStorage 可能不可写，此时进度只在本次会话有效
  }
}

/** 从今天（或昨天，允许今天还没打卡）向前数连续打卡的天数 */
function computeStreak(checkins) {
  const today = new Date()
  let cursor = checkins[dateKey(today)] ? today : addDays(today, -1)
  if (!checkins[dateKey(cursor)]) return 0
  let streak = 0
  while (checkins[dateKey(cursor)]) {
    streak += 1
    cursor = addDays(cursor, -1)
  }
  return streak
}

export function useProgress() {
  const [state, setState] = useState(load)

  useEffect(() => {
    save(state)
  }, [state])

  // 多个标签页同时打开时保持同步
  useEffect(() => {
    function onStorage(e) {
      if (e.key === STORAGE_KEY) setState(load())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const markLearned = useCallback((bird, date = new Date()) => {
    const key = dateKey(date)
    setState((prev) => ({
      ...prev,
      learned: { ...prev.learned, [bird.id]: { firstAt: prev.learned[bird.id]?.firstAt || key, lastAt: key } },
      checkins: { ...prev.checkins, [key]: bird.id },
    }))
  }, [])

  const unmarkLearned = useCallback((bird, date = new Date()) => {
    const key = dateKey(date)
    setState((prev) => {
      const learned = { ...prev.learned }
      delete learned[bird.id]
      const checkins = { ...prev.checkins }
      // 只撤掉指向这只鸟的那次打卡，别误删同一天其他记录
      if (checkins[key] === bird.id) delete checkins[key]
      return { ...prev, learned, checkins }
    })
  }, [])

  const toggleLearned = useCallback(
    (bird, date = new Date()) => {
      if (state.learned[bird.id]) unmarkLearned(bird, date)
      else markLearned(bird, date)
    },
    [state.learned, markLearned, unmarkLearned],
  )

  const setRegion = useCallback((region) => {
    setState((prev) => ({ ...prev, region: region || null }))
  }, [])

  const reset = useCallback(() => setState({ ...EMPTY }), [])

  return {
    learned: state.learned,
    checkins: state.checkins,
    region: state.region,
    learnedCount: Object.keys(state.learned).length,
    streak: computeStreak(state.checkins),
    isLearned: (id) => Boolean(state.learned[id]),
    markLearned,
    unmarkLearned,
    toggleLearned,
    setRegion,
    reset,
  }
}
