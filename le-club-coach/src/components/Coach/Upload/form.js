import React from 'react'
import { useStoreon } from 'storeon/react'
import { Divider, Upload, Radio, Icon, Button, Row, Col } from 'antd'
import { uploadVideo } from '@/actions/upload'
import VideoWhitelist from '../VideoWhitelist'
import TierModal from '../../TierModal'
import MediaModal from '../../MediaModal'
import i18n from 'i18n-js'
import '@/i18n'

// NOTE:
// We should generate watermark composition on the client side and upload it in s3 before uploading video
// since qencode allow us to use only one watermark

class UploadForm extends React.PureComponent {

  state = {
    tierModal: false,
    privacy: 'public',
    whitelistModal: false,
    whitelist: [],
    previewItem: undefined,
    sponsorFile: undefined,
  }

  files = []

  startUpload = () => {
    if (this.props.match) {
      return this.startMatchUpload()
    }
    if (this.props.training) {
      return this.startTrainingUpload()
    }
  }

  removePreview = () => {
    if (this.state.previewItem) {
      URL.revokeObjectURL(this.state.previewItem.url)
    }
    this.setState({
      previewItem: undefined,
    })
  }

  startTrainingUpload = () => {
    if (this.files.length === 0) {
      return
    }

    const trainingId = this.props.training._id
    const coachId = this.props.coach._id
    const season = this.props.currentSeason.season

    this._emit('onUploadStart')
    uploadVideo({
      trainingId,
      coachId,
      season,
      teamId: this.props.currentSeason.team,
      privacy: this.state.privacy,
      whitelist: this.state.whitelist,
      files: this.files,
      sponsorFile: this.state.sponsorFile,
    })
    // this.props.dispatch(push(`/coach?mode=training&training=${trainingId}&season=${season}`))
  }

  startMatchUpload = () => {
    if (this.files.length === 0) {
      return
    }

    const matchId = this.props.match._id
    const coachId = this.props.coach._id
    const season = this.props.currentSeason.season

    this._emit('onUploadStart')

    uploadVideo({
      matchId,
      coachId,
      season,
      teamId: this.props.currentSeason.team,
      privacy: this.state.privacy,
      whitelist: this.state.whitelist,
      files: this.files,
      sponsorFile: this.state.sponsorFile,
    })
    // this.props.dispatch(push(`/coach?mode=match&match=${matchId}&season=${season}`))
  }

  _emit (event, ...data) {
    if (this.props[event]) {
      this.props[event](...data)
    }
  }

  handleFileChange = (evt) => {
    const file = evt.file
    if (file.status !== 'removed') {
      return this.files.push(file)
    }
    const index = this.files.findIndex(f => f.uid === file.uid)
    if (index >= 0) {
      this.files.splice(index, 1)
    }
  }

  handlePrivacyChange = (evt) => {
    const privacy = evt.target.value
    if (privacy === 'private' && !this.props.coach.privateActivate) {
      return
    }
    this.setState({ privacy: evt.target.value })
  }

  handleWhitelistChange = ({ privacy, whitelist }) => {
    this.setState({ privacy, whitelist, whitelistModal: false })
  }

  handleCloseTierModal = () => {
    return this.setState({ tierModal: false })
  }

  openWhitelist = () => {
    if (!this.props.coach.privateActivate) {
      return this.setState({ tierModal: true })
    }
    this.setState({ whitelistModal: true })
  }

  renderWhitelist = () => {
    return (
      <VideoWhitelist
        modal
        onChange={this.handleWhitelistChange}
        whitelist={this.state.whitelist}
        visible={this.state.whitelistModal}
      />
    )
  }

  renderTierModal = () => {
    if (!this.state.tierModal) {
      return null
    }
    return <TierModal close={this.handleCloseTierModal} />
  }

  handlePreview = (file) => {
    const item = this.state.previewItem
    if (item) {
      URL.revokeObjectURL(item.url)
    }
    this.setState({
      previewItem: {
        title: file.name,
        type: file.type,
        url: URL.createObjectURL(file.originFileObj ? file.originFileObj : file),
      },
    })
    return false
  }

  handlePreviewClose = () => {
    const item = this.state.previewItem
    if (!item) {
      return
    }
    URL.revokeObjectURL(item.url)
    this.setState({ previewItem: undefined })
  }

  renderPreviewModal = () => {
    const item = this.state.previewItem
    if (!item) {
      return null
    }
    return (
      <MediaModal
        visible
        title={item.title}
        url={item.url}
        type={item.type}
        onClose={this.handlePreviewClose}
      />
    )
  }

  handleSponsorFileChange = evt => {
    const file = evt.fileList.pop()
    this.setState({ sponsorFile: file ? file.originFileObj : undefined })
  }

  getSponsorFileList = () => {
    if (this.state.sponsorFile) {
      return [this.state.sponsorFile]
    }
    return []
  }

  render () {
    const Whitelist = this.renderWhitelist
    const TierModal = this.renderTierModal
    const PreviewModal = this.renderPreviewModal

    return (
      <React.Fragment>
        <Whitelist />
        <TierModal />
        <PreviewModal />
        <Row gutter={16}>
          <Col>
            <Upload.Dragger onChange={this.handleFileChange} beforeUpload={() => false} listType='picture' onPreview={this.handlePreview} multiple>
              <p className='ant-upload-drag-icon'>
                <Icon type='video-camera' />
              </p>
              <p className='ant-upload-text'>{i18n.t('VideoPrivacyModal.description')}</p>
            </Upload.Dragger>
          </Col>
          <Col>
            <Divider>{i18n.t('VideoPrivacyModal.video_privacy')}</Divider>
            <Radio.Group value={this.state.privacy} onChange={this.handlePrivacyChange} style={{ display: 'flex', justifyContent: 'center' }}>
              <Radio.Button value='private' onClick={this.openWhitelist}>{i18n.t('Common_word.private')}</Radio.Button>
              <Radio.Button value='public'>{i18n.t('Common_word.public')}</Radio.Button>
            </Radio.Group>
          </Col>
          {this.props.coach.accountType !== 'T0' && (
            <Col>
              <Divider>{i18n.t('VideoPrivacyModal.sponsor_logo')}</Divider>
              <Upload.Dragger
                fileList={this.getSponsorFileList()}
                listType='picture'
                accept='image/*'
                onChange={this.handleSponsorFileChange}
                beforeUpload={() => false}
                onPreview={this.handlePreview}
              >
                <p className='ant-upload-drag-icon'>
                  <i className='fas fa-ad' style={{ fontSize: 32, color: '#EA178C' }} />
                </p>
                <p className='ant-upload-text'>{i18n.t('VideoPrivacyModal.sponsor_logo_description')}</p>
              </Upload.Dragger>
            </Col>
          )}
          <Col>
            <Divider />
            <Button style={{ width: '100%' }} onClick={this.startUpload}>{i18n.t('VideoPrivacyModal.send_video')}</Button>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default React.forwardRef((initialProps, ref) => {
  const { dispatch, coach, coachSeason } = useStoreon('coach', 'coachSeason')
  return React.createElement(UploadForm, {
    ...initialProps,
    ref,
    dispatch,
    coach,
    currentSeason: coachSeason.currentSeason,
  })
})
