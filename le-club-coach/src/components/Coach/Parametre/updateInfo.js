import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { useStoreon } from 'storeon/react'
import { updateCoach, updateLogoCoverCoach } from '@/actions/coach'
import { Form, Button, Input } from 'antd'
import SimplePicture from './simplePicture'
import { Formik } from 'formik'
import i18n from 'i18n-js'
import '@/i18n'

const FormItem = Form.Item

const makeField = Component => ({ err, label, placeholder, children, ...rest }) => {
  const hasError = err
  return (
    <FormItem
      label={label}
      validateStatus={hasError ? 'error' : 'success'}
      hasFeedback={!!hasError}
      help={hasError && err}
    >
      <Component {...rest} children={children} placeholder={placeholder} />
    </FormItem>
  )
}
const AInput = makeField(Input)

class UpdateCoach extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
  }

  onSubmit = event => {
    if (event.email === this.props.initialValues.email) {
      delete event.email
    } else if (event.email) { event.email = event.email.toLowerCase() }
    updateCoach(this.props.coach._id, event)
    event.email = this.props.coach.email
  }

  render () {

    const { coach, initialValues } = this.props
    return (
      <div style={{ width: '100%', minHeight: '70vh', marginTop: '20px', padding: '20px' }}>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {coach && (
            <SimplePicture
              id={coach._id}
              url={coach.urlLogo}
              title={`${i18n.t('Common_word.profilePicture')}:`}
              urlBack={`coach/update/coverlogo/${coach._id}?mode=add&type=logo`}
              handleRemove={() => { updateLogoCoverCoach(coach._id, 'logo') }}
            />
          )}
          <Formik
            initialValues={initialValues}
            validate={this.validate}
            onSubmit={this.onSubmit}
          >
            {({
              handleSubmit,
              handleChange,
              initialValues,
            }) => (
              <Form title='Edit' onSubmit={handleSubmit} style={{ width: '100%' }}>
                <AInput onChange={handleChange} defaultValue={initialValues.firstName} name='firstName' placeholder={i18n.t('Common_word.firstname')} label={i18n.t('Common_word.firstname')} type='firstName'/>
                <h1>{i18n.t('Common_word.private_infos')}</h1>
                <hr/>
                <AInput onChange={handleChange} defaultValue={initialValues.lastName} name='lastName' placeholder={i18n.t('Common_word.name')} label={i18n.t('Common_word.name')} type='lastName' />
                <AInput onChange={handleChange} defaultValue={initialValues.email} name='email' placeholder={i18n.t('Common_word.email')} label={i18n.t('Common_word.email')} type='email'/>
                <AInput onChange={handleChange} name='password' placeholder={i18n.t('Common_word.oldPassword')} label={i18n.t('Common_word.password')} type='password' />
                <AInput onChange={handleChange} name='newPassword' placeholder={i18n.t('Common_word.newPassword')} label={i18n.t('Common_word.newPassword')} type='password' />
                <Button htmlType='submit' type='primary'>{i18n.t('Common_word.update')}</Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    )
  }
}

export default initialProps => {
  const { coach } = useStoreon('coach')
  const props = {
    ...initialProps,
    coach,
  }
  return <UpdateCoach {...props} />
}
