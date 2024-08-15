import 'moment/locale/fr'
import React, { PureComponent } from 'react'
import { deleteCut } from '@/actions/coach'
import PlayerCut from '../CutSample/Player'
import Scrubber from '../CutSample/Scrubber'
import CutForm from '../CutSample/form'
import CutFormUpdate from '../CutSample/updateForm'
import { message, Drawer, Button } from 'antd'
import { ClipContext } from '../CutSample/context'
import moment from 'moment'
import Playlist from '../CutSample/Playlist'
import SpotlightLayer from '../Studio/SpotlightLayer'
import DrawingLayer from '../Studio/DrawingLayer'
import { StoreContext, connectStoreon, customContext, useStoreon } from 'storeon/react' 
import { createSequence, createDrawingClip, createSpotlightClip } from '@/actions/coach'
import uuid from 'uuid/v1'
import './index.scss'
import i18n from 'i18n-js'
import '@/i18n.js'

moment.locale('fr')
message.config({
  maxCount: 1,
})

const base_image = new Image(100, 80)
base_image.src = '../assets/test4.png'
base_image.style.width = '150px'
base_image.style.height = '100px'

class Studio extends PureComponent {

  componentDidMount () {
    if (!this.props.video._id) {
      this.props.dispatch(router.navigate, '/coach/home')
    }
    this.clipContext.on('stop', this.handleEditingStop)
    document.getElementById('LeClub').className = 'stop-scrolling'
  }

  componentWillUnmount () {
    document.getElementById('LeClub').className = ''
    this.clipContext.off('stop', this.handleEditingStop)
  }

  get clipContext () {
    return this.context
  }

  handleEditingStop = () => {
    this.setState({
      spotlightActivated: false,
      spotlightBlob: undefined,
      spotlightURL: undefined,
      spotlightDuration: 0,
      drawings: [],
    })
  }

  static contextType = ClipContext

  state = {
    isDrawerOpen: false,
    drawingsActivated: false,
    drawings: [],
    spotlightActivated: false,
    spotlightDuration: 0,
    spotlightBlob: undefined,
    spotlightURL: undefined,
    updateCut: false,
    cut: null,
  }

  handleSpotlightSave = evt => {
    this.context.startEdit({ duration: evt.duration / 0.5 })
    this.setState({
      spotlightDuration: evt.duration / 0.5,
      spotlightBlob: evt.blob,
      spotlightURL: URL.createObjectURL(evt.blob),
    }, () => {
      setImmediate(() => {
        this.context.player.restart()
        this.context.player.playbackRate = 2
      })
    })
  }

  toggleSpotlightMode = () => {
    this.setState({ spotlightActivated: !this.state.spotlightActivated })
  }

  replaceFakeCut = (fakeId, cut) => {
    if (!this.context.playlist) {
      return
    }
    this.context.playlist.replaceItem(fakeId, {
      _id: cut._id,
      videoUrl: cut.url,
      thumbnail: cut.poster,
      start: 0,
      end: cut.timeOfCut,
      title: cut.title,
      about: cut.about,
      themes: cut.tags,
    })
  }

  saveSpotlight = async (form, blob) => {
    if (blob === undefined) {
      return message.error(i18n.t('Studio.spotlightLayer.clipSpotlightDisclaimer'), 3)
    }
    const fakeId = uuid()
    try {
      const thumb = await this.context.player.getThumbnail(0)
      const { spotlightDuration, spotlightURL } = this.state

      this.context.stopEdit()
      this.context.playlist.addItem({
        _id: fakeId,
        videoUrl: spotlightURL,
        start: 0,
        end: spotlightDuration,
        thumbnail: thumb.data,
        title: form.title,
        about: form.about,
        themes: form.tags,
        match: this.props.match,
        training: this.props.training,
        timeOfCut: form.end - form.start,
        isSpotlight: true,
        fake: true,
      })
      const { cut } = await createSpotlightClip(this.props.coach._id, {
        videoWidth: 1280,
        videoHeight: 720,
        spotlight: blob,
        start: 0,
        end: spotlightDuration,
        duration: spotlightDuration,
        videoId: this.props.video._id,
        matchId: this.props.video.match,
        trainingId: this.props.video.training,
        tags: form.tags,
        whitelist: form.whitelist,
        isPublic: form.isPublic,
        users: [],
        title: form.title,
        about: form.about,
      })
      this.replaceFakeCut(fakeId, cut)
    } catch (err) {
      this.context.playlist.removeItem(fakeId)
    }
  }

  saveDrawings = async (form, drawings) => {
    const fakeId = uuid()
    try {
      const thumbnail = URL.createObjectURL(drawings[0].file)
      const videoUrl = this.context.player.source

      this.context.stopEdit()
      this.context.playlist.addItem({
        _id: fakeId,
        videoUrl,
        thumbnail,
        start: form.start,
        end: form.end,
        title: form.title,
        about: form.about,
        themes: form.tags,
        match: this.props.match,
        training: this.props.training,
        timeOfCut: form.end - form.start,
        drawings,
        fake: true,
      })
      const { cut } = await createDrawingClip(this.props.coach._id, {
        videoWidth: 1280,
        videoHeight: 720,
        startDrawing: drawings[0].time,
        videoUrl: this.props.video.url,
        start: form.start,
        end: form.end,
        duration: 3,
        videoId: this.props.video._id,
        matchId: this.props.video.match,
        trainingId: this.props.video.training,
        tags: form.tags,
        whitelist: form.whitelist,
        isPublic: form.isPublic,
        users: [],
        title: form.title,
        about: form.about,
        drawings,
      })
      this.replaceFakeCut(fakeId, cut)
    } catch (err) {
      this.context.playlist.removeItem(fakeId)
    }
  }

  saveCut = async (form) => {
    const fakeId = uuid()
    try {
      const thumb = await this.context.player.getThumbnail(form.start, this.props.mobile.isOnMobile)
      const videoUrl = this.context.player.source
      this.context.stopEdit()
      this.context.playlist.addItem({
        _id: fakeId,
        videoUrl,
        start: form.start,
        end: form.end,
        thumbnail: thumb.data,
        title: form.title,
        about: form.about,
        tags: form.tags,
        match: this.props.match,
        training: this.props.training,
        timeOfCut: form.end - form.start,
        fake: true,
      })
      const { cut } = await createSequence(this.props.coach._id, {
        title: form.title,
        about: form.about,
        tags: form.tags,
        start: form.start,
        end: form.end,
        videoUrl: this.props.video.url.replace('d122fkd51lwme.cloudfront.net', 'videos-ressources1.s3.amazonaws.com'),
        videoId: this.props.video._id,
        matchId: this.props.video.match,
        whitelist: form.whitelist,
        isPublic: form.isPublic,
        trainingId: this.props.video.training,
        users: [],
        coachId: this.props.coach._id,
      })
      this.replaceFakeCut(fakeId, cut)
    } catch (err) {
      this.context.playlist.removeItem(fakeId)
    }
  }

  handleSubmit = (form) => {
    // prevent coach smashing create clip button
    if (this._creatingCut) {
      return
    }
    this._creatingCut = true
    if (this.state.spotlightActivated || this.state.spotlightBlob) {
      this.saveSpotlight(form, this.state.spotlightBlob)
    } else if (this.state.drawings.length > 0) {
      this.saveDrawings(form, this.state.drawings.slice())
    } else {
      this.saveCut(form)
    }
    this._creatingCut = false
  }

  handleDrawingsUpdate = (drawings) => {
    this.setState({ drawings })
  }

  getVideoUrl = () => {
    return this.state.spotlightURL
      ? this.state.spotlightURL
      : this.props.video.url
  }

  handleCutDelete = async (cutId) => {
    this.context.playlist.removeItem(cutId)
    await deleteCut(this.props.coach._id, cutId)
  }

  handleUpdateCut = (cut) => {
    this.setState({ updateCut: !this.state.updateCut, cut })
  }

  render () {
    const { video } = this.props
    return (
      <div style={{ height: '100%', maxHeight: '100%', width: '100%' }}>
        <div id={'newStudio'} style={{ height: '100%' }}>
          <div style={{ width: '100%', height: '100%', display: 'flex' }}>
            <div className='width-animation' style={{
              background: 'rgb(24, 24, 24)',
              width: window.innerWidth > 425 ? '80%' : '100%',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div
                tabIndex='0'
                id={'overlay-spotlight'}
                style={{ outline: 'none' }}
              >
                <PlayerCut
                  mobile={this.props.mobile}
                  source={this.getVideoUrl()}
                  drawings={video.drawings}
                  drawingsV2={this.state.drawings}
                  coachId={this.props.coach._id}
                  matchId={this.props.video.match}
                  trainingId={this.props.video.training}
                  currentTime={this.context.currentTime}
                  disableShortcuts={this.context.editing || this.state.spotlightActivated}
                  drawingElement={
                    this.context.editing && !this.state.spotlightBlob && (<DrawingLayer
                      video={this.props.video}
                      onDrawingsUpdate={this.handleDrawingsUpdate}
                    />)
                  }
                >
                  {!this.context.editing && !this.state.spotlightBlob && !this.props.mobile.isOnMobile && (
                    <SpotlightLayer
                      onSpotlightSave={this.handleSpotlightSave}
                      onActivate={this.toggleSpotlightMode}
                      onDeactivate={this.toggleSpotlightMode}
                      framerate={60}
                      cursorRadius={60}
                    />
                  )}

                </PlayerCut>
              </div>
              {!this.state.spotlightBlob && (
                <Scrubber
                  coachId={this.props.coach._id}
                  matchId={this.props.video.match}
                  trainingId={this.props.video.training}
                />
              )}
              {window.innerWidth <= 425 && (
                <Button onClick={() => { this.setState({ isDrawerOpen: !this.state.isDrawerOpen }) }} className='drawerBtn'>
                  { !this.context.editing && !this.context.spotlight && !this.context.drawing && !this.state.updateCut ? i18n.t('Common_word.playlist') : i18n.t('Common_word.create')}
                </Button>
              )}
            </div>
            <Drawer
              id={'studio_mobile_drawer'}
              drawerStyle={{ backgroundColor: '#181818' }}
              bodyStyle={{ backgroundColor: '#181818', padding: '0px' }}
              visible={this.state.isDrawerOpen}
              closable
              headerStyle={{ color: 'white' }}
              onClose={() => { this.setState({ isDrawerOpen: !this.state.isDrawerOpen }) }}
              className='width-animation'
              width={this.props.mobile.isOnIOS ? '100%' : '65%'}
            >
              <Playlist
                style={{
                  height: `${window.innerHeight}px`,
                  maxWidth: '100%',
                  display: !this.context.editing && !this.context.spotlight && !this.context.drawing && !this.state.updateCut ? 'block' : 'none',
                }}
                deleteCut={this.handleCutDelete}
                coach={this.props.coach}
                video={this.props.video}
                handleUpdateCut={this.handleUpdateCut}
              />
              <CutForm
                tags={this.props.coach.prefStudio.tags}
                video={video}
                match={this.props.match}
                coach={this.props.coach}
                onSubmit={this.handleSubmit}
              />
              {this.state.updateCut && (
                <CutFormUpdate
                  video={video}
                  coach={this.props.coach}
                  pickableTags={this.props.coach.prefStudio.tags}
                  handleUpdateCut={this.handleUpdateCut}
                  updateCut={this.state.updateCut}
                  cut={this.state.cut}
                />
              )}
            </Drawer>
            {window.innerWidth > 425 && (

              <div className='width-animation' style={{ width: '20%', background: '#181818' }}>
                <Playlist
                  style={{
                    maxWidth: '100%',
                    maxHeight: !this.props.isOnMobile && 'calc(100vh - 70px)',
                    display: !this.context.editing && !this.context.spotlight && !this.context.drawing && !this.state.updateCut ? 'block' : 'none',
                  }}
                  deleteCut={this.handleCutDelete}
                  coach={this.props.coach}
                  video={this.props.video}
                  handleUpdateCut={this.handleUpdateCut}
                />
                <CutForm
                  tags={this.props.coach.prefStudio.tags}
                  video={video}
                  match={this.props.match}
                  coach={this.props.coach}
                  onSubmit={this.handleSubmit}
                />
                {this.state.updateCut && (
                  <CutFormUpdate
                    video={video}
                    coach={this.props.coach}
                    pickableTags={this.props.coach.prefStudio.tags}
                    handleUpdateCut={this.handleUpdateCut}
                    updateCut={this.state.updateCut}
                    cut={this.state.cut}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default initialeProps => {
  const { dispatch, coach, mobile } = useStoreon('coach', 'mobile')
  return React.createElement(Studio, {
    ...initialeProps,
    dispatch,
    coach,
    mobile,
  })
}
