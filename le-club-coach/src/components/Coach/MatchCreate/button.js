import React from 'react'
import { connectStoreon } from 'storeon/react'
import { Button, Modal } from 'antd'
import MatchCreateForm from './form'
import { callApi } from '@/utils/callApi'
import i18n from 'i18n-js'
import '@/i18n'
import './match_create.scss'

class MatchCreateButton extends React.PureComponent {

  state = {
    opened: false,
  }

  openModal = () => {
    this.setState({ opened: true })
  }

  closeModal = () => {
    this.setState({ opened: false })
  }

  createMatch = () => {
    this.formRef.validateFields((errors, value) => {
      if (errors) {
        return
      }

      const coachId = this.props.coach._id
      const { season, team } = this.props.coachSeason.currentSeason

      const payload = {
        season,
        myTeam: team,
      }

      if (value.type === 'custom') {
        payload.oppositeTeam = value.oppositeTeam
        payload.date = value.date
        payload.isHome = value.isHome
      }

      callApi(`${coachId}/match/new/${value.type}`, 'post', payload).then(data => {
        this.props.dispatch('matches/setMatch', {
          matchId: data.match._id,
          match: data.match,
        })
        this.formRef.resetFields()
        this.closeModal()
      })
    })
  }

  render () {
    return (
      <React.Fragment>
        <Button onClick={this.openModal} icon='plus' className={'match_create_button'}>{i18n.t('MatchCreate.title')}</Button>
        <Modal
          title={i18n.t('MatchCreate.title')}
          visible={this.state.opened}
          onCancel={this.closeModal}
          onOk={this.createMatch}
          okText={i18n.t('MatchCreate.create_confirmation')}
          cancelText={i18n.t('Common_word.cancel')}
        >
          <MatchCreateForm ref={ref => this.formRef = ref} />
        </Modal>
      </React.Fragment>
    )
  }
}

export default connectStoreon('coachSeason', 'coach', MatchCreateButton)
