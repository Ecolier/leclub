import './style.scss'
import React, { PureComponent } from 'react'
import uuid from 'uuid/v1'
import Player from './Player'
import Scrubber from './Scrubber'
import Playlist from './Playlist'
import CutForm from './form'
import { ClipContext } from './context'

export default class extends PureComponent {

  static contextType = ClipContext

  homeSampleHandleSubmit = async (form) => {
    const thumb = await this.context.player.getThumbnail(form.start)
    this.context.stopEdit()
    this.context.playlist.addItem({
      _id: uuid(),
      videoUrl: this.context.player.source,
      start: form.start,
      end: form.end,
      thumbnail: thumb.data,
      title: form.title,
      description: form.description,
      themes: form.tags,
      duration: form.duration,
    })
  }

  render () {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className='b-cut-sample' style={{ backgroundColor: '#181818',
        }}>
          <div className='b-cut-sample-studio'>
            <Player source={this.props.source} />
            <Scrubber />
          </div>
          <Playlist style={{ ...this.props.style, display: !this.context.editing ? 'block' : 'none' }} />
          <CutForm onSubmit={this.props.homeSample && this.homeSampleHandleSubmit}/>
        </div>
      </div>
    )
  }
}
