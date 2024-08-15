import React, { Component } from 'react'
import { Circle } from 'react-konva'

class CircleComp extends Component {
  render () {
    return (
      <Circle
        ref={node => { if (this.props.setRef) { this.props.setRef(node, this.props.name) } }}
        radius={this.props.radius}
        x={this.props.x}
        y={this.props.y}
        width={this.props.width}
        height={this.props.height}
        fill={this.props.fill}
        name={this.props.name}
        draggable={this.props.draggable}
        onClick={this.props.onClick}
        onDrag={this.props.onDrag}
        opacity={this.props.opacity}
        sceneFunc={this.props.sceneFunc}

        visible={this.props.visible}
      />
    )
  }
}

export default CircleComp
