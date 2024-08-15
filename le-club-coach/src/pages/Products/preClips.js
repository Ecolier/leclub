import React, { PureComponent } from 'react'
import RouterLink from '@/components/RouterLink'
import i18n from 'i18n-js'
import '@/i18n.js'

export default class extends PureComponent {
  render () {
    return (
      <div className='b-product-inner'>
        <div className='b-product-title'>
          {i18n.t('Products.liveEditing.title')}
        </div>
        <div className='b-product-subtitle'>
          <div>{i18n.t('Products.liveEditing.explanation_first_part')}</div>
          <div>{i18n.t('Products.liveEditing.explanation_second_part')}</div>
        </div>
        <iframe style={{ marginBottom: '20px' }} width='80%' height='720px' src='https://www.youtube.com/embed/c7w7UCTNmQ0' frameBorder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowFullScreen />
        <RouterLink to='/inscription'>
          <button className='b-button'>{i18n.t('HomePage.home-banner-button')}</button>
        </RouterLink>
      </div>
    )
  }
}
