import React, { PureComponent } from 'react'
import Draggable from '../Draggable'
import { ClipContext } from '../context'

export default class extends PureComponent {

  static contextType = ClipContext

  handleDragStart = (pos) => {
    this._origin = pos
    this._originStart = this.context.clipStart
    this._originEnd = this.context.clipEnd
  }

  handleDrag = (pos) => {
    if (!this.props.scrub) return

    const { width, left } = this.props.scrub.getBoundingClientRect()
    const ratio = (pos - left) / width
    const ratio2 = (this._origin - left) / width
    const max = 1
    const min = 0

    const r = Math.max(Math.min(ratio, max), min)
    const r2 = Math.max(Math.min(ratio2, max), min)

    const distance = (this.context.timePreview * r) - (this.context.timePreview * r2)

    this.context.setRange(this._originStart + distance, this._originEnd + distance, true)
  }

  render () {
    return (
      <Draggable className='b-cut-scrubbing-range-drag' onDragStart={this.handleDragStart} onDrag={this.handleDrag} />
    )
  }
}
