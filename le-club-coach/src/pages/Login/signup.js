import './newSinginIn.scss'
import React, { Component } from 'react'
import { createAccountCoach } from '@/actions/service'
import { loginCoach } from '@/actions/coach'
import { callApi } from '@/utils/callApi.js'
import { Form, Input, Button, notification, Checkbox } from 'antd'
import ClubAutoComplete from '@/components/ClubAutoComplete'
import { StoreContext, connectStoreon, customContext, useStoreon } from 'storeon/react' 
import i18n from 'i18n-js'
import '@/i18n.js'

import './index.css'
const FormItem = Form.Item

const makeField = Component => ({ err, label, placeholder, children, ...rest }) => {
  const hasError = err
  return (
    <FormItem
      label={label}
      validateStatus={hasError ? 'error' : 'success'}
      hasFeedback={!!hasError}
      help={hasError && err}
      style={{ width: '100%' }}
    >
      <Component {...rest} children={children} placeholder={placeholder} style={{ width: '100%' }} />
    </FormItem>
  )
}

const makeSField = Component => ({ err, label, placeholder, children, ...rest }) => {
  const hasError = err
  return (
    <FormItem
      label={label}
      validateStatus={hasError ? 'error' : 'success'}
      hasFeedback={!!hasError}
      help={hasError && err}
      style={{ width: '100%' }}
    >
      <Component {...rest} children={children} placeholder={placeholder} style={{ width: '100%' }} hasFeedback/>

    </FormItem>
  )
}

const AInput = makeField(Input)
const SAInput = makeSField(Input.Password)

class SingupCoach extends Component {

  state = {
    dataSource: [],
    clubName: '',
    clubs: {},
    start: 0,
    values: { newsletters: true, contrat: false },
    errors: {},
  }

handleSelect = (id) => {
  callApi(`find/club/one/${id}`, 'get').then(body => {

    this.setState({ club: body.club, clubId: body.club._id, clubName: body.club.name })
  }).catch((error) => {
    notification.error({ message: i18n.t('ClubAutoComplete.error'), description: error })
  })
}

 validate = values => {
   const errors = {}
   const requiredFields = ['email', 'password', 'firstName', 'lastName', 'phone']

   requiredFields.forEach(field => { if (!values[field]) { errors[field] = i18n.t('Common_word.required') } })
   if (values.email && !(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i).test(values.email)) {
     errors.email = i18n.t('UserForm.emailErrors.invalidEmail')
   }
   if (!values.password || !(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9!!@#$%&*',.;:(){}\\-`.+,/\"]{8,}$/i).test(values.password) && (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging')) {
     errors.password = i18n.t('UserForm.passwordErrors.invalidPassword')
   }
   if (values.phone && !(/^([+][0-9]{11}|[0-9]{10})$/i).test(values.phone)) {
     errors.phone = i18n.t('UserForm.phoneNumberErrors.invalidPhoneNumber')
   }
   return errors
 }
  onSubmit = e => {
    e.preventDefault()
    const event = this.state.values

    if (event.contrat !== true) { notification.error({ message: i18n.t('Common_word.form'), description: i18n.t('UserForm.contratErrors.acceptError') }); return }

    if (!this.state.clubId) { notification.error({ message: i18n.t('ClubAutoComplete.clubName'), description: i18n.t('UserForm.clubErrors.missingClub') }) }

    event.club = this.state.clubId
    event.email = event.email.toLowerCase()
    if (this.props.mobile.pushToken) {
      event.pushToken = this.props.mobile.pushToken
    }
    createAccountCoach(event, this.props.onCancel, () => {
      loginCoach(event)
    })
  }

  handleChange = (e, type) => {

    const values = this.state.values
    if (e.target) {
      values[type] = e.target.value
    } else {
      values[type] = e
    }
    const errors = this.validate(values)

    this.setState({ errors, values })

  }
  render () {
    const { errors, values } = this.state
    return (
      <div className={'login-page'}>
        <div className={'singup-modal'}>
          <h2 style={{ textAlign: 'center', padding: '20px' }}>{i18n.t('Header.inscriptionButton')}</h2>
          {/* <Formik
            initialValues={{ newsletters: true }}
            validate={this.validate}
            onSubmit={}
          >
            {({
              values,
              errors,
              handleSubmit,
              this.handleChange,
            }) => ( */}
          <form title='Singup' className='signupForm' onSubmit={this.onSubmit}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <span style={{ marginRight: '10px', width: '100%' }}>
                <AInput onChange={(e) => this.handleChange(e, 'firstName')} err={errors.firstName} name='firstName' label={<span><span style={{ color: 'red' }}>*</span> {i18n.t('Common_word.firstname')}</span>} type='firstName' placeholder={i18n.t('Common_word.firstname')} />
              </span>
              <AInput onChange={(e) => this.handleChange(e, 'lastName')} err={errors.lastName} name='lastName' label={<span><span style={{ color: 'red' }}>*</span> {i18n.t('Common_word.name')}</span>} type='lastName' placeholder={i18n.t('Common_word.name')} />
            </div>
            <AInput onChange={(e) => this.handleChange(e, 'email')} err={errors.email} style={{ color: '#bc4934' }} name='email' autoFocus placeholder={i18n.t('Common_word.email')} label={<span><span style={{ color: 'red' }}>*</span> {i18n.t('Common_word.email')}</span>} type='email' />

            <div className='ant-row ant-form-item' style={{ width: '100%' }}>
              <p style={{ marginBottom: '15px' }}><span style={{ color: 'red' }}>*</span> {i18n.t('ClubAutoComplete.placeholder')}:</p>
              <ClubAutoComplete
                onSelect={this.handleSelect}
              />
            </div>
            <AInput onChange={(e) => this.handleChange(e, 'phone')} err={errors.phone} name='phone' label={<span><span style={{ color: 'red' }}>*</span> {i18n.t('Common_word.phone_number')}</span>} type='phone' placeholder={i18n.t('Common_word.phone_number')} />

            <SAInput onChange={(e) => this.handleChange(e, 'password')} err={errors.password} name='password' label={<span><span style={{ color: 'red' }}>*</span> {i18n.t('Common_word.password')}</span>} type='password' placeholder={i18n.t('Common_word.password')} />
            <Checkbox defaultValue={false} onChange={(e) => this.handleChange(!values.contrat, 'contrat')} err={errors.licenciesNbr} name='contrat' style={{ fontWeight: '500', marginTop: '30px' }}>{i18n.t('UserForm.contrat.consentSentenceBegin')} <a className='contrat' href={`${window.location.origin}/cgv`} target='_blank'>{i18n.t('UserForm.contrat.consentSentenceDetail')}</a></Checkbox>
            <Checkbox checked={values.newsletters} onChange={(e) => this.handleChange(!values.newsletters, 'newsletters')} name='newsletters' style={{ fontWeight: '500', marginTop: '30px', alignSelf: 'flex-start', marginLeft: 0 }}>{i18n.t('UserForm.newsletter.description')}</Checkbox>
            <Button htmlType='submit' style={{ marginTop: '25px' }} type='primary'>
              {i18n.t('UserForm.submitButton.createAccount')}
            </Button>
            <a style={{ marginTop: '15px', textDecoration: 'underline', cursor: 'pointer' }} href='/login' onClick={() => this.props.dispatch(router.navigate, '/login')}>{i18n.t('Header.connexionButton')}</a>
          </form>
        </div>

      </div>
    )
  }
}

const ConnectedSignupCoach = connectStoreon('dispatch', 'mobile', SingupCoach)

class SignUp extends React.PureComponent {

  state = {
    showCoachForm: true,
  }

  renderCard = (props) => {
    const style = {
      flex: 1,
      backgroundImage: [
        'linear-gradient(transparent, #0a0a0a)',
        `url('${props.img}')`,
      ].join(','),
    }
    return (
      <div className='signup-card' style={style} onClick={props.onClick}>
        <div className='signup-card-title'>
          {props.title}
        </div>
      </div>
    )
  }

  render () {
    const Card = this.renderCard

    if (!this.state.showCoachForm) {
      return (
        <Card
          openNotification={thsi.props.openNotification}
          title='coach' img='https://d1ceovtllg6jml.cloudfront.net/coachImg2.png' onClick={() => this.setState({ showCoachForm: true })} />
      )
    }

    return (<ConnectedSignupCoach />)
  }
}

export default SignUp
