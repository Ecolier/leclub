import React, { PureComponent } from 'react'
import { Table, Button } from 'antd'
import RouterLink from '@/components/RouterLink'
import i18n from 'i18n-js'
import '@/i18n'
import './style.scss'

function dashboardRoute (type) {
  if (type === i18n.t('Offers.card.individual.basic_perks.website_access')
  || type === i18n.t('Offers.card.individual.basic_perks.detections')
  || type === i18n.t('Offers.card.individual.basic_perks.video_management')
  || type === i18n.t('Offers.card.individual.basic_perks.video_analysis')
  || type === i18n.t('Offers.card.individual.premium_perks.add_logo')
  || type === i18n.t('Offers.card.individual.premium_perks.video_playlist')
  || type === i18n.t('Offers.card.individual.premium_perks.download_video')
  || type === i18n.t('Offers.team_number')) { return '/products/plus' }
  if (type === i18n.t('Offers.card.collective.coach_perks.pre_editing')) { return '/products/pre-made-clips' }
  if (type === i18n.t('Offers.card.collective.coach_perks.video_material')) { return '/products/stuff' }
  return '/login'
}
const columns = [
  {
    title: 'type',
    render: text => <div><p>{text}</p><RouterLink target={'_blank'} to={dashboardRoute(text)}><Button size='small' type='primary'>{i18n.t('Common_word.learn_more')}</Button></RouterLink></div>,
    dataIndex: 'titre',
    key: 'key1',
    className: 'noBackgroundTabs',
  },
  {
    title: 't0',
    render: text => text === 'Illimité' ? (<i className='fas fa-check' style={{ color: '#35d058', fontSize: '1.5rem' }}/>) : text === 'X' ? (<i className='fas fa-times' style={{ color: '#f5222d', fontSize: '1.5rem' }}/>) : <p>{text}</p>,
    dataIndex: 'titleT0',
    key: 'key2',
    align: 'center',
    className: 'noBackgroundTabs',

  }, {
    title: 't1',
    render: text => text === 'Illimité' ? (<i className='fas fa-check' style={{ color: '#35d058', fontSize: '1.5rem' }}/>) : text === 'X' ? (<i className='fas fa-times' style={{ color: '#f5222d', fontSize: '1.5rem' }}/>) : <p>{text}</p>,

    dataIndex: 'titleT1',
    key: 'key3',
    align: 'center',
    className: 'noBackgroundTabs',

  }, {
    title: 't2',
    render: text => text === 'Illimité' ? (<i className='fas fa-check' style={{ color: '#35d058', fontSize: '1.5rem' }}/>) : text === 'X' ? (<i className='fas fa-times' style={{ color: '#f5222d', fontSize: '1.5rem' }}/>) : <p style={{ color: 'white' }}>{text}</p>,

    dataIndex: 'titleT2',
    key: 'key4',
    align: 'center',
    className: 'backgroundTabs',

  }, {
    title: 't3',
    render: text => text === 'Illimité' ? (<i className='fas fa-check' style={{ color: '#35d058', fontSize: '1.5rem' }}/>) : text === 'X' ? (<i className='fas fa-times' style={{ color: '#f5222d', fontSize: '1.5rem' }}/>) : <p style={{ color: 'white' }}>{text}</p>,

    dataIndex: 'titleT3',
    key: 'key5',
    align: 'center',
    className: 'backgroundTabs',
  },
  // {
  //   title: 't4',
  //   render: type => <RouterLink to={type}><Button type='primary'>EN SAVOIR PLUS</Button></RouterLink>,
  //   dataIndex: 'titleT4',
  //   key: 'key6',
  //   align: 'center',
  //   className: 'backgroundTabs',
  // },
]
const communicationData = [
  {
    titre: i18n.t('Offers.card.individual.basic_perks.website_access'),
    titleT0: 'Illimité',
    titleT1: 'Illimité',
    titleT2: 'Illimité',
    titleT3: 'Illimité',
    key: 'key1',
  },
  {
    titre: i18n.t('Offers.card.individual.basic_perks.detections'),
    titleT0: 'Illimité',
    titleT1: 'Illimité',
    titleT2: 'Illimité',
    titleT3: 'Illimité',
    key: 'key2',
  },
  {
    titre: i18n.t('Offers.card.individual.basic_perks.video_management'),
    titleT0: 'Illimité',
    titleT1: 'Illimité',
    titleT2: 'Illimité',
    titleT3: 'Illimité',
    key: 'key3',
  },

  {
    titre: i18n.t('Offers.card.individual.basic_perks.video_analysis'),
    titleT0: 'Illimité',
    titleT1: 'Illimité',
    titleT2: 'Illimité',
    titleT3: 'Illimité',
    key: 'key4',
  },

  {
    titre: i18n.t('Offers.card.individual.premium_perks.add_logo'),
    titleT0: 'X',
    titleT1: 'Illimité',
    titleT2: 'Illimité',
    titleT3: 'Illimité',
    key: 'key5',
  },

  {
    titre: i18n.t('Offers.card.individual.premium_perks.video_playlist'),
    titleT0: 'X',
    titleT1: 'Illimité',
    titleT2: 'Illimité',
    titleT3: 'Illimité',
    key: 'key6',
  },

  {
    titre: i18n.t('Offers.card.collective.coach_perks.pre_editing'),
    titleT0: 'X',
    titleT1: 'Illimité',
    titleT2: 'Illimité',
    titleT3: 'Illimité',
    key: 'key7',
  },
  {
    titre: i18n.t('Offers.card.individual.premium_perks.download_video'),
    titleT0: 'X',
    titleT1: 'Illimité',
    titleT2: 'Illimité',
    titleT3: 'Illimité',
    key: 'key8',
  },
  {
    titre: i18n.t('Offers.card.collective.coach_perks.video_material'),
    titleT0: 'X',
    titleT1: 'X',
    titleT2: 'Illimité',
    titleT3: 'Illimité',
    key: 'key10',
  },
  {
    titre: i18n.t('Offers.team_number'),
    titleT0: `1 ${i18n.t('Common_word.team').toLowerCase()}`,
    titleT1: `1 ${i18n.t('Common_word.team').toLowerCase()}`,
    titleT2: `2 ${i18n.t('Common_word.teams').toLowerCase()}`,
    titleT3: i18n.t('Common_word.unlimited'),
    key: 'key',
  },

]
export default class extends PureComponent {

  render () {

    return (
      <div style={{ width: '100%', overflow: 'auto' }}>
        <div style={{ maxWidth: '800px', margin: '50px auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '40px' }}>{i18n.t('Offers.compare.title')}</h2>
          <p style={{ textAlign: 'center', color: '#586069', fontSize: '16px', fontWeight: '400' }}>{i18n.t('Offers.compare.description')}</p>
        </div>
        <div style={{ width: '100%', overflow: 'auto' }}>

          <div style={{ display: 'flex', flexDirection: 'column', width: '95%', margin: '25px auto' }}>
            <div style={{ display: 'flex', width: '100%' }}>
              <div className={'empty_cell'} />
              <div style={{ width: '100%', border: 'solid 0.5px rgba(88, 96, 105, 0.3)', paddingTop: '16px', paddingBottom: '16px' }}>
                <h3 style={{ textAlign: 'center', margin: '0', fontSize: '16px' }}>{i18n.t('Offers.card.individual.title')}</h3>
              </div>
              <div style={{ width: '100%', backgroundColor: '#032f62', border: 'solid 0.5px #044289', paddingTop: '16px', paddingBottom: '16px' }}>
                <h3 style={{ color: 'white', textAlign: 'center', margin: '0', fontSize: '16px' }}>{i18n.t('Common_word.team')}</h3>
              </div>
            </div>
            <div className={'formula_cell_container'}>
              <div style={{ width: '50%' }} />
              <div style={{ display: 'flex', width: '100%', border: 'solid 0.5px rgba(88, 96, 105, 0.5)', borderTop: 'none' }}>
                <div style={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: 'solid 0.5px rgba(88, 96, 105, 0.5)', padding: '16px' }}>
                  <p style={{ color: 'black', fontSize: '18px', fontWeight: '500' }}>{i18n.t('Common_word.basic')}</p>
                  <p style={{ color: 'black', fontSize: '30px', fontWeight: '500' }}>0€</p>
                  <p style={{ fontSize: '14px', color: '#586069' }}>/ {i18n.t('Common_word.season')}</p>
                </div>
                <div style={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: 'solid 0.5px rgba(88, 96, 105, 0.5)', padding: '16px' }}>
                  <p style={{ color: 'black', fontSize: '18px', fontWeight: '500' }}>{i18n.t('Common_word.premium')}</p>
                  <p style={{ color: 'black', fontSize: '30px', fontWeight: '500' }}>10€</p>
                  <p style={{ fontSize: '14px', color: '#586069' }}>/ {i18n.t('Common_word.month')}</p>
                </div>
              </div>
              <div style={{ display: 'flex', width: '100%', backgroundColor: '#032f62' }}>
                <div style={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: 'solid 0.5px #044289', padding: '16px' }}>
                  <p style={{ color: 'white', fontSize: '18px', fontWeight: '500' }}>{i18n.t('Common_word.coach')}</p>
                  <p style={{ color: 'white', fontSize: '30px', fontWeight: '500' }}>300€</p>
                  <p style={{ fontSize: '14px', color: 'hsla(0,0%,100%,.7)' }}>/ {i18n.t('Common_word.season')}</p>
                </div>
                <div style={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: 'solid 0.5px #044289', padding: '16px' }}>
                  <p style={{ color: 'white', fontSize: '18px', fontWeight: '500' }}>{i18n.t('Common_word.club')}</p>
                  <p style={{ color: 'white', fontSize: '30px', fontWeight: '500' }}>550€</p>
                  <p style={{ fontSize: '14px', color: 'hsla(0,0%,100%,.7)' }}>/ {i18n.t('Common_word.season')}</p>
                </div>
              </div>
            </div>
          </div>
          <div style={{ width: '95%', margin: '10px auto' }}>
            <Table showHeader={false} bordered columns={columns} dataSource={communicationData} pagination={false} />
          </div>
        </div>
      </div>
    )
  }

}
