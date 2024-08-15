import React, { PureComponent } from 'react'
import MediaModal from '../../MediaModal'

export default class extends PureComponent {
  render () {
    const props = {
      ...this.props,
      url: this.props.source,
      autoPlay: true,
    }
    return (
      <MediaModal type='video' visible onClose={this.props.onClose} videoProps={props} url={this.props.url} />
    )
  }
}
