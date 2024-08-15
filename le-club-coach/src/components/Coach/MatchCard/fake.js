import React, { Fragment } from 'react'
import moment from 'moment'
import { StoreContext, connectStoreon, customContext, useStoreon } from 'storeon/react' 
import { Card, Tooltip, Button, Col, Row, Popconfirm, Icon } from 'antd'
import Slider from 'react-slick'
import { callApi } from '@/utils/callApi'
import i18n from 'i18n-js'
import '@/i18n'

moment.locale('fr')

class FakeMatchCard extends React.PureComponent {

  homeLogo = () => {
    return this.props.match.clubHome.urlLogo
  }

  awayLogo = () => {
    return this.props.match.clubAway.urlLogo
  }

  renderResult = () => {
    return <span style={{ color: 'green', textTransform: 'uppercase' }}>{i18n.t('HomeV2.carousel.fake_editing.match_result')}</span>
  }

  renderDate = () => {
    return <span style={{ fontSize: 12 }}>{i18n.t('HomeV2.carousel.fake_editing.match_date')}</span>
  }

  handleClose = () => {
    const coachId = this.props.coach._id
    callApi(`${coachId}/sequencage/hide`, 'put').then(() => {
      this.props.dispatch({
        type: 'http/hideSequencageTry',
      })
    })
  }

  handleSequencage = () => {
    this.props.dispatch(router.navigate, '/coach/tryLeClub')
  }

  renderFloatingCloseButton = () => {
    const title = (
      <React.Fragment>
        <div>{i18n.t('HomeV2.carousel.close_button.warning')}</div>
        <div style={{ color: 'red', fontWeight: 'bold' }}>{i18n.t('HomeV2.carousel.close_button.disclaimer')}</div>
      </React.Fragment>
    )
    return (
      <div style={{ position: 'absolute', left: 10, top: 10 }}>
        <Tooltip title={i18n.t('HomeV2.carousel.close_button.hover')}>
          <Popconfirm placement='bottom' onConfirm={this.handleClose} okText={i18n.t('Common_word.yes')} cancelText={i18n.t('Common_word.no')} title={title}>
            <Button icon='close' shape='circle' style={{ fontSize: 12 }}/>
          </Popconfirm>
        </Tooltip>
      </div>
    )
  }

  renderTeam = ({ club }) => {
    return (
      <div style={{ width: '100px', textAlign: 'center' }}>
        <Tooltip title={club.name}>
          <img src={club.urlLogo} height='128px'/>
        </Tooltip>
      </div>
    )
  }

  renderFRATeam = () => {
    return this.renderTeam({
      club: {
        name: i18n.t('HomeV2.carousel.fake_editing.France'),
        urlLogo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/4/43/Logo_%C3%89quipe_France_Football_2018.svg/398px-Logo_%C3%89quipe_France_Football_2018.svg.png',
      },
    })
  }

  renderARGTeam = () => {
    return this.renderTeam({
      club: {
        name: i18n.t('HomeV2.carousel.fake_editing.Argentina'),
        urlLogo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/b/b8/Football_Argentine_federation.svg/365px-Football_Argentine_federation.svg.png',
      },
    })
  }

  renderScore = () => (
    <div style={{ fontWeight: 'bold', fontSize: '18px', marginRight: '12px' }}>
      4 - 3
    </div>
  )

  renderTutorialPDFCard = ({ tutorialTitle, imgSrc, link }) => (
    <div className={'tutorial_pdf_card'}>
      <h1 style={{
        textAlign: 'center',
        fontSize: 24,
        marginBottom: '20px',
        fontWeight: 'bold',
        color: '#555',
      }}>{tutorialTitle}</h1>
      <img src={imgSrc} style={{ width: '13rem', marginBottom: '2rem' }} alt={'image-tutoriel'}/>
      <Button type='primary' onClick={() => this.props.dispatch(router.navigate, link)}>{i18n.t('HomeV2.carousel.tutorials.button')}</Button>
    </div>
  )

  render () {
    const FloatingCloseButton = this.renderFloatingCloseButton
    const MatchFRATeam = this.renderFRATeam
    const MatchARGTeam = this.renderARGTeam
    const MatchScore = this.renderScore
    const MatchResult = this.renderResult
    const MatchDate = this.renderDate
    const TutorialPDFCard = this.renderTutorialPDFCard
    const settings = {
      infinite: true,
      autoplay: true,
      autoplaySpeed: 5000,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <Icon type={'right'} />,
      prevArrow: <Icon type={'left'} />,
    }
    return (
      <React.Fragment>
        <Row gutter={16} style={{ padding: 0 }}>
          <Col span={24}>
            <Card style={{ marginRight: 10, display: 'flex', flexDirection: 'column', minWidth: 270 }}>
              <FloatingCloseButton/>
              <Slider {...settings}>
                {window.innerWidth > 425 && (
                  <Fragment>
                    <h1 style={{
                      textAlign: 'center',
                      fontSize: 24,
                      marginBottom: '20px',
                      fontWeight: 'bold',
                      color: '#555',
                    }}>{i18n.t('HomeV2.carousel.fake_editing.title')}</h1>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <MatchFRATeam/>
                      <MatchScore/>
                      <MatchARGTeam/>
                    </div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      textAlign: 'center',
                      marginTop: 20,
                    }}>
                      <div><MatchResult/></div>
                      <div><MatchDate/></div>
                      <div>
                        <Button type='primary' style={{ marginTop: '20px' }} onClick={this.handleSequencage}>{i18n.t('HomeV2.carousel.fake_editing.button')}</Button>
                      </div>
                    </div>
                  </Fragment>
                )}
                <Fragment>
                  <TutorialPDFCard tutorialTitle={i18n.t('HomeV2.carousel.tutorials.pdf_tutorial_title')} imgSrc={'https://d1ceovtllg6jml.cloudfront.net/pdf.svg'} link={'/coach/tutorial/pdf'} />
                </Fragment>
                <Fragment>
                  <TutorialPDFCard tutorialTitle={i18n.t('HomeV2.carousel.tutorials.video_tutorial_title')} imgSrc={'https://d1ceovtllg6jml.cloudfront.net/educational-video.svg'} link={'/coach/tutorial/video'}/>
                </Fragment>
              </Slider>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default initialProps => {
  const { dispatch, coach } = useStoreon('coach')
  return React.createElement(FakeMatchCard, {
    ...initialProps,
    dispatch,
    coach,
  })
}
