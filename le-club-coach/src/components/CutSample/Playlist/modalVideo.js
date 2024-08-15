import './style.scss'
import React, { PureComponent } from 'react'
import MediaModal from '../../MediaModal'

class modalVideo extends PureComponent {

  render () {
    const { cut } = this.props
    if (!cut) {
      return null
    }
    const videoProps = {
      start: cut.fake ? cut.start : 0,
      duration: cut.timeOfCut || cut.end - cut.start,
      drawings: cut.drawings,
      themes: cut.tags,
      fake: cut.fake,
      autoPlay: true,
      playbackRate: (cut.isSpotlight && cut.fake) ? 2 : 1,
    }
    return (
      <MediaModal
        onClose={this.props.closeCut}
        url={cut.videoUrl || cut.url}
        videoProps={videoProps}
        type='video'
        visible
      />
    )
  }
}

export default modalVideo
