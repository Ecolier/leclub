import React from 'react'
import { useVideoDuration, useVideoCurrentTime } from './Time'
import PlayerContext from './context'
import Draggable from '../Draggable'

export default () => {
  const player = React.useContext(PlayerContext)
  const duration = useVideoDuration()
  const currentTime = useVideoCurrentTime()

  const seenPercent = Math.min((currentTime / duration) * 100, 100)
  const bufferedPercent = Math.min((player.bufferEndTime / duration) * 100, 100)

  function handleDrag (evt) {
    const parentX = evt.dragElement.getBoundingClientRect().x
    const parentWidth = evt.dragElement.offsetWidth
    const ratio = Math.max(Math.min((evt.startX + evt.x - parentX) / parentWidth, 1), 0)

    player.currentTime = player.duration * ratio
    player.play()
  }

  return (
    <Draggable onDragStart={handleDrag} onDrag={handleDrag}>
      <div className='leClub-player-video-seekbar'>
        <div className='leClub-player-video-seekbar-buffered' style={{ width: `${bufferedPercent}%` }} />
        <div className='leClub-player-video-seekbar-seen' style={{ width: `${seenPercent}%` }} />
        <div className='leClub-player-video-seekbar-cursor' style={{ left: `${seenPercent}%` }} />
      </div>
    </Draggable>
  )
}
