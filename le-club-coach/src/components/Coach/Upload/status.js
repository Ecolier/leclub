import React from 'react'
import { UPLOAD_STATE } from '@/actions/upload'
import { Progress, Icon, Tooltip } from 'antd'

class UploadStatus extends React.PureComponent {

  static isCompleted (upload) {
    return upload.state === UPLOAD_STATE.COMPLETED
  }

  getPercent () {
    const { upload } = this.props

    switch (upload.state) {
    case UPLOAD_STATE.VIDEO_UPLOADING:
    case UPLOAD_STATE.TRANSCODING:
      return parseFloat(upload.percent.toFixed(2))
    case UPLOAD_STATE.VIDEO_UPLOADING_COMPLETED:
    case UPLOAD_STATE.TRANSCODING_COMPLETED:
    case UPLOAD_STATE.COMPLETED:
      return 100
    default:
      return 0
    }
  }

  getStateMessage () {
    const { upload } = this.props
    const percent = this.getPercent()

    switch (upload.state) {
    case UPLOAD_STATE.VIDEO_UPLOADING:
      return `Vidéo en cours d'envoi ${percent}%`
    case UPLOAD_STATE.VIDEO_UPLOADING_COMPLETED:
      return 'Vidéo envoyé avec succès'
    case UPLOAD_STATE.VIDEO_UPLOADING_ERROR:
      return 'Un problème est survenu lors de l\'envoi de la vidéo'
    case UPLOAD_STATE.TRANSCODING:
      return `Vidéo en cours de traitement ${percent}%`
    case UPLOAD_STATE.TRANSCODING_WAITING:
      return 'Vidéo en attente de traitement'
    case UPLOAD_STATE.TRANSCODING_COMPLETED:
      return 'Vidéo traitée avec succés'
    case UPLOAD_STATE.TRANSCODING_ERROR:
      return 'Le traitement de la vidéo a rencontrer un problème'
    case UPLOAD_STATE.COMPLETED:
      return 'Votre vidéo est maintenant sur LeClub!'
    default:
      return undefined
    }
  }

  renderStateIcon () {
    const { upload } = this.props
    const size = this.props.extended ? 24 : 12

    switch (upload.state) {
    case UPLOAD_STATE.VIDEO_UPLOADING:
    case UPLOAD_STATE.VIDEO_UPLOADING_COMPLETED:
      return <Icon type='upload' style={{ fontSize: size }} />
    case UPLOAD_STATE.TRANSCODING:
    case UPLOAD_STATE.TRANSCODING_COMPLETED:
      return <Icon type='sync' style={{ fontSize: size }} spin />
    case UPLOAD_STATE.VIDEO_UPLOADING_ERROR:
    case UPLOAD_STATE.TRANSCODING_ERROR:
      return <Icon type='close' style={{ fontSize: size }} />
    case UPLOAD_STATE.COMPLETED:
      return <Icon type='check' style={{ fontSize: size }} />
    default:
      return <Icon type='loading' style={{ fontSize: size }} />
    }
  }

  renderExtended () {
    const message = this.getStateMessage()
    const percent = this.getPercent()
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase' }}>{ message }</div>
        <div style={{ marginTop: 10 }}>
          <Progress type='circle' percent={percent} width={48} format={() => this.renderStateIcon()} />
        </div>
      </div>
    )
  }

  render () {
    if (!this.props.upload) {
      return null
    }
    if (this.props.extended) {
      return this.renderExtended()
    }
    return (
      <Tooltip title={this.getStateMessage()}>
        <Progress type='circle' percent={this.getPercent()} width={24} format={() => this.renderStateIcon()} />
      </Tooltip>
    )
  }
}

export default UploadStatus
