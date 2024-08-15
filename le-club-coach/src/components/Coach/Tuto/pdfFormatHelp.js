import React, { Component } from 'react'
import { Card, Icon } from 'antd'
import { Document, Page } from 'react-pdf'
import { Collapse } from 'antd'
const { Panel } = Collapse

import i18n from 'i18n-js'
import '@/i18n'

class Tuto extends Component {

  state = {
    extractFilePDF: 1,
    addMatchPDF: 1,
    removeMatchPDF: 1,
    sequencageSettingsPDF: 1,
    sequencageCreationPDF: 1,
    sequencageLivePDF: 1,
    videoDrawingPDF: 1,
    billingHistoryPDF: 1,
  }

  render () {
    return (
      <div style={{ padding: '5px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1>{i18n.t('Sider.tutorial_section.title')}:</h1>
          <hr style={{ width: '100%' }} />
          {/* <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '10px', marginBottom: '1rem' }}>
            <Card title={i18n.t('helpCenter.pdfHelp.title')}>
              <Collapse>
                <Panel header={i18n.t('helpCenter.pdfHelp.beforeMatch')} style={{ marginBottom: '1rem' }}>
                  <div style={{ marginTop: '5px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                    <Card
                      title={i18n.t('helpCenter.pdfHelp.beforeMatchCheck')}
                    >
                      <Document
                        file='https://d1ceovtllg6jml.cloudfront.net/TUTORIEL/9-AVANT+MATCH+.pdf'
                      >
                        <Page height={`${window.innerWidth < 425 ? 300 : 500}`} width={`${window.innerWidth < 425 ? 300 : 500}`} pageNumber={1} />
                      </Document>
                      <p>{i18n.t('Common_word.page')} {1} {i18n.t('Common_word.on')} {1}</p>
                    </Card>
                  </div>
                </Panel>
              </Collapse>
              <Collapse>
                <Panel header={i18n.t('helpCenter.pdfHelp.exctractFileTuto')} style={{ marginBottom: '1rem' }}>
                  <div style={{ marginTop: '5px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                    <Card
                      title={i18n.t('helpCenter.pdfHelp.exctractFile')}
                      actions={[<Icon type='left' style={{ fontSize: '20px' }} onClick={() => { if (this.state.extractFilePDF - 1 >= 1) this.setState({ extractFilePDF: this.state.extractFilePDF - 1 }) }} />, <Icon type='right' style={{ fontSize: '20px' }} onClick={() => { if (this.state.extractFilePDF + 1 < 5) this.setState({ extractFilePDF: this.state.extractFilePDF + 1 }) }} />]}
                    >
                      <Document
                        file='https://d1ceovtllg6jml.cloudfront.net/TUTORIEL/4-Extraire+les+fichiers+de+la+carte+me%CC%81moire.pdf'
                      >
                        <Page height={`${window.innerWidth < 425 ? 300 : 500}`} width={`${window.innerWidth < 425 ? 300 : 500}`} pageNumber={this.state.extractFilePDF} />
                      </Document>
                      <p>{i18n.t('Common_word.page')} {this.state.extractFilePDF} {i18n.t('Common_word.on')} {4}</p>
                    </Card>
                  </div>
                </Panel>
              </Collapse>
              <Collapse>
                <Panel header={i18n.t('helpCenter.pdfHelp.addMatchTuto')} style={{ marginBottom: '1rem' }}>
                  <div style={{ marginTop: '5px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                    <Card
                      title={i18n.t('helpCenter.pdfHelp.addMatch')}
                      actions={[<Icon type='left' style={{ fontSize: '20px' }} onClick={() => { if (this.state.addMatchPDF - 1 >= 1) this.setState({ addMatchPDF: this.state.addMatchPDF - 1 }) }} />, <Icon type='right' style={{ fontSize: '20px' }} onClick={() => { if (this.state.addMatchPDF + 1 < 7) this.setState({ addMatchPDF: this.state.addMatchPDF + 1 }) }} />]}
                    >
                      <Document
                        file='https://d1ceovtllg6jml.cloudfront.net/TUTORIEL/5-AJOUTER+UN+MATCH+ou+UN+ENTRAINEMENT.pdf'
                      >
                        <Page height={`${window.innerWidth < 425 ? 300 : 500}`} width={`${window.innerWidth < 425 ? 300 : 500}`} pageNumber={this.state.addMatchPDF} />
                      </Document>
                      <p>{i18n.t('Common_word.page')} {this.state.addMatchPDF} {i18n.t('Common_word.on')} {6}</p>
                    </Card>
                  </div>
                </Panel>
              </Collapse>
              <Collapse>
                <Panel header={i18n.t('helpCenter.pdfHelp.delMatchTuto')}>
                  <div style={{ marginTop: '5px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                    <Card
                      title={i18n.t('helpCenter.pdfHelp.delMatch')}
                      actions={[<Icon type='left' style={{ fontSize: '20px' }} onClick={() => { if (this.state.removeMatchPDF - 1 >= 1) this.setState({ removeMatchPDF: this.state.removeMatchPDF - 1 }) }} />, <Icon type='right' style={{ fontSize: '20px' }} onClick={() => { if (this.state.removeMatchPDF + 1 < 4) this.setState({ removeMatchPDF: this.state.removeMatchPDF + 1 }) }} />]}
                    >
                      <Document
                        file='https://d1ceovtllg6jml.cloudfront.net/TUTORIEL/10-SUPPRIMER+UN+MATCH+ou+UN+ENTRAINEMENT.pdf'
                      >
                        <Page height={`${window.innerWidth < 425 ? 300 : 500}`} width={`${window.innerWidth < 425 ? 300 : 500}`} pageNumber={this.state.removeMatchPDF} />
                      </Document>
                      <p>{i18n.t('Common_word.page')} {this.state.removeMatchPDF} {i18n.t('Common_word.on')} {3}</p>
                    </Card>
                  </div>
                </Panel>
              </Collapse>
            </Card>
          </div> */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '10px', marginBottom: '1rem' }}>
            <Card title={i18n.t('helpCenter.pdfHelp.toolTuto')}>
              <Collapse>
                <Panel header={i18n.t('helpCenter.pdfHelp.toolTutoParm')} style={{ marginBottom: '1rem' }}>
                  <div style={{ marginTop: '5px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                    <Card
                      title={i18n.t('helpCenter.pdfHelp.seqParam')}
                      actions={[<Icon type='left' style={{ fontSize: '20px' }} onClick={() => { if (this.state.sequencageSettingsPDF - 1 >= 1) this.setState({ sequencageSettingsPDF: this.state.sequencageSettingsPDF - 1 }) }} />, <Icon type='right' style={{ fontSize: '20px' }} onClick={() => { if (this.state.sequencageSettingsPDF + 1 < 3) this.setState({ sequencageSettingsPDF: this.state.sequencageSettingsPDF + 1 }) }} />]}
                    >
                      <Document
                        file='https://d1ceovtllg6jml.cloudfront.net/TUTORIEL/6-PARAME%CC%81TRER+LE+SE%CC%81QUENC%CC%A7AGE+.pdf'
                      >
                        <Page height={`${window.innerWidth < 425 ? 300 : 500}`} width={`${window.innerWidth < 425 ? 300 : 500}`} pageNumber={this.state.sequencageSettingsPDF} />
                      </Document>
                      <p>{i18n.t('Common_word.page')} {this.state.sequencageSettingsPDF} {i18n.t('Common_word.on')} {2}</p>
                    </Card>
                  </div>
                </Panel>
              </Collapse>
              <Collapse>
                <Panel header={i18n.t('helpCenter.pdfHelp.seqCreateTuto')} style={{ marginBottom: '1rem' }}>
                  <div style={{ marginTop: '5px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                    <Card
                      title={i18n.t('helpCenter.pdfHelp.seqCreate')}
                      actions={[<Icon type='left' style={{ fontSize: '20px' }} onClick={() => { if (this.state.sequencageCreationPDF - 1 >= 1) this.setState({ sequencageCreationPDF: this.state.sequencageCreationPDF - 1 }) }} />, <Icon type='right' style={{ fontSize: '20px' }} onClick={() => { if (this.state.sequencageCreationPDF + 1 < 5) this.setState({ sequencageCreationPDF: this.state.sequencageCreationPDF + 1 }) }} />]}
                    >
                      <Document
                        file='https://d1ceovtllg6jml.cloudfront.net/TUTORIEL/7-SE%CC%81QUENCER+UN+MATCH+SUR+LA+PLATEFORME.pdf'
                      >
                        <Page height={`${window.innerWidth < 425 ? 300 : 500}`} width={`${window.innerWidth < 425 ? 300 : 500}`} pageNumber={this.state.sequencageCreationPDF} />
                      </Document>
                      <p>{i18n.t('Common_word.page')} {this.state.sequencageCreationPDF} {i18n.t('Common_word.on')} {4}</p>
                    </Card>
                  </div>
                </Panel>
              </Collapse>
              <Collapse>
                <Panel header={i18n.t('helpCenter.pdfHelp.downloadTuto')} style={{ marginBottom: '1rem' }}>
                  <div style={{ marginTop: '5px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                    <Card
                      title={i18n.t('helpCenter.pdfHelp.download')}
                      actions={[<Icon type='left' style={{ fontSize: '20px' }} onClick={() => { if (this.state.sequencageLivePDF - 1 >= 1) this.setState({ sequencageLivePDF: this.state.sequencageLivePDF - 1 }) }} />, <Icon type='right' style={{ fontSize: '20px' }} onClick={() => { if (this.state.sequencageLivePDF + 1 < 11) this.setState({ sequencageLivePDF: this.state.sequencageLivePDF + 1 }) }} />]}
                    >
                      <Document
                        file='https://d1ceovtllg6jml.cloudfront.net/TUTORIEL/11-TE%CC%81LE%CC%81CHARGER+L%27APPLI+LECLUB+COACH+POUR+SE%CC%81QUENCER+EN+LIVE.pdf'
                      >
                        <Page height={`${window.innerWidth < 425 ? 300 : 500}`} width={`${window.innerWidth < 425 ? 300 : 500}`} pageNumber={this.state.sequencageLivePDF} />
                      </Document>
                      <p>{i18n.t('Common_word.page')} {this.state.sequencageLivePDF} {i18n.t('Common_word.on')} {10}</p>
                    </Card>
                  </div>
                </Panel>
              </Collapse>
              <Collapse>
                <Panel header={i18n.t('helpCenter.pdfHelp.tutoDrawing')}>
                  <div style={{ marginTop: '5px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                    <Card
                      title={i18n.t('helpCenter.pdfHelp.drawing')}
                      actions={[<Icon type='left' style={{ fontSize: '20px' }} onClick={() => { if (this.state.videoDrawingPDF - 1 >= 1) this.setState({ videoDrawingPDF: this.state.videoDrawingPDF - 1 }) }} />, <Icon type='right' style={{ fontSize: '20px' }} onClick={() => { if (this.state.videoDrawingPDF + 1 < 5) this.setState({ videoDrawingPDF: this.state.videoDrawingPDF + 1 }) }} />]}
                    >
                      <Document
                        file='https://d1ceovtllg6jml.cloudfront.net/TUTORIEL/8-UTILISER+LA+PALETTE+POUR+DESSINER+SUR+TES+VIDE%CC%81OS.pdf'
                      >
                        <Page height={`${window.innerWidth < 425 ? 300 : 500}`} width={`${window.innerWidth < 425 ? 300 : 500}`} pageNumber={this.state.videoDrawingPDF} />
                      </Document>
                      <p>{i18n.t('Common_word.page')} {this.state.videoDrawingPDF} {i18n.t('Common_word.on')} {4}</p>
                    </Card>
                  </div>
                </Panel>
              </Collapse>
            </Card>
          </div>
        </div>
        {/* <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '10px', marginBottom: '1rem' }}>
          <Card title={i18n.t('helpCenter.pdfHelp.tutoAdministatrion')}>
            <Collapse>
              <Panel header={i18n.t('helpCenter.pdfHelp.administatrion')}>
                <div style={{ marginTop: '5px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                  <Card
                    title={i18n.t('helpCenter.pdfHelp.findBilling')}
                    actions={[<Icon type='left' style={{ fontSize: '20px' }} onClick={() => { if (this.state.billingHistoryPDF - 1 >= 1) this.setState({ billingHistoryPDF: this.state.billingHistoryPDF - 1 }) }} />, <Icon type='right' style={{ fontSize: '20px' }} onClick={() => { if (this.state.billingHistoryPDF + 1 < 3) this.setState({ billingHistoryPDF: this.state.billingHistoryPDF + 1 }) }} />]}
                  >
                    <Document
                      file='https://d1ceovtllg6jml.cloudfront.net/TUTORIEL/12-TE%CC%81LE%CC%81CHARGER+VOS+FACTURES.pdf'
                    >
                      <Page height={`${window.innerWidth < 425 ? 300 : 500}`} width={`${window.innerWidth < 425 ? 300 : 500}`} pageNumber={this.state.billingHistoryPDF} />
                    </Document>
                    <p>{i18n.t('Common_word.page')} {this.state.billingHistoryPDF} {i18n.t('Common_word.on')} {2}</p>
                  </Card>
                </div>
              </Panel>
            </Collapse>
          </Card>
        </div> */}
      </div>
    )
  }
}

export default (Tuto)
