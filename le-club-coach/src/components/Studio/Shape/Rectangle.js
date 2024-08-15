import React, { Component } from 'react'
import { Rect } from 'react-konva'

class Rectangle extends Component {
  render () {
    return (
      <Rect
        ref={node => { if (this.props.setRef) { this.props.setRef(node, this.props.name) } }}
        x={this.props.x}
        y={this.props.y}
        width={this.props.width}
        height={this.props.height}
        fill={this.props.fill}
        name={this.props.name}
        draggable={this.props.draggable}
        opacity={this.props.opacity}
        onClick={this.props.onClick}
        visible={this.props.visible}

      />
    )
  }
}

export default Rectangle
