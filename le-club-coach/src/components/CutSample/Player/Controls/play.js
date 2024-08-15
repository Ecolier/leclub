import React, { PureComponent } from 'react'
import { PlayIcon, PauseIcon } from '../icons'
import { ClipContext } from '../../context'

export default class extends PureComponent {

  componentDidUpdate () {
    if (this.context.player) {
      const paused = this.context.player.paused
      if (this.state.paused !== paused) {
        this.setState({ paused })
      }
    }
  }

  static contextType = ClipContext

  state = {
    paused: true,
  }

  handleTogglePlay = () => {
    if (this.context.player) {
      const paused = this.context.player.paused
      paused ? this.context.player.play() : this.context.player.pause()
      this.setState({ paused }, () => { this.props.isPaused(!this.state.paused) })
    }
  }

  render () {
    const Component = this.state.paused ? PlayIcon : PauseIcon
    return (
      <div className='leClub-player-controls-item'>
        <Component className='leClub-player-video-control-icon' onClick={this.handleTogglePlay} />
      </div>
    )
  }
}
