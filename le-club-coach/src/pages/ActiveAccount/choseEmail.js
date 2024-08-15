import React, { Component } from 'react'
import { useStoreon } from 'storeon/react'
import { Input, Button, notification, Spin } from 'antd'
import { callApi } from '@/utils/callApi.js'
import i18n from 'i18n-js'
import '@/i18n.js'

class ActiveAccount extends Component {

  state = {
    type: 'coach',
    email: '',
    loading: false,
  }

  onSubmit = () => {
    if (this.state.email) {
      this.setState({ loading: true })
      callApi(`settings/newPassword/${this.state.email.toLowerCase()}?type=${this.state.type}`, 'get').then(res => {
        this.setState({ loading: false })

        notification.success({
          message: i18n.t('Common_word.emailSend'),
          description: res.message,
        })
      }).catch((error) => {
        this.setState({ loading: false })

        notification.error({
          message: i18n.t('Common_word.serverError'),
          description: error,
        })
      })
    } else {
      this.setState({ loading: false })

      notification.error({
        message: i18n.t('UserForm.emailErrors.empty'),
        description: i18n.t('UserForm.emailErrors.invalidEmail'),
      })
    }
  }

  render () {
    return (
      <div className={'loginPage'}>
        <Spin spinning={this.state.loading} size='large'>
          <div className={'loginModal'}>
            <div style={{ padding: '20px', marginTop: '30px' }}>
              <h1 style={{ textAlign: 'center' }}>{i18n.t('Common_word.yourEmail')}: </h1>
              <Input onChange={(e) => { this.setState({ email: e.target.value }) }} />
              <Button htmlType='submit' className='send-button' type='submit' onClick={this.onSubmit} >
                {i18n.t('Common_word.newPassword')}
              </Button>
            </div>
          </div>
        </Spin>
        <a style={{ marginTop: '15px', marginLeft: '10px', textDecoration: 'underline', cursor: 'pointer' }} href='login'>{i18n.t('Header.connexionButton')}</a>
      </div>
    )
  }
}

export default initialProps => {
  const { dispatch } = useStoreon()
  const props = {
    ...initialProps,
    dispatch,
  }
  return <ActiveAccount {...props} />
}
