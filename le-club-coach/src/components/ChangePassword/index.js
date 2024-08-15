import React, { Component } from 'react'
import { Formik } from 'formik'
import { Form, Input, Button, Card } from 'antd'
const FormItem = Form.Item
import i18n from 'i18n-js'
import '@/i18n.js'

const makeField = Component => ({ err, label, placeholder, children, ...rest }) => {
  const hasError = err
  return (
    <FormItem
      label={label}
      validateStatus={hasError ? 'error' : 'success'}
      hasFeedback={!!hasError}
      help={hasError && err}
    >
      <Component {...rest} children={children} placeholder={placeholder} style={{ width: '90%' }} />
    </FormItem>
  )
}
const AInput = makeField(Input)

class ChangePassword extends Component {

  validate = values => {
    const errors = {}

    if (!values.password || !(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9!!@#$%&*',.;:(){}\\-`.+,/\"]{8,}$/i).test(values.password) && (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging')) {
      errors.password = i18n.t('UserForm.passwordErrors.invalidPassword')
    } else if (values.password !== values.passwordVerification) {
      errors.password = i18n.t('UserForm.passwordErrors.notSamePassword')
      errors.passwordVerification = i18n.t('UserForm.passwordErrors.notSamePassword')
    }
    return errors
  }

  render () {
    const { onSubmit } = this.props
    return (
      <Card className='loginModal' title={i18n.t('Common_word.activateAccount')} bordered={false} style={{ boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', margin: '10px', width: '100%' }}>
        <Formik
          validate={this.validate}
          onSubmit={(e) => { onSubmit(e) }}
        >
          {({
            values,
            errors,
            handleSubmit,
            handleChange,
          }) => (
            <form title='ChangePassword' onSubmit={handleSubmit}>
              <AInput onChange={handleChange} err={errors.password} name='password' label={i18n.t('Common_word.password')} placeholder={i18n.t('Common_word.password')} type='password' style={{ width: '100%' }} />
              <AInput onChange={handleChange} err={errors.passwordVerification} name='passwordVerification' label={i18n.t('Common_word.confirmPassword')} placeholder={i18n.t('Common_word.confirmPassword')} type='password' style={{ width: '100%' }} />
              <Button htmlType='submit' className='send-button' >
                {i18n.t('Common_word.activateAccount')}
              </Button>
            </form>
          )}
        </Formik>
      </Card>
    )
  }
}

export default ChangePassword
