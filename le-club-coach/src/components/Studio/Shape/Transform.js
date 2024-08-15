
import React, { Component } from 'react'
import { Transformer } from 'react-konva'

class TransformerComponent extends Component {
  componentDidMount () {
    this.checkNode()
  }
  componentDidUpdate () {
    this.checkNode()
  }
  checkNode () {
    // here we need to manually attach or detach Transformer node
    const stage = this.transformer.getStage()
    const { selectedShapeName } = this.props

    const selectedNode = stage.findOne(`.${selectedShapeName}`)
    // do nothing if selected node is already attached
    if (selectedNode === this.transformer.node()) {
      return
    }

    if (selectedNode) {
      // attach to another node
      this.transformer.attachTo(selectedNode)

    } else {
      // remove transformer
      this.transformer.detach()
    }
    this.transformer.getLayer().batchDraw()
    this.transformer.anchorStroke('black')
    this.transformer.anchorStrokeWidth(0.5)
    this.transformer.anchorCornerRadius(3)
  }
  render () {
    let enabledAnchors = null
    if (this.props.selectedShapeName) { if (this.props.selectedShapeName.split('-')[0] === 'arrow') { enabledAnchors = ['top-left', 'bottom-right'] } else if (this.props.selectedShapeName.split('-')[0] === 'text') { enabledAnchors = [] } }

    return (<Transformer onMouseDown={this.props.shouldUnselect} ref={node => { this.transformer = node }} keepRatio={false} enabledAnchors={enabledAnchors} borderStroke={'white'}/>)
  }
}

export default TransformerComponent
