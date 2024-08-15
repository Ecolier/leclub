import React from 'react'

import PlayerContext from './context'

export function useVideoDuration () {
  const player = React.useContext(PlayerContext)
  const [duration, setDuration] = React.useState(player.duration)

  React.useEffect(() => {
    return player.subscribeToStateChange(() => {
      setDuration(player.duration)
    })
  })

  return duration
}

export function useVideoCurrentTime () {
  const player = React.useContext(PlayerContext)
  const [currentTime, setCurrentTime] = React.useState(player.accurateCurrentTime)

  React.useEffect(() => {
    return player.subscribe('timeupdate', (evt) => {
      setCurrentTime(evt.accurateCurrentTime)
    })
  })

  return currentTime
}

function CurrentTime () {
  const currentTime = useVideoCurrentTime() || 0
  const minutes = Math.floor(currentTime / 60).toString().padStart(2, '0')
  const seconds = (Math.floor(currentTime) % 60).toString().padStart(2, '0')
  return <React.Fragment>{ `${minutes}:${seconds}` }</React.Fragment>
}

function Duration () {
  const duration = useVideoDuration() || 0
  const minutes = Math.floor(duration / 60).toString().padStart(2, '0')
  const seconds = (Math.floor(duration) % 60).toString().padStart(2, '0')
  return <React.Fragment>{ `${minutes}:${seconds}` }</React.Fragment>
}

export default () => {
  return (
    <div style={{ fontSize: 12, color: 'white', margin: '0 10px' }}>
      <CurrentTime /> - <Duration />
    </div>
  )
}
