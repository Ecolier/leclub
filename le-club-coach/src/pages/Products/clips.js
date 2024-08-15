import React, { PureComponent } from 'react'
import CutSample from '@/components/CutSample'
import RouterLink from '@/components/RouterLink'
import i18n from 'i18n-js'
import '@/i18n.js'

export default class extends PureComponent {
  render () {
    return (
      <div className='b-product-inner'>
        <div className='b-product-title'>
          {i18n.t('HomePage.clip-disclaimer-title')}
        </div>
        <div className='b-product-subtitle'>
          <div>{i18n.t('HomePage.clip-disclaimer-subtitle_firstSentence')}</div>
          <div>{i18n.t('HomePage.clip-disclaimer-subtitle_secondSentence')}</div>
        </div>
        <CutSample
          source='https://d1ceovtllg6jml.cloudfront.net/ballin_8eme_france_argentine_demo_cut_sequencage.mp4'
          homeSample
        />
        <RouterLink to='/inscription'>
          <button className='b-button' style={{ marginTop: 40 }}>{i18n.t('HomePage.home-banner-button')}</button>
        </RouterLink>
      </div>
    )
  }
}
