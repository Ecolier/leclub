import React, { useEffect, Component } from 'react'
import { loginCoach } from '@/actions/coach'
import { Form, Input, Icon, Spin } from 'antd'
import { Formik } from 'formik'
import { StoreContext, connectStoreon, customContext, useStoreon } from 'storeon/react' 
import { getQueryStringValue } from '@/utils/helper'
import i18n from 'i18n-js'
import '@/i18n.js'

const FormItem = Form.Item

import './index.css'

const makeField = Component => ({ err, placeholder, children, type, icon, style, ...rest }) => {
  const hasError = err
  return (
    <FormItem
      className='login-input'
      validateStatus={hasError ? 'error' : 'success'}
      hasFeedback={!!hasError}
      help={hasError && err}
    >
      <Input style={style} prefix={<Icon type={icon} style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder={placeholder} {...rest} children={children} type={type} />
    </FormItem>
  )
}

const AInput = makeField(Input)

class Login extends Component {

  state = {
    loading: false,
  }

  validate = values => {
    const errors = {}
    const requiredFields = ['email', 'password']

    requiredFields.forEach(field => { if (!values[field]) { errors[field] = 'Required' } })

    return errors
  }

  onSubmit = event => {
    this.setState({ loading: true }, async () => {
      if (this.props.mobile.pushToken) {
        event.pushToken = this.props.mobile.pushToken
      }
      await loginCoach(event)
      this.setState({ loading: false })
    })
  }

  render () {
    return (
      <div className='login-page'>
        <h1 className='login-title'>{i18n.t('Common_word.coachGreetings')}</h1>
        <div className='section-separator' style={{ backgroundColor: '#2CC1EB', marginBottom: '20px' }} />
        <div className='login-modal'>
          <Spin spinning={this.state.loading} size='large'>
            <Formik
              initialValues={{ name: '', departement: '', region: '' }}
              validate={this.validate}
              onSubmit={this.onSubmit}>
              {({
                values,
                errors,
                handleSubmit,
                handleChange,
              }) => (
                <Form className='signupForm' title={i18n.t('Header.connexionButton')} onSubmit={handleSubmit}>
                  <p style={{ alignSelf: 'start', marginTop: '5px', marginBottom: '5px' }}>{i18n.t('Common_word.email')}</p>
                  <AInput onChange={handleChange} err={errors.email} name='email' placeholder={i18n.t('Common_word.email')} label={i18n.t('Common_word.email')} type='email' icon={'user'} />
                  <p style={{ alignSelf: 'start', marginTop: '5px', marginBottom: '5px' }}>{i18n.t('Common_word.password')}</p>
                  <AInput onChange={handleChange} err={errors.password} name='password' style={{ marginBottom: '20px' }} placeholder={i18n.t('Common_word.password')} icon={'lock'} label={i18n.t('Common_word.password')} type='password' />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button className='b-button' htmlType='submit' type='submit'>{i18n.t('Header.connexionButton')}</button>
                    <a style={{ marginTop: '15px', textDecoration: 'underline', cursor: 'pointer' }} href='newpassword' onClick={() => this.props.dispatch(router.navigate, '/newpassword')}>{i18n.t('Common_word.forgotPassword')}</a>
                    {!this.props.mobile.isOnIOS && <a style={{ marginTop: '15px', textDecoration: 'underline', cursor: 'pointer' }} href='inscription' onClick={() => this.props.dispatch(router.navigate, '/inscription')}>{i18n.t('Header.inscriptionButton')}</a>}
                  </div>
                </Form>
              )}
            </Formik>
          </Spin>
        </div>
      </div>
    )
  }
}

export default initialProps => {
  const { dispatch, mobile } = useStoreon('mobile')
  useEffect(() => {
    dispatch('mobile/setPushToken', getQueryStringValue('pushToken'))
  }, [])
  const props = {
    ...initialProps,
    dispatch,
    mobile,
  }
  return <Login {...props} />
}
