import React, { PureComponent } from 'react'
import RouterLink from '@/components/RouterLink'
import i18n from 'i18n-js'
import '@/i18n.js'

export default class extends PureComponent {
  render () {
    return (
      <div className='b-product-inner'>
        <div className='b-product-title'>
          {i18n.t('Products.stuff.title')}
        </div>
        <div className='b-product-subtitle'>
          <div>
            {i18n.t('Products.stuff.advertising_n1')}
          </div>
          <div>
            {i18n.t('Products.stuff.advertising_n2')}
          </div>
          <div>
            {i18n.t('Products.stuff.advertising_n3')}
          </div>
        </div>
        <img src='https://d1ceovtllg6jml.cloudfront.net/ballin_materiel.png' className='b-product-media' />
        <RouterLink to='/inscription'>
          <button className='b-button'>{i18n.t('HomePage.home-banner-button')}</button>
        </RouterLink>
      </div>
    )
  }
}
