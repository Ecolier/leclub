import React, { Component, Fragment } from 'react'
import { useStoreon } from 'storeon/react'
import { StoreContext, connectStoreon, customContext, useStoreon } from 'storeon/react' 
import { Icon, Button, Spin, Modal } from 'antd'
import { cancelSubscription } from '@/actions/stripe'
import moment from 'moment'
import i18n from 'i18n-js'
import '@/i18n'

const confirm = Modal.confirm

class Desabonner extends Component {

  unSubscribe = () => {
    if (this.props.coach.cancelSubscription) {
      return
    }
    confirm({
      title: `${name}`,
      content: <div>
        <p>{i18n.t('Subscribe.unsubscribe.warning_message')}</p>
      </div>,
      okText: i18n.t('Common_word.yes'),
      okType: 'danger',
      cancelText: i18n.t('Common_word.no'),
      onOk: () => {
        cancelSubscription(this.props.coach._id, this.props.changePage)
      },
    })
  }

  render () {
    return (
      <div className='leClub-coach-unsub' style={{ textAlign: 'center' }}>
        <h1>{i18n.t('Subscribe.unsubscribe.title')}</h1>
        <hr/> {
          this.props.coach.subscribeAt
            ? (<Fragment>
              <p>{i18n.t('Subscribe.unsubscribe.change_club_explanation')}</p>
              <div style={{
                margin: '20px 0',
              }}>
                <b style={{
                  cursor: 'default',
                  fontSize: '1.7rem',
                }}>team@leClub.co</b>
              </div>
              <p>{i18n.t('Subscribe.unsubscribe.step.title')}:</p>
              <p><Icon type='caret-right'/>{i18n.t('Subscribe.unsubscribe.step.contact_us')}<b>contact@leClub.co</b>{i18n.t('Subscribe.unsubscribe.step.return_gears_explanation')}<a style={{
                cursor: 'pointer',
                color: '#008dff',
              }} onClick={() => {
                this.props.dispatch(router.navigate, '/cgv')
              }}>CGV</a>.</p>
              <div style={{
                margin: '20px 0',
              }}>
                <h3><Icon type='warning' style={{
                  color: 'red',
                }}/>{i18n.t('Subscribe.unsubscribe.step.disclaimers.title')}:</h3>
                <hr/>
                <p><Icon type='caret-right'/>{i18n.t('Subscribe.unsubscribe.step.disclaimers.loosing_discount')}</p>
                <p><Icon type='caret-right'/>{i18n.t('Subscribe.unsubscribe.step.disclaimers.subscription')}</p>
                <p><Icon type='caret-right'/>{i18n.t('Subscribe.unsubscribe.step.disclaimers.return_gears')}</p>
              </div>
              <Button disabled={this.props.coach.cancelSubscription} type={'primary'} onClick={this.unSubscribe}>{i18n.t('Subscribe.unsubscribe.button')}</Button>
              {
                this.props.coach.cancelSubscription && (<div>
                  <p style={{
                    color: 'orange',
                  }}>{i18n.t('Subscribe.unsubscribe.success_message')}</p>
                  <b style={{
                    color: 'orange',
                  }}>{i18n.t('Subscribe.unsubscribe.ending')}: {
                      moment(this.props.coach.subscribeAt).add(
                        this.props.coach.accountType === 'T1'
                          ? 'M'
                          : 'years',
                        1).format('Do MMMM YYYY, à H:mm')
                    }</b>
                </div>)
              }
            </Fragment>)
            : (<div style={{
              textAlign: 'center',
              marginTop: '20px',
            }}>
              <Icon type='form' style={{
                fontSize: '5rem',
                marginBottom: '5px',
              }}/>
              <p style={{
                fontSize: '1.2rem',
              }}>{i18n.t('Subscribe.tracking.no_subscription')}</p>
            </div>)
        }
      </div>)
  }
}

export default initialProps => {
  const { dispatch, coach } = useStoreon('coach')
  const props = {
    ...initialProps,
    dispatch,
    coach,
  }
  return <Desabonner {...props}/>
}
