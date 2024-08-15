import React, { Component } from 'react'
import { Card, Icon } from 'antd'
import { Document, Page } from 'react-pdf'
import i18n from 'i18n-js'
import '@/i18n'

class Cgv extends Component {
  state = {
    pageNumber: 1,
    pageNumber1: 1,
    pageNumber2: 1,
  }
  render () {
    const { pageNumber, pageNumber1, pageNumber2 } = this.state
    return (
      <div style={{ marginTop: '5px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
        <Card
          title='CGU'
          actions={[<Icon type='left' style={{ fontSize: '20px' }} onClick={() => { if (pageNumber - 1 >= 1) this.setState({ pageNumber: pageNumber - 1 }) }} />, <Icon type='right' style={{ fontSize: '20px' }} onClick={() => { if (pageNumber + 1 < 11) this.setState({ pageNumber: pageNumber + 1 }) }} />]}
        >
          <Document
            file='/assets/CGU.pdf'
          >
            <Page pageNumber={pageNumber} />
          </Document>
          <p>{i18n.t('Common_word.page')} {pageNumber} {i18n.t('Common_word.on')} {10}</p>
        </Card>

        <Card
          title='CGV'
          actions={[<Icon type='left' style={{ fontSize: '20px' }} onClick={() => { if (pageNumber1 - 1 >= 1) this.setState({ pageNumber1: pageNumber1 - 1 }) }} />, <Icon type='right' style={{ fontSize: '20px' }} onClick={() => { if (pageNumber1 + 1 < 16) this.setState({ pageNumber1: pageNumber1 + 1 }) }} />]}
        >
          <Document
            file='/assets/CGV.pdf'
          >
            <Page pageNumber={pageNumber1} />
          </Document>
          <p>{i18n.t('Common_word.page')} {pageNumber1} {i18n.t('Common_word.on')} {15}</p>
        </Card>

        <Card
          title='Politique de Confidentialité'
          actions={[<Icon type='left' style={{ fontSize: '20px' }} onClick={() => { if (pageNumber2 - 1 >= 1) this.setState({ pageNumber2: pageNumber2 - 1 }) }} />, <Icon type='right' style={{ fontSize: '20px' }} onClick={() => { if (pageNumber2 + 1 < 7) this.setState({ pageNumber2: pageNumber2 + 1 }) }} />]}
        >
          <Document
            file='/assets/PDC.pdf'
            onLoadSuccess={this.onDocumentLoadSuccess}
          >
            <Page pageNumber={pageNumber2} />
          </Document>
          <p>{i18n.t('Common_word.page')} {pageNumber2} {i18n.t('Common_word.on')} {6}</p>
        </Card>

      </div>
    )
  }
}

export default Cgv
