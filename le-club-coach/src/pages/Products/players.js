import React, { PureComponent } from 'react'
import i18n from 'i18n-js'
import '@/i18n.js'

export default class extends PureComponent {
  render () {
    return (
      <div className='b-product-inner'>
        <div className='b-product-title'>
          {i18n.t('Products.playerApp.title')}
        </div>
        <div style={{ marginTop: 40 }}>
          <div className='mobile-badges' style={{ display: 'flex', justifyContent: 'center' }}>
            <a target='_blanck' href='https://itunes.apple.com/us/app/ballin-fc/id1457171138?l=fr&ls=1&mt=8'>
              <img height='168px' style={{ marginTop: '-14px' }} src='../../assets/appstore.png' />
            </a>
            <a href='https://play.google.com/store/apps/details?id=leClubProduction.app' target='_blank'>
              <img height='140px' src='../../assets/playstore.png' />
            </a>
          </div>
          <img style={{ marginTop: '100px' }} src='https://d1ceovtllg6jml.cloudfront.net/ballin_application_joueur_profil.png' className='b-product-media' />
        </div>
        <div className='mobile-badges' style={{ display: 'flex', justifyContent: 'center' }}>
          <a target='_blanck' href='https://itunes.apple.com/us/app/ballin-fc/id1457171138?l=fr&ls=1&mt=8'>
            <img height='84px' style={{ marginTop: '-8px' }} src='../../assets/appstore.png' />
          </a>
          <a href='https://play.google.com/store/apps/details?id=leClubProduction.app' target='_blank'>
            <img height='70px' src='../../assets/playstore.png' />
          </a>
        </div>
      </div>
    )
  }
}
