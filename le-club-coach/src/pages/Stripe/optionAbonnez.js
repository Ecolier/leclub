import React, { Component } from 'react'
import { useStoreon } from 'storeon/react'
import { Button, Modal, Popconfirm } from 'antd'
import { updateCoachOption } from '@/actions/stripe'
import i18n from 'i18n-js'
import '@/i18n'
import './style.scss'

class OptionAbonnez extends Component {
  componentDidMount () {
    this.setState({ private: this.props.coach.privateActivate ? 'private' : 'public' })
  }

  state = {
    privateActivate: 'private',
  }

  onChange = (e) => {
    this.setState(e)
  }

  changeOption = async (value) => {
    if (value === true) {
      Modal.confirm({
        title: `${name}`,
        content: <div>
          <p>{i18n.t('OptionAbonnez.private.disclaimer')}</p>
        </div>,
        okText: i18n.t('Common_word.yes'),
        okType: 'danger',
        cancelText: i18n.t('Common_word.no'),
        onOk: async () => {
          const stripe = Stripe(process.env.NODE_ENV === 'production' ? 'pk_live_C1JPvRRiMTd3q7jxbJHQUZMm' : 'pk_test_S7wXJWtGrpNdnDVgvVszqY1M')
          await updateCoachOption(this.props.coach._id, { privateActivate: value }, stripe)
        },
      })
    } else {
      const stripe = Stripe(process.env.NODE_ENV === 'production' ? 'pk_live_C1JPvRRiMTd3q7jxbJHQUZMm' : 'pk_test_S7wXJWtGrpNdnDVgvVszqY1M')
      await updateCoachOption(this.props.coach._id, { privateActivate: value }, stripe)
    }
  }

  render () {
    const { coach } = this.props
    return (
      <div style={{ margin: 'auto' }}>
        <h1 className={'option_title'}>{i18n.t('OptionAbonnez.title').toUpperCase()}</h1>
        <hr style={{ width: '80%', marginBottom: '30px', marginLeft: 'auto', marginRight: 'auto' }}/>
        <p className={'option_description'}>{i18n.t('OptionAbonnez.description')}</p>
        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'space-evenly', justifyContent: 'space-evenly', flexWrap: 'wrap', width: '100%' }}>
          <div style={{ margin: '30px', flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid rgba(0,0,0,.1)', zIndex: '1', backgroundClip: 'padding-box', boxShadow: '1px 1px 15px rgba(27,31,35,.15)', padding: '40px', backgroundColor: 'white', borderRadius: '6px', color: 'black' }}>
            <div style={{ textAlign: 'center' }}>
              <h2>{i18n.t('Common_word.public').toUpperCase()}</h2>
              <hr style={{ width: '100px' }}/>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', letterSpacing: '1px', textAlign: 'center', height: '220px' }}>
              <div style={{ display: 'flex' }}>
                <p style={{ fontSize: '3rem', fontWeight: '500' }}>0</p>
                <p style={{ fontSize: '2.5rem', fontWeight: '500', marginTop: '-4px', marginLeft: '2px' }}>€</p>
              </div>
              <p style={{ fontSize: '1.2rem' }}>/ {i18n.t('Common_word.month')}</p>
              <p style={{ color: '#586069', fontSize: '1rem' }}>{i18n.t('OptionAbonnez.public.description')}</p>
            </div>
            <Popconfirm disabled={!coach.privateActivate || coach.disabledPrivateActivate === false} title={i18n.t('OptionAbonnez.public.discalaimer')} onConfirm={() => { this.changeOption(false) }} okText={i18n.t('Common_word.yes')} cancelText={i18n.t('Common_word.no')}>
              <Button disabled={!coach.privateActivate || coach.disabledPrivateActivate === false} type='primary'>{i18n.t('Common_word.update').toUpperCase()}</Button>
            </Popconfirm>
            {this.props.coach.disabledPrivateActivate === false && (
              <div style={{ marginTop: '20px', textAlign: 'center', color: 'orange' }}>
                <p>{i18n.t('OptionAbonnez.recent_changes.title')}</p>
                <p>{i18n.t('OptionAbonnez.recent_changes.description')}</p>
              </div>
            )}
          </div>
          <div style={{ margin: '30px', flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,0,0,.1)', zIndex: '1', backgroundClip: 'padding-box', boxShadow: '1px 1px 15px rgba(27,31,35,.15)', padding: '40px', backgroundColor: 'white', borderRadius: '6px', color: 'black' }}>
            <div style={{ textAlign: 'center' }}>
              <h2>{i18n.t('Common_word.private').toUpperCase()}</h2>
              <hr style={{ width: '100px' }}/>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', letterSpacing: '1px', textAlign: 'center', height: '220px' }}>
              <div style={{ display: 'flex' }}>
                {coach.accountType === 'T1' && (<p style={{ fontSize: '3rem', fontWeight: '500' }}>10</p>)}
                {coach.accountType === 'T2' && (<p style={{ fontSize: '3rem', fontWeight: '500' }}>300</p>)}
                {coach.accountType === 'T3' && (<p style={{ fontSize: '3rem', fontWeight: '500' }}>550</p>)}
                <p style={{ fontSize: '2.5rem', fontWeight: '500', marginTop: '-4px', marginLeft: '2px' }}>€</p>
              </div>
              <p style={{ fontSize: '1.2rem' }}>{coach.accountType === 'T1' ? i18n.t('Common_word.monthly') : i18n.t('Common_word.seasonally')}</p>
              <p style={{ color: '#586069', fontSize: '1rem' }}>{i18n.t('OptionAbonnez.private.description')}</p>
            </div>
            <Button disabled={coach.privateActivate} onClick={() => { this.changeOption(true) }} type='primary'>{i18n.t('Common_word.update').toUpperCase()}</Button>
          </div>
        </div>
      </div>
    )
  }
}

export default initialProps => {
  const { dispatch, coach } = useStoreon('coach')
  const props = {
    ...initialProps,
    dispatch,
    coach,
  }
  return <OptionAbonnez {...props}/>
}
