import './style.scss'

import React, { PureComponent } from 'react'
import i18n from 'i18n-js'
import '@/i18n'

export default class extends PureComponent {
  render () {
    return (
      <div className='b-navigation'>
        {/* <div className='b-navigation-item'>
          <a>{i18n.t('Header.ProductNavigation.product')}</a>
          <div className='b-navigation-items'>
            <div className='b-navigation-items-inner'>
              <a href='https://leClub.co/product/coach'>{i18n.t('Header.ProductNavigation.coaches')}</a>
              <a href='https://leClub.co/product/player'>{i18n.t('Header.ProductNavigation.players')}</a>
              <a href='https://leClub.co/product/recruiter'>{i18n.t('Header.ProductNavigation.recruiters')}</a>
              <a href='https://leClub.co/products/fan'>{i18n.t('Header.ProductNavigation.fans')}</a>
            </div>
          </div>
        </div> */}
        {/* <div className='b-navigation-item'>
          <a href='https://leClub.co/press'>{i18n.t('Header.BrowseNavigation.press')}</a>
        </div> */}
        <div className='b-navigation-item'>
          <a href='https://ballin.co/contact'>{i18n.t('Header.BrowseNavigation.contact')}</a>
        </div>
        {/* <div className='b-navigation-item'>
          <a href='https://teamballin.wordpress.com/' target='_blank'>{i18n.t('Header.BrowseNavigation.actualites')}</a>
        </div> */}
      </div>
    )
  }
}
