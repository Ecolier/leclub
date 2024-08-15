import React, { PureComponent } from 'react'
import 'moment/locale/fr'
import i18n from 'i18n-js'
import '@/i18n.js'

export default class extends PureComponent {

  render () {
    return (
      <div style={{ width: '80%', fontSize: '1.5rem', margin: 'auto' }}>
        <div style={{ maxWidth: '800px', margin: 'auto' }}>
          <p style={{ textAlign: 'center', color: '#586069', fontSize: '20px', fontWeight: '400' }}>{i18n.t('Header.ProductNavigation.plus')}</p>
          <hr style={{ width: '30%', margin: 'auto', padding: '2px' }} />
          <h1 style={{ textAlign: 'center', fontSize: '40px' }}>{i18n.t('Products.plus.title')}</h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid rgba(0,0,0,.1)', backgroundClip: 'padding-box', boxShadow: '1px 1px 15px rgba(27,31,35,.15)', padding: '30px', backgroundColor: 'white', borderRadius: '6px', color: 'black' }}>
          <h3 style={{ color: '#EA178C', marginBottom: '-5px' }}>{i18n.t('Products.plus.teamNumber.title')}</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '20px', color: '#586069', fontStyle: 'italic' }}>{i18n.t('Products.plus.teamNumber.explanation')}</p>
          <p style={{ fontSize: '0.9rem' }}><b style={{ color: '#2CC1EB' }}>{i18n.t('Products.plus.teamNumber.basic.title')}:</b> {i18n.t('Products.plus.teamNumber.basic.explanation')}</p>
          <p style={{ fontSize: '0.9rem' }}><b style={{ color: '#2CC1EB' }}>{i18n.t('Products.plus.teamNumber.premium.title')}:</b> {i18n.t('Products.plus.teamNumber.premium.explanation')}</p>
          <p style={{ fontSize: '0.9rem' }}><b style={{ color: '#2CC1EB' }}>{i18n.t('Products.plus.teamNumber.coach.title')}:</b> {i18n.t('Products.plus.teamNumber.coach.explanation')}</p>
          <p style={{ fontSize: '0.9rem' }}><b style={{ color: '#2CC1EB' }}>{i18n.t('Products.plus.teamNumber.club.title')}:</b> {i18n.t('Products.plus.teamNumber.club.explanation')}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: '20px' }}>
          <div style={{ backgroundColor: '#032f62', display: 'flex', flexDirection: 'column', border: '1px solid rgba(0,0,0,.1)', backgroundClip: 'padding-box', boxShadow: '1px 1px 15px rgba(27,31,35,.15)', padding: '30px', borderRadius: '6px', color: 'white' }}>
            <h3 style={{ color: '#EA178C', marginBottom: '0px' }}>{i18n.t('Products.plus.detection.title')}</h3>
            <p style={{ fontSize: '0.9rem' }}>{i18n.t('Products.plus.detection.explanation')} <a href='https://youtu.be/JIe7UX3Bmik' target='_blank'>{'https://youtu.be/JIe7UX3Bmik'}</a></p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: '20px' }}>
          <div style={{ backgroundColor: '#032f62', marginRight: '20px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(0,0,0,.1)', backgroundClip: 'padding-box', boxShadow: '1px 1px 15px rgba(27,31,35,.15)', padding: '30px', borderRadius: '6px', color: 'white' }}>
            <h3 style={{ color: '#EA178C', marginBottom: '0px' }}>{i18n.t('Products.plus.share.title')}</h3>
            <p style={{ fontSize: '0.9rem' }}>{i18n.t('Products.plus.share.explanation')}</p>
          </div>
          <div style={{ display: 'flex', width: '80%', flexDirection: 'column', border: '1px solid rgba(0,0,0,.1)', backgroundClip: 'padding-box', boxShadow: '1px 1px 15px rgba(27,31,35,.15)', padding: '30px', backgroundColor: 'white', borderRadius: '6px', color: 'black' }}>
            <h3 style={{ color: '#EA178C', marginBottom: '0px' }}>{i18n.t('Products.plus.logo.title')}</h3>
            <p style={{ fontSize: '0.9rem' }}>{i18n.t('Products.plus.logo.explanation')}</p>
            <p style={{ fontSize: '0.9rem', color: '#586069', fontStyle: 'italic', marginTop: 'auto' }}>{i18n.t('Products.plus.disclaimer')}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', marginTop: '20px' }}>

          <div style={{ backgroundColor: 'white', marginRight: '20px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(0,0,0,.1)', backgroundClip: 'padding-box', boxShadow: '1px 1px 15px rgba(27,31,35,.15)', padding: '30px', borderRadius: '6px', color: 'black' }}>
            <h3 style={{ color: '#EA178C', marginBottom: '0px' }}>{i18n.t('Products.plus.edit.title')}</h3>
            <p style={{ fontSize: '0.9rem' }}>{i18n.t('Products.plus.edit.explanation')}</p>
            <p style={{ fontSize: '0.9rem', color: '#586069', fontStyle: 'italic', marginTop: 'auto' }}>{i18n.t('Products.plus.disclaimer')}</p>

          </div>
          <div style={{ backgroundColor: '#032f62', display: 'flex', width: '80%', flexDirection: 'column', border: '1px solid rgba(0,0,0,.1)', backgroundClip: 'padding-box', boxShadow: '1px 1px 15px rgba(27,31,35,.15)', padding: '30px', borderRadius: '6px', color: 'white' }}>
            <h3 style={{ color: '#EA178C', marginBottom: '0px' }}>{i18n.t('Products.plus.download.title')}</h3>
            <p style={{ fontSize: '0.9rem' }}>{i18n.t('Products.plus.download.explanation')}</p>
            <p style={{ fontSize: '0.9rem', color: '#b5c1d0', fontStyle: 'italic', marginTop: 'auto' }}>{i18n.t('Products.plus.disclaimer')}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', marginTop: '20px' }}>
          <div style={{ backgroundColor: '#032f62', display: 'flex', flexDirection: 'column', border: '1px solid rgba(0,0,0,.1)', backgroundClip: 'padding-box', boxShadow: '1px 1px 15px rgba(27,31,35,.15)', padding: '30px', borderRadius: '6px', color: 'white' }}>
            <h3 style={{ color: '#EA178C', marginBottom: '0px' }}>{i18n.t('Products.plus.privacy.title')}</h3>
            <p style={{ fontSize: '0.9rem' }}>{i18n.t('Products.plus.privacy.explanation')}</p>
            <p style={{ fontSize: '0.9rem' }}>{i18n.t('Products.plus.privacy.disclaimer').join('\n')}</p>
          </div>
        </div>
        <div style={{ fontStyle: 'italic', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', fontSize: '1.2rem', marginTop: '10px' }}>
          <div>
            <p style={{ color: 'red', marginBottom: '-15px', marginLeft: '-10px' }}>*</p>
            <p style={{ marginTop: '0px' }}>{i18n.t('Products.plus.privatePrice.premium')}</p>
            <p>{i18n.t('Products.plus.privatePrice.coach')}</p>
            <p>{i18n.t('Products.plus.privatePrice.club')}</p>
          </div>
          <div>
            <p style={{ color: 'red', marginBottom: '-15px', marginLeft: '-10px' }}>*</p>
            <p style={{ marginTop: '0px' }}>{i18n.t('Products.plus.publicPrice.title')} :</p>
            <p>{i18n.t('Products.plus.publicPrice.premium')}</p>
            <p>{i18n.t('Products.plus.publicPrice.coach')}</p>
            <p>{i18n.t('Products.plus.publicPrice.club')}</p>
          </div>
        </div>
      </div>
    )
  }
}
