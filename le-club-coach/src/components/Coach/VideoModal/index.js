import React from 'react'
import { Modal } from 'antd'
import VideoPlayer from '../../Player/playlistVideos'

export default class extends React.PureComponent {

  render () {
    const { visible, video } = this.props
    if (!video) {
      return null
    }
    return (
      <Modal
        title={video.title}
        width='80vw'
        visible={visible}
        destroyOnClose
        footer={null}
        onCancel={this.props.onCancel}
      >
        <VideoPlayer
          propsId={'video-1'}
          playerStyle={{ width: '90%' }}
          shareOff
          toolbar
          drawings={video.drawings}
          poster={video.poster}
          url={video.url}
          video={video}
          autoPlay
        />
      </Modal>
    )
  }
}
