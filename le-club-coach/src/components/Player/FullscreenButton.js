import React from 'react'
import PlayerContext from './context'
import { MaximizeIcon } from './icons'

export default () => {
  const player = React.useContext(PlayerContext)
  return (
    <div className='leClub-player-controls-item' onClick={player.toggleFullscreen}>
      <MaximizeIcon className='leClub-player-video-control-icon' />
    </div>
  )
}
