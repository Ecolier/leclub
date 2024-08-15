import React, { Component } from 'react'
import { Card } from 'antd'
import { Document, Page } from 'react-pdf'
import i18n from 'i18n-js'
import '@/i18n'

class Cgv extends Component {

  render () {

    return (
      <div style={{ marginTop: '5px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
        <Card
          title={i18n.t('LeClubLegalMention')}
        >
          <Document
            file='/assets/ML.pdf'
          >
            <Page pageNumber={1} />
          </Document>
          <p>{i18n.t('Common_word.page')} {1} {i18n.t('Common_word.on')} {1}</p>
        </Card>

      </div>
    )
  }
}

export default Cgv
