import React from 'react'
import { Divider, InputNumber, Radio, Collapse, Input, Row, Col } from 'antd'
import { useStoreon } from 'storeon/react'
import Section from '../MatchSheet/section'
import EditableList from '../MatchSheet/editableList'
import VideoWhitelist from '../VideoWhitelist'
import { callApi } from '@/utils/callApi'
import TierModal from '../../TierModal'
import i18n from 'i18n-js'
import '@/i18n'
import { throttle } from 'lodash'

const { Panel } = Collapse
const { TextArea } = Input

class TrainingSettings extends React.PureComponent {

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
    const { training } = this.props
    const coachId = this.props.coach._id

    // TODO: CREATE ACTION
    callApi(`${coachId}/training/${training._id}/video/privacy`, 'put', data).then(data => {
      this.props.dispatch('trainings/setTraining', Object.assign({}, training, data))
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
    const { coach, training } = this.props
    const plus = this.state.newPlus !== undefined ? this.state.newPlus : training.plus
    const minus = this.state.newMinus !== undefined ? this.state.newMinus : training.minus
    const comment = this.state.newComment !== undefined ? this.state.newComment : training.comment
    const note = parseInt(this.state.newNote !== undefined ? this.state.newNote : training.note, 10)

    const payload = {
      plus: Array.isArray(plus) ? plus : [],
      minus: Array.isArray(minus) ? minus : [],
      comment: typeof comment === 'string' ? comment : undefined,
      note: !Number.isNaN(note) ? note : undefined,
    }
    // TODO: Create Action
    callApi(`${coach._id}/training/${training._id}/data`, 'put', payload).then(data => {
      const t = Object.assign({}, training, data)
      this.props.dispatch('trainings/setTraining', t)
      this.props.dispatch('notifications/success', i18n.t('Common_word.sheet_updated'))
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
    const training = this.props.training

    const plus = this.state.newPlus !== undefined ? this.state.newPlus : training.plus
    const minus = this.state.newMinus !== undefined ? this.state.newMinus : training.minus
    const comment = this.state.newComment !== undefined ? this.state.newComment : training.comment
    const note = parseInt(this.state.newNote !== undefined ? this.state.newNote : training.note, 10)

    return (
      <Section title={i18n.t('Common_word.analysis')}>
        <Row gutter={16}>
          <Col span={24}>
            <h3>{i18n.t('Sheets.training.training_rating')}</h3>
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
        <Row style={{ width: '100%', margin: '20px 0' }} gutter={16}>
          <Col span={24}>
            <h3>{i18n.t('Common_word.commentary')}</h3>
            <TextArea autosize={{ minRows: 4 }} value={comment} onChange={evt => this.handleAnalyseFieldChange({ newComment: evt.target.value })} />
          </Col>
        </Row>
        <Row style={{ width: '100%' }} gutter={16}>
          <Col span={12}>
            <h3>{i18n.t('Sheets.team_strength')}</h3>
            <EditableList addLabel={i18n.t('Sheets.add_strength')} items={plus} onChange={items => this.handleAnalyseFieldChange({ newPlus: items })} />
          </Col>
          <Col span={12}>
            <h3>{i18n.t('Sheets.team_weakness')}</h3>
            <EditableList addLabel={i18n.t('Sheets.add_weakness')} items={minus} onChange={items => this.handleAnalyseFieldChange({ newMinus: items })} />
          </Col>
        </Row>
      </Section>
    )
  }

  render () {
    const PrivacySection = this.renderPrivacySection
    const AnalyseSection = this.renderAnalyseSection

    return (
      <Section title={i18n.t('Sheets.training.training_infos')}>
        <PrivacySection />
        <AnalyseSection />
      </Section>
    )
  }
}

export default (initialProps) => {
  const { dispatch, coach } = useStoreon('coach')
  const video = initialProps.training.url !== '' ? initialProps.training : undefined
  const props = {
    ...initialProps,
    dispatch,
    video,
    coach,
  }
  return React.createElement(TrainingSettings, props)
}
