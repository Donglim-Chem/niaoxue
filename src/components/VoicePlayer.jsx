import { useClips } from '../hooks/useMedia'

/**
 * 鸣声播放器。录音是本地文件，直接播放。
 * CC 协议要求署名，录音者与许可证一并显示。
 * 没有录音的鸟只展示文字描述的鸣声特征。
 */
export default function VoicePlayer({ bird }) {
  const clips = useClips(bird)

  return (
    <div className="voice">
      <div className="voice-desc">
        <span className="voice-icon" aria-hidden="true">
          ♪
        </span>
        <p>{bird.voice}</p>
      </div>

      {clips.length > 0 ? (
        <ul className="clip-list">
          {clips.map((clip) => (
            <li key={clip.src} className="clip">
              <audio controls preload="none" src={clip.src}>
                你的浏览器不支持内嵌音频。
              </audio>
              <div className="clip-meta">
                <span className="clip-title">{clip.title}</span>
                {(clip.author || clip.license) && (
                  <span className="muted small">
                    {clip.author && `录音：${clip.author}`}
                    {clip.author && clip.license && ' · '}
                    {clip.license}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted small">这一种暂无收录的录音，可参考上面的鸣声描述。</p>
      )}
    </div>
  )
}
