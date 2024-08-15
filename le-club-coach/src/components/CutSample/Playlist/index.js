import './style.scss'
import 'moment-duration-format'
import React, { Fragment } from 'react'
import { ClipContext } from '../context'
import MediaModal from '../../MediaModal'
import { Button, Dropdown, Icon, Menu, Tabs, Popover, notification } from 'antd'
import moment from 'moment'
import { values } from 'lodash'
import i18n from 'i18n-js'
import '@/i18n.js'

const TabPane = Tabs.TabPane

export default class extends React.PureComponent {

  componentDidMount () {
    const select = document.getElementsByClassName('ant-tabs-tab')
    for (let i = 0; select[i]; i++) {
      select[i].style.width = '80%'
    }
    this.context.setPlaylist(this)
    if (this.props.coach) {
      this.addItems(this.props.coach.currentCuts)
    }
  }

  componentWillUnmount () {
    // this.context.setPlaylist(undefined)
  }

  static contextType = ClipContext

  state = {
    cuts: {},
    cut: undefined,
  }

  get cuts () {
    return values(this.state.cuts)
  }

  addItems (newCuts) {
    const cuts = { ...this.state.cuts }
    for (const cut of newCuts) {
      cuts[cut._id] = cut
    }
    this.setState({ cuts })
  }

  addItem (cut) {
    const cuts = { ...this.state.cuts }
    cuts[cut._id] = cut
    this.setState({ cuts })
  }

  replaceItem (id, cut) {
    const cuts = { ...this.state.cuts }
    delete cuts[id]
    cuts[cut._id] = cut
    this.setState({ cuts })
  }

  updateItems (newCuts) {
    const cuts = { ...this.state.cuts }
    for (const cut of newCuts) {
      cuts[cut._id] = Object.assign({}, cuts[cut._id], cut)
    }
    this.setState({ cuts })
  }

  removeItem (id) {
    const cuts = { ...this.state.cuts }
    delete cuts[id]
    this.setState({ cuts })
  }

  togglePlaylist = () => {
    this.setState({ folded: !this.state.folded })
  }

  renderThemes = (themes) => {
    return themes.map((t, key) => {
      return (
        <div key={key} style={{ background: t.color }}>{ t.name }</div>
      )
    })
  }

  deleteFakeCut = (cutId) => {
    this.removeItem(cutId)
  }

  handleCutDelete = async (cutId) => {
    if (this.props.test) {
      return this.deleteFakeCut(cutId)
    }
    const deleteHandler = this.props.deleteCut ? this.props.deleteCut : () => { return null }
    await deleteHandler(cutId)
    notification.success({ message: i18n.t('VideoPlayer.playlist.deletedSequence') })
    this.removeItem(cutId)
  }

  renderPlaylistItems = () => {
    // const cuts = [...this.props.coach.currentCuts]
    const cuts = values(this.state.cuts)
    return cuts.map((cut, key) => (
      <div key={key} className='b-cut-playlist-item'>
        <div style={{ display: 'flex' }} onClick={this.openCut(cut)}>
          <div style={{ display: 'flex', marginRight: '15px' }}>
            <img src={cut.thumbnail || cut.poster} className='b-cut-playlist-item-thumb' />
          </div>
          <div style={{ flex: 1 }}>
            <div className='b-cut-playlist-item-title'>{ cut.title }</div>
            <div className='b-cut-playlist-item-desc'>{ cut.description || cut.about }</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className='b-cut-playlist-item-themes'>{ this.renderThemes(cut.themes || cut.tags) }</div>
          {this.props.coach && (
            <div>
              { cut.fake && !this.props.test ? (
                <Popover content={i18n.t('VideoPlayer.playlist.spotlightCreation')} title={i18n.t('Common_word.creating')}>
                  <Icon type='loading' />
                </Popover>
              ) : (
                <Dropdown
                  overlay={
                    <Menu style={{ backgroundColor: '#4e4e4e', border: 'solid 2px #8e8e8e' }}>
                      {/* <Menu.Item>*/}
                      {/* <Button style={{ borderRadius: '10px' }} onClick={() => { this.props.openModalCutDrawing(key) }} > Dessin </Button>*/}
                      {/* </Menu.Item>*/}
                      {!this.props.test && <Menu.Item>
                        <Button style={{ borderRadius: '10px', backgroundColor: 'transparent', color: 'white', border: 'none' }} type='link' onClick={() => this.props.handleUpdateCut(cut)}> {i18n.t('Common_word.modify')} </Button>
                      </Menu.Item>}
                      <Menu.Item>
                        <Button style={{ borderRadius: '10px', backgroundColor: 'transparent', color: 'red', border: 'none' }} type='link' onClick={() => {
                          if (!this.props.test) {
                            this.handleCutDelete(cut._id)
                          } else { this.deleteFakeCut(cut._id) }
                        }}> {i18n.t('Common_word.delete')} </Button>
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Icon type='bars' style={{ fontSize: '20px', color: 'white', backgroundColor: '#2CC1EB', padding: '4px', marginTop: '15px' }} />
                </Dropdown>
              )}
            </div>
          )}
        </div>
      </div>
    ))
  }

  renderDrawingItems = () => {
    return this.props.video.drawings.map((e, key) => {
      return (
        <div className='overClass' key={key} style={{ display: 'flex', flexDirection: 'column', padding: '25px', paddingBottom: '10px', alignItems: 'center', cursor: 'pointer' }}>
          <img className='image' onClick={() => { this.props.openDrawingPreview(e.url) }} src={e.url || 'https://d1ceovtllg6jml.cloudfront.net/logo_ok.png'} style={{ width: '15vw', height: '12vh' }} />
          <div style={{ display: 'flex', flexDirection: 'column', width: '15vw' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

              <p style={{ fontSize: '1rem', color: 'white' }}>{`${i18n.t('VideoPlayer.playlist.showAt')}: ${moment.duration(e.start, 'minutes').format('h:mm')} ${e.start < 60 ? i18n.t('Common_word.secondes') : i18n.t('Common_word.minutes')}`}</p>
              <p style={{ fontSize: '0.7rem', color: 'white' }}>{`${moment(e.createdAt).format('DD/MM/YYYY')}`}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

              <p style={{ fontSize: '1rem', color: 'white' }}>{`${i18n.t('VideoPlayer.playlist.duration')}: ${moment.duration(e.duration, 'minutes').format('h:mm')} ${i18n.t('Common_word.secondes')}`}</p>
              <Dropdown overlay={
                <Menu>
                  <Menu.Item>
                    <Button style={{ borderRadius: '10px' }} onClick={() => { this.props.openDrawingPreview(e.url) }} > {i18n.t('Common_word.show')} </Button>
                  </Menu.Item>
                  <Menu.Item>
                    <Button style={{ borderRadius: '10px' }} type='danger' onClick={() => { this.props.deleteDrawingFunc(e.name) }}> {i18n.t('Common_word.delete')} </Button>
                  </Menu.Item>
                </Menu>
              }>
                <Icon type='bars' style={{ fontSize: '20px', color: 'white', backgroundColor: '#2CC1EB', padding: '4px' }} />
              </Dropdown>
            </div>
          </div>
        </div>
      )
    })
  }

  renderNoItems = () => {
    return (
      <div style={{ textAlign: 'center', fontSize: '14px' }}>
        <div>
          <div>{i18n.t('VideoPlayer.playlist.noClips')}</div>
          <div style={{ fontSize: 18, fontWeight: 'bold' }}>:(</div>
        </div>
      </div>
    )
  }

  renderNoDrawingItems = () => {
    return (
      <div style={{ textAlign: 'center', fontSize: '14px' }}>
        <div>
          <div>{i18n.t('VideoPlayer.playlist.noDrawings')}</div>
          <div style={{ fontSize: 18, fontWeight: 'bold' }}>:(</div>
        </div>
      </div>
    )
  }

  openCut (cut) {
    return () => {
      if (this.context.player) {
        this.context.player.pause()
      }
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', this.handleEscapeKey)
      this.setState({ cut })
    }
  }

  closeCut = () => {
    document.body.style.overflow = 'initial'
    window.removeEventListener('keydown', this.handleEscapeKey)
    this.setState({ cut: undefined })
  }

  handleEscapeKey = (evt) => {
    if (evt.key === 'Escape') {
      this.closeCut()
    }
  }

  render () {
    const cut = this.state.cut
    const cuts = values(this.state.cuts)
    const Items = this.renderPlaylistItems
    const NoItems = this.renderNoDrawingItems

    return (
      <Fragment>
        {!this.state.cut && <div className='b-cut-playlist' style={{ ...this.props.style }}>
          <div className='b-cut-playlist-header'>
            <div className='b-cut-playlist-header-title'>{i18n.t('Common_word.playlist')}</div>
          </div>

          {this.props.video && this.props.video.drawings ? (
            <Tabs defaultActiveKey='1' style={{ color: 'white', width: '100%' }}>
              <TabPane tab={<p style={{ color: 'white' }}>{i18n.t('ProductNavigation.clips')}</p>} key='1'>
                {cuts.length > 0 && this.renderPlaylistItems()}
                {cuts.length <= 0 && this.renderNoItems()}
              </TabPane>
              <TabPane tab={<p style={{ color: 'white' }}>{i18n.t('Common_word.drawings')}</p>} key='2'>
                {this.props.video.drawings.length > 0 && <Items />}
                {this.props.video.drawings.length <= 0 && <NoItems />}
              </TabPane>
            </Tabs>
          ) : (
            <div className='b-cut-playlist-items-container'>
              {cuts.length > 0 && this.renderPlaylistItems()}
              {cuts.length <= 0 && this.renderNoItems()}
            </div>
          )}
        </div>}
        {this.state.cut && (
          <MediaModal
            visible={!!this.state.cut}
            type='video'
            url={cut.url || cut.videoUrl}
            title={cut.title}
            about={cut.about}
            tags={cut.tags}
            timeOfCut={cut.timeOfCut}
            training={cut.training}
            match={cut.match}
            videoProps={{ ...this.state.cut, autoPlay: true }}
            onClose={this.closeCut}
          />
        )}
      </Fragment>
    )
  }
}
