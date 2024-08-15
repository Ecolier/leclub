import React from 'react'
import { Modal, Button } from 'antd'
import UploadForm from './form'
import i18n from 'i18n-js'
import '@/i18n'

export class UploadModalButton extends React.PureComponent {

  state = {
    opened: false,
  }

  openModal = () => {
    this.setState({ opened: true })
  }

  closeModal = () => {
    this.setState({ opened: false })
  }

  handleUploadStart = (...args) => {
    this.closeModal()
    this.props.onUploadStart && this.props.onUploadStart(...args)
  }

  render () {
    return (
      <React.Fragment>
        <UploadModal visible={this.state.opened} onUploadStart={this.handleUploadStart} onCancel={this.closeModal} match={this.props.match} training={this.props.training} />
        {!this.props.noButton && (
          <Button {...this.props.button} onClick={this.openModal}>{ this.props.children }</Button>
        )}
        {this.props.noButton && (
          <div onClick={this.openModal}>
            { this.props.children }
          </div>
        )}
      </React.Fragment>
    )
  }
}

class UploadModal extends React.PureComponent {

  renderFooter = () => {
    return (
      <Button onClick={this.handleCancel}>{i18n.t('Common_word.cancel')}</Button>
    )
  }

  handleCancel = () => {
    if (this.props.onCancel) {
      this._form.removePreview()
      this.props.onCancel()
    }
  }

  handleRef = (ref) => {
    if (ref) {
      this._form = ref
    }
  }

  render () {
    const Footer = this.renderFooter
    return (
      <Modal {...this.props} keyboard={false} onCancel={this.handleCancel} title={i18n.t('Common_word.add_video')} footer={<Footer />}>
        <UploadForm
          training={this.props.training}
          match={this.props.match}
          onUploadStart={this.props.onUploadStart}
          ref={this.handleRef}
        />
      </Modal>
    )
  }
}

export default UploadModal
