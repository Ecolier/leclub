import React, { Component } from 'react'
import { Icon, Button } from 'antd'
import { useStripe } from '@/components/Stripe/StripeHookProvider'
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
  handleSubmit = (ev) => {
    ev.preventDefault()
    this.props.handleSubmit(this.props.stripe)
  };

  render () {
    const { onChange, initialValues } = this.props
    return (<div className='stripe-body'>
      <form onSubmit={this.handleSubmit} className='stripe-form'>
        <div className={'stripe-input-container'}>
          <label style={{
            flex: '1',
            paddingRight: '10px',
          }} className='stripe-label'>
            {i18n.t('Stripe.card_infos.card_owner_name')}
            <input name='name' type='text' placeholder='Pierre DUPOND' required='required' className='stripe-input' style={{
              width: '100%',
            }} onChange={(e) => {
              onChange({ name: e.target.value })
            }} value={initialValues.name}/>
          </label>
          <label style={{
            flex: '1',
            paddingRight: '10px',
          }} className='stripe-label'>
            {i18n.t('Common_word.email')}
            <input name='email' type='email' placeholder='pierre.dupond@example.com' required='required' className='stripe-input' style={{
              width: '100%',
            }} onChange={(e) => {
              onChange({ email: e.target.value })
            }} value={initialValues.email}/>
          </label>
        </div>
        <label style={{
          flex: '1',
          paddingRight: '10px',
        }} className='stripe-label'>
          {i18n.t('Common_word.address')}
          <input name='address' type='text' placeholder='1 rue de la fontaine' required='required' className='stripe-input' style={{
            width: '100%',
            maxWidth: 'initial',
          }} onChange={(e) => {
            onChange({ address: e.target.value })
          }} value={initialValues.address}/>
        </label>
        <div className={'stripe-input-container'}>
          <label style={{
            flex: '1',
            paddingRight: '10px',
          }} className='stripe-label'>
            {i18n.t('Common_word.city')}
            <input name='city' type='text' placeholder='Paris' required='required' className='stripe-input' style={{
              width: '100%',
            }} onChange={(e) => {
              onChange({ city: e.target.value })
            }} value={initialValues.city}/>
          </label>
          <label className='stripe-label' style={{
            flex: '1',
            paddingRight: '10px',
          }}>
            {i18n.t('Common_word.zip_code')}
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
            }} onChange={(e) => {
              onChange({ phone: e.target.value })
            }} value={initialValues.phone}/>
          </div>

        </label>
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
                <b className={'credit_card_title'}>{i18n.t('Common_word.credit_card')}</b>
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
                  <CardNumberElement ref={ref => {
                    this.carNumber = ref
                  }} {...createOptions(this.props.fontSize)}/>
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
        <div style={{
          textAlign: 'right',
          margin: '20px 0',
        }}>
          {
            this.props.subscribeType === 'coach' && this.props.privateActivate === 'public' && (<div>
              <p style={{
                color: '#ea158c',
              }}>{i18n.t('Subscribe.pricing.total_no_discount')}:
                <strong style={{
                  color: '#2bc1eb',
                }}>300€</strong>
              </p>
              {
                this.props.coach.cagnotte && this.props.coach.cagnotte !== 0
                  ? (<div>
                    <p style={{
                      color: '#ea158c',
                    }}>{i18n.t('Common_word.discount')}:
                      <strong style={{
                        color: '#2bc1eb',
                      }}>-{this.props.coach.cagnotte}€</strong>
                    </p>
                    <p style={{
                      color: '#ea158c',
                    }}>{i18n.t('Common_word.total')}:
                      <strong style={{
                        color: '#2bc1eb',
                      }}>{
                          300 - this.props.coach.cagnotte < 0
                            ? 0
                            : 300 - this.props.coach.cagnotte
                        }€</strong>
                    </p>
                  </div>)
                  : this.props.coupon && this.props.coupon !== ''
                    ? (<div>
                      <p style={{
                        color: '#ea158c',
                      }}>{i18n.t('Common_word.discount')}:
                        <strong style={{
                          color: '#2bc1eb',
                        }}>-15€</strong>
                      </p>
                      <p style={{
                        color: '#ea158c',
                      }}>{i18n.t('Common_word.total')}:
                        <strong style={{
                          color: '#2bc1eb',
                        }}>{300 - 15}€</strong>
                      </p>
                    </div>)
                    : (<div>
                      <p style={{
                        color: '#ea158c',
                      }}>{i18n.t('Common_word.discount')}:
                        <strong style={{
                          color: '#2bc1eb',
                        }}>0€</strong>
                      </p>
                      <p style={{
                        color: '#ea158c',
                      }}>{i18n.t('Common_word.total')}:
                        <strong style={{
                          color: '#2bc1eb',
                        }}>300€</strong>
                      </p>
                    </div>)
              }
            </div>)
          }
          {
            this.props.subscribeType === 'coach' && this.props.privateActivate === 'private' && (<div>
              <p style={{
                color: '#ea158c',
              }}>{i18n.t('Subscribe.pricing.total_no_discount')}:
                <strong style={{
                  color: '#2bc1eb',
                }}>600€</strong>
              </p>
              {
                this.props.coach.cagnotte && this.props.coach.cagnotte !== 0
                  ? (<div>
                    <p style={{
                      color: '#ea158c',
                    }}>{i18n.t('Common_word.discount')}:
                      <strong style={{
                        color: '#2bc1eb',
                      }}>-{this.props.coach.cagnotte}€</strong>
                    </p>
                    <p style={{
                      color: '#ea158c',
                    }}>{i18n.t('Common_word.total')}:
                      <strong style={{
                        color: '#2bc1eb',
                      }}>{
                          600 - this.props.coach.cagnotte < 0
                            ? 0
                            : 600 - this.props.coach.cagnotte
                        }€</strong>
                    </p>
                  </div>)
                  : this.props.coupon && this.props.coupon !== ''
                    ? (<div>
                      <p style={{
                        color: '#ea158c',
                      }}>{i18n.t('Common_word.discount')}:
                        <strong style={{
                          color: '#2bc1eb',
                        }}>-15€</strong>
                      </p>
                      <p style={{
                        color: '#ea158c',
                      }}>{i18n.t('Common_word.total')}:
                        <strong style={{
                          color: '#2bc1eb',
                        }}>{600 - 15}€</strong>
                      </p>
                    </div>)
                    : (<div>
                      <p style={{
                        color: '#ea158c',
                      }}>{i18n.t('Common_word.discount')}:
                        <strong style={{
                          color: '#2bc1eb',
                        }}>0€</strong>
                      </p>
                      <p style={{
                        color: '#ea158c',
                      }}>{i18n.t('Common_word.total')}:
                        <strong style={{
                          color: '#2bc1eb',
                        }}>600€</strong>
                      </p>
                    </div>)
              }
            </div>)
          }
          {
            this.props.subscribeType === 'club' && this.props.privateActivate === 'public' && (<div>
              <p style={{
                color: '#ea158c',
              }}>{i18n.t('Subscribe.pricing.total_no_discount')}:
                <strong style={{
                  color: '#2bc1eb',
                }}>550€</strong>
              </p>
              {
                this.props.coach.cagnotte && this.props.coach.cagnotte !== 0
                  ? (<div>
                    <p style={{
                      color: '#ea158c',
                    }}>{i18n.t('Common_word.discount')}:
                      <strong style={{
                        color: '#2bc1eb',
                      }}>-{this.props.coach.cagnotte}€</strong>
                    </p>
                    <p style={{
                      color: '#ea158c',
                    }}>{i18n.t('Common_word.total')}:
                      <strong style={{
                        color: '#2bc1eb',
                      }}>{
                          550 - this.props.coach.cagnotte < 0
                            ? 0
                            : 550 - this.props.coach.cagnotte
                        }€</strong>
                    </p>
                  </div>)
                  : this.props.coupon && this.props.coupon !== ''
                    ? (<div>
                      <p style={{
                        color: '#ea158c',
                      }}>{i18n.t('Common_word.discount')}:
                        <strong style={{
                          color: '#2bc1eb',
                        }}>-25€</strong>
                      </p>
                      <p style={{
                        color: '#ea158c',
                      }}>{i18n.t('Common_word.total')}:
                        <strong style={{
                          color: '#2bc1eb',
                        }}>{550 - 25}€</strong>
                      </p>
                    </div>)
                    : (<div>
                      <p style={{
                        color: '#ea158c',
                      }}>{i18n.t('Common_word.discount')}:
                        <strong style={{
                          color: '#2bc1eb',
                        }}>0€</strong>
                      </p>
                      <p style={{
                        color: '#ea158c',
                      }}>{i18n.t('Common_word.total')}:
                        <strong style={{
                          color: '#2bc1eb',
                        }}>550€</strong>
                      </p>
                    </div>)
              }
            </div>)
          }
          {
            this.props.subscribeType === 'club' && this.props.privateActivate === 'private' && (<div>
              <p style={{
                color: '#ea158c',
              }}>{i18n.t('Subscribe.pricing.total_no_discount')}:
                <strong style={{
                  color: '#2bc1eb',
                }}>1100€</strong>
              </p>
              {
                this.props.coach.cagnotte && this.props.coach.cagnotte !== 0
                  ? (<div>
                    <p style={{
                      color: '#ea158c',
                    }}>{i18n.t('Common_word.discount')}:
                      <strong style={{
                        color: '#2bc1eb',
                      }}>-{this.props.coach.cagnotte}€</strong>
                    </p>
                    <p style={{
                      color: '#ea158c',
                    }}>{i18n.t('Common_word.total')}:
                      <strong style={{
                        color: '#2bc1eb',
                      }}>{
                          1100 - this.props.coach.cagnotte < 0
                            ? 0
                            : 1100 - this.props.coach.cagnotte
                        }€</strong>
                    </p>
                  </div>)
                  : this.props.coupon && this.props.coupon !== ''
                    ? (<div>
                      <p style={{
                        color: '#ea158c',
                      }}>{i18n.t('Common_word.discount')}:
                        <strong style={{
                          color: '#2bc1eb',
                        }}>-25€</strong>
                      </p>
                      <p style={{
                        color: '#ea158c',
                      }}>{i18n.t('Common_word.total')}:
                        <strong style={{
                          color: '#2bc1eb',
                        }}>{1100 - 25}€</strong>
                      </p>
                    </div>)
                    : (<div>
                      <p style={{
                        color: '#ea158c',
                      }}>{i18n.t('Common_word.discount')}:
                        <strong style={{
                          color: '#2bc1eb',
                        }}>0€</strong>
                      </p>
                      <p style={{
                        color: '#ea158c',
                      }}>{i18n.t('Common_word.total')}:
                        <strong style={{
                          color: '#2bc1eb',
                        }}>1100€</strong>
                      </p>
                    </div>)
              }
            </div>)
          }
        </div>
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
          <Button style={{
            marginRight: 8,
          }} onClick={() => this.props.prev()}>{i18n.t('Common_word.previous')}</Button>
          <Button type='primary' htmlType={'submit'} disabled={this.props.disabledBtn} onClick={this.handleSubmit}>{i18n.t('Common_word.next')}</Button>
        </div>
      </form>
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
