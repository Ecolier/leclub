import React, { Component } from 'react'
import { useStoreon } from 'storeon/react'
import { updateLogoCoverCoach, updateCoach } from '@/actions/coach.js'
import { Form, Input, Button, Tag, notification } from 'antd'
import SimplePicture from './simplePicture.js'
import { callApi } from '@/utils/callApi'
import ClubAutoComplete from '@/components/ClubAutoComplete'
import i18n from 'i18n-js'
import '@/i18n'

import { Formik } from 'formik'
const { TextArea } = Input

const FormItem = Form.Item

const WAIT_INTERVAL = 700

const makeField = Component => ({ err, label, placeholder, children, ...rest }) => {
  const hasError = err
  return (
    <FormItem
      label={label}
      validateStatus={hasError ? 'error' : 'success'}
      hasFeedback={!!hasError}
      help={hasError && err}
    >
      <Component {...rest} children={children} placeholder={placeholder} style={{ width: '100%', minHeight: '100px' }} />
    </FormItem>
  )
}

const makeFieldSmall = Component => ({ err, label, placeholder, children, ...rest }) => {
  const hasError = err
  return (
    <FormItem
      label={label}
      validateStatus={hasError ? 'error' : 'success'}
      hasFeedback={!!hasError}
      help={hasError && err}
    >
      <Component {...rest} children={children} placeholder={placeholder} style={{ width: '100%' }} />
    </FormItem>
  )
}

const AInput = makeFieldSmall(Input)
const PInput = makeField(TextArea)

class ProfileUpdate extends Component {

    state = {
      tagsPlayer: this.props.coach.playerCoached || [],
      tagsClubs: this.props.coach.trainedTeam || [],
    }

  onSubmit = event => {

    const body = {}
    body.playerCoached = this.state.tagsPlayer
    body.trainedTeam = this.state.tagsClubs
    body.biographie = event.biographie
    body.succesTitle = event.succesTitle
    body.succesValue = event.succesValue
    body.philosophie = event.philosophie
    body.playerCareer = event.playerCareer
    body.favoriteCoach = event.favoriteCoach
    updateCoach(this.props.coach._id, body)
  }

    handleSelectClubs = (id) => {
      callApi(`find/club/one/${id}`, 'get').then(body => {

        const { clubs, tagsClubs } = this.state
        tagsClubs.push({ name: body.club.name })
        this.setState({ tagsClubs })

      }).catch((error) => {
        notification.error({ message: i18n.t('Common_word.clubNotFound'), description: error })
      })
    }
    handleChange = (e) => {
      clearTimeout(this.timer)
      this.setState({ playerName: e })
      this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL)
    }

    render () {
      const { coach, initialValues } = this.props
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Formik
            initialValues={initialValues}
            validate={this.validate}
            onSubmit={this.onSubmit}
          >
            {({
              values,
              errors,
              handleSubmit,
              handleChange,
              initialValues,
            }) => (
              <form style={{ width: '100%', minHeight: '70vh', marginTop: '20px' }} title='profileForm' className='publicUpdate' onSubmit={handleSubmit}>
                {coach && (
                  <SimplePicture
                    id={coach._id}
                    url={coach.urlCover}
                    title={`${i18n.t('Common_word.coverImage')}:`}
                    urlBack={`coach/update/coverlogo/${coach._id}?mode=add&type=cover`}
                    handleRemove={() => { updateLogoCoverCoach(coach._id, 'cover') }}
                  />
                )}
                <PInput defaultValue={initialValues.biographie} onChange={handleChange} name='biographie' err={errors.biographie} label={i18n.t('Common_word.bio')} placeholder={i18n.t('Settings.bioPlaceholder')} type='Biographie'/>
                <PInput defaultValue={initialValues.philosophie} onChange={handleChange} name='philosophie' err={errors.philosophie} label={i18n.t('Common_word.philo')} placeholder={i18n.t('Settings.philoPlaceholder')} type='Philosophie'/>
                <PInput defaultValue={initialValues.playerCareer} onChange={handleChange} name='playerCareer' err={errors.playerCareer} label={i18n.t('Settings.player_career.title')} placeholder={i18n.t('Settings.player_career.placeholder')} type='Carrière'/>
                <AInput defaultValue={initialValues.favoriteCoach} onChange={handleChange} err={errors.favoriteCoach} name='favoriteCoach' label={i18n.t('Settings.favoriteCoach.title')} placeholder={i18n.t('Settings.favoriteCoach.title')} type='Favori'/>
                <h2>{i18n.t('Common_word.palmares')}</h2>
                <hr/>
                <AInput defaultValue={initialValues.succesTitle} onChange={handleChange} err={errors.succesTitle} name='succesTitle' label={i18n.t('Settings.successTitle.title')} placeholder={i18n.t('Settings.successTitle.title')} type='succesTitle'/>
                <AInput defaultValue={initialValues.succesValue} onChange={handleChange} err={errors.succesValue} name='succesValue' label={i18n.t('Common_word.score')}placeholder={i18n.t('Settings.scorePlaceholder')} type='succesValue'/>
                <label>{i18n.t('Common_word.last_team')}</label>
                <hr/>
                <ClubAutoComplete
                  onSelect={this.handleSelectClubs}
                />
                <div style={{ padding: '15px', height: 'auto', overflow: 'auto' }}>
                  {this.state.tagsClubs && this.state.tagsClubs.length !== 0 && (
                    this.state.tagsClubs.map((e, key) => {
                      return (
                        <Tag key={key} closable visible onClose={() => {
                          const tagsClubs = this.state.tagsClubs
                          tagsClubs.splice(key, 1)
                          this.setState({ tagsClubs })
                        }}>{e.name}</Tag>)
                    })
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: '25px', marginBottom: '100px' }}>
                  <Button type='primary' htmlType='submit' >
                    {i18n.t('Common_word.save')}
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      )
    }
}

export default initialProps => {
  const { dispatch, coach } = useStoreon('coach')
  const props = {
    ...initialProps,
    dispatch,
    coach,
  }
  return <ProfileUpdate {...props} />
}
