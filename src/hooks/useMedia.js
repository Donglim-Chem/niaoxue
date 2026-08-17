// 素材已全部在本地，取用是同步的，不再需要加载态、视口懒加载与请求去重——
// 那些机制是为了应付维基媒体的限流，离线化之后一并撤掉。
// 这里只保留一个薄封装，方便组件按鸟种取素材。

import { useEffect, useState } from 'react'
import { getPhoto, getClips, loadRuntimeManifest, subscribeMediaManifest } from '../services/media'

function useRuntimeManifest() {
  const [, setVersion] = useState(0)
  useEffect(() => {
    loadRuntimeManifest()
    return subscribeMediaManifest(() => setVersion((version) => version + 1))
  }, [])
}

export function usePhoto(bird) {
  useRuntimeManifest()
  return bird ? getPhoto(bird) : null
}

export function useClips(bird) {
  useRuntimeManifest()
  return bird ? getClips(bird) : []
}
