import React, { Component } from 'react'
import { StoreContext, connectStoreon, customContext, useStoreon } from 'storeon/react' 
import { Button, Modal } from 'antd'
import './tier_modal.scss'
import i18n from 'i18n-js'
import '@/i18n'

class TierModal extends Component {

    state = {
      visible: true,
    }

    closeModal = () => {
      this.setState({ visible: false })
      if (this.props.close) { this.props.close() }
    }

    render () {
      return (
        <Modal
          closable={false}
          destroyOnClose
          visible={this.state.visible}
          onCancel={this.closeModal}
          footer={null}
          title={i18n.t('TierModal.title')}
          className={'tier_modal_container'}>
          {!this.props.mobile.isOnIOS
            && <div style={{ margin: 'auto' }}>
              {screen.width > 425 && <h1 className={'tier_modal_catch_phrase'}>{i18n.t('TierModal.catch_phrase')}</h1>}
              {screen.width > 425 && <p style={{ textAlign: 'center', color: '#586069', fontSize: '16px', fontWeight: '400' }}><i className='fas fa-check' style={{ color: '#35d058' }}/> {i18n.t('Header.ProductNavigation.pre-made-clips')}, <i className='fas fa-check' style={{ color: '#35d058' }}/> {i18n.t('TierModal.advantages.edit_custom')}, <i className='fas fa-check' style={{ color: '#35d058' }}/> {i18n.t('Offers.card.collective.coach_perks.video_material')}, <i className='fas fa-check' style={{ color: '#35d058' }}/> {i18n.t('TierModal.advantages.unlimited_leClub')}
              </p>}
              <div className={'tier_modal_offer_container'}>
                <div style={{ flex: '1', margin: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid rgba(0,0,0,.1)', zIndex: '1', backgroundClip: 'padding-box', boxShadow: '1px 1px 15px rgba(27,31,35,.15)', padding: '40px', backgroundColor: 'white', borderRadius: '6px', color: 'black' }}>
                  <div style={{ textAlign: 'center' }}>
                    <h2>PREMIUM</h2>
                    <hr style={{ width: '100px' }}/>
                  </div>
                  <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', letterSpacing: '1px', textAlign: 'center', height: '220px' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>{i18n.t('TierModal.premium_catch_phrase')}</p>
                    <div style={{ display: 'flex', marginTop: '20px' }}>
                      <p style={{ fontSize: '3rem', fontWeight: '500' }}>10</p>
                      <p style={{ fontSize: '2.5rem', fontWeight: '500', marginTop: '-4px', marginLeft: '2px' }}>€</p>
                    </div>
                    <p style={{ fontSize: '1.2rem' }}>/ {i18n.t('Common_word.month')}</p>
                    <p style={{ fontSize: '0.7rem', color: '#586069' }}>{i18n.t('Offers.card.individual.description')}</p>
                  </div>
                </div>

                <div style={{ flex: '1', margin: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid rgba(0,0,0,.1)', zIndex: '1', backgroundClip: 'padding-box', boxShadow: '1px 1px 15px rgba(27,31,35,.15)', padding: '40px', backgroundColor: 'white', borderRadius: '6px', color: 'black' }}>
                  <div style={{ textAlign: 'center' }}>
                    <h2>COACH</h2>
                    <hr style={{ width: '100px' }}/>
                  </div>

                  <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', letterSpacing: '1px', textAlign: 'center', height: '220px' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>{i18n.t('TierModal.coach_catch_phrase')}</p>
                    <div style={{ display: 'flex' }}>
                      <p style={{ fontSize: '3rem', fontWeight: '500' }}>300</p>
                      <p style={{ fontSize: '2.5rem', fontWeight: '500', marginTop: '-4px', marginLeft: '2px' }}>€</p>
                    </div>
                    <p style={{ fontSize: '1.2rem' }}>/ {i18n.t('Common_word.season').toLowerCase()}</p>
                    <p style={{ fontSize: '0.7rem', color: '#586069' }}>{i18n.t('Offers.card.collective.coach_perks.description')}</p>
                  </div>
                </div>

                <div style={{ flex: '1', margin: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid rgba(0,0,0,.1)', zIndex: '1', backgroundClip: 'padding-box', boxShadow: '1px 1px 15px rgba(27,31,35,.15)', padding: '40px', backgroundColor: 'white', borderRadius: '6px', color: 'black' }}>
                  <div style={{ textAlign: 'center' }}>
                    <h2>CLUB</h2>
                    <hr style={{ width: '100px' }}/>
                  </div>
                  <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', letterSpacing: '1px', textAlign: 'center', height: '220px' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>{i18n.t('TierModal.club_catch_phrase')}</p>
                    <div style={{ display: 'flex', marginTop: '20px' }}>
                      <p style={{ fontSize: '3rem', fontWeight: '500' }}>550</p>
                      <p style={{ fontSize: '2.5rem', fontWeight: '500', marginTop: '-4px', marginLeft: '2px' }}>€</p>
                    </div>
                    <p style={{ fontSize: '1.2rem' }}>/ {i18n.t('Common_word.season').toLowerCase()}</p>
                    <p style={{ fontSize: '0.7rem', color: '#586069' }}>{i18n.t('TierModal.club_description')}.</p>

                  </div>
                </div>
              </div>
              <Button style={{ width: '100%', marginTop: '20px', height: '55px', borderRadius: '5px', fontWeight: 'bold' }}type='primary' onClick={() => this.props.dispatch(router.navigate, '/coach/subscribe')}>{i18n.t('TierModal.button').toUpperCase()}</Button>
            </div>}
          {this.props.mobile.isOnIOS
          && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <h1 className={'tier_modal_catch_phrase'}>Vous n'êtes autorisé à faire cette action !</h1>
            <Button style={{ width: '100%', marginTop: '20px', height: '55px', borderRadius: '5px', fontWeight: 'bold' }}type='primary' onClick={this.closeModal}>FERMER</Button>
          </div>}
        </Modal>

      )
    }
}

export default initialProps => {
  const { dispatch, coach, mobile } = useStoreon('coach', 'mobile')
  return React.createElement(TierModal, {
    ...initialProps,
    dispatch,
    coach,
    mobile,
  })
}
