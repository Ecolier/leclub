import React, { Component } from 'react'
import { useStoreon } from 'storeon/react'
import { Modal } from 'antd'
import PrivacyForm from './index'
import TierModal from '../TierModal'
import i18n from 'i18n-js'
import '@/i18n'
import './modal.scss'

class PrivacyVideoModal extends Component {

  handleCancel = () => {
    if (!this.formRef) {
      const privateActivate = this.props.coach && this.props.coach.privateActivate
      return this.props.savePrivacy && (
        this.props.savePrivacy(!privateActivate ? 'public' : this.props.isPublic, this.props.list)
      )
    }
    this.formRef.refs.wrappedInstance.preSave()
  }

  render () {
    return (
      <Modal
        closable={false}
        destroyOnClose
        visible={this.props.visible}
        onCancel={this.handleCancel}
        footer={null}
        title={i18n.t('Common_word.add_players')}>
        {this.props.coach && this.props.coach.privateActivate ? (
          <PrivacyForm {...this.props} ref={ref => this.formRef = ref} />
        ) : (
          <TierModal close={this.handleCancel} />
        )}
      </Modal>
    )
  }
}

export default (initialProps) => {
  const { coach } = useStoreon('coach')
  const props = {
    ...initialProps,
    coach,
  }
  return <PrivacyVideoModal {...props} />
}
