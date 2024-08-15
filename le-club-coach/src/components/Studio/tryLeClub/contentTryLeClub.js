import React, { Component } from 'react'
import Scrubber from '../../CutSample/Scrubber'
import Playlist from '../../CutSample/Playlist'
import CutForm from '../../CutSample/form'
import PlayerTryLeClub from './playerTryLeClub'
import { ClipContext } from '../../CutSample/context'
import uuid from 'uuid/v1'

class ContentTryLeClub extends Component {

  static contextType = ClipContext

  state = {
    drawings: [],
  }

  resetDrawings = () => {
    this.setState({ drawings: [] })
  }

  pushDrawings = (drawing, canCheck) => {
    const drawings = this.state.drawings
    const index = drawings.findIndex(d => d.time === drawing.time)
    if (index !== -1) {
      drawings[index] = drawing
    } else {
      drawings.push(drawing)
    }
    this.setState({ drawings }, () => { if (canCheck) { canCheck() } })
  }

  handleSubmit = async (form) => {
    const drawings = this.state.drawings
    const thumb = await this.context.player.getThumbnail(form.start)
    this.context.stopEdit()
    this.context.playlist.addItem({
      _id: uuid(),
      videoUrl: this.context.player.source,
      start: form.start,
      end: form.end,
      duration: form.end - form.start,
      thumbnail: drawings.length > 0 ? URL.createObjectURL(drawings[0].file) : thumb.data,
      title: form.title,
      description: form.description,
      themes: form.tags,
      drawings: drawings.map(draw => ({ ...draw, fileUrl: URL.createObjectURL(draw.file) })),
    })
    this.resetDrawings()
  }

  render () {
    const { coach } = this.props
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <div className='b-cut-sample' style={{ backgroundColor: '#181818', maxWidth: 'none', width: '100%', height: `${window.innerHeight - 70}px` }}>
          <div className='b-cut-sample-studio' style={{ width: '80%' }}>
            <PlayerTryLeClub coach={coach} drawings={this.state.drawings} pushDrawings={this.pushDrawings}/>
            <Scrubber
              coachId={this.props.coach._id}
            />
          </div>
          <div style={{ width: '20%' }}>
            <Playlist
              style={{ maxWidth: '100%', display: !this.context.editing && !this.context.spotlight && !this.context.drawing ? 'block' : 'none' }}
              coach={this.props.coach}
              test
            />
            <CutForm
              tags={coach.prefStudio.tags}
              coach={coach}
              dispatch={this.props.dispatch}
              drawings={this.state.drawings}
              resetDrawings={this.resetDrawings}
              onSubmit={this.handleSubmit}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default ContentTryLeClub
