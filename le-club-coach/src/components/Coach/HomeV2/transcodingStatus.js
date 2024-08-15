import React from 'react'
import { UPLOAD_STATE } from '@/actions/upload'
import { Progress, Icon, Tooltip } from 'antd'
import i18n from 'i18n-js'
import '@/i18n'

class TranscodingStatus extends React.PureComponent {

  getPercent () {
    const { upload } = this.props.match

    switch (upload.state) {
    case UPLOAD_STATE.VIDEO_UPLOADING:
    case UPLOAD_STATE.TRANSCODING:
      return upload.percent
    case UPLOAD_STATE.VIDEO_UPLOADING_COMPLETED:
    case UPLOAD_STATE.TRANSCODING_COMPLETED:
    case UPLOAD_STATE.COMPLETED:
      return 100
    default:
      return 0
    }
  }

  getStateMessage () {
    const { upload } = this.props.match

    switch (upload.state) {
    case UPLOAD_STATE.VIDEO_UPLOADING:
      return `${i18n.t('Upload.transcodingStatus.VIDEO_UPLOADING')}: ${upload.percent}%`
    case UPLOAD_STATE.VIDEO_UPLOADING_COMPLETED:
      return i18n.t('Upload.transcodingStatus.VIDEO_UPLOADING_COMPLETED')
    case UPLOAD_STATE.VIDEO_UPLOADING_ERROR:
      return i18n.t('Upload.transcodingStatus.VIDEO_UPLOADING_ERROR')
    case UPLOAD_STATE.TRANSCODING:
      return `${i18n.t('Upload.transcodingStatus.TRANSCODING')}: ${upload.percent}%`
    case UPLOAD_STATE.TRANSCODING_WAITING:
      return i18n.t('Upload.transcodingStatus.TRANSCODING_WAITING')
    case UPLOAD_STATE.TRANSCODING_COMPLETED:
      return `${i18n.t('Upload.transcodingStatus.TRANSCODING_COMPLETED')}: 100%`
    case UPLOAD_STATE.TRANSCODING_ERROR:
      return i18n.t('Upload.transcodingStatus.TRANSCODING_ERROR')
    case UPLOAD_STATE.COMPLETED:
      return i18n.t('Upload.transcodingStatus.COMPLETED')
    default:
      return undefined
    }
  }

  renderStateIcon () {
    const { upload } = this.props.match

    switch (upload.state) {
    case UPLOAD_STATE.VIDEO_UPLOADING:
    case UPLOAD_STATE.VIDEO_UPLOADING_COMPLETED:
      return <Icon type='upload' />
    case UPLOAD_STATE.TRANSCODING:
    case UPLOAD_STATE.TRANSCODING_COMPLETED:
      return <Icon type='sync' spin />
    case UPLOAD_STATE.VIDEO_UPLOADING_ERROR:
    case UPLOAD_STATE.TRANSCODING_ERROR:
      return <Icon type='close' />
    case UPLOAD_STATE.COMPLETED:
      return <Icon type='check' />
    default:
      return <Icon type='loading' />
    }
  }

  render () {
    if (!this.props.match.upload) {
      return null
    }
    return (
      <Tooltip title={this.getStateMessage()}>
        <Progress type='circle' percent={this.getPercent()} width={24} format={() => this.renderStateIcon()} />
      </Tooltip>
    )
  }
}

export default TranscodingStatus
