import React, { Component } from 'react'
import { Line } from 'react-konva'

class TextComponent extends Component {
  render () {
    return (
      <Line
        ref={node => { if (this.props.setRef) { this.props.setRef(node, this.props.name) } }}
        strokeScaleEnabled={this.props.strokeScaleEnabled}
        x={this.props.x}
        y={this.props.y}
        points={this.props.points}
        tension={this.props.tension}
        width={this.props.width}
        height={this.props.height}
        fill={this.props.fill}
        name={this.props.name}
        draggable={this.props.draggable}
        stroke={this.props.stroke}
        lineCap={this.props.lineCap}
        lineJoin={this.props.lineJoin}
        dash={this.props.dash}
        opacity={this.props.opacity}
        onClick={this.props.onClick}
        visible={this.props.visible}

      />
    )
  }
}

export default TextComponent
