import { useEffect, useState } from 'react'
import { usePhoto } from '../hooks/useMedia'

/**
 * 鸟类照片。文件在本地，路径同步可得，但图片解码仍需时间，
 * 所以保留骨架屏，等 onLoad 后再淡入，避免露出半张图。
 */
export default function BirdPhoto({ bird, ratio = '4 / 3', showCredit = false, className = '' }) {
  const photo = usePhoto(bird)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setReady(false)
    setFailed(false)
  }, [photo?.src])

  const hasSrc = Boolean(photo?.src) && !failed

  return (
    <figure className={`photo ${className}`} style={{ aspectRatio: ratio }}>
      {hasSrc && !ready && <div className="photo-skeleton" aria-label="图片加载中" />}

      {hasSrc && (
        <img
          src={photo.src}
          alt={`${bird.name}（${bird.sci}）`}
          loading="lazy"
          decoding="async"
          className={ready ? 'is-ready' : ''}
          onLoad={() => setReady(true)}
          onError={() => setFailed(true)}
        />
      )}

      {!hasSrc && (
        <div className="photo-placeholder">
          <span className="photo-placeholder-name">{bird.name}</span>
          <span className="photo-placeholder-hint">暂无图片</span>
        </div>
      )}

      {showCredit && hasSrc && ready && (photo.author || photo.license) && (
        <figcaption className="photo-credit">
          {photo.author && <span className="credit-author">{photo.author}</span>}
          {photo.author && photo.license && ' · '}
          {photo.license}
        </figcaption>
      )}
    </figure>
  )
}
