import React, { Component } from 'react'
import { Arrow } from 'react-konva'

class ArrowComp extends Component {
  render () {
    return (
      <Arrow
        ref={node => { if (this.props.setRef) { this.props.setRef(node, this.props.name) } }}
        {...this.props}
      />
    )
  }
}

export default ArrowComp
