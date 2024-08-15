import React, { Component } from 'react'
import { Star } from 'react-konva'

class StarComponent extends Component {
  render () {
    return (
      <Star
        ref={node => { if (this.props.setRef) { this.props.setRef(node, this.props.name) } }}

        x={this.props.x}
        y={this.props.y}
        width={this.props.width}
        height={this.props.height}
        fill={this.props.fill}
        name={this.props.name}
        draggable={this.props.draggable}
        onClick={this.props.onClick}
        rotation={this.props.rotation}
        numPoints={this.props.numPoints}
        innerRadius={this.props.innerRadius}
        outerRadius={this.props.outerRadius}
        opacity={this.props.opacity}
        visible={this.props.visible}

      />
    )
  }
}

export default StarComponent
