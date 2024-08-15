import './style.scss'

import React, { PureComponent } from 'react'
import Navigation from '../Navigation'
import RouterLink from '../RouterLink'
import { connectStoreon } from 'storeon/react'
import i18n from 'i18n-js'
import '@/i18n.js'

class Footer extends PureComponent {
  render () {
    if (this.props.coach.isAuthenticated) {
      return null
    }
    return (
      <div className='footer'>
        <div className='footer-side'>
          <div>
            <div onClick={this.headerClick} className='leClub-logo' src='https://d1ceovtllg6jml.cloudfront.net/logo.backGround.png'></div>
            <div style={{ marginTop: 20 }}>
              <div><a href='https://ballin.co/assets/legal/2019.01.01%20Mentions%20légales.pdf'>{i18n.t('Common_word.legalMentions')}</a></div>
              <div><a href='https://ballin.co/assets/legal/PDC.pdf'>{i18n.t('Common_word.confidentialityPolicies')}</a></div>
              <div><a href='https://ballin.co/assets/legal/CGU.pdf'>CGU</a></div>
              <div><a href='https://ballin.co/assets/legal/CGV.pdf'>CGV</a></div>
              <div><a href='https://ballin.co/faq'>FAQ</a></div>
            </div>
          </div>
          <Navigation />
        </div>
        <div className='footer-side'>
          <div>
            <div className='mobile-app'>
              <div className='mobile-app-name'>{i18n.t('Common_word.player_app')}</div>
              <div className='mobile-badges'>
                <a target='_blanck' href='https://itunes.apple.com/us/app-fc/id1457171138?l=fr&ls=1&mt=8'>
                  <img height='84px' style={{ marginTop: '-8px' }} src='../../assets/appstore.png' alt='ios mobile application teamballinfc youth players grassroot-football football' />
                </a>
                <a href='https://play.google.com/store/apps/details?id=leClubProduction.app' target='_blank'>
                  <img height='70px' src='../../assets/playstore.png' alt='android mobile application teamballinfc youth players grassroot-football football' />
                </a>
              </div>
            </div>
            {/* <div className='mobile-app'>
              <div className='mobile-app-name'>Application Coach</div>
              <div className='mobile-badges'>
                <img src='https://parisianavores.paris/wp-content/uploads/2016/02/app-store-badge-fr.png' />
                <img src='https://play.google.com/intl/en_us/badges/images/badge_new.png' />
              </div>
            </div>*/}
          </div>
        </div>
      </div>
    )
  }
}

export default connectStoreon('coach', Footer)
