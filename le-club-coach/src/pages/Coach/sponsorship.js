import '@/i18n'
import i18n from 'i18n-js'
import React from 'react'
import './sponsorship.scss'

import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from 'react-share'

import { Modal, Button, Icon, message } from 'antd'

export default (props) => {
  return (
    <Modal
      title={i18n.t('Sider.sponsorship_section.title')}
      visible={props.parrainageModal}
      onCancel={props.closeParrainageModal}
      maskClosable
      footer={false}
      width={'700px'}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
      }}>
        <h3 style={{ fontSize: '1.5rem' }}>{i18n.t('Sider.sponsorship_modal.description.first_normal_word')} <span style={{ color: '#e978b8' }}>{i18n.t('Sider.sponsorship_modal.description.first_bold_words')}</span> {i18n.t('Sider.sponsorship_modal.description.second_normal_words')}
          <span style={{ color: '#e978b8' }}> {i18n.t('Sider.sponsorship_modal.description.second_bold_words')}</span>*</h3>
        <p>{i18n.t('Sider.sponsorship_modal.instruction')}</p>
        <img style={{
          width: '200px',
          height: 'auto',
          margin: '5px 0',
        }}
        src={'https://i.eurosport.com/2017/03/19/2046682-42929127-2560-1440.jpg?w=1050'}
        />
        <div style={{ fontSize: '1.1rem', marginTop: '10px' }}>
          <p>{i18n.t('Sider.sponsorship_modal.explanation.normal_sentence')} <b>{i18n.t('Sider.sponsorship_modal.explanation.coach_formula')}</b></p>
          <p><b><span style={{ color: '#e978b8' }}>30€</span> {i18n.t('Sider.sponsorship_modal.explanation.money_for_you')}</b></p>
          <p><b><span style={{ color: '#e978b8' }}>15€</span> {i18n.t('Sider.sponsorship_modal.explanation.money_for_your_affiliate')}</b></p>
        </div>
        <div style={{ marginTop: '20px', fontSize: '1.1rem' }}>
          <p>{i18n.t('Sider.sponsorship_modal.explanation.normal_sentence')} <b>{i18n.t('Sider.sponsorship_modal.explanation.club_formula')}</b></p>
          <p><b><span style={{ color: '#e978b8' }}>50€</span> {i18n.t('Sider.sponsorship_modal.explanation.money_for_you')}</b></p>
          <p><b><span style={{ color: '#e978b8' }}>25€</span> {i18n.t('Sider.sponsorship_modal.explanation.money_for_your_affiliate')}</b></p>
        </div>
        <div className={'code-container'}>
          <input
            type={'text'}
            style={{ fontWeight: 'bold', border: 'dashed #ceceec 1px', padding: '5px' }}
            id={'code-parrainage'}
            value={props.parrainageToken}
            onChange={() => {
            }}
            onClick={(e) => {
              e.currentTarget.select()
              document.execCommand('copy')
              message.success(i18n.t('Common_word.copy'), 2)
            }}
          />
          <Button className={'copy-button'}
            onClick={() => {
              const e = document.getElementById('code-parrainage')
              e.select()
              document.execCommand('copy')
              message.success(i18n.t('Common_word.copy'), 2)
            }}>Copier</Button>
        </div>
        <div className={'share-container'}>
          <a href={`mailto:?subject=${i18n.t('Sider.sponsorship_section.mailMessage')}[${i18n.t('Common_word.code')}: ${props.parrainageToken}]`}>
            <div
              style={{
                cursor: 'pointer',
                backgroundColor: 'rgb(92, 202, 188)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '2.5rem',
                width: '2.5rem',
                borderRadius: '10px',
              }}>
              <Icon type='mail' theme='filled' style={{ color: 'white', fontSize: '1.5rem' }}/>
            </div>
          </a>
          <FacebookShareButton
            style={{ cursor: 'pointer' }}
            quote={`${i18n.t('Sider.sponsorship_section.shareMessage')} [${i18n.t('Common_word.code')}: "${props.parrainageToken}"].`}
            url={'https://teamballinfc.com/'}>
            <FacebookIcon size={'2.5rem'} round/>
          </FacebookShareButton>
          <TwitterShareButton
            style={{
              cursor: 'pointer',
              backgroundColor: '#4ba1ec',
              color: 'white',
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            title={`${i18n.t('Sider.sponsorship_section.shareMessage')} [${i18n.t('Common_word.code')}: "${props.parrainageToken}"].`}
            quote={`${i18n.t('Sider.sponsorship_section.shareMessage')} [${i18n.t('Common_word.code')}: "${props.parrainageToken}"].`}
            url={'https://teamballinfc.com/'}
            hastag={[i18n.t('Common_word.football'), i18n.t('Header.BrowseNavigation.videos'), 'LeClub', 'LeClubFc']}>
            <Icon type='twitter' style={{ fontSize: '1.25rem' }}/>
          </TwitterShareButton>
          <LinkedinShareButton
            style={{
              cursor: 'pointer',
              width: '2.5rem',
              height: '2.5rem',
            }}
            url={'https://teamballinfc.com/'}>
            <Icon type='linkedin' theme='filled' style={{ color: 'rgb(0, 115, 177)',
              fontSize: '2.5rem',
            }}/>
          </LinkedinShareButton>
        </div>
      </div>
    </Modal>
  )
}
