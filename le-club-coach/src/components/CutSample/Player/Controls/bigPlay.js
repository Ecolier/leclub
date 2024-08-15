import React, { PureComponent } from 'react'
import { PlayIcon } from '../icons'
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
    paused: false,
  }

  play = () => {
    if (this.context.player) {
      this.context.player.play()
      this.props.isPaused(true)
    }
  }

  render () {
    if (!this.state.paused) return null
    return (
      <div className='b-video-player-big-play-button' onClick={this.play}>
        <PlayIcon />
      </div>
    )
  }
}
