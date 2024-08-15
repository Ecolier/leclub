import React from 'react'
import PlayerContext from './context'
import { PlayIcon, PauseIcon } from './icons'

function useVideoPlayStatus () {
  const player = React.useContext(PlayerContext)
  const [isPlaying, setIsPlaying] = React.useState(!player.paused)

  React.useEffect(() => {
    return player.subscribeToStateChange(() => {
      setIsPlaying(!player.paused)
    })
  })

  return [isPlaying, (v) => {
    return v ? player.play() : player.pause()
  }]
}

export default () => {
  const [isPlaying, setIsPlaying] = useVideoPlayStatus()
  const Icon = isPlaying ? PauseIcon : PlayIcon

  return (
    <div className='leClub-player-controls-item' onClick={() => setIsPlaying(!isPlaying)}>
      <Icon className='leClub-player-video-control-icon' />
    </div>
  )
}
