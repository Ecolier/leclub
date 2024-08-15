import React, { PureComponent } from 'react'

class Draggable extends PureComponent {

  componentDidMount () {
    this._moveListener = window.addEventListener('mousemove', this.onMove)
    this._upListener = window.addEventListener('mouseup', this.onDragEnd)
    this._touchMoveListener = window.addEventListener('touchmove', this.onTouchMove)
    this._touchUpListener = window.addEventListener('touchend', this.onDragEnd)
  }

  componentWillUnmount () {
    window.removeEventListener('mousemove', this._moveListener)
    window.removeEventListener('touchmove', this._touchMoveListener)
    window.removeEventListener('touchend', this._touchUpListener)
    window.removeEventListener('mouseup', this._upListener)
  }

  onTouchDragStart = (e) => {
    this._mouseDown = true
    this.props.onDragStart && this.props.onDragStart(e.targetTouches[0].clientX)
  }

  onDragStart = (e) => {
    this._mouseDown = true
    this.props.onDragStart && this.props.onDragStart(e.clientX)
  }

  onTouchMove = (e) => {
    if (this._mouseDown) {
      this.props.onDrag && this.props.onDrag(e.targetTouches[0].clientX)
    }
  }

  onMove = (e) => {
    if (this._mouseDown) {
      this.props.onDrag && this.props.onDrag(e.clientX)
    }
  }

  onDragEnd = (e) => {
    this._mouseDown = false
  }

  render () {
    const { fRef, ...props } = this.props
    props.onDrag = null
    return (
      <div {...props} ref={fRef} onMouseDown={this.onDragStart} onTouchStart={this.onTouchDragStart}>{ this.props.children }</div>
    )
  }
}

export default React.forwardRef((props, ref) => (
  <Draggable {...props} fRef={ref} />
))
