import React, { PureComponent } from 'react'
import i18n from 'i18n-js'
import '@/i18n.js'

export default class extends PureComponent {
  render () {
    return (
      <div className='b-product-inner' style={{ justifySelf: 'center' }}>
        <div className='b-product-title'>
          {i18n.t('Products.custom.title')}
        </div>
        <div>{i18n.t('Products.custom.contact')}: <a href='mailto:team@leClub.co'>team@leClub.co</a></div>
      </div>
    )
  }
}
