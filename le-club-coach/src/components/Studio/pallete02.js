import React, { Component } from 'react'
import { Button, Slider, Icon, notification, Popover } from 'antd'
import { SketchPicker } from 'react-color'
import { ClipContext } from '../CutSample/context'

class Pallete extends Component {

  componentDidMount () {
    const canvasHead = document.getElementById('canvasHead')
    if (canvasHead) { this.setState({ widthCanvas: canvasHead.clientWidth - 1280 }) }
  }

  static contextType = ClipContext

  state = {
    color: '',
    widthCanvas: 0,
    heightCanvas: 0,
  }

  noShape = () => {
    notification.open({
      message: 'Aucun objet sélectionné',
      description: 'Pour appliquer une action sur un objet sélectionne le premier.',
      icon: <Icon type='smile' style={{ color: '#108ee9' }} />,
    })
  }

  render () {
    const { color } = this.state
    return (
      <div style={{
        display: 'flex',
        position: 'absolute',
        zIndex: '15',
        left: this.props.leftSetings || '8px',
        top: this.props.topSetings,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        width: '40px',
        height: `${this.props.heightVideo - 80 || 420}px`,
        maxHeight: '340px',
        borderTopRightRadius: '5px',
        borderBottomRightRadius: '5px',
      }}>
        <Popover content={<p>Entrer en mode "Dessin"</p>} title='Mode Dessin' placement='leftBottom'>
          <Button disabled={!!(this.props.imageTmp !== null && !(this.props.isLoading && this.props.isStarted))} onClick={() => { this.props.preSaveCanvas(); this.context.setDrawing(true) }}type='primary' icon='edit' style={{ marginTop: '10px', filter: `blur(${this.props.imageTmp === null ? '0px' : '5px'})` }} />
        </Popover>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          filter: `blur(${this.props.imageTmp !== null ? '0px' : '5px'})`,
        }}>
          <Popover content={<p>Annuler les modifications et sortir du mode "Dessin".</p>} title='Annuler' placement='leftBottom'>
            <Button disabled={this.props.imageTmp === null} onClick={() => { this.props.deleteCanvas() }} type='primary' icon='close' />
          </Popover>

          <Icon onClick={() => { this.props.addForm('rect') }} style={{ fontSize: '2vh', cursor: 'pointer', color: '#bbb' }} type='border' />
          <span onClick={() => { this.props.addForm('circle') }} style={{ height: '2vh', width: '2vh', border: 'solid 2px #bbb', borderRadius: '50%', display: 'inline-block', cursor: 'pointer' }} />
          <Icon onClick={() => { this.props.addForm('star') }} style={{ fontSize: '2vh', cursor: 'pointer', color: '#bbb' }} type='star' />

          <Icon onClick={() => { this.props.addForm('text') }} style={{ fontSize: '2vh', cursor: 'pointer', color: '#bbb' }} type='font-size' />
          <Icon onClick={() => { this.props.isDrawing(true) }} style={{ fontSize: '2vh', cursor: 'pointer', color: '#bbb' }} type='arrow-up' />

          <span onClick={() => {
            if (this.props.selectedShapeName !== '') { this.props.setColorVisibility() } else { this.noShape() }
          }} style={{ height: '2vh', width: '2vh', backgroundColor: this.state.color.hex || 'pink', borderRadius: '50%', display: 'inline-block', cursor: 'pointer' }} />
          { this.props.colorVisible && (
            <div style={{ position: 'absolute', left: '60px', zIndex: '15' }}>
              <SketchPicker
                color={color}
                onChange={(e) => { this.setState({ color: e }); this.props.changeColor(e) }}
                disableAlpha
              /> </div>)}
          {this.props.alphaVisibility && (
            <div style={{ position: 'absolute', left: '60px', zIndex: '15', backgroundColor: '#202020', padding: '3px', borderRadius: '10px' }}>
              <Slider style={{ width: '150px' }} defaultValue={50} onChange={(e) => { this.props.changeOpacity(e) }} />
            </div>
          )}

          <Icon onClick={() => {
            if (this.props.selectedShapeName !== '') { this.props.setAlphaVisibility() } else { this.noShape() }
          }} style={{ fontSize: '2vh', cursor: 'pointer', color: '#bbb' }} type='eye' />
          <Popover content={<p>Supprime un élément du montage.</p>} title='Supprimer' placement='leftBottom'>
            <Icon onClick={() => { this.props.deleteObject() }} type='delete' theme='outlined' style={{ fontSize: '2vh', cursor: 'pointer', color: '#f44336' }} />
          </Popover>
          <Popover content={<p>Enregistre les modifications et quitte le mode "Dessin".</p>} title='Enregistrer' placement='leftBottom'>
            <Icon onClick={() => { this.props.saveCanvas() }} type='save' style={{ fontSize: '2vh', cursor: 'pointer', color: '#fec403' }} />
          </Popover>
        </div>
      </div>
    )
  }
}

export default Pallete
