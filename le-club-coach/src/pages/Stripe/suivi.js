import React, { Component } from 'react'
import { useStoreon } from 'storeon/react'
import 'moment/locale/fr'
import { callApi } from '@/utils/callApi'
import moment from 'moment'
import { Icon, Table, Divider, Spin, notification } from 'antd'
import i18n from 'i18n-js'
import '@/i18n'

moment.locale('fr')

const columns = [{
  title: i18n.t('Common_word.date'),
  dataIndex: 'date',
  key: 'date',
  render: text => moment(text).format('Do MMMM YYYY, à H:mm'),
}, {
  title: i18n.t('Common_word.description'),
  dataIndex: 'description',
  key: 'description',
}, {
  title: i18n.t('Subscribe.pricing.amount_paid'),
  dataIndex: 'amount_paid',
  key: 'amount_paid',
  render: text => `${text / 100}€`,
}, {
  title: i18n.t('Common_word.invoice'),
  key: 'facture',
  render: (text, record) => (
    <span>
      <a href={record.url} target='_blank'>{i18n.t('Subscribe.invoice_management.online_invoice')}</a>
      <Divider type='vertical' />
      <a href={record.pdf} target='_blank'>{i18n.t('Subscribe.invoice_management.pdf_invoice')}</a>
    </span>
  ),
}]

class SuiviAbonnement extends Component {

  componentDidMount () {
    callApi(`stripe/lastinvoices/${this.props.coach._id}`, 'get', {}, '').then(e => {
      this.setState({ nextInvoice: e.invoice, prevInvoices: e.prevInvoices })
    }).catch(() => {
      notification.error({ message: i18n.t('Subscribe.invoice_management.no_invoice'), description: i18n.t('Subscribe.invoice_management.no_invoice_message') })
      this.setState({ prevInvoices: [] })
    })
  }

    state = {
      nextInvoice: null,
      prevInvoices: null,
    }

    render () {
      return (
        <div className='leClub-coach-sub-tracking'>
          <h1>{i18n.t('Subscribe.tracking.title')}</h1>
          <hr/>
          { this.props.coach.subscribeAt ? (
            <div>
              <p>{i18n.t('Subscribe.tracking.sign_up')}<b>{moment(this.props.coach.createdAt).format('Do MMMM YYYY, à H:mm')}</b></p>
              <p>{i18n.t('Subscribe.tracking.subscribed_at')}<b>{this.props.coach.accountType === 'T1' ? i18n.t('Common_word.premium') : this.props.coach.accountType === 'T2' ? i18n.t('Common_word.coach') : i18n.t('Common_word.club')}</b> {i18n.t('Common_word.at')} <b>{moment(this.props.coach.subscribeAt).format('Do MMMM YYYY, à H:mm')}</b></p>
              <div style={{ display: 'flex' }}>
                <div>
                  <p>{i18n.t('Subscribe.tracking.next_paiement')}:
                    {this.props.coach.cancelSubscription ? (
                      <b style={{ color: 'orange', marginLeft: '5px' }}>{i18n.t('Subscribe.tracking.cancel_subscription')}</b>
                    ) : (
                      <b style={{ marginLeft: '5px' }}>{this.state.nextInvoice ? moment(this.state.nextInvoice).format('Do MMMM YYYY, à H:mm') : <Icon type='loading' />}</b>
                    )}
                  </p>
                </div>
              </div>
              <p>{i18n.t('Subscribe.tracking.contact')}<b>team@leClub.co</b></p>
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Icon type='form' style={{ fontSize: '5rem', marginBottom: '5px' }}/>
              <p style={{ fontSize: '1.2rem' }}>{i18n.t('Subscribe.tracking.no_subscription')}</p>
            </div>
          )}
          <div style={{ marginTop: '20px' }}>
            <h3>{i18n.t('Subscribe.tracking.last_invoices')}:</h3>
            <hr/>
            <Spin spinning={!this.state.prevInvoices} size={'large'}>
              <Table bordered dataSource={this.state.prevInvoices} columns={columns} rowKey={(invoice, key) => key} size={screen.width <= 425 ? 'small' : 'large'}/>
            </Spin>
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
  return <SuiviAbonnement {...props}/>
}
