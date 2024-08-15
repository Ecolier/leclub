import React from 'react'

export default class Draggable extends React.PureComponent {

  componentWillUnmount () {
    this.stopDrag()
  }

  startDrag = (evt) => {
    this.target = evt.target
    this.dragStartX = evt.clientX
    this.dragStartY = evt.clientY
    this.targetStartX = this.target.offsetLeft
    this.targetStartY = this.target.offsetTop

    window.addEventListener('mousemove', this.handleDrag)
    window.addEventListener('touchmove', this.handleDragMobile)
    window.addEventListener('mouseup', this.stopDrag)

    this.emit('onDragStart', {
      x: evt.clientX - this.dragStartX,
      y: evt.clientY - this.dragStartY,
    })
  }

  startDragMobile = (evt) => {
    this.startDrag({
      target: evt.target,
      clientX: evt.targetTouches[0].clientX,
      clientY: evt.targetTouches[0].clientY,
    })
  }

  stopDrag = () => {
    window.removeEventListener('mousemove', this.handleDrag)
    window.removeEventListener('touchmove', this.handleDragMobile)
    window.removeEventListener('mouseup', this.stopDrag)
  }

  emit = (evt, data) => {
    setImmediate(this.props[evt] && this.props[evt]({
      target: this.target,
      dragElement: this.dragEl,
      targetStartX: this.targetStartX,
      targetStartY: this.targetStartY,
      startX: this.dragStartX,
      startY: this.dragStartY,
      ...data,
    }))
  }

  handleDragMobile = (evt) => {
    this.emit('onDrag', {
      x: evt.targetTouches[0].clientX - this.dragStartX,
      y: evt.targetTouches[0].clientY - this.dragStartY,
    })
  }

  handleDrag = (evt) => {
    this.emit('onDrag', {
      x: evt.clientX - this.dragStartX,
      y: evt.clientY - this.dragStartY,
    })
  }

  render () {
    return (
      <div onMouseDown={this.startDrag} onTouchStart={this.startDragMobile} ref={el => this.dragEl = el} style={{ touchAction: 'none', cursor: this.props.cursor || 'pointer' }}>
        { this.props.children }
      </div>
    )
  }
}

