import React, { Component } from 'react'
import { StoreContext, connectStoreon, customContext, useStoreon } from 'storeon/react' 
import './style.scss'
import 'moment/locale/fr'
import moment from 'moment'
import { notification, Button } from 'antd'
import Comparatif from './comparator'
import i18n from 'i18n-js'
import '@/i18n'

moment.locale('fr')

class AbonnezVous extends Component {

    changePage = (type) => {

      if (type === 'premium' && this.props.coach.accountType === 'T1') { return notification.warning({ message: i18n.t('Common_word.subscription'), description: i18n.t('Offers.subscription_infos.already_subscribed') }) }
      if (type === 'coach' && this.props.coach.accountType === 'T2') { return notification.warning({ message: i18n.t('Common_word.subscription'), description: i18n.t('Offers.subscription_infos.already_subscribed') }) }
      if (type === 'club' && this.props.coach.accountType === 'T3') { return notification.warning({ message: i18n.t('Common_word.subscription'), description: i18n.t('Offers.subscription_infos.already_subscribed') }) }
      if (type === 'free' && this.props.coach.accountType === 'T0') { type = 'premium' }
      if (type === 'free' && this.props.coach.accountType === 'T1') { type = 'coach' }
      if (type === 'free' && this.props.coach.accountType === 'T2') { type = 'club' }

      // if (!this.props.coach.subscribeAt) { this.props.handleClick({ key: 'paiement', subscribeType: type }) }
      // this.props.handleClick({ key: 'paiement', subscribeType: type })
      this.props.dispatch(router.navigate, `/coach/subscribe/checkout/${type}`)
    }

    alertDowngrade = () => {
      notification.close('downgrade')
      notification.info({
        message: this.props.coach.cancelSubscription ? i18n.t('Common_word.ending_soon') : i18n.t('Common_word.unsubscribe'),
        description: (<div>
          {this.props.coach.cancelSubscription
            ? <p>{i18n.t('Offers.subscription_infos.cancel_subscription.end_of_subscription')}<br /><b>{moment(this.props.coach.subscribeAt).add(this.props.coach.accountType === 'T1' ? 'M' : 'years', 1).format('Do MMMM YYYY, à H:mm')}</b><br />{i18n.t('Offers.subscription_infos.cancel_subscription.new_subscription')}</p>
            : <p>{i18n.t('Offers.subscription_infos.cancel_subscription.advice')}</p>
          }
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {!this.props.coach.cancelSubscription && (
              <Button type='primary' style={{ marginLeft: 'auto' }} onClick={() => { this.props.dispatch(router.navigate, '/coach/unsubscribe') }}>{i18n.t('Common_word.unsubscribe')} <i className={'fas fa-arrow-right'} style={{ marginLeft: '10px' }} /></Button>
            )}
          </div>
        </div>),
        duration: 10,
        style: { boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)' },
        key: 'downgrade',
      })
    }

    render () {
      return (
        <div className={'offer_page_container'}>
          <div style={{ maxWidth: '800px', margin: 'auto' }}>
            {screen.width > 565 && <p style={{ textAlign: 'center', color: '#586069', fontSize: '20px', fontWeight: '400' }}>{i18n.t('Common_word.offers')}</p>}
            {screen.width > 565 && <h1 style={{ textAlign: 'center', fontSize: '40px' }}>{i18n.t('Offers.title')}</h1>}
          </div>
          {this.props.coach.cancelSubscription && (
            <p style={{ color: 'orange', fontSize: '1rem' }}>{i18n.t('Offers.subscription_infos.cancel_subscription.end_of_subscription')} {moment(this.props.coach.subscribeAt).add(this.props.coach.accountType === 'T1' ? 'M' : 'years', 1).format('Do MMMM YYYY, à H:mm')}</p>
          )}
          {this.props.coach.futurAccountType && (
            <div>
              <p style={{ fontSize: '0.9rem', color: '#f5222d', fontStyle: 'italic' }}>{i18n.t('Offers.subscription_infos.modify_subscription.recent_changes')}</p>
              <p style={{ fontSize: '0.9rem', color: '#f5222d', fontStyle: 'italic' }}>{i18n.t('Offers.subscription_infos.modify_subscription.advice')}</p>
            </div>
          )}
          { this.props.coach.isAdminManaged && (
            <div>
              <p style={{ fontSize: '0.9rem', color: '#f5222d', fontStyle: 'italic' }}>{i18n.t('Offers.subscription_infos.modify_subscription.leClub_managed')}</p>
            </div>
          )}
          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
            <div className={'offer_content_container'}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ margin: 'auto' }}>{i18n.t('Offers.card.individual.title').toUpperCase()}</h2>
                <hr style={{ width: '150%', margin: 'auto', marginLeft: '-50px' }} />
                <p style={{ color: '#586069', marginTop: '10px', fontSize: '1rem' }}>{i18n.t('Offers.card.without_material')}</p>
              </div>
              <div className={'offer_container'}>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', padding: '24px' }}>
                  <div className={'offer_description'}>
                    <p style={{ fontSize: '1.5rem' }}>{i18n.t('Common_word.basic').toUpperCase()}</p>

                    <div style={{ display: 'flex' }}>
                      <p style={{ fontSize: '3rem', fontWeight: '500' }}>0</p>
                      <p style={{ fontSize: '2.5rem', fontWeight: '500', marginTop: '-4px', marginLeft: '2px' }}>€</p>
                      <p style={{ fontSize: '1.2rem', alignSelf: 'flex-end', fontWeight: '500' }}>/ {i18n.t('Common_word.season').toLowerCase()}</p>
                    </div>
                    <p style={{ color: '#586069', fontSize: '1rem', marginTop: '20px' }}>{i18n.t('Offers.card.individual.description')}</p>
                  </div>
                  <div style={{ margin: '20px 0', width: '100%', height: '220px' }}>
                    <div style={{ display: 'flex' }}>
                      <div style={{ width: '30px', display: 'flex' }}>
                        <i className='fas fa-check' style={{ color: '#35d058', marginRight: '10px', fontSize: '1rem', display: 'flex', alignItems: 'center' }}/>
                      </div>
                      <p style={{ fontSize: '1rem' }}>{i18n.t('Common_word.unlimited')} - {i18n.t('Offers.card.individual.basic_perks.website_access')}</p>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <div style={{ width: '30px', display: 'flex' }}>
                        <i className='fas fa-check' style={{ color: '#35d058', marginRight: '10px', fontSize: '1rem', display: 'flex', alignItems: 'center' }}/>
                      </div>
                      <p style={{ fontSize: '1rem' }}>{i18n.t('Common_word.unlimited')} - {i18n.t('Offers.card.individual.basic_perks.video_management')}</p>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <div style={{ display: 'flex' }}>
                        <i className='fas fa-check' style={{ color: '#35d058', marginRight: '10px', fontSize: '1rem', display: 'flex', alignItems: 'center' }}/>
                      </div>
                      <p style={{ fontSize: '1rem' }}>{i18n.t('Offers.card.individual.basic_perks.video_analysis')}</p>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <div style={{ width: '30px', display: 'flex' }}>
                        <i className='fas fa-check' style={{ color: '#35d058', marginRight: '10px', fontSize: '1rem', display: 'flex', alignItems: 'center' }}/>
                      </div>
                      <p style={{ fontSize: '1rem' }}>{i18n.t('Offers.card.individual.basic_perks.detections')}</p>
                    </div>
                  </div>
                  <div style={{ marginTop: 'auto', width: '100%', fontSize: '12px' }}>
                    {/* Marche plus a cause du 3d Secure => Necessite une intervention supplementaire du client pour chaque payement*/}
                    <Button disabled={this.props.coach.accountType === 'T3' || this.props.coach.accountType === 'T3' || this.props.coach.isAdminManaged} type='primary' className='pricing-button' onClick={() => this.changePage('free')}>
                      {i18n.t('Common_word.update')}
                    </Button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', padding: '24px' }}>
                  <div className={'offer_description'}>
                    <p style={{ fontSize: '1.5rem' }}>{i18n.t('Common_word.premium').toUpperCase()}</p>
                    <div style={{ display: 'flex' }}>
                      <p style={{ fontSize: '3rem', fontWeight: '500' }}>10</p>
                      <p style={{ fontSize: '2.5rem', fontWeight: '500', marginTop: '-4px', marginLeft: '2px' }}>€</p>
                      <p style={{ fontSize: '1.2rem', alignSelf: 'flex-end', fontWeight: '500' }}>/ {i18n.t('Common_word.month')}</p>
                    </div>
                    <p style={{ color: '#586069', fontSize: '1rem', marginTop: '20px' }}>{i18n.t('Offers.card.individual.description')}</p>
                  </div>
                  <div style={{ margin: '20px 0', width: '100%' }}>
                    <div style={{ width: '100%', borderBottom: 'solid 1px rgba(88, 96, 105, 0.2)', marginBottom: '16px', padding: '10px 0', color: '#586069' }}>
                      <div style={{ display: 'flex' }}>
                        <div style={{ width: '30px', display: 'flex' }}>
                          <i className='fas fa-arrow-left' style={{ color: '#35d058', fontSize: '1.1rem', display: 'flex', alignItems: 'center' }}/>
                        </div>
                        <p style={{ fontSize: '1rem' }}>{i18n.t('Offers.card.individual.premium_perks.everything_before')}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <div style={{ width: '30px', display: 'flex' }}>
                        <i className='fas fa-check' style={{ color: '#35d058', marginRight: '10px', fontSize: '1rem', display: 'flex', alignItems: 'center' }}/>
                      </div>
                      <p style={{ fontSize: '1rem' }}>{i18n.t('Offers.card.individual.premium_perks.video_playlist')}</p>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <div style={{ width: '30px', display: 'flex' }}>
                        <i className='fas fa-check' style={{ color: '#35d058', marginRight: '10px', fontSize: '1rem', display: 'flex', alignItems: 'center' }}/>
                      </div>
                      <p style={{ fontSize: '1rem' }}>{i18n.t('Offers.card.individual.premium_perks.add_logo')}</p>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <div style={{ display: 'flex' }}>
                        <i className='fas fa-check' style={{ color: '#35d058', marginRight: '10px', fontSize: '1rem', display: 'flex', alignItems: 'center' }}/>
                      </div>
                      <p style={{ fontSize: '1rem' }}>{i18n.t('Offers.card.individual.premium_perks.live_editing')}</p>
                    </div>
                  </div>
                  <div style={{ marginTop: 'auto', width: '100%', fontSize: '12px' }}>
                    <div style={{ width: '100%', marginTop: '16px' }}>
                      <p style={{ color: '#586069', fontSize: '0.9rem' }}>{i18n.t('Common_word.questions')}?</p>
                      <div className={'pricing-question'}>
                        <i className='fas fa-arrow-right' style={{ marginRight: '10px', fontSize: '1rem', display: 'flex', alignItems: 'center', color: '#2CC1EB' }} />
                        <a href={`${window.origin}/faq`} target='blank' style={{ fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', color: '#2CC1EB' }}>
                          {i18n.t('Common_word.more_about_leClub')}
                        </a>
                      </div>
                    </div>
                    <Button disabled={this.props.coach.accountType === 'T1' || this.props.coach.isAdminManaged} type='primary' className={'pricing-button'} onClick={() => { if (this.props.coach.accountType === 'T2' || this.props.coach.accountType === 'T3') { this.alertDowngrade() } else { this.changePage('premium') } }}>
                      {i18n.t('Offers.card.individual.premium_perks.button')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className={'offer_content_container'} style={{ marginTop: '20px', background: 'rgb(3, 47, 98)', color: 'white' }}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ margin: 'auto', color: 'white' }}>{i18n.t('Offers.card.collective.title').toUpperCase()}</h2>
                <hr style={{ width: '150%', margin: 'auto', marginLeft: '-50px' }} />
                <p style={{ color: 'white', marginTop: '10px', fontSize: '1rem' }}>{i18n.t('Offers.card.collective.with_material')}</p>
              </div>
              <div className={'offer_container'}>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', padding: '24px' }}>
                  <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', letterSpacing: '1px', textAlign: 'center', border: 'solid', borderColor: '#EA178C', borderRadius: '3px', paddingBottom: '5px' }}>
                    <Button style={{ width: '100%', borderRadius: 0, height: '30px', marginRight: 'auto' }} type='primary' onClick={() => this.changePage('coach')}>
                      {i18n.t('Offers.card.collective.most_popular_offer').toUpperCase()}
                    </Button>
                    <p style={{ fontSize: '1.5rem', marginTop: '5px' }}>{i18n.t('Common_word.coach').toUpperCase()}</p>
                    <div style={{ display: 'flex' }}>
                      <p style={{ fontSize: '3rem', fontWeight: '500' }}>300</p>
                      <p style={{ fontSize: '2.5rem', fontWeight: '500', marginTop: '-4px', marginLeft: '2px' }}>€</p>
                      <p style={{ fontSize: '1.2rem', alignSelf: 'flex-end', fontWeight: '500' }}>/ {i18n.t('Common_word.season').toLowerCase()}</p>
                    </div>
                    <p style={{ color: 'hsla(0,0%,100%,.7)', fontSize: '1rem', marginTop: '20px' }}>{i18n.t('Offers.card.collective.coach_perks.description')}</p>

                  </div>
                  <div style={{ margin: '20px 0', width: '100%' }}>
                    <div style={{ display: 'flex' }}>
                      <div style={{ display: 'flex' }}>
                        <i className='fas fa-check' style={{ marginRight: '10px', color: '#35d058', fontSize: '1rem', display: 'flex', alignItems: 'center' }}/>
                      </div>
                      <p style={{ fontSize: '1rem' }}>{i18n.t('Offers.card.individual.basic_perks.website_access')}</p>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <div style={{ display: 'flex' }}>
                        <i className='fas fa-check' style={{ marginRight: '10px', color: '#35d058', fontSize: '1rem', display: 'flex', alignItems: 'center' }}/>
                      </div>
                      <p style={{ fontSize: '1rem' }}>{i18n.t('Offers.card.individual.basic_perks.video_management')}</p>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <div style={{ display: 'flex' }}>
                        <i className='fas fa-check' style={{ marginRight: '10px', color: '#35d058', fontSize: '1rem', display: 'flex', alignItems: 'center' }}/>
                      </div>
                      <p style={{ fontSize: '1rem' }}>{i18n.t('Offers.card.individual.premium_perks.video_playlist')}</p>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <div style={{ display: 'flex' }}>
                        <i className='fas fa-check' style={{ color: '#35d058', marginRight: '10px', fontSize: '1rem', display: 'flex', alignItems: 'center' }}/>
                      </div>
                      <p style={{ fontSize: '1rem' }}>{i18n.t('Offers.card.individual.basic_perks.video_analysis')}</p>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <div style={{ display: 'flex' }}>
                        <i className='fas fa-check' style={{ color: '#35d058', marginRight: '10px', fontSize: '1rem', display: 'flex', alignItems: 'center' }}/>
                      </div>
                      <p style={{ fontSize: '1rem' }}>{i18n.t('Offers.card.individual.basic_perks.detections')}</p>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <div style={{ display: 'flex' }}>
                        <i className='fas fa-check' style={{ color: '#35d058', marginRight: '10px', fontSize: '1rem', display: 'flex', alignItems: 'center' }}/>
                      </div>
                      <p style={{ fontSize: '1rem' }}>{i18n.t('Offers.card.individual.premium_perks.add_logo')}</p>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <div style={{ display: 'flex' }}>
                        <i className='fas fa-check' style={{ color: '#35d058', marginRight: '10px', fontSize: '1rem', display: 'flex', alignItems: 'center' }}/>
                      </div>
                      <p style={{ fontSize: '1rem' }}>{i18n.t('Offers.card.collective.coach_perks.pre_editing')}</p>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <div style={{ display: 'flex' }}>
                        <i className='fas fa-check' style={{ color: '#35d058', marginRight: '10px', fontSize: '1rem', display: 'flex', alignItems: 'center' }}/>
                      </div>
                      <p style={{ fontSize: '1rem' }}>{i18n.t('Offers.card.collective.coach_perks.video_material')}</p>
                    </div>
                  </div>
                  <div style={{ marginTop: 'auto', width: '100%', fontSize: '12px' }}>

                    <div style={{ width: '100%', marginTop: '16px' }}>
                      <p style={{ color: 'hsla(0,0%,100%,.7)', fontSize: '0.9rem' }}>{i18n.t('Common_word.questions')}?</p>
                      <div className={'pricing-question'}>
                        <i className='fas fa-arrow-right' style={{ fontSize: '1rem', display: 'flex', alignItems: 'center' }} />
                        <a href={`${window.origin}/faq`} target='blank' style={{ fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', color: '#2CC1EB' }}>
                          {i18n.t('Common_word.more_about_leClub')}
                        </a>
                      </div>
                    </div>
                    <Button disabled={this.props.coach.accountType === 'T2' || this.props.coach.isAdminManaged} type='primary' className={'pricing-button'} onClick={() => { if (this.props.coach.accountType === 'T3') { this.alertDowngrade() } else { this.changePage('coach') } }}>
                      {i18n.t('Offers.card.collective.coach_perks.button')}
                    </Button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', padding: '24px' }}>
                  <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', letterSpacing: '1px', textAlign: 'center', borderRadius: '3px' }}>
                    <p style={{ fontSize: '1.5rem', marginTop: '35px' }}>{i18n.t('Common_word.club').toUpperCase()}</p>

                    <div style={{ display: 'flex' }}>
                      <p style={{ fontSize: '3rem', fontWeight: '500' }}>550</p>
                      <p style={{ fontSize: '2.5rem', fontWeight: '500', marginTop: '-4px', marginLeft: '2px' }}>€</p>
                      <p style={{ fontSize: '1.2rem', alignSelf: 'flex-end', fontWeight: '500' }}>/ {i18n.t('Common_word.season').toLowerCase()}</p>
                    </div>
                    <p style={{ color: 'hsla(0,0%,100%,.7)', fontSize: '1rem', marginTop: '20px' }}>{i18n.t('Offers.card.collective.club_perks.description')}</p>
                  </div>
                  <div className={'offer_description'}>
                    <div style={{ width: '100%', borderBottom: 'solid 1px white', marginBottom: '16px', padding: '10px 0', color: 'hsla(0,0%,100%,.7)' }}>
                      <div style={{ display: 'flex' }}>
                        <div style={{ width: '30px', display: 'flex' }}>
                          <i className='fas fa-arrow-left' style={{ color: '#35d058', fontSize: '1.1rem', display: 'flex', alignItems: 'center' }}/>
                        </div>
                        <p style={{ fontSize: '1rem' }}>{i18n.t('Offers.card.collective.club_perks.everything_included')}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className='fas fa-check' style={{ color: '#35d058', fontSize: '3rem', display: 'flex', alignItems: 'center' }}/>
                    </div>
                  </div>
                  <div style={{ marginTop: 'auto', width: '100%', fontSize: '12px' }}>
                    <div style={{ width: '100%', marginTop: '16px' }}>
                      <p style={{ color: 'hsla(0,0%,100%,.7)', fontSize: '0.9rem' }}>{i18n.t('Common_word.questions')}?</p>
                      <div className={'pricing-question'}>
                        <i className='fas fa-arrow-right' style={{ fontSize: '1rem', display: 'flex', alignItems: 'center' }} />
                        <a href={`${window.origin}/faq`} target='blank' style={{ fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', color: '#2CC1EB' }}>
                          {i18n.t('Common_word.more_about_leClub')}
                        </a>
                      </div>
                    </div>
                    <Button disabled={this.props.coach.accountType === 'T3' || this.props.coach.isAdminManaged} type='primary' className={'pricing-button'} onClick={() => this.changePage('club')}>
                      {i18n.t('Offers.card.collective.club_perks.button')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {this.props.coach.futurAccountType && (
            <div>
              <p style={{ fontSize: '0.9rem', color: '#f5222d', fontStyle: 'italic' }}>{i18n.t('Offers.subscription_infos.modify_subscription.recent_changes')}</p>
              <p style={{ fontSize: '0.9rem', color: '#f5222d', fontStyle: 'italic' }}>{i18n.t('Offers.subscription_infos.modify_subscription.advice')}</p>
            </div>
          )}
          <Comparatif />
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
  return <AbonnezVous {...props}/>
}
