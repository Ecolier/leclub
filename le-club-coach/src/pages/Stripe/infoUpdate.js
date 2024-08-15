import React, { Component } from 'react'
import { useStoreon } from 'storeon/react'
import { Elements, StripeProvider } from 'react-stripe-elements'
import StripeHookProvider from '@/components/Stripe/StripeHookProvider'
import { Button, Icon, Spin } from 'antd'
import UpdateCheckoutForm from '@/components/Stripe/update'
import { callApi } from '../../utils/callApi'
import 'moment/locale/fr'
import moment from 'moment'
import './infoUpdate.scss'
import i18n from 'i18n-js'
import '@/i18n'

moment.locale('fr')

class InfoUpdate extends Component {

  componentDidMount () {
    callApi(`stripe/payment/${this.props.coach._id}`, 'get', {}).then(body => {
      this.setState({ info: body.payment })
    })
  }

    state = {
      info: null,
      update: false,
    }

    update = () => {
      this.retour()
      callApi(`stripe/payment/${this.props.coach._id}`, 'get', {}).then(body => {
        this.setState({ info: body.payment })
      })
    }

    retour = () => {
      this.setState({ update: false })
    }

    render () {
      const { info, update } = this.state
      return (
        <div className='leClub-coach-billing-infos'>
          <h1>{i18n.t('Subscribe.billing_infos.title')}</h1>
          <hr/>
          {this.props.coach.stripeId ? (
            <div style={{ marginTop: '20px' }}>
              { !update ? (
                <div>
                  <div id={'info_update_credit_card'}>
                    {info ? (
                      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', fontSize: '1.5rem' }}>
                          <div style={{ background: 'white', width: '50px', borderRadius: '5px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ width: '100%', height: '7px', borderBottom: 'solid 1px grey' }} />
                            <div style={{ display: 'flex' }}>
                              <div style={{ width: '100%', height: '20px', borderRight: 'solid 1px grey', flex: '1' }} />
                              <div style={{ flex: '2' }} />
                              <div style={{ width: '100%', height: '20px', borderLeft: 'solid 1px grey', flex: '1' }} />
                            </div>
                            <div style={{ width: '100%', height: '7px', borderTop: 'solid 1px grey' }} />
                          </div>
                          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <b style={{ marginRight: '10px' }}>{info.brand}</b>
                            <Icon type='credit-card' style={{ fontSize: '2rem' }}/>
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '1.2rem' }}>
                            <b>{i18n.t('Stripe.card_infos.card_numbers')}</b>
                            <p style={{ letterSpacing: '5px' }}>XXXX XXXX XXXX {info.last4}</p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
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
                    ) : <div style={{ width: '100%', flexDirection: 'column', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Spin spinning size={'large'}/>
                      <p>{i18n.t('Subscribe.billing_infos.searching')}</p>
                    </div>}
                  </div>
                  <Button id={'info_update_button'} type='primary' onClick={() => { this.setState({ update: true }) }}>{i18n.t('Stripe.modify_button')}</Button>
                </div>
              ) : (
                <StripeProvider apiKey='pk_test_S7wXJWtGrpNdnDVgvVszqY1M'>
                  <Elements>
                    <StripeHookProvider>
                      <UpdateCheckoutForm retour={this.retour} update={this.update}/>
                    </StripeHookProvider>
                  </Elements>
                </StripeProvider>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <Icon type='credit-card' style={{ fontSize: '5rem', marginBottom: '5px' }}/>
              <p style={{ fontSize: '1.2rem' }}>{i18n.t('Stripe.no_card')}</p>
            </div>
          )}
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
  return <InfoUpdate {...props}/>
}
