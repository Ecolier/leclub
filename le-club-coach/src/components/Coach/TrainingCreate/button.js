import React from 'react'
import { useStoreon } from 'storeon/react'
import { Button, Modal } from 'antd'
import TrainingCreateForm from './form'
import { callApi } from '@/utils/callApi'
import i18n from 'i18n-js'
import '@/i18n'

class TrainingCreateButton extends React.PureComponent {

  state = {
    opened: false,
  }

  openModal = () => {
    this.setState({ opened: true })
  }

  closeModal = () => {
    this.setState({ opened: false })
  }

  createTraining = () => {
    this.formRef.validateFields((errors, value) => {
      if (errors) {
        return
      }
      const coachId = this.props.coach._id
      const team = this.props.currentSeason.team
      const season = this.props.currentSeason.season
      const payload = {
        team,
        season,
        ...value,
      }
      callApi(`${coachId}/training`, 'post', payload).then((data) => {
        this.closeModal()
        this.formRef.resetFields()
        this.props.dispatch('trainings/setTraining', data.training)
      })
    })
  }

  render () {
    return (
      <React.Fragment>
        <Button onClick={this.openModal} icon='plus'>{i18n.t('TrainingCreate.title')}</Button>
        <Modal
          title={i18n.t('TrainingCreate.title')}
          visible={this.state.opened}
          onCancel={this.closeModal}
          onOk={this.createTraining}
          okText={i18n.t('TrainingCreate.create_confirmation')}
          cancelText={i18n.t('Common_word.cancel')}
        >
          <TrainingCreateForm ref={ref => this.formRef = ref} />
        </Modal>
      </React.Fragment>
    )
  }
}

export default (initialProps) => {
  const { dispatch, coachSeason, coach } = useStoreon('coachSeason', 'coach')
  const { currentSeason } = coachSeason
  const props = {
    ...initialProps,
    dispatch,
    currentSeason,
    coach,
  }
  return <TrainingCreateButton {...props} />
}
