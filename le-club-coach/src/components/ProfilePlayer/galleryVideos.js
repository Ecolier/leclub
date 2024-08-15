import React, { Component } from 'react'
import { List, Card } from 'antd'
import { useStoreon } from 'storeon/react'
import { callApi } from '@/utils/callApi'
import VideoModal from '../Coach/VideoModal'
const { Meta } = Card
import './style.scss'
import i18n from 'i18n-js'
import '@/i18n.js'

class GalleryVideos extends Component {

  state = {
    playerId: this.props.playerId,
    selectedVideo: undefined,
  }

  openVideo = (video) => {
    // here sign video url :)
    callApi(`${this.props.coach._id}/studio/media/${video._id}/signed?type=${this.props.type}`, 'get').then(res => {
      this.setState({
        selectedVideo: res.video,
      })
    })
  }

  closeVideo = () => {
    this.setState({
      selectedVideo: undefined,
    })
  }

  render () {
    const { videos } = this.props
    return (
      <div style={{ marginBottom: '50px', minHeight: '40vh', maxHeight: '40vh', overflow: 'auto' }}>
        { videos && videos.length === 0 ? (<h2 style={{ width: '100%', textAlign: 'center', fontSize: '3rem', color: 'grey' }}>{i18n.t('Common_word.noVideo')}</h2>) : null}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <List
            style={{ width: '100%', margin: '0 12px' }}
            grid={{ gutter: 1, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 }}
            dataSource={videos}
            renderItem={(video) => (
              <List.Item style={{ margin: '10px' }}>
                <Card
                  style={{ maxHeight: '400px' }}
                  hoverable
                  onClick={() => { this.openVideo(video) }}
                  cover={<img alt={video.title} src={video.poster || 'https://d1ceovtllg6jml.cloudfront.net/23.jpg'} style={{ height: '240px', width: 'auto', maxWidth: '100%' }} />}>
                  <Meta
                    title={<div style={{ textAlign: 'center' }}>{video.title}</div>}
                  />
                </Card>
              </List.Item>
            )}
          />
        </div>
        <VideoModal
          visible={this.state.selectedVideo !== undefined}
          video={this.state.selectedVideo}
          onCancel={this.closeVideo}
        />
      </div>
    )
  }
}

export default initialProps => {
  const { dispatch, coach } = useStoreon('coach')
  const props = {
    ...initialProps,
    dispatch,
    coach,
  }
  return <GalleryVideos {...props} />
}
