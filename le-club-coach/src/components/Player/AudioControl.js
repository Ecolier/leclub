import './AudioControl.css'
import React from 'react'
import PlayerContext from './context'
import { VolumeIcon, MutedVolumeIcon } from './icons'
import Draggable from '../Draggable'

function useVideoSoundStatus () {
  const player = React.useContext(PlayerContext)
  const [state, setState] = React.useState({
    volume: player.volume,
    muted: player.muted,
  })

  React.useEffect(() => {
    return player.subscribeToStateChange(() => {
      setState({
        volume: player.volume,
        muted: player.muted,
      })
    })
  })

  return [state, {
    toggleSound () {
      player.muted = !player.muted
    },
    setVolume (v) {
      player.volume = v
    },
  }]
}

class VolumeBar extends React.PureComponent {

  handleDrag = (evt) => {
    const barX = this.barEl.getBoundingClientRect().x
    const barWidth = this.barEl.offsetWidth
    const volume = ((evt.startX + evt.x) - barX) / barWidth
    const clampedVolume = Math.max(Math.min(volume, 1), 0)

    this.props.onVolumeChange && this.props.onVolumeChange(clampedVolume)
  }

  render () {
    const volumeBarPercent = this.props.muted ? 0 : this.props.volume * 100
    return (
      <Draggable onDrag={this.handleDrag} onDragStart={this.handleDrag}>
        <div className='player-audio-control-volumebar' ref={el => this.barEl = el}>
          <div style={{ position: 'absolute', bottom: 0, top: 0, width: `${volumeBarPercent}%`, background: 'white' }} />
        </div>
      </Draggable>
    )
  }
}

export default () => {
  const [sound, actions] = useVideoSoundStatus()
  const Icon = sound.volume === 0 || sound.muted ? MutedVolumeIcon : VolumeIcon

  return (
    <div className='leClub-player-controls-item player-audio-control'>
      <Icon className='leClub-player-video-control-icon' onClick={actions.toggleSound} />
      <VolumeBar volume={sound.volume} muted={sound.muted} onVolumeChange={actions.setVolume} />
    </div>
  )
}
