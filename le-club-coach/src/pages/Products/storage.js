import React, { PureComponent } from 'react'
import RouterLink from '@/components/RouterLink'
import i18n from 'i18n-js'
import '@/i18n.js'

export default class extends PureComponent {
  render () {
    return (
      <div className='b-product-inner'>
        <div className='b-product-title'>
          {i18n.t('Products.storage.title')}
        </div>
        <div className='b-product-subtitle'>
          <div>{i18n.t('Products.storage.explanation_first_part')}</div>
          <div>{i18n.t('Products.storage.explanation_second_part')}</div>
        </div>
        <img src='https://d1ceovtllg6jml.cloudfront.net/ballin_applications_stockage.png' className='b-product-media' />
        <RouterLink to='/inscription'>
          <button className='b-button'>{i18n.t('HomePage.home-banner-button')}</button>
        </RouterLink>
      </div>
    )
  }
}
