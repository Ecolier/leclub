import React, { Component } from 'react'
import { List, Card, Modal } from 'antd'
import { connect } from 'react-redux'
import './style.scss'
import ClipPage from './cutIndex'

const { Meta } = Card

const mapDispatchToProps = (dispatch) => {
  return { dispatch }
}

const mapStateToProps = state => {
  return {
    state,
    coach: state.coach.toJS(),
    openModalVideo: false,
  }
}

class GalleryCuts extends Component {

  state = {
  }

  render () {
    const { user, medias } = this.props

    return (
      <div style={{ marginBottom: '50px', minHeight: '40vh', maxHeight: '40vh', overflow: 'auto' }}>
        { medias && medias.length === 0 ? (<h2 style={{ width: '100%', textAlign: 'center', fontSize: '3rem', color: '#fec535' }}>Aucun cuts disponible</h2>) : null}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <List
            style={{ width: '100%', margin: '0 12px' }}
            grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 }}
            dataSource={medias}
            renderItem={media => (

              <List.Item style={{ margin: '10px' }}>
                {media && media.title && (
                  <Card
                    style={{ maxHeight: '400px' }}
                    hoverable
                    onClick={() => {
                      this.setState({ openModalVideo: true, cutId: media._id })
                    }}
                    cover={<img alt={media.title} src={media.poster} style={{ height: '240px', width: 'auto', maxWidth: '100%' }} />}>
                    <Meta
                      title={<div style={{ textAlign: 'center' }}>{media.title}</div>}
                    />
                  </Card>
                )}
              </List.Item>
            )}
          />
        </div>
        <Modal
          title={'Clip'}
          destroyOnClose
          bodyStyle={{ padding: '0px', minHeight: '50vh' }}
          width='70vw'
          visible={this.state.openModalVideo}
          onCancel={() => this.setState({ openModalVideo: false })}
        >
          <ClipPage user={user} cutId={this.state.cutId} />
        </Modal>
      </div>
    )
  }
}

export default connectStoreon(mapStateToProps, mapDispatchToProps)(GalleryCuts)
