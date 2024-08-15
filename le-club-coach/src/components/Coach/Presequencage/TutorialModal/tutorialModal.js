import React from 'react'
import { Modal } from 'antd'
import i18n from 'i18n-js'
import './tutorialModal.scss'

const TutorialModal = props => {
  const { closeTutorialModal, tutorialModalVisible } = props

  return (
    <Modal
      title={i18n.t('Presequencage.tutorialModal.modalTitle')}
      visible={tutorialModalVisible}
      onOk={() => closeTutorialModal(false)}
      onCancel={() => closeTutorialModal(false)}
      footer={null}>
      <div>
        <h2>{i18n.t('Presequencage.tutorialModal.title')}</h2>
        <div className={'tutorial-modal-paragraph'}>
          <ul>
            <li>{i18n.t('Presequencage.tutorialModal.oneTapExplanation')}</li>
            <li>{i18n.t('Presequencage.tutorialModal.twoTapExplanation')}</li>
            <li>{i18n.t('Presequencage.tutorialModal.addNumbers')}</li>
          </ul>
        </div>
        <div className={'tutorial-modal-paragraph'}>
          <ul>
            <li>{i18n.t('Common_word.the_button')} <b className={'bold_word'}>{i18n.t('Common_word.start')}</b> {i18n.t('Presequencage.tutorialModal.chronoStartExplanation')}</li>
            <li>{i18n.t('Common_word.the_button')} <b className={'bold_word'}>{i18n.t('Common_word.stop')}</b> {i18n.t('Presequencage.tutorialModal.chronoStopExplanation')}</li>
            <li>{i18n.t('Common_word.the_button')} <b className={'bold_word'}>{i18n.t('Common_word.reset')}</b> {i18n.t('Presequencage.tutorialModal.chronoResetExplanation')}</li>
            <li>{i18n.t('Common_word.the_button')} <b className={'bold_word'}>{i18n.t('Common_word.end')}</b> {i18n.t('Presequencage.tutorialModal.chronoEndExplanation')}</li>
          </ul>
        </div>
        <p>{i18n.t('Presequencage.tutorialModal.videoExplanation')}</p>
      </div>
    </Modal>
  )
}

export default TutorialModal
