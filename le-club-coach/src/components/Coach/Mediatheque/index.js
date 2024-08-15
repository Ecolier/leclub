import React, { Component } from 'react'
import { StoreContext, connectStoreon, customContext, useStoreon } from 'storeon/react' 
import { Button, Input, Select, Tag, Modal } from 'antd'

import { callApi } from '@/utils/callApi'
import InfiniteScroll from '@/components/InfiniteScroller'
import VideoCard from '@/components/Studio/videoCard.js'
import MediaModal from '@/components/MediaModal'

import 'moment/locale/fr'
import moment from 'moment'
import DownloadMediaButton from './downloadMedia'
import { FacebookShareButton, FacebookIcon, TwitterIcon, TwitterShareButton, LinkedinShareButton, LinkedinIcon } from 'react-share'

import './style.css'

const Search = Input.Search
const Option = Select.Option

moment.locale('fr')

import i18n from 'i18n-js'
import '@/i18n'

const WAIT_INTERVAL = 700

class Mediateque extends Component {

  componentDidMount () {
    window.scrollTo(0, 0)
    const select = document.getElementsByClassName('ant-select-selection--single')
    for (let i = 0; select[i]; i++) {
      select[i].style.height = '100%'
      select[i].style.display = 'flex'
      select[i].style.alignItems = 'center'
    }
    this.timer = null
    setTimeout(this.fetchMedias, 300)
  }

  state = {
    name: '',
    medias: [],
    nbr: 0,
    tag: '',
    hasMoreItems: true,
    isOpenModal: false,
    currentMedia: {},
    mediaType: '',
    findBy: 'TITRE',
    openModal: false,
    videoChoose: null,
  }

  fetchMedias = () => {
    const { findBy, nbr, name, tag, mediaType } = this.state
    callApi(`service/searchMedia/${this.props.coach._id}?page=${nbr}&findBy=${findBy}&name=${name}&tag=${tag}&mediaType=${mediaType}`, 'get').then(body => {
      this.setState({
        medias: nbr === 0 ? body.medias : [...this.state.medias, ...body.medias],
        nbr: nbr + 1,
        hasMoreItems: body.medias.length > 0,
      })
    })
  }

  handleInput = (e) => {
    clearTimeout(this.timer)

    const name = e.target.value
    this.timer = setTimeout(() => {
      this.setState({
        name,
        nbr: 0,
      }, this.fetchMedias)
    }, WAIT_INTERVAL)
  }

  handleMediaTypeChange = (mediaType) => {
    this.setState({
      mediaType,
      nbr: 0,
      hasMoreItems: true,
    }, this.fetchMedias)
  }

  handleSearchByChange = (findBy) => {
    this.setState({
      findBy: findBy || i18n.t('Mediateque.Search.titleSearch'),
      nbr: 0,
      hasMoreItems: true,
    }, this.fetchMedias)
  }

  handleThemeChange = (tag) => {
    this.setState({
      tag,
      nbr: 0,
      hasMoreItems: true,
    }, this.fetchMedias)
  }

  openModal = (e) => { this.setState({ isOpenModal: true, currentMedia: e }) }

  getMediaTypeLabel (media) {
    switch (media.type) {
    case 'video':
      return i18n.t('Mediateque.Search.videoSearch')
    case 'cut':
      return i18n.t('Mediateque.Search.cutSearch')
    case 'training':
      return i18n.t('Mediateque.Search.trainingSearch')
    default:
      return ''
    }
  }

  render () {

    const { medias } = this.state
    const { coach } = this.props

    return (
      <div>
        <div className='mediathequeContainer'>
          <div className='mediathequeTitleContainer'>
            <Search
              className='mediathequeSearch'
              style={{ borderRaduis: '0px' }}
              placeholder={i18n.t('Mediateque.Search.textSearch')}
              onChange={this.handleInput}
              onSearch={this.handleInput}
              size={'large'}
            />
            <Select className='mediathequeBox' size={'large'} onChange={this.handleMediaTypeChange} defaultValue=''>
              <Option value=''>{i18n.t('Mediateque.Search.mediaSearch')}</Option>
              <Option value='VIDEO'>{i18n.t('Mediateque.Search.videoSearch')}</Option>
              <Option value='CUT'>{i18n.t('Mediateque.Search.cutSearch')}</Option>
              <Option value='TRAINING'>{i18n.t('Mediateque.Search.trainingSearch')}</Option>
            </Select>
            <Select className='mediathequeBox' size={'large'} onChange={this.handleSearchByChange} defaultValue=''>
              <Option value=''>{i18n.t('Mediateque.Search.bySearch')}</Option>
              <Option value='TITRE'>{i18n.t('Mediateque.Search.titleSearch')}</Option>
              <Option value='COMMENTAIRE'>{i18n.t('Mediateque.Search.comentSearch')}</Option>
            </Select>
            <Select className='mediathequeBox' size={'large'} onChange={this.handleThemeChange} defaultValue=''>
              <Option value=''>THÈME</Option>
              { coach && coach.prefStudio && coach.prefStudio.tags && coach.prefStudio.tags.length !== 0 && (coach.prefStudio.tags.map((l, key) => { return (<Option style={{ color: `${l.color}` }}value={l.name} key={key}>{`${l.name}`}</Option>) }))}
            </Select>
          </div>
          {medias && medias.length !== 0 ? (
            <InfiniteScroll
              pageStart={0}
              loadMore={this.fetchMedias}
              loader={<div className='loader' key={0}>...</div>}
              hasMore={this.state.hasMoreItems}
            >
              <div>
                {medias && medias.length && (
                  medias.map((e, key) => {
                    return (
                      <div key={key} className='mediathequeCard'>

                        <VideoCard poster={e.poster || 'https://d1ceovtllg6jml.cloudfront.net/logo_ok.png'} openModal={() => { this.openModal(e) }} keyCut={key} />

                        <div className='mediathequeTitle'>
                          <div style={{ fontWeight: 'bold', margin: '5px 0' }}>{this.getMediaTypeLabel(e)}</div>
                          <div >{e.title}</div>
                          <div style={{ marginTop: 10 }}>{e.about && e.about}</div>
                          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                            {e.tags && e.tags.length !== 0 && e.tags.map((t, key) => {
                              return (
                                <Tag color={t.color}key={key}>{t.name}</Tag>
                              )
                            })}
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginRight: '10px' }}>
                          <h3 style={{ alignSelf: 'flex-end' }}>{`${moment(e.updatedAt).format('DD/MM/YYYY')}`}</h3>
                          <DownloadMediaButton coach={coach} media={e} />
                          <Button style={{ marginTop: '10px' }} onClick={() => { this.openModal(e) }}>{i18n.t('Mediateque.seeButton')}</Button>
                          <div style={{ display: e.isPublic === 'public' ? 'flex' : 'none', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
                            <FacebookShareButton disabled={e.isPublic !== 'public'} style={{ marginRight: '5px', cursor: 'pointer' }} quote={i18n.t('Mediateque.facebookShare')} url={`https://teamballinfc.com/public/coach?name=${this.props.coach._id}&mode=${e.video ? 'cuts' : 'videos'}&videoKey=${e._id}&isOpenModal=true`}>
                              <FacebookIcon size={32} round />
                            </FacebookShareButton>
                            <TwitterShareButton disabled={e.isPublic !== 'public'} style={{ marginRight: '5px', cursor: 'pointer' }} url={`https://teamballinfc.com/public/coach?name=${this.props.coach._id}&mode=${e.video ? 'cuts' : 'videos'}&videos&videoKey=${e._id}&isOpenModal=true`}>
                              <TwitterIcon size={32} round />
                            </TwitterShareButton>
                            <LinkedinShareButton disabled={e.isPublic !== 'public'} style={{ cursor: 'pointer' }} url={`https://teamlballinfc.com/public/coach?name=${this.props.coach._id}&mode=${e.video ? 'cuts' : 'videos'}&videoKey=${e._id}&isOpenModal=true`}>
                              <LinkedinIcon size={32} round />
                            </LinkedinShareButton>
                          </div>
                          <div style={{ display: e.isPublic !== 'public' ? 'flex' : 'none', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onClick={() => { this.setState({ openModal: true, videoChoose: key }) }}>
                            <div style={{ marginRight: '5px', opacity: '0.4', cursor: 'pointer' }}>
                              <FacebookIcon size={32} round />
                            </div>
                            <div style={{ marginRight: '5px', opacity: '0.4', cursor: 'pointer' }}>
                              <TwitterIcon size={32} round />
                            </div>
                            <div style={{ opacity: '0.4', cursor: 'pointer' }}>
                              <LinkedinIcon size={32} round />
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </InfiniteScroll>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '200px' }}>
              <h1>{i18n.t('Mediateque.subTitle')}</h1>
              <Button style={{ marginBottom: '30vh' }} onClick={() => { this.props.dispatch(router.navigate, '/coach/home') }} size={'large'} type='primary'>{i18n.t('Mediateque.leClubStudio')}</Button>
            </div>
          )}
        </div>
        {/* this commpent make the scrooll bug if you delte the condition */}
        {this.state.isOpenModal && (
          <MediaModal
            visible={this.state.isOpenModal}
            title={this.state.currentMedia.title}
            url={this.state.currentMedia.url}
            tags={this.state.currentMedia.tags}
            about={this.state.currentMedia.about}
            match={this.state.currentMedia.match}
            training={this.state.currentMedia.training}
            timeOfCut={this.state.currentMedia.timeOfCut}
            onClose={() => { this.setState({ isOpenModal: false, currentMedia: {} }) }}
            type='video'
          />
        )}

        <Modal
          title={i18n.t('VideoPrivacyModal.video_privacy')}
          visible={this.state.openModal}
          destroyOnClose
          onCancel={() => { this.setState({ openModal: false, videoChoose: null }) }}
          footer={null}
        >
          <p>{i18n.t('Mediateque.Modal.privacy')}</p>
        </Modal>
      </div>
    )
  }
}

export default (initialProps) => {
  const { dispatch, coach } = useStoreon('coach')
  const props = {
    ...initialProps,
    dispatch,
    coach,
  }
  return <Mediateque {...props} />
}
