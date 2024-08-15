import React, { Component } from 'react'
import { CardCVCElement, CardExpiryElement, CardNumberElement, PostalCodeElement } from 'react-stripe-elements'
import { useStripe } from '@/components/Stripe/StripeHookProvider'
import { notification, Icon, Spin } from 'antd'
import { updateStripe } from '@/actions/stripe'
import './style.scss'
import { useStoreon } from 'storeon/react'
import i18n from 'i18n-js'
import '@/i18n'

const createOptions = (fontSize, padding) => {
  return {
    style: {
      base: {
        fontSize,
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: 'Source Code Pro, monospace',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding,
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }
}

class CheckoutForm extends Component {

  state = {
    isLoading: false,
  }

  handleSubmit = (ev) => {
    this.setState({ isLoading: true })
    const email = ev.target.email.value
    const name = ev.target.name.value
    const address_line1 = ev.target.address.value
    const address_city = ev.target.city.value
    const phone = ev.target.phone.value
    ev.preventDefault()
    const reg = RegExp(/^[1-9]{1}[0-9]{8}$/u)
    const regName = RegExp(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)
    const regAddress = RegExp(/^[0-9a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)
    if (!reg.test(phone)) {
      notification.error({ message: i18n.t('Stripe.form_error.phone_number.error_message'), description: i18n.t('Stripe.form_error.phone_number.error_description') })
      this.setState({ isLoading: false })
      return
    }
    if (!regName.test(name)) {
      notification.error({ message: i18n.t('Stripe.form_error.name.error_message'), description: i18n.t('Stripe.form_error.name.error_message') })
      this.setState({ isLoading: false })
      return
    }
    if (!regName.test(address_city)) {
      notification.error({ message: i18n.t('Stripe.form_error.city.error_message'), description: i18n.t('Stripe.form_error.city.error_message') })
      this.setState({ isLoading: false })
      return
    }
    if (!regAddress.test(address_line1)) {
      notification.error({ message: i18n.t('Stripe.form_error.address.error_message'), description: i18n.t('Stripe.form_error.address.error_message') })
      this.setState({ isLoading: false })
      return
    }
    if (this.props.stripe) {
      this.props.stripe.createToken({ name, email, address_line1, address_city }).then(async (stripeToken) => {
        if (stripeToken.error) {
          notification.error({ message: i18n.t('Stripe.card_error'), description: stripeToken.error.message })
          this.setState({ isLoading: false })
          return
        }
        await updateStripe(this.props.coach._id, {
          name: stripeToken.token.card.name,
          email: stripeToken.token.email,
          stripeToken: stripeToken.token.id,
          address_city,
          address_line1,
          phone,
          address_zip: stripeToken.token.card.address_zip,
          description: `${this.props.coach.firstName} ${this.props.coach.lastName}`,
        }, this.props.update)
        this.setState({ isLoading: false })
      }).catch(e => {
        notification.error({ message: i18n.t('Common_word.error'), description: e.message })
        this.setState({ isLoading: false })
      })
    } else {
      this.setState({ isLoading: false })
    }
  };

  render () {
    return (<div className='stripe-body'>
      <Spin spinning={this.state.isLoading} size='large'>
        <form onSubmit={this.handleSubmit} className='stripe-form'>
          <div className={'stripe-input-container'}>
            <label style={{
              flex: '1',
              paddingRight: '10px',
            }} className='stripe-label'>
              {i18n.t('Stripe.card_infos.card_owner_name')}
              <input name='name' type='text' placeholder='Pierre DUPOND' required='required' className='stripe-input' style={{
                width: '100%',
              }}/>
            </label>
            <label style={{
              flex: '1',
              paddingRight: '10px',
            }} className='stripe-label'>
              {i18n.t('Common_word.email')}
              <input name='email' type='email' placeholder='pierre.dupond@example.com' required='required' className='stripe-input' style={{
                width: '100%',
              }}/>
            </label>
          </div>
          <label style={{
            flex: '1',
            paddingRight: '10px',
          }} className='stripe-label'>
            {i18n.t('Common_word.address')}
            <input name='address' type='text' placeholder='1 rue de la fontaine' required='required' className='stripe-input' style={{
              width: '100%',
            }}/>
          </label>
          <div className={'stripe-input-container'}>
            <label style={{
              flex: '1',
              paddingRight: '10px',
            }} className='stripe-label'>
              {i18n.t('Common_word.city')}
              <input name='city' type='text' placeholder='Paris' required='required' className='stripe-input' style={{
                width: '100%',
              }}/>
            </label>
            <label className='stripe-label' style={{
              flex: '1',
              paddingRight: '10px',
            }}>
              {i18n.t('Common_word.zip_code')}
              <PostalCodeElement {...createOptions('1.5rem')}/>
            </label>
          </div>
          <label style={{
            flex: '1',
            paddingRight: '10px',
          }} className='stripe-label'>
            {i18n.t('Common_word.phone_number')}
            <div style={{
              display: 'flex',
            }}>
              <div style={{
                bordeTopLeftRadius: '5px',
                bordeBottomLeftRadius: '5px',
                padding: '10px',
                background: '#c9c9c9',
                boxShadow: 'rgba(50, 50, 93, 0.14902) 0px 1px 3px, rgba(0, 0, 0, 0.0196078) 0px 1px 0px',
                display: 'flex',
                alignItems: 'center',
                margin: '10px 0 20px 0',
              }}>
                +33
              </div>
              <input name='phone' type='number' placeholder='612345678' required='required' pattern='^[0-9]{9}$' className='stripe-input' style={{
                width: '100%',
              }}/>
            </div>

          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}>
            <div className={'update_credit_card'}>
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <div style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  fontSize: '1.5rem',
                }}>
                  <div style={{
                    background: 'white',
                    width: '50px',
                    borderRadius: '5px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <div style={{
                      width: '100%',
                      height: '7px',
                      borderBottom: 'solid 1px grey',
                    }}/>
                    <div style={{
                      display: 'flex',
                    }}>
                      <div style={{
                        width: '100%',
                        height: '20px',
                        borderRight: 'solid 1px grey',
                        flex: '1',
                      }}/>
                      <div style={{
                        flex: '2',
                      }}/>
                      <div style={{
                        width: '100%',
                        height: '20px',
                        borderLeft: 'solid 1px grey',
                        flex: '1',
                      }}/>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '7px',
                      borderTop: 'solid 1px grey',
                    }}/>
                  </div>
                  <div style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}>
                    <b style={{
                      marginRight: '10px',
                    }}>{i18n.t('Common_word.credit_card')}</b>
                    <Icon type='credit-card' style={{
                      fontSize: '2rem',
                    }}/>
                  </div>
                </div>
                <div>
                  <div style={{
                    fontSize: '1.2rem',
                  }}>
                    <label className='stripe-label' style={{
                      color: 'white',
                    }}>
                      {i18n.t('Stripe.card_infos.card_numbers')}
                      <CardNumberElement {...createOptions(this.props.fontSize)}/>
                    </label>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '20px',
                  }}>
                    <label className='stripe-card-label'>
                      {i18n.t('Stripe.card_infos.expiration_date')}
                      <CardExpiryElement {...createOptions(this.props.fontSize)}/>
                    </label>
                    <div>
                      <label className='stripe-card-label'>
                        {i18n.t('Stripe.card_infos.cryptogram')}
                        <CardCVCElement {...createOptions(this.props.fontSize)}/>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <button className='stripe-button' style={{
              background: 'white',
            }} onClick={this.props.retour}><Icon type='left' style={{
                marginRight: '2px',
              }}/> {i18n.t('Common_word.back')}</button>
            <button className='stripe-button'>{i18n.t('Common_word.save')}</button>
          </div>
        </form>
      </Spin>
    </div>)
  }
}

export default initialProps => {
  const { dispatch, coach } = useStoreon('coach')
  const stripe = useStripe()
  const props = {
    ...initialProps,
    dispatch,
    coach,
    stripe,
  }
  return <CheckoutForm {...props}/>
}
