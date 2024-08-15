import React from 'react'
import { Divider, InputNumber, DatePicker, Radio, Button, Collapse, Input, Row, Col, notification } from 'antd'
import { useStoreon } from 'storeon/react'
import MatchSection from './section'
import VideoWhitelist from '../VideoWhitelist'
import { callApi } from '@/utils/callApi'
import { setMatchVideo, setMatch } from '@/actions/matches'
import EditableList from './editableList'
import TierModal from '../../TierModal'
import moment from 'moment'
import throttle from 'lodash/throttle'
import i18n from 'i18n-js'
import '@/i18n'

const { Panel } = Collapse
const { TextArea } = Input

class MatchSettings extends React.PureComponent {

  componentDidMount () {
    this._isMounted = true
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  state = {
    whitelistModal: false,
    tierModal: false,
    newScoreHome: undefined,
    newScoreAway: undefined,
    newComment: undefined,
    newPlus: undefined,
    newMinus: undefined,
    newGlobalNote: undefined,
  }

  updateVideoPrivacy = (data) => {
    const { video, match, isHome } = this.props
    const coachId = this.props.coach._id
    const videoId = video._id

    callApi(`${coachId}/video/${videoId}/privacy`, 'put', data).then(data => {
      setMatchVideo({
        matchId: match._id,
        videoHome: isHome ? data.video : undefined,
        videoAway: !isHome ? data.video : undefined,
      })
      notification.success({
        message: i18n.t('Common_word.settings_saved'),
      })
    })
  }

  handleScoreUpdate = (data) => {
    const coachId = this.props.coach._id
    const match = this.props.match
    const matchId = match._id
    callApi(`${coachId}/match/${matchId}/score`, 'put', data).then(() => {
      match.scoreHome.score = data.scoreHome
      match.scoreAway.score = data.scoreAway
      setMatch({
        matchId,
        match,
      })
    })
  }

  renderSection = ({ children, title }) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 1200 }}>
        <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>{ title }</div>
        <div style={{ display: 'flex', width: '100%', alignItems: 'center', flexDirection: 'column' }}>{ children }</div>
        <Divider />
      </div>
    )
  }

  renderScoreSection = () => {
    const Section = this.renderSection
    const { match } = this.props

    if (moment(match.date).isAfter(moment())) {
      return null
    }

    const scoreHome = match.scoreHome.score
    const scoreAway = match.scoreAway.score

    const newScoreHome = this.state.newScoreHome !== undefined ? this.state.newScoreHome : scoreHome
    const newScoreAway = this.state.newScoreAway !== undefined ? this.state.newScoreAway : scoreAway

    const canUpdateScore = (
      newScoreHome !== scoreHome
      || newScoreAway !== scoreAway
    )

    return (
      <Section title={i18n.t('Sheets.match.match_score')}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ minWidth: 230 }}>
            <InputNumber value={newScoreHome} onChange={v => this.setState({ newScoreHome: v })} style={{ margin: '0 10px' }} min={0} />
            <span>-</span>
            <InputNumber value={newScoreAway} onChange={v => this.setState({ newScoreAway: v })} style={{ margin: '0 10px' }} min={0} />
          </div>
        </div>
        {canUpdateScore && (
          <Button type='primary' onClick={() => this.handleScoreUpdate({ scoreHome: newScoreHome, scoreAway: newScoreAway })} style={{ margin: 20 }}>{i18n.t('Sheets.match.update_match_score')}</Button>
        )}
      </Section>
    )
  }

  renderDateSection = () => {
    const Section = this.renderSection
    const { match } = this.props

    if (match.type !== 'custom') {
      return null
    }

    return (
      <Section title={i18n.t('Sheets.match.match_date')}>
        <DatePicker />
      </Section>
    )
  }

  handleWhitelistChange = (data) => {
    const { video } = this.props
    this.setState({ whitelistModal: false })
    const diff = [
      ...video.whitelist.filter(id => data?.whitelist.indexOf(id) === -1),
      ...data.whitelist.filter(id => video?.whitelist.indexOf(id) === -1),
    ]
    const shouldUpdate = (
      diff.length > 0
      || video.isPublic !== data.privacy
    )
    if (shouldUpdate) {
      this.updateVideoPrivacy(data)
    }
  }

  openWhitelist = () => {
    this.setState({ whitelistModal: true })
  }

  toggleTierModal = () => {
    this.setState({ tierModal: !this.state.tierModal })
  }

  handlePrivacyChange = (privacy) => {
    const { video, coach } = this.props
    if (privacy === 'private' && !coach.privateActivate) {
      return this.toggleTierModal()
    }
    const data = {
      privacy,
      whitelist: video.whitelist,
    }
    this.updateVideoPrivacy(data)
  }

  saveAnalyseSheet = throttle(() => {
    const { sheet, coach, match } = this.props
    const plus = this.state.newPlus !== undefined ? this.state.newPlus : sheet.plus
    const minus = this.state.newMinus !== undefined ? this.state.newMinus : sheet.minus
    const comment = this.state.newComment !== undefined ? this.state.newComment : sheet.comment
    const note = parseInt(this.state.newNote !== undefined ? this.state.newNote : sheet.note, 10)

    const payload = {
      plus: Array.isArray(plus) ? plus : [],
      minus: Array.isArray(minus) ? minus : [],
      comment: typeof comment === 'string' ? comment : undefined,
      note: !Number.isNaN(note) ? note : undefined,
    }
    callApi(`${coach._id}/match/${match._id}/sheet`, 'put', payload).then(res => {
      if (this._isMounted) {
        this.props.onSheetUpdate && this.props.onSheetUpdate(payload)
      }
    })
  }, 2500)

  renderTierModal = () => {
    if (!this.state.tierModal) {
      return null
    }
    return <TierModal close={this.toggleTierModal} />
  }

  renderPrivacySection = () => {
    const Section = this.renderSection
    const TierModal = this.renderTierModal
    const { video, coach } = this.props
    if (!video || video.coach !== coach._id) {
      return null
    }
    return (
      <Section title={i18n.t('VideoPrivacyModal.video_privacy')}>
        <TierModal />
        <Radio.Group value={video.isPublic}>
          <Radio.Button value='private' onClick={() => this.handlePrivacyChange('private')}>{i18n.t('Common_word.private')}</Radio.Button>
          <Radio.Button value='public' onClick={() => this.handlePrivacyChange('public')}>{i18n.t('Common_word.public')}</Radio.Button>
        </Radio.Group>
        {video.isPublic === 'private' && (
          <Collapse style={{ width: '100%', textAlign: 'center', marginTop: 10 }}>
            <Panel header={i18n.t('VideoPrivacyModal.see_whitelist')}>
              <VideoWhitelist
                onChange={this.handleWhitelistChange}
                whitelist={video.whitelist}
                visible={this.state.whitelistModal}
              />
            </Panel>
          </Collapse>
        )}
      </Section>
    )
  }

  handleAnalyseFieldChange = (state) => {
    this.setState(state, this.saveAnalyseSheet)
  }

  renderAnalyseSection = () => {
    const Section = this.renderSection
    const sheet = this.props.sheet

    const plus = this.state.newPlus !== undefined ? this.state.newPlus : sheet.plus
    const minus = this.state.newMinus !== undefined ? this.state.newMinus : sheet.minus
    const comment = this.state.newComment !== undefined ? this.state.newComment : sheet.comment
    const note = parseInt(this.state.newNote !== undefined ? this.state.newNote : sheet.note, 10)

    return (
      <Section title={i18n.t('Common_word.analysis')}>
        <Row style={{ width: '100%' }} gutter={16}>
          <Col span={24}>
            <h3>{i18n.t('Common_word.commentary')}</h3>
            <TextArea autosize={{ minRows: 4 }} value={comment} onChange={evt => this.handleAnalyseFieldChange({ newComment: evt.target.value })} />
          </Col>
        </Row>
        <Row style={{ width: '100%', margin: '20px 0' }} gutter={16}>
          <Col span={12}>
            <h3>{i18n.t('Sheets.team_strength')}</h3>
            <EditableList addLabel={i18n.t('Sheets.add_strenght')} setToStart items={plus} onChange={items => this.handleAnalyseFieldChange({ newPlus: items })} />
          </Col>
          <Col span={12}>
            <h3>{i18n.t('Sheets.team_weakness')}</h3>
            <EditableList addLabel={i18n.t('Sheets.add_weakness')} setToStart items={minus} onChange={items => this.handleAnalyseFieldChange({ newMinus: items })} />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <h3>{i18n.t('Sheets.team_rating')}</h3>
            <InputNumber
              value={note}
              min={0}
              max={10}
              style={{ width: 200 }}
              parser={v => {
                const matches = v.match(/(\d+)/)
                if (!matches) {
                  return undefined
                }
                const value = parseInt(matches[0], 10)
                return Math.min(Math.max(value, 0), 10)
              }}
              formatter={value => (!value && value !== 0) ? i18n.t('Common_word.no_rating') : value}
              onChange={v => {
                if (v === null) {
                  v = undefined
                }
                this.handleAnalyseFieldChange({ newNote: v })
              }}
            />
          </Col>
        </Row>
      </Section>
    )
  }

  render () {
    const ScoreSection = this.renderScoreSection
    const PrivacySection = this.renderPrivacySection
    const AnalyseSection = this.renderAnalyseSection

    return (
      <MatchSection title={i18n.t('Sheets.match.match_infos')}>
        <ScoreSection />
        <PrivacySection />
        <AnalyseSection />
      </MatchSection>
    )
  }
}

export default (initialProps) => {
  const { dispatch, coachSeason, coach } = useStoreon('coachSeason', 'coach')
  const { currentSeason } = coachSeason
  const isHome = currentSeason.team === initialProps.match.teamHome._id
  const video = isHome ? initialProps.match.videoHome : initialProps.match.videoAway
  const props = {
    ...initialProps,
    dispatch,
    coach,
    video,
    isHome,
  }

  return React.createElement(MatchSettings, props)
}
