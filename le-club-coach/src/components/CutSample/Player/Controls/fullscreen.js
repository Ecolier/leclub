import React, { PureComponent } from 'react'
import { MaximizeIcon } from '../icons'
import { ClipContext } from '../../context'

export default class extends PureComponent {

  static contextType = ClipContext

  toggleFullscreen = () => {
    if (this.context.player) {
      this.context.player.toggleFullscreen()
    }
  }

  render () {
    return (
      <div className='b-video-control'>
        <MaximizeIcon className='b-video-control-icon' onClick={this.toggleFullscreen} />
      </div>
    )
  }
}
