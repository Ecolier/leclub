import React, { Component } from 'react'
import { Text } from 'react-konva'

class TextComponent extends Component {
  render () {
    return (
      <Text
        ref={node => { if (this.props.setRef) { this.props.setRef(node, this.props.name) } }}
        text={this.props.text}
        x={this.props.x}
        y={this.props.y}
        width={this.props.width}
        height={this.props.height}
        fill={this.props.fill}
        name={this.props.name}
        draggable={this.props.draggable}
        onClick={this.props.onClick}
        opacity={this.props.opacity}
        fontSize={this.props.fontSize}
        visible={this.props.visible}

      />
    )
  }
}

export default TextComponent
