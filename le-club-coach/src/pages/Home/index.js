import React, { PureComponent } from 'react'
import { Icon } from 'antd'
import CutSample from '@/components/CutSample'
import { connectStoreon } from 'storeon/react'
import RouterLink from '@/components/RouterLink'
import i18n from 'i18n-js'
import { StoreContext, connectStoreon, customContext, useStoreon } from 'storeon/react' 
import Header from '@/components/Header'

import '@/i18n'

import { useStoreon } from 'storeon/react'

class Discoverable extends PureComponent {

  constructor (props) {
    super(props)
    this._ref = React.createRef()
  }

  componentDidMount () {
    this.subscribeScroll()
    this.handleScroll()
  }

  componentWillUnmount () {
    this.unsubscribeScroll()
  }

  state = {
    discovered: false,
  }

  subscribeScroll = () => {
    this._scrollListener = window.addEventListener('scroll', this.handleScroll)
  }

  unsubscribeScroll = () => {
    window.removeEventListener('scroll', this._scrollListener)
  }

  handleScroll = () => {
    const elem = this._ref.current
    if (elem) {
      const viewport = window.scrollY + window.innerHeight
      const inViewport = elem.offsetTop <= viewport - 40
      if (inViewport) {
        this.unsubscribeScroll()
        this.setState({ discovered: true })
      }
    }
  }

  render () {
    const { children, ...props } = this.props
    props.ref = this._ref
    props.className = `${props.className || ''} ${!this.state.discovered ? 'not-discovered' : 'discovered'}`
    return React.createElement('div', props, children)
  }
}

class Home extends PureComponent {

  componentDidMount () {
    // const { coach } = useStoreon('coach')
    const { coach, dispatch } = this.props

    // redirect connected coach to the dashboard
    if (coach && coach.role === 15) {
      return dispatch(router.navigate, '/coach?mode=home')
    }
  }

  render () {
    return (
      <div>
        {screen.width < 800 && <Header />}
        <div className='home-banner'>
          <video className='home-video' autoPlay loop muted>
            <source src='https://d1ceovtllg6jml.cloudfront.net/ballin_application_mobile_joueur_video_preview.mp4' type='video/webm' />
          </video>
          <div className='home-video-overlay'>
            <div className='inner-overlay'>
              <div className='home-banner-title'>{i18n.t('HomePage.home-banner-title')}</div>
              <div className='home-banner-desc'>
                <div>
                  {i18n.t('HomePage.home-banner-desc_firstSentence')}
                </div>
                <div>
                  {i18n.t('HomePage.home-banner-desc_secondSentence')}
                </div>
              </div>
              <RouterLink to='/inscription'>
                <button className='b-button'>
                  {i18n.t('HomePage.home-banner-button')}
                </button>
              </RouterLink>
            </div>
          </div>
        </div>
        <div className='home-section'>
          <div className='section-header'>
            <div className='section-title'>{i18n.t('HomePage.clip-disclaimer-title')}</div>
            <div className='section-subtitle'>
              {i18n.t('HomePage.clip-disclaimer-subtitle_firstSentence')}<br />
              {i18n.t('HomePage.clip-disclaimer-subtitle_secondSentence')}
            </div>
          </div>
          {screen.width > 425
            && <Discoverable>
              <CutSample
                style={{ maxWidth: '300px' }}
                source='https://d1ceovtllg6jml.cloudfront.net/ballin_8eme_france_argentine_demo_cut_sequencage.mp4'
                homeSample
              />
            </Discoverable>}
        </div>
        <div className='home-section'>
          <Discoverable className='section-header'>
            <div className='section-title'>{i18n.t('HomePage.video-material-disclaimer-title')}</div>
            <div className='section-subtitle'>
              <div>{i18n.t('HomePage.video-material-disclaimer-subtitle_firstSentence')}</div>
            </div>
          </Discoverable>
          <Discoverable className='products-media'>
            <img className='' src='https://d1ceovtllg6jml.cloudfront.net/ballin_materiel_situations.png' />
          </Discoverable>
          <Discoverable>
            <RouterLink to='/products/stuff'>
              <button className='b-button '>{i18n.t('HomePage.video-material-disclaimer-button')}</button>
            </RouterLink>
          </Discoverable>
        </div>
        <div className='home-section'>
          <Discoverable className='section-header'>
            <div className='section-title'>{i18n.t('HomePage.leClub-community-title')}</div>
            <div className='section-separator' />
          </Discoverable>
          <Discoverable className='section-community-word'>
            <div>{i18n.t('HomePage.leClub-community-word')}</div>
          </Discoverable>
          <Discoverable className='leClub-stats'>
            <div className='stat-container'>
              <div className='stat-icon'>
                <Icon type='video-camera' />
              </div>
              <div className='stat-nb'>1 000+</div>
              <div className='stat-label'>{i18n.t('HomePage.video-match-record-label')}</div>
            </div>
            <div className='stat-container'>
              <div className='stat-icon'>
                <Icon type='hourglass' />
              </div>
              <div className='stat-nb'>5 000 000+</div>
              <div className='stat-label'>{i18n.t('HomePage.video-minutes-watched-label')}</div>
            </div>
            <div className='stat-container'>
              <div className='stat-icon'>
                <Icon type='eye' />
              </div>
              <div className='stat-nb'>1 000 000+</div>
              <div className='stat-label'>{i18n.t('HomePage.video-views-label')}</div>
            </div>
          </Discoverable>
          <Discoverable className='leClub-users'>
            <div className='leClub-users-title'>
              <div>{i18n.t('HomePage.leClub-users-title')}</div>
            </div>
          </Discoverable>
          <Discoverable className='community-quotes'>
            <div className='quote'>
              <div className='quote-big-quote'>"</div>
              <div>
                <div className='quote-content'>
                  "{i18n.t('HomePage.community-quotes_firstQuotes')}"
                </div>
                <div className='quote-author'>
                  <div className='quote-author-separator' />
                  <div className='quote-author-name'>Matthieu Carette</div>
                  <div className='quote-author-type'>Coach U17 R1, US Palaiseau</div>
                </div>
              </div>
            </div>
            <div className='quote'>
              <div className='quote-big-quote'>"</div>
              <div>
                <div className='quote-content'>
                  "{i18n.t('HomePage.community-quotes_firstQuotes')}"
                </div>
                <div className='quote-author'>
                  <div className='quote-author-separator' />
                  <div className='quote-author-name'>Thomas Berlette</div>
                  <div className='quote-author-type'>Coach U17 Nationaux, FC Montrouge</div>
                </div>
              </div>
            </div>
          </Discoverable>
        </div>
        <div className='home-start-section'>
          <Discoverable className='section-inner'>
            <div className='start-section-title'>{i18n.t('HomePage.join-leClub-disclaimer')}</div>
            <RouterLink to='/inscription'>
              <button className='b-button '>{i18n.t('HomePage.home-banner-button')}</button>
            </RouterLink>
          </Discoverable>
        </div>
      </div>
    )
  }
}

export default connectStoreon(
  'dispatch',
  'coach',
  Home,
)
