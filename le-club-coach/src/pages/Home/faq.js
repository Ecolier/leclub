import React, { PureComponent, Fragment } from 'react'
import { Collapse, Icon } from 'antd'
import './faq.scss'
import i18n from 'i18n-js'
import '@/i18n.js'

const Panel = Collapse.Panel

class Faq extends PureComponent {
  render () {
    return (
      <Fragment>
        <div className={'header'}>
          <Icon type='left' style={{ fontSize: '1.25rem' }} onClick={() => window.history.back()}/>
          <h1>{i18n.t('FAQ.title')}</h1>
        </div>
        <div className={'faq-content'}>
          <h4 style={{ color: '#2CC1EB' }}>{i18n.t('Common_word.general')}</h4>
          <Collapse defaultActiveKey={['1']}>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q1.question')} key='1'>
              <p>{i18n.t('FAQ.leClubExplanation.Q1.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q2.question')} key='2'>
              <p>{i18n.t('FAQ.leClubExplanation.Q2.answer').join('\n')}</p>
              <img className={'centered-image'} src='https://s3.eu-west-3.amazonaws.com/ballin-ressources/opportunites.png' />
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q3.question')} key='3'>
              <p>{i18n.t('FAQ.leClubExplanation.Q3.answer')} :</p>
              <p>
                <i className='fas fa-circle' style={{ fontSize: '0.7rem', textAlign: 'center', padding: '0.5rem', color: '#ea158c' }}/>
                {i18n.t('FAQ.leClubExplanation.Q3.basic')}
              </p>
              <p>
                <i className='fas fa-circle' style={{ fontSize: '0.7rem', textAlign: 'center', padding: '0.5rem', color: '#ea158c' }}/>
                {i18n.t('FAQ.leClubExplanation.Q3.premium')}
              </p>
              <p>
                <i className='fas fa-circle' style={{ fontSize: '0.7rem', textAlign: 'center', padding: '0.5rem', color: '#ea158c' }}/>
                {i18n.t('FAQ.leClubExplanation.Q3.coach')}
              </p>
              <p>
                <i className='fas fa-circle' style={{ fontSize: '0.7rem', textAlign: 'center', padding: '0.5rem', color: '#ea158c' }}/>
                {i18n.t('FAQ.leClubExplanation.Q3.club')}
              </p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q4.question')} key='4'>
              <p>{i18n.t('FAQ.leClubExplanation.Q4.answer').join('\n')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q5.question')} key='5'>
              <p>{i18n.t('FAQ.leClubExplanation.Q5.answer').join('\n')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q6.question')} key='6'>
              <p>{i18n.t('FAQ.leClubExplanation.Q6.answer_first_part')} :</p>
              <p><i className='fas fa-circle' style={{ fontSize: '0.7rem', textAlign: 'center', padding: '0.5rem', color: '#ea158c' }}/>{i18n.t('FAQ.leClubExplanation.Q6.reason_n1')}</p>
              <p><i className='fas fa-circle' style={{ fontSize: '0.7rem', textAlign: 'center', padding: '0.5rem', color: '#ea158c' }}/>{i18n.t('FAQ.leClubExplanation.Q6.reason_n2')}</p>
              <p><i className='fas fa-circle' style={{ fontSize: '0.7rem', textAlign: 'center', padding: '0.5rem', color: '#ea158c' }}/>{i18n.t('FAQ.leClubExplanation.Q6.reason_n3')}</p>
              <p>{i18n.t('FAQ.leClubExplanation.Q6.answer_second_part')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q7.question')} key='7'>
              <p>{i18n.t('FAQ.leClubExplanation.Q7.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q8.question')} key='8'>
              <p>{i18n.t('FAQ.leClubExplanation.Q8.answer').join('\n')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q9.question')} key='9'>
              <p>{i18n.t('FAQ.leClubExplanation.Q9.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q10.question')} key='10'>
              <p>{i18n.t('FAQ.leClubExplanation.Q10.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q11.question')} key='11'>
              <p>{i18n.t('FAQ.leClubExplanation.Q11.answer').join('\n')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q12.question')} key='12'>
              <p>{i18n.t('FAQ.leClubExplanation.Q12.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q13.question')} key='13'>
              <p>{i18n.t('FAQ.leClubExplanation.Q13.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q14.question')} key='14'>
              <p>{i18n.t('FAQ.leClubExplanation.Q14.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q15.question')} key='15'>
              <p>{i18n.t('FAQ.leClubExplanation.Q15.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q16.question')} key='16'>
              <p>{i18n.t('FAQ.leClubExplanation.Q16.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q17.question')} key='17'>
              <p>{i18n.t('FAQ.leClubExplanation.Q17.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q18.question')} key='18'>
              <p>{i18n.t('FAQ.leClubExplanation.Q18.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q19.question')} key='19'>
              <p>{i18n.t('FAQ.leClubExplanation.Q19.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q20.question')} key='20'>
              <p>{i18n.t('FAQ.leClubExplanation.Q20.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q21.question')} key='21'>
              <p>{i18n.t('FAQ.leClubExplanation.Q21.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q22.question')} key='22'>
              <p>{i18n.t('FAQ.leClubExplanation.Q22.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q23.question')} key='23'>
              <p>{i18n.t('FAQ.leClubExplanation.Q23.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q24.question')} key='24'>
              <p>{i18n.t('FAQ.leClubExplanation.Q24.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q25.question')} key='25'>
              <p>{i18n.t('FAQ.leClubExplanation.Q25.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q26.question')} key='26'>
              <p>{i18n.t('FAQ.leClubExplanation.Q26.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q27.question')} key='27'>
              <p>{i18n.t('FAQ.leClubExplanation.Q27.answer').join('\n')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q28.question')} key='28'>
              <p>{i18n.t('FAQ.leClubExplanation.Q28.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q29.question')} key='29'>
              <p>{i18n.t('FAQ.leClubExplanation.Q29.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q30.question')} key='30'>
              <p>{i18n.t('FAQ.leClubExplanation.Q30.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q31.question')} key='31'>
              <p>{i18n.t('FAQ.leClubExplanation.Q31.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q32.question')} key='32'>
              <p>{i18n.t('FAQ.leClubExplanation.Q32.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q33.question')} key='33'>
              <p>{i18n.t('FAQ.leClubExplanation.Q33.answer_first_part')}</p>
              <p>{i18n.t('FAQ.leClubExplanation.Q33.answer_second_part')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q34.question')} key='34'>
              <p>{i18n.t('FAQ.leClubExplanation.Q34.answer')}</p>
              <p>
                <i className='fas fa-circle' style={{ fontSize: '0.7rem', textAlign: 'center', padding: '0.5rem', color: '#ea158c' }}/>
                {i18n.t('FAQ.leClubExplanation.Q34.skill_n1')}
              </p>
              <p>
                <i className='fas fa-circle' style={{ fontSize: '0.7rem', textAlign: 'center', padding: '0.5rem', color: '#ea158c' }}/>
                {i18n.t('FAQ.leClubExplanation.Q34.skill_n2')}
              </p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q35.question')} key='35'>
              <p>{i18n.t('FAQ.leClubExplanation.Q35.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q36.question')} key='36'>
              <p>{i18n.t('FAQ.leClubExplanation.Q36.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.leClubExplanation.Q37.question')} key='37'>
              <p><strong>{i18n.t('FAQ.leClubExplanation.Q37.answer')}</strong></p>
              <p>{i18n.t('FAQ.leClubExplanation.Q37.imageRight.title')} :</p>
              <p><i className='fas fa-circle' style={{ fontSize: '0.7rem', textAlign: 'center', padding: '0.5rem', color: '#ea158c' }}/>{i18n.t('FAQ.leClubExplanation.Q37.imageRight.explanation_n1')}</p>
              <p><i className='fas fa-circle' style={{ fontSize: '0.7rem', textAlign: 'center', padding: '0.5rem', color: '#ea158c' }}/>{i18n.t('FAQ.leClubExplanation.Q37.imageRight.explanation_n2')}</p>
              <p>{i18n.t('FAQ.leClubExplanation.Q37.imageRight.explanation_n3')} :</p>
              <p><i className='fas fa-circle' style={{ fontSize: '0.7rem', textAlign: 'center', padding: '0.5rem', color: '#ea158c' }}/>{i18n.t('FAQ.leClubExplanation.Q37.imageRight.explanation_n4')}</p>
              <p><i className='fas fa-circle' style={{ fontSize: '0.7rem', textAlign: 'center', padding: '0.5rem', color: '#ea158c' }}/>{i18n.t('FAQ.leClubExplanation.Q37.imageRight.explanation_n5')}</p>
              <p><i className='fas fa-circle' style={{ fontSize: '0.7rem', textAlign: 'center', padding: '0.5rem', color: '#ea158c' }}/>{i18n.t('FAQ.leClubExplanation.Q37.imageRight.explanation_n6')}</p>
              <p>{i18n.t('FAQ.leClubExplanation.Q37.imageRight.explanation_n7')}

                {i18n.t('FAQ.leClubExplanation.Q37.imageRight.explanation_n8').join('\n')}
              </p>
              <p>{i18n.t('FAQ.leClubExplanation.Q37.imageRight.more')} :</p>
              <p>
                <a target='_blank' href='http://www.legadroit.com/droit-image.html'>http://www.legadroit.com/droit-image.html</a>
              </p>
              <p>
                <a target='_blank' href='http://www.cabinetbouchara.com/P-351-2-A1-le-droit-a-l-image.html'>http://www.cabinetbouchara.com/P-351-2-A1-le-droit-a-l-image.html</a>
              </p>
              <p>
                <a target='_blank' href='http://www.droit-image.com/droit-a-limage-des-personnes.html'>http://www.droit-image.com/droit-a-limage-des-personnes.html</a>
              </p>
            </Panel>
          </Collapse>

          <h4 style={{ marginTop: '20px', color: '#2CC1EB' }}>{i18n.t('FAQ.aboutUs.title')}</h4>
          <Collapse defaultActiveKey={['1']}>

            <Panel header={i18n.t('FAQ.aboutUs.Q1.question')} key='1'>
              <p>{i18n.t('FAQ.aboutUs.Q1.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.aboutUs.Q2.question')} key='2'>
              <p>{i18n.t('FAQ.aboutUs.Q2.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.aboutUs.Q3.question')} key='3'>
              <p>{i18n.t('FAQ.aboutUs.Q3.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.aboutUs.Q4.question')} key='4'>
              <p>{i18n.t('FAQ.aboutUs.Q4.answer')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.aboutUs.Q5.question')} key='5'>
              <p>{i18n.t('FAQ.aboutUs.Q5.answer_first_part')}</p>
              <p>{i18n.t('FAQ.aboutUs.Q5.answer_second_part')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.aboutUs.Q6.question')} key='6'>
              <p><strong>{i18n.t('FAQ.aboutUs.Q6.value_n1_first_part')}</strong> : {i18n.t('FAQ.aboutUs.Q6.value_n1_second_part')}</p>
              <p><strong>{i18n.t('FAQ.aboutUs.Q6.value_n2_first_part')}</strong>{i18n.t('FAQ.aboutUs.Q6.value_n2_second_part')}</p>
              <p><strong>{i18n.t('FAQ.aboutUs.Q6.value_n3_first_part')}</strong>{i18n.t('FAQ.aboutUs.Q6.value_n3_second_part')}</p>
              <p><strong>{i18n.t('FAQ.aboutUs.Q6.value_n4_first_part')}</strong>{i18n.t('FAQ.aboutUs.Q6.value_n4_second_part')}</p>
            </Panel>
            <Panel header={i18n.t('FAQ.aboutUs.moreQuestion')} key='7'>
              <p>{'team@leClub.co'}</p>
            </Panel>
          </Collapse>
        </div>
      </Fragment>
    )
  }
}

export default Faq
