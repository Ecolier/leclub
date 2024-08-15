import React, { PureComponent } from 'react'
import { MutedVolumeIcon, VolumeIcon } from '../icons'
import { ClipContext } from '../../context'
import Draggable from '../../Draggable'

export default class extends PureComponent {

  componentDidUpdate () {
    if (this.context.player) {
      const { muted, volume } = this.context.player
      if (this.state.muted !== muted) {
        this.setState({ muted })
      }
      if (this.state.volume !== volume) {
        this.setState({ volume })
      }
    }
  }

  static contextType = ClipContext

  state = {
    muted: false,
    volume: 1,
  }

  handleToggleSound = () => {
    const muted = !this.context.player.muted
    this.context.player.muted = muted
    this.setState({ muted })
  }

  handleVolumeDrag = (pos) => {
    const { width, left } = this.refs.bar.getBoundingClientRect()
    const ratio = (pos - left) / width
    const max = 1
    const min = 0

    const r = Math.max(Math.min(ratio, max), min)
    this.context.setVolume(r)
    this.setState({ volume: r })
  }

  get volumePercent () {
    return `${this.state.volume * 100}%`
  }

  render () {
    const Component = this.state.muted ? MutedVolumeIcon : VolumeIcon
    return (
      <div className='b-video-control b-video-control-sound'>
        <Component className='b-video-control-icon' onClick={this.handleToggleSound} />
        <Draggable ref='bar' className='b-video-control-sound-bar' onDragStart={this.handleVolumeDrag} onDrag={this.handleVolumeDrag}>
          <div className='b-video-control-sound-bar-current' style={{ width: this.volumePercent }} />
        </Draggable>
      </div>
    )
  }
}
