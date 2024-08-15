import React, { PureComponent } from 'react'
import RouterLink from '@/components/RouterLink'
import i18n from 'i18n-js'
import '@/i18n.js'

export default class extends PureComponent {
  render () {
    return (
      <div className='b-product-inner'>
        <div className='b-product-title'>
          {i18n.t('Products.reports.title')}
        </div>
        <div className='b-product-subtitle'>
          {i18n.t('Products.reports.explanation')}
        </div>
        <iframe width='800px' height='450px' className='b-product-media' src='https://www.youtube.com/embed/?listType=playlist&list=PLN439-aKKKKf3OXcD12jqAcJ7HVnUB3tw' frameBorder='0' allowFullScreen />
        <iframe width='800px' height='450px' className='b-product-media' src='https://www.youtube.com/embed/K_umm-g3cMY' frameBorder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowFullScreen />
        <iframe width='800px' height='450px' className='b-product-media' src='https://www.youtube.com/embed/a2AGKiGkw7U' frameBorder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowFullScreen />
        <iframe width='800px' height='450px' className='b-product-media' src='https://www.youtube.com/embed/V5X-aJ-qJQ4' frameBorder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowFullScreen />
        <RouterLink to='/inscription'>
          <button className='b-button'>{i18n.t('HomePage.home-banner-button')}</button>
        </RouterLink>
      </div>
    )
  }
}
