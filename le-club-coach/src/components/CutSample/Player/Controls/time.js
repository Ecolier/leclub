import React, { PureComponent } from 'react'
import { ClipContext } from '../../context'
import moment from 'moment'

export default class extends PureComponent {

  static contextType = ClipContext

  get formattedEndTime () {
    if (this.context.editing) {
      return moment.utc((this.context.getMaxTimeCut() || this.props.duration) * 1000).format('HH:mm:ss')
    }
    return moment.utc((this.props.duration) * 1000).format('HH:mm:ss')

  }

  get formattedCurrentTime () {
    if (this.context.editing) {
      return moment.utc((this.context.getAbsoluteCurrentTime() || 0) * 1000).format('HH:mm:ss')
    }
    return moment.utc((this.context.currentTime || 0) * 1000).format('HH:mm:ss')

  }

  render () {
    return (
      <div className='b-video-control'>
        <div className='b-player-controlbar-time'>
          <span>{ this.formattedCurrentTime }</span>
          <span> / </span>
          <span>{ this.formattedEndTime }</span>
        </div>
      </div>
    )
  }
}
