import React, { Component } from 'react'
import { StoreContext, connectStoreon, customContext, useStoreon } from 'storeon/react' 
import { Elements, StripeProvider } from 'react-stripe-elements'
import { Radio, Steps, Button, notification, Icon, Spin, Input, Table, Popconfirm } from 'antd'
import CheckoutForm from '@/components/Stripe/index'
import StripeHookProvider from '@/components/Stripe/StripeHookProvider'
import 'moment/locale/fr'
import moment from 'moment'
import { setSeasonTeams } from '@/actions/coach'
import { addStripe } from '@/actions/stripe'
import { callApi } from '@/utils/callApi'
import './add.scss'
import i18n from 'i18n-js'
import '@/i18n'

const RadioGroup = Radio.Group
const Step = Steps.Step

moment.locale('fr')

const columns = [{
  title: i18n.t('Common_word.team'),
  dataIndex: 'name',
  key: '_id',
}]

class ProSubscription extends Component {

  componentDidMount () {
    if (
      (this.props.coach.accountType === 'T1' && (this.props.type === 'premium'))
        || (this.props.coach.accountType === 'T2' && (this.props.type === 'premium' || this.props.type === 'coach'))
        || (this.props.coach.accountType === 'T3' && (this.props.type === 'premium' || this.props.type === 'coach' || this.props.type === 'club'))
    ) { this.props.dispatch(router.navigate, '/coach/subscribe') }
    if (this.props.type) {
      this.setState({ subscribeType: this.props.type })
    }
    if (this.props.coach.stripeId) {
      this.setState({ oldCard: true })
      callApi(`stripe/payment/${this.props.coach._id}`, 'get', {}).then(body => {
        this.setState({ info: body.payment })
      })
    } else {
      this.setState({ info: false })
    }
  }

  state = {
    privateActivate: 'public',
    subscribeType: this.props.subscribeType || '',
    current: 0,
    name: '',
    email: '',
    address: '',
    phone: '',
    city: '',
    coachEmail: '',
    coupon: '',
    oldCard: false,
    info: null,
    selectedRows: [],
    selectedRows1: [],
    disabledBtn: false,
  }

  next = () => {
    window.scrollTo(0, 0)
    this.setState({ current: this.state.current + 1 })
  }

  shouldShowStripe = () => {
    if (this.props.isOnboarding) {
      return (
        this.props.coach.accountType === 'T0'
        && this.state.subscribeType !== 'basic'
      )
    }
    return this.state.subscribeType !== 'basic'
  }

  handleSubscribeSuccess = () => {
    this.next()
    this.props.onSuccess && this.props.onSuccess()
  }

  prev = () => {
    window.scrollTo(0, 0)
    if (this.state.current - 1 < 0) {
      return this.props.onBack && this.props.onBack()
    }
    this.setState({ current: this.state.current - 1 })
    // if (this.state.current === 2 && this.state.subscribeType === 'club') {
    // const current = this.state.current - 2
    // this.setState({ current })
    // } else {
    // const current = this.state.current - 1
    // this.setState({ current })
    // }
  }

  onChange = (e) => {
    this.setState(e)
  }

  handleSubmitTeamChange = async () => {
    const teams = this.state.selectedRows1.length > 0 ? this.state.selectedRows1 : this.state.selectedRows
    await setSeasonTeams({
      teams: teams.map(t => t._id),
    })
    return this.handleSubscribeSuccess()
  }

  handleSubmit = (stripe) => {
    window.scrollTo(0, 0)
    this.setState({ disabledBtn: true })

    if (this.state.oldCard) {

      const body = {
        coachEmail: this.state.coachEmail,
        coupon: this.state.coupon,
        privateActivate: this.state.privateActivate,
        subscribeType: this.state.subscribeType,
        description: `${this.props.coach.firstName} ${this.props.coach.lastName}`,
        oldCard: this.state.oldCard,
        coachFirstName: this.state.coachFirstName,
        coachLastName: this.state.coachLastName,
      }
      const teams = this.state.selectedRows1.length > 0 ? this.state.selectedRows1 : this.state.selectedRows
      body.team1 = teams[0] && teams[0]._id
      body.team2 = teams[1] && teams[1]._id
      if (stripe) {
        const newStripe = Stripe(process.env.NODE_ENV === 'production' ? 'pk_live_C1JPvRRiMTd3q7jxbJHQUZMm' : 'pk_test_S7wXJWtGrpNdnDVgvVszqY1M')

        addStripe(this.props.coach, body, this.state.subscribeType, this.handleSubscribeSuccess, newStripe, (() => { this.setState({ disabledBtn: false }) }))

      }
    } else {
      const email = this.state.email
      const name = this.state.name
      const address_line1 = this.state.address
      const address_city = this.state.city
      const phone = this.state.phone
      const reg = RegExp(/^[1-9]{1}[0-9]{8}$/u)
      const regName = RegExp(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)
      const regAddress = RegExp(/^[0-9a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)
      const regEmail = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      if (!reg.test(phone)) { notification.error({ message: i18n.t('Stripe.form_error.phone_number.error_message'), description: i18n.t('Stripe.form_error.phone_number.error_message') }); this.setState({ disabledBtn: false }); return }
      if (!regName.test(name)) { notification.error({ message: i18n.t('Stripe.form_error.name.error_message'), description: i18n.t('Stripe.form_error.name.error_message') }); this.setState({ disabledBtn: false }); return }
      if (!regName.test(address_city)) { notification.error({ message: i18n.t('Stripe.form_error.city.error_message'), description: i18n.t('Stripe.form_error.city.error_message') }); this.setState({ disabledBtn: false }); return }
      if (!regAddress.test(address_line1)) { notification.error({ message: i18n.t('Stripe.form_error.address.error_message'), description: i18n.t('Stripe.form_error.address.error_message') }); this.setState({ disabledBtn: false }); return }
      if (!regEmail.test(email)) { notification.error({ message: i18n.t('Stripe.form_error.email.error_message'), description: i18n.t('Stripe.form_error.email.error_message') }); this.setState({ disabledBtn: false }); return }
      if (stripe) {
        stripe.createToken({ name, email, address_line1, address_city }).then((stripeToken) => {
          if (stripeToken.error) { notification.error({ message: i18n.t('Stripe.form_error.form.error_message'), description: stripeToken.error.message }); return }
          const body = {
            coachEmail: this.state.coachEmail,
            coachFirstName: this.state.coachFirstName,
            coachLastName: this.state.coachLastName,
            privateActivate: this.state.privateActivate,
            name: stripeToken.token.card.name,
            email: stripeToken.token.email,
            stripeToken: stripeToken.token.id,
            coupon: this.state.coupon,
            address_city,
            address_line1,
            phone,
            address_zip: stripeToken.token.card.address_zip,
            subscribeType: this.state.subscribeType,
            description: `${this.props.coach.firstName} ${this.props.coach.lastName}`,
            oldCard: this.state.oldCard,
          }
          const teams = this.state.selectedRows1.length > 0 ? this.state.selectedRows1 : this.state.selectedRows
          body.team1 = teams[0] && teams[0]._id
          body.team2 = teams[1] && teams[1]._id
          addStripe(this.props.coach, body, this.state.subscribeType, this.handleSubscribeSuccess, stripe, (() => { this.setState({ disabledBtn: false }) }))

        }).catch(e => {
          this.setState({ disabledBtn: false })
          notification.error({ message: i18n.t('Common_word.error'), description: e.message })
        })
      }
    }
  }

  render () {
    const { current, info } = this.state
    const rowSelection = {
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRows })
      },
    }
    const rowSelection1 = {
      onChange: (selectedRowKeys, selectedRows) => {
        if (selectedRowKeys.length > 2) { selectedRowKeys.splice(0, 1); selectedRows.splice(0, 1) }

        this.setState({ selectedRows1: selectedRows, selectedRowKeys })

      },
      selectedRowKeys: this.state.selectedRowKeys,
    }

    const steps = [{
      title: i18n.t('Subscribe.choose_offers'),
      condition: () => {
        if (this.props.isOnboarding) {
          return this.props.coach.accountType === 'T0'
        }
        return true
      },
      actions: () => (
        <React.Fragment>
          {this.props.onBack && (<Button onClick={this.props.onBack}>{i18n.t('Common_word.previous')}</Button>)}
          <Button type='primary' onClick={() => this.next()} style={{ marginLeft: 10 }}>{i18n.t('Common_word.next')}</Button>
        </React.Fragment>
      ),
      content: <div>
        <div>
          <p style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{i18n.t('Subscribe.subscribe_type')}</p>
          <div style={{ width: '100%', margin: '10px 0', fontWeight: '400' }}>
            <RadioGroup value={this.state.subscribeType}>
              {this.state.subscribeType === 'basic' && (
                <div className={'video_confidentiality_option'}>
                  <Radio disabled value='basic' style={{ fontWeight: 'bold' }}>{i18n.t('Common_word.basic')}</Radio>
                  <p>{i18n.t('Subscribe.pricing.basic')}</p>
                </div>
              )}
              {this.state.subscribeType === 'premium' && (
                <div className={'video_confidentiality_option'}>
                  <Radio disabled value='premium' style={{ fontWeight: 'bold' }}>{i18n.t('Common_word.premium')}</Radio>
                  <p>{i18n.t('Subscribe.pricing.premium')}</p>
                </div>
              )}
              {this.state.subscribeType === 'coach' && (
                <div className={'video_confidentiality_option'}>
                  <Radio disabled value='coach' style={{ fontWeight: 'bold' }}>{i18n.t('Common_word.coach')}</Radio>
                  <p>{i18n.t('Subscribe.pricing.coach')}</p>
                </div>
              )}
              {this.state.subscribeType === 'club' && (
                <div className={'video_confidentiality_option'}>
                  <Radio disabled value='club' style={{ fontWeight: 'bold' }}>{i18n.t('Common_word.club')}</Radio>
                  <p>{i18n.t('Subscribe.pricing.club')}</p>
                </div>
              )}
            </RadioGroup>
          </div>
        </div>
        <div>
          {this.state.privateActivate === 'public' ? (
            <div>
              <p style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{i18n.t('Subscribe.privacy_option.public.option_choice')}</p>
              <p style={{ fontSize: '1rem', marginTop: '5px' }}>
                {i18n.t('Subscribe.privacy_option.public.description.first_part')}<strong>{i18n.t('Subscribe.privacy_option.public.description.strong_part')}</strong>{i18n.t('Subscribe.privacy_option.public.description.second_part')}
              </p>
              <p>{i18n.t('Subscribe.privacy_option.public.description.last_part')}</p>
            </div>
          ) : (
            <div>
              <p style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{i18n.t('Subscribe.privacy_option.private.option_choice')}</p>
              <p style={{ fontSize: '1rem', marginTop: '5px' }}>
                {i18n.t('Subscribe.privacy_option.private.description.first_part')}<strong>{i18n.t('Subscribe.privacy_option.private.description.strong_part')}</strong> 😉
              </p>
              <p>{i18n.t('Subscribe.privacy_option.private.description.last_part')}</p>
            </div>
          )}
          <div style={{ width: '100%', margin: '10px 0', fontWeight: '400' }}>
            <RadioGroup id={'video_confidentiality_option_container'} onChange={(e) => { this.onChange({ privateActivate: e.target.value }) }} value={this.state.privateActivate}>
              <div onClick={(e) => { this.onChange({ privateActivate: 'public' }) }} className={'video_confidentiality_option'}>
                <Radio value='public' style={{ fontWeight: 'bold' }}>{i18n.t('Common_word.public')}</Radio>
                <p>{i18n.t('Subscribe.privacy_option.public.explanation.first_part')}<strong>{i18n.t('Subscribe.privacy_option.strong_unlimited')}</strong>{i18n.t('Subscribe.privacy_option.public.explanation.last_part')}</p>
              </div>

              {this.state.subscribeType !== 'basic' && (
                <div onClick={(e) => { this.onChange({ privateActivate: 'private' }) }} className={'video_confidentiality_option'}>
                  <Radio value='private' style={{ fontWeight: 'bold' }}>{i18n.t('Common_word.private')}</Radio>
                  {this.state.subscribeType === 'premium' && (<p>10€,{i18n.t('Subscribe.privacy_option.private.explanation.first_part')}<strong>{i18n.t('Subscribe.privacy_option.strong_unlimited')}</strong>{i18n.t('Subscribe.privacy_option.private.explanation.last_part')}</p>)}
                  {this.state.subscribeType === 'coach' && (<p>300€,{i18n.t('Subscribe.privacy_option.private.explanation.first_part')}<strong>{i18n.t('Subscribe.privacy_option.strong_unlimited')}</strong>{i18n.t('Subscribe.privacy_option.private.explanation.last_part')}</p>)}
                  {this.state.subscribeType === 'club' && (<p>550€,{i18n.t('Subscribe.privacy_option.private.explanation.first_part')}<strong>{i18n.t('Subscribe.privacy_option.strong_unlimited')}</strong>{i18n.t('Subscribe.privacy_option.private.explanation.last_part')}</p>)}
                </div>
              )}
            </RadioGroup>
          </div>
        </div>
        <div className={'checkout_detail'}>
          <h4 style={{ color: '#ea158c' }}>Sous-total:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
              <i className='fas fa-circle' style={{ fontSize: '0.5rem', textAlign: 'center', padding: '0.5rem', marginBottom: '0.5rem', color: '#ea158c' }}/>
              {this.state.subscribeType === 'basic' && (<h4 style={{ color: '#ea158c' }}> {i18n.t('Common_word.basic')}: <strong style={{ color: '#2bc1eb' }}>0€</strong></h4>)}
              {this.state.subscribeType === 'premium' && (<h4 style={{ color: '#ea158c' }}> {i18n.t('Common_word.premium')}: <strong style={{ color: '#2bc1eb' }}>10€</strong></h4>)}
              {this.state.subscribeType === 'coach' && (<h4 style={{ color: '#ea158c' }}>{i18n.t('Common_word.coach')}: <strong style={{ color: '#2bc1eb' }}>300€</strong></h4>)}
              {this.state.subscribeType === 'club' && (<h4 style={{ color: '#ea158c' }}>{i18n.t('Common_word.club')}: <strong style={{ color: '#2bc1eb' }}>550€</strong></h4>)}
            </div>

            {this.state.subscribeType !== 'basic' && (
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                <i className='fas fa-circle' style={{ fontSize: '0.5rem', textAlign: 'center', padding: '0.5rem', marginBottom: '0.5rem', color: '#ea158c' }}/>

                {this.state.subscribeType === 'premium' && this.state.privateActivate === 'public' && (<h4 style={{ color: '#ea158c' }}> {i18n.t('Common_word.public')}:<strong style={{ color: '#2bc1eb' }}> 0€</strong></h4>)}
                {this.state.subscribeType === 'premium' && this.state.privateActivate !== 'public' && (<h4 style={{ color: '#ea158c' }}> {i18n.t('Common_word.private')}:<strong style={{ color: '#2bc1eb' }}> 10€</strong></h4>)}

                {this.state.subscribeType === 'coach' && this.state.privateActivate === 'public' && (<h4 style={{ color: '#ea158c' }}> {i18n.t('Common_word.public')}:<strong style={{ color: '#2bc1eb' }}> 0€</strong></h4>)}
                {this.state.subscribeType === 'coach' && this.state.privateActivate !== 'public' && (<h4 style={{ color: '#ea158c' }}> {i18n.t('Common_word.private')}:<strong style={{ color: '#2bc1eb' }}> 300€</strong></h4>)}

                {this.state.subscribeType === 'club' && this.state.privateActivate === 'public' && (<h4 style={{ color: '#ea158c' }}> {i18n.t('Common_word.public')}:<strong style={{ color: '#2bc1eb' }}> 0€</strong></h4>)}
                {this.state.subscribeType === 'club' && this.state.privateActivate !== 'public' && (<h4 style={{ color: '#ea158c' }}> {i18n.t('Common_word.private')}:<strong style={{ color: '#2bc1eb' }}> 550€</strong></h4>)}
              </div>
            )}
          </div>
        </div>
        <hr/>
        <div className={'checkout_price'}>
          {this.state.subscribeType === 'premium' && this.state.privateActivate === 'public' && (<h2 style={{ color: '#ea158c' }}>{i18n.t('Common_word.total')}: <strong style={{ color: '#2bc1eb' }}>10€</strong></h2>)}
          {this.state.subscribeType === 'premium' && this.state.privateActivate === 'private' && (<h2 style={{ color: '#ea158c' }}>{i18n.t('Common_word.total')}: <strong style={{ color: '#2bc1eb' }}>20€</strong></h2>)}
          {this.state.subscribeType === 'coach' && this.state.privateActivate === 'public' && (
            <div>
              <p style={{ color: '#ea158c' }}>{i18n.t('Subscribe.pricing.total_no_discount')}: <strong style={{ color: '#2bc1eb' }}>300€</strong></p>
              <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.discount')}: <strong style={{ color: '#2bc1eb' }}>-{this.props.coach.cagnotte}€</strong></p>
              <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.total')}: <strong style={{ color: '#2bc1eb' }}>{300 - this.props.coach.cagnotte < 0 ? 0 : 300 - this.props.coach.cagnotte}€</strong></p>
            </div>
          )}
          {this.state.subscribeType === 'coach' && this.state.privateActivate === 'private' && (
            <div>
              <p style={{ color: '#ea158c' }}>{i18n.t('Subscribe.pricing.total_no_discount')}: <strong style={{ color: '#2bc1eb' }}>600€</strong></p>
              <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.discount')}: <strong style={{ color: '#2bc1eb' }}>-{this.props.coach.cagnotte}€</strong></p>
              <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.total')}: <strong style={{ color: '#2bc1eb' }}>{600 - this.props.coach.cagnotte < 0 ? 0 : 600 - this.props.coach.cagnotte}€</strong></p>
            </div>
          )}
          {this.state.subscribeType === 'club' && this.state.privateActivate === 'public' && (
            <div>
              <p style={{ color: '#ea158c' }}>{i18n.t('Subscribe.pricing.total_no_discount')}: <strong style={{ color: '#2bc1eb' }}>550€</strong></p>
              <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.discount')}: <strong style={{ color: '#2bc1eb' }}>-{this.props.coach.cagnotte}€</strong></p>
              <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.total')}: <strong style={{ color: '#2bc1eb' }}>{550 - this.props.coach.cagnotte < 0 ? 0 : 550 - this.props.coach.cagnotte}€</strong></p>
            </div>
          )}
          {this.state.subscribeType === 'club' && this.state.privateActivate === 'private' && (
            <div>
              <p style={{ color: '#ea158c' }}>{i18n.t('Subscribe.pricing.total_no_discount')}: <strong style={{ color: '#2bc1eb' }}>1100€</strong></p>
              <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.discount')}: <strong style={{ color: '#2bc1eb' }}>-{this.props.coach.cagnotte}€</strong></p>
              <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.total')}: <strong style={{ color: '#2bc1eb' }}>{1100 - this.props.coach.cagnotte < 0 ? 0 : 1100 - this.props.coach.cagnotte}€</strong></p>
            </div>
          )}
        </div>
      </div>,
    },
    {
      title: i18n.t('Common_word.more_info'),
      condition: () => {
        return this.state.subscribeType !== 'club'
      },
      actions: () => {
        const onConfirm = () => {

          if (this.state.subscribeType === 'coach') {
            if (this.state.selectedRows1.length === 0) {
              return notification.warning({ message: i18n.t('Common_word.warning'), description: i18n.t('Subscribe.coach_teams.errors.no_team') })
            }
          }

          if (this.state.subscribeType === 'premium') {
            if (this.state.selectedRows.length === 0) {
              return notification.warning({ message: i18n.t('Common_word.warning'), description: i18n.t('Subscribe.premium_team_error') })
            }
          }

          if (!this.shouldShowStripe()) {
            return this.handleSubmitTeamChange()
          }
          return this.next()
        }

        const getWarningText = () => {
          if (this.state.subscribeType === 'coach') {
            if (this.state.selectedRows1.length !== 2) {
              return i18n.t('Subscribe.coach_teams.errors.one_team_disclaimer')
            }
          }
          return i18n.t('Subscribe.coach_teams.errors.one_team_disclaimer_confirm')
        }
        return (
          <React.Fragment>
            <Button onClick={this.prev}>{i18n.t('Common_word.previous')}</Button>
            <Popconfirm title={getWarningText()} onConfirm={onConfirm} okText={i18n.t('Common_word.yes')} cancelText={i18n.t('Common_word.no')}>
              <Button type='primary' style={{ marginLeft: 10 }}>{i18n.t('Common_word.next')}</Button>
            </Popconfirm>
          </React.Fragment>
        )
      },
      content: <div style={{ marginTop: '20px' }}>
        {(this.state.subscribeType === 'basic' || this.state.subscribeType === 'premium') && (
          <div>
            <p style={{ textTransform: 'uppercase', fontSize: 'bold' }}>{i18n.t('Subscribe.one_team_offers.title')}</p>
            <hr/>
            <h4 style={{ color: 'red' }}>{i18n.t('Subscribe.one_team_offers.disclaimer')}</h4>
            <Table showHeader={false} rowSelection={rowSelection} columns={columns} dataSource={this.props.season.club.teams} pagination={false} />
          </div>
        )}
        {this.state.subscribeType === 'coach' && (

          <div>
            <p style={{ fontSize: '20px', marginBottom: '15px' }}>{i18n.t('Subscribe.coach_teams.explanation')}</p>
            <p style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{i18n.t('Subscribe.coach_teams.title')}</p>
            <hr/>
            <div>
              <Table showHeader={false} rowSelection={rowSelection1} columns={columns} dataSource={this.props.season.club.teams} pagination={false} />
            </div>
          </div>
        )}
        {this.state.subscribeType === 'coach' && (
          <div>
            <p style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{i18n.t('Subscribe.coach_teams.send_invite')}</p>
            <hr/>
            <Input value={this.state.coachEmail} onChange={(e) => this.setState({ coachEmail: e.target.value })} type='email' placeholder={i18n.t('Common_word.email')} />
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: '10px' }}>
              <Input style={{ width: '30%' }} value={this.state.coachFirstName} onChange={(e) => this.setState({ coachFirstName: e.target.value })} placeholder={i18n.t('Common_word.firstname')} />
              <Input style={{ width: '30%', marginRight: '10px' }} value={this.state.coachLastName} onChange={(e) => this.setState({ coachLastName: e.target.value })} placeholder={i18n.t('Common_word.name')} />
            </div>
          </div>
        )}
      </div>,
    },
    {
      title: i18n.t('Subscribe.billing_infos.title'),
      actions: () => this.state.oldCard && (
        <React.Fragment>
          <Button onClick={this.prev}>{i18n.t('Common_word.previous')}</Button>
          <Button type='primary' onClick={this.handleSubmit} disabled={this.state.disabledBtn} style={{ marginLeft: 10 }}>{i18n.t('Common_word.next')}</Button>
        </React.Fragment>
      ),
      condition: () => {
        return this.shouldShowStripe()
      },
      content: <div>
        <RadioGroup onChange={(e) => { this.onChange({ oldCard: e.target.value }) }} value={this.state.oldCard}>
          <div style={{ margin: '10px 0' }}>
            <Radio value style={{ fontWeight: 'bold' }} disabled={!this.props.coach.stripeId}>{i18n.t('Subscribe.billing_infos.saved_card.title')}</Radio>
            <p>{i18n.t('Subscribe.billing_infos.saved_card.explanation')}<a onClick={() => { this.props.dispatch(router.navigate, '/coach/subscribe/billing') }}>{i18n.t('Subscribe.billing_infos.title')}</a></p>
            <div style={{ width: '250px', overflow: 'hidden', height: this.props.coach.stripeId && info && this.state.oldCard ? '140px' : '0', transition: 'height 1s, padding 1s', borderRadius: '10px', padding: this.props.coach.stripeId && info && this.state.oldCard ? '20px 30px' : '0', background: 'linear-gradient(160deg, #2b5876, #4e4376)', color: 'white', boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)', fontWeight: '200', marginBottom: '20px' }}>
              {this.props.coach.stripeId && info && this.state.oldCard ? (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '1.5rem' }}>
                    <div style={{ background: 'white', width: '20px', borderRadius: '5px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ width: '100%', height: '3px', borderBottom: 'solid 1px grey' }} />
                      <div style={{ display: 'flex' }}>
                        <div style={{ width: '100%', height: '7px', borderRight: 'solid 1px grey', flex: '1' }} />
                        <div style={{ flex: '2' }} />
                        <div style={{ width: '100%', height: '7px', borderLeft: 'solid 1px grey', flex: '1' }} />
                      </div>
                      <div style={{ width: '100%', height: '3px', borderTop: 'solid 1px grey' }} />
                    </div>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <b style={{ marginRight: '10px', fontSize: '0.9rem' }}>{info.brand}</b>
                      <Icon type='credit-card' style={{ fontSize: '0.9rem' }}/>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem' }}>
                      <b>{i18n.t('Stripe.card_infos.card_numbers')}</b>
                      <p style={{ letterSpacing: '2px' }}>XXXX XXXX XXXX {info.last4}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '10px' }}>
                      <div>
                        <b>{i18n.t('Common_word.name')}</b>
                        <p>{info.name}</p>
                      </div>
                      <div>
                        <b>{i18n.t('Stripe.card_infos.expiration_date')}</b>
                        <p>{info.exp_month}/{info.exp_year}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : this.props.coach.stripeId && info !== false && this.state.oldCard ? <div style={{ width: '100%', flexDirection: 'column', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spin spinning size={'large'}/>
                <p>{i18n.t('Subscribe.billing_infos.searching')}</p>
              </div> : null}
            </div>
          </div>
          <div style={{ margin: '10px 0' }}>
            <Radio value={false} style={{ fontWeight: 'bold' }}>{i18n.t('Subscribe.billing_infos.new_card.title')}</Radio>
            <p>{i18n.t('Subscribe.billing_infos.new_card.explanation')}</p>
          </div>
          {this.state.subscribeType !== 'premium' && (
            <div>
              <div style={{
                width: '100%',
                padding: '15px',
                borderRadius: '5px',
              }}>
                <label style={{ flex: '1', paddingRight: '10px' }} className='stripe-label'>
                  <span style={{ fontWeight: 'bold' }}>{i18n.t('Subscribe.billing_infos.discount_code')}</span>
                  <input name='coupon' type='text' placeholder='Cod3ProM0TionN3L' required className='stripe-input' style={{ width: '100%', marginBottom: '5px' }} onChange={(e) => { this.onChange({ coupon: e.target.value }) }} value={this.state.coupon}/>
                </label>
              </div>
            </div>
          )}
          {this.state.oldCard && (
            <div className={'checkout_price'}>
              {this.state.subscribeType === 'coach' && this.state.privateActivate === 'public' && (
                <div>
                  <p style={{ color: '#ea158c' }}>{i18n.t('Subscribe.pricing.total_no_discount')}: <strong style={{ color: '#2bc1eb' }}>300€</strong></p>
                  {this.props.coach.cagnotte && this.props.coach.cagnotte !== 0 ? (
                    <div>
                      <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.discount')}: <strong style={{ color: '#2bc1eb' }}>-{this.props.coach.cagnotte}€</strong></p>
                      <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.total')}: <strong style={{ color: '#2bc1eb' }}>{300 - this.props.coach.cagnotte < 0 ? 0 : 300 - this.props.coach.cagnotte}€</strong></p>
                    </div>
                  ) : this.state.coupon && this.state.coupon !== '' ? (
                    <div>
                      <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.discount')}: <strong style={{ color: '#2bc1eb' }}>-15€</strong></p>
                      <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.total')}: <strong style={{ color: '#2bc1eb' }}>{300 - 15}€</strong></p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.discount')}: <strong style={{ color: '#2bc1eb' }}>0€</strong></p>
                      <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.total')}: <strong style={{ color: '#2bc1eb' }}>300€</strong></p>
                    </div>
                  )}
                </div>
              )}
              {this.state.subscribeType === 'coach' && this.state.privateActivate === 'private' && (
                <div>
                  <p style={{ color: '#ea158c' }}>{i18n.t('Subscribe.pricing.total_no_discount')}: <strong style={{ color: '#2bc1eb' }}>600€</strong></p>
                  {this.props.coach.cagnotte && this.props.coach.cagnotte !== 0 ? (
                    <div>
                      <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.discount')}: <strong style={{ color: '#2bc1eb' }}>-{this.props.coach.cagnotte}€</strong></p>
                      <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.total')}: <strong style={{ color: '#2bc1eb' }}>{600 - this.props.coach.cagnotte < 0 ? 0 : 600 - this.props.coach.cagnotte}€</strong></p>
                    </div>
                  ) : this.state.coupon && this.state.coupon !== '' ? (
                    <div>
                      <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.discount')}: <strong style={{ color: '#2bc1eb' }}>-15€</strong></p>
                      <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.total')}: <strong style={{ color: '#2bc1eb' }}>{600 - 15}€</strong></p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.discount')}: <strong style={{ color: '#2bc1eb' }}>0€</strong></p>
                      <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.total')}: <strong style={{ color: '#2bc1eb' }}>600€</strong></p>
                    </div>
                  )}
                </div>
              )}
              {this.state.subscribeType === 'club' && this.state.privateActivate === 'public' && (
                <div>
                  <p style={{ color: '#ea158c' }}>{i18n.t('Subscribe.pricing.total_no_discount')}: <strong style={{ color: '#2bc1eb' }}>550€</strong></p>
                  {this.props.coach.cagnotte && this.props.coach.cagnotte !== 0 ? (
                    <div>
                      <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.discount')}: <strong style={{ color: '#2bc1eb' }}>-{this.props.coach.cagnotte}€</strong></p>
                      <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.total')}: <strong style={{ color: '#2bc1eb' }}>{550 - this.props.coach.cagnotte < 0 ? 0 : 550 - this.props.coach.cagnotte}€</strong></p>
                    </div>
                  ) : this.state.coupon && this.state.coupon !== '' ? (
                    <div>
                      <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.discount')}: <strong style={{ color: '#2bc1eb' }}>-25€</strong></p>
                      <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.total')}: <strong style={{ color: '#2bc1eb' }}>{550 - 25}€</strong></p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.discount')}: <strong style={{ color: '#2bc1eb' }}>0€</strong></p>
                      <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.total')}: <strong style={{ color: '#2bc1eb' }}>550€</strong></p>
                    </div>
                  )}
                </div>
              )}
              {this.state.subscribeType === 'club' && this.state.privateActivate === 'private' && (
                <div>
                  <p style={{ color: '#ea158c' }}>{i18n.t('Subscribe.pricing.total_no_discount')}: <strong style={{ color: '#2bc1eb' }}>1100€</strong></p>
                  {this.props.coach.cagnotte && this.props.coach.cagnotte !== 0 ? (
                    <div>
                      <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.discount')}: <strong style={{ color: '#2bc1eb' }}>-{this.props.coach.cagnotte}€</strong></p>
                      <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.total')}: <strong style={{ color: '#2bc1eb' }}>{1100 - this.props.coach.cagnotte < 0 ? 0 : 1100 - this.props.coach.cagnotte}€</strong></p>
                    </div>
                  ) : this.state.coupon && this.state.coupon !== '' ? (
                    <div>
                      <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.discount')}: <strong style={{ color: '#2bc1eb' }}>-25€</strong></p>
                      <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.total')}: <strong style={{ color: '#2bc1eb' }}>{1100 - 25}€</strong></p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.discount')}: <strong style={{ color: '#2bc1eb' }}>0€</strong></p>
                      <p style={{ color: '#ea158c' }}>{i18n.t('Common_word.total')}: <strong style={{ color: '#2bc1eb' }}>1100€</strong></p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </RadioGroup>
        <div style={{ marginTop: '20px', height: !this.state.oldCard ? 'auto' : '0', transition: 'height 1s', overflow: 'hidden' }}>
          {!this.state.oldCard && (
            <StripeProvider apiKey={process.env.NODE_ENV === 'production' ? 'pk_live_C1JPvRRiMTd3q7jxbJHQUZMm' : 'pk_test_S7wXJWtGrpNdnDVgvVszqY1M'}>
              <Elements>
                <StripeHookProvider>
                  <CheckoutForm coupon={this.state.coupon} status={'add'} subscribeType={this.state.subscribeType} privateActivate={this.state.privateActivate} handleSubmit={this.handleSubmit} prev={this.prev} onChange={this.onChange}
                    disabledBtn={this.state.disabledBtn}
                    initialValues={{ coupon: this.state.coupon, name: this.state.name, email: this.state.email, city: this.state.city, address: this.state.address, phone: this.state.phone, oldCard: this.state.phone }}/>
                </StripeHookProvider>
              </Elements>
            </StripeProvider>
          )}
        </div>
      </div>,
    }, {
      title: i18n.t('Common_word.validation'),
      actions: () => (
        <Button type='primary' onClick={() => { this.props.dispatch(router.navigate, '/coach/home') }}>{i18n.t('Subscribe.success.title')}</Button>
      ),
      content: <div>
        <div style={{ width: '100%', textAlign: 'center' }}>
          <Icon type='check-circle' style={{ fontSize: '6rem', color: '#4BB543' }}/>
          <h2>{i18n.t('Subscribe.success.active')}</h2>
          { this.props.coach.futurAccountType ? (
            <p>{i18n.t('Subscribe.success.recap')}<b>{this.props.coach.futurAccountType === 'T1' ? i18n.t('Common_word.premium') : this.props.coach.futurAccountType === 'T2' ? i18n.t('Common_word.coach') : i18n.t('Common_word.club')}</b> !</p>
          ) : (
            <p>{i18n.t('Subscribe.success.recap')}<b>{this.props.coach.accountType === 'T1' ? i18n.t('Common_word.premium') : this.props.coach.accountType === 'T2' ? i18n.t('Common_word.coach') : i18n.t('Common_word.club')}</b> !</p>
          )}
          {(this.props.coach.futurAccountType === 'T2' || this.props.coach.futurAccountType === 'T3') && (
            <p>{i18n.t('Subscribe.success.email')}</p>
          )}
          <p>{i18n.t('Subscribe.success.use_leClub')}</p>
        </div>
      </div>,
    }].filter(i => i.condition ? i.condition() : true)

    const currentStep = steps[current]
    if (!currentStep) {
      return null
    }
    return (
      <div style={{ width: '100%', padding: '50px' }}>
        {/* <Spin spinning={this.props.toaster.loading}> */}
        <div style={{ maxWidth: '970px', margin: '20px auto' }}>
          <Steps current={current}>
            {steps.map(item => <Step key={item.title} title={item.title} />)}
          </Steps>
          <div className='steps-content' style={{ margin: '20px 0' }}>{currentStep.content}</div>
          <div className='steps-action' style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            {currentStep.actions && currentStep.actions()}
          </div>
        </div>
        {/* </Spin> */}
      </div>
    )
  }
}

export default initialProps => {
  const { dispatch, coach, coachSeason } = useStoreon('coach', 'coachSeason')
  const season = coachSeason.currentSeason
  const props = {
    ...initialProps,
    dispatch,
    coach,
    season,
  }
  return <ProSubscription {...props}/>
}
