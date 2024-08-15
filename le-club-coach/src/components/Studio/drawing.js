import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { Stage, Layer, Image } from 'react-konva'
import { Button, Modal, Input, InputNumber, notification, Icon, Spin } from 'antd'
import { saveDrawing } from '@/actions/coach.js'
import Rectangle from './Shape/Rectangle.js'
import Arrow from './Shape/Arrow.js'
import Star from './Shape/Star.js'
import Circle from './Shape/Circle.js'
import Text from './Shape/Text.js'
import TransformerComponent from './Shape/Transform.js'
import Pallete from './pallete02.js'
import { duration } from 'moment'
import uuid from 'uuid/v1'

const mapDispatchToProps = (dispatch) => { return { dispatch } }

const mapStateToProps = state => {
  return {
    coach: state.coach.toJS(),
  }
}

class DrawingStudio extends Component {

  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.imageTmp !== this.props.imageTmp) {
      this.setState({
        rectangles: [],
        circles: [],
        arrows: [],
        stars: [],
        list: [],
        selectedShapeName: '',
        visible: false,
        duration: 3,
        texts: [],
        arrowColors: {},
        alphaVisibility: false,
        colorVisible: false,
      })

    }
    return true
  }

  state = {
    rectangles: [],
    circles: [],
    arrows: [],
    stars: [],
    list: [],
    selectedShapeName: '',
    visible: false,
    duration: 3,
    texts: [],
    arrowColors: {},
    alphaVisibility: false,
    colorVisible: false,
    loading: false,
    selectedForm: null,
    isDrawing: false,
  }

  handleStageMouseDown = e => {
  // clicked on stage - claer selection
    const { offsetX, offsetY } = e.evt
    if (this.state.isDrawing) {
      const arrows = this.state.arrows
      arrows.push({
        points: [offsetX, offsetY, 0, 0],
        pointerLength: 20,
        pointerWidth: 20,
        fill: 'black',
        stroke: 'black',
        strokeWidth: 4,
        id: 'arrow-1',
      })
    }

    if (document.getElementById('toDestroyText')) { document.getElementById('toDestroyText').remove() }
    if (e.target === e.target.getStage()) {
      this.setState({ selectedShapeName: '', arrowStartPos: { x: offsetX, y: offsetY }, arrowEndPos: { x: offsetX, y: offsetY } })
      return
    }
    // clicked on transformer - do nothing
    const clickedOnTransformer = e.target.getParent().className === 'Transformer'

    if (clickedOnTransformer) { return }
    const name = e.target.name()
    // if (name && name.split('@')[1] === 'NOT') {
    //   this.setState({ selectedShapeName: name })
    //   return
    // }
    const rect1 = this.state.rectangles.find(r => r.name === name)
    const rect2 = this.state.arrows.find(r => r.name === name)
    const rect3 = this.state.circles.find(r => r.name === name)
    const rect4 = this.state.stars.find(r => r.name === name)
    const rect5 = this.state.texts.find(r => r.name === name)

    if (rect1) {
      this.setState({ selectedShapeName: name, colorVisible: false, alphaVisibility: false, arrowStartPos: { x: offsetX, y: offsetY }, arrowEndPos: { x: offsetX, y: offsetY } })
    } else if (rect2) {
      this.setState({ selectedShapeName: name, colorVisible: false, alphaVisibility: false, arrowStartPos: { x: offsetX, y: offsetY }, arrowEndPos: { x: offsetX, y: offsetY } })
    } else if (rect3) {
      this.setState({ selectedShapeName: name, colorVisible: false, alphaVisibility: false, arrowStartPos: { x: offsetX, y: offsetY }, arrowEndPos: { x: offsetX, y: offsetY } })
    } else if (rect4) {
      this.setState({ selectedShapeName: name, colorVisible: false, alphaVisibility: false, arrowStartPos: { x: offsetX, y: offsetY }, arrowEndPos: { x: offsetX, y: offsetY } })
    } else if (rect5) {
      this.setState({ selectedShapeName: name, colorVisible: false, alphaVisibility: false, arrowStartPos: { x: offsetX, y: offsetY }, arrowEndPos: { x: offsetX, y: offsetY } })
    } else {
      this.setState({ selectedShapeName: '', colorVisible: false, alphaVisibility: false, arrowStartPos: { x: offsetX, y: offsetY }, arrowEndPos: { x: offsetX, y: offsetY } })
    }
  }

  handleMouseMove = (e) => {
    const { isDrawing } = this.state
    const { offsetX, offsetY } = e.evt

    if (isDrawing) {
      const newArrows = this.state.arrows
      const index = newArrows.findIndex(a => a.id === 'arrow-1')
      if (index !== -1) {
        newArrows[index].points[2] = offsetX
        newArrows[index].points[3] = offsetY
      }
      this.setState({
        arrowEndPos: { arrows: newArrows },
      })
    }
  }

  handleMouseUp = () => {
    const { isDrawing } = this.state
    if (isDrawing) {
      this.setState({ isDrawing: false, startPos: null, endPos: null })
    }
  }

  setRef = (e) => {
    this.setState({ refsVideo: e })
  }

  saveCanvas = () => {

    this.setState({ loading: true })
    const tmpCanvas = document.createElement('canvas')
    tmpCanvas.width = 1280
    tmpCanvas.height = 720

    const ctx = tmpCanvas.getContext('2d')
    ctx.drawImage(this.layerRef.getCanvas()._canvas, 0, 0, 1280, 720)
    tmpCanvas.toBlob(((blob) => {
      const params = {
        blob,
        videoId: this.props.videoId,
        duration: this.state.duration,
        timeOfimage: this.props.timeOfimage,
        isType: this.props.isType,
      }
      const closeModalFunc = () => {
        this.setState({ visible: false, loading: false })
        this.props.closeModal()

      }
      this.props.dispatch(saveDrawing(this.props.coach._id, params, closeModalFunc))
    }), 'image/png', 1)

    this.context.setDrawing(false)
  }

  addForm = (name) => {
    if (name === 'rect') {
      const rectangles = this.state.rectangles
      rectangles.push({ x: (this.props.widthVideo / 100) * 20, y: 10, width: 100, height: 100, fill: 'red', name: `rect-${uuid()}`, draggable: true, fillEnabled: true, opacity: 0.25 })
      this.setState({ rectangles })
    } else if (name === 'arrow') {
      const arrows = this.state.arrows
      // const circles = this.state.circles
      // const name = uuid()
      arrows.push({
        points: [0, 0, 0, 0],
        pointerLength: 20,
        pointerWidth: 20,
        fill: 'black',
        stroke: 'black',
        strokeWidth: 4,
        id: 'arrow-1',
        // stroke: 'blue',
        // // name: `${name}@Parent@NOT`,
        // name: `arrow-${uuid()}`,
        // opacity: 1,
        // draggable: true,
        // lineCap: 'round',
        // fill: 'red',
        // // x: (this.props.widthVideo / 100) * 20,
        // // y: 150,
        // points: [startPos.x, startPos.y, endPos.x, endPos.y],
        // strokeWidth: 6,
        // onClick: (arrowNode) => {
        //   if (arrowNode.target.attrs.dash && arrowNode.target.attrs.dash.length !== 0) {
        //     arrowNode.target.dash([])
        //   } else { arrowNode.target.dash([20, 20]) }
        //   this.layerRef.draw()
        // },
        // sceneFunc: (context, shape) => {
        //   const quadStart = this[`${name}@Start@NOT`]
        //   const quadMiddle = this[`${name}@Middle@NOT`]
        //   const quadEnd = this[`${name}@End@NOT`]
        //   if (quadMiddle && quadEnd && quadStart) {
        //     context.beginPath()
        //     context.moveTo(quadStart.attrs.x, quadStart.attrs.y)
        //     context.quadraticCurveTo(quadMiddle.attrs.x, quadMiddle.attrs.y, quadEnd.attrs.x, quadEnd.attrs.y - 5)
        //     if (this.state.arrowColors && this.state.arrowColors[`${name}@Middle@NOT`]) {
        //       context.setAttr('strokeStyle', `${this.state.arrowColors[`${name}@Middle@NOT`]}`)
        //     } else if (this.state.arrowColors && this.state.arrowColors[`${name}@End@NOT`]) {
        //       context.setAttr('strokeStyle', `${this.state.arrowColors[`${name}@End@NOT`]}`)
        //     } else if (this.state.arrowColors && this.state.arrowColors[`${name}@Start@NOT`]) {
        //       context.setAttr('strokeStyle', `${this.state.arrowColors[`${name}@Start@NOT`]}`)
        //     } else { context.setAttr('strokeStyle', 'blue') }
        //     context.setAttr('lineOpacity', 0.5)
        //     context.setAttr('lineVisible', false)
        //     context.setAttr('lineWidth', 6)
        //     context.setAttr('name', `arrow-${name}`)
        //     if (this.state.arrowColors && (
        //       this.state.arrowColors[`${name}@Start@NOT`] === 'stop'
        //       || this.state.arrowColors[`${name}@Middle@NOT`] === 'stop'
        //       || this.state.arrowColors[`${name}@End@NOT`] === 'stop')
        //     ) {
        //       console.log('In stop :Question ??')
        //     } else {
        //       context.stroke()
        //     }
        //
        //   }
        // },
      })
      // circles.push({
      //   setRef: (node) => { this[`${name}@Start@NOT`] = node },
      //   x: (this.props.widthVideo / 100) * 20,
      //   y: 100,
      //   width: 30,
      //   height: 30,
      //   fill: 'red',
      //   name: `${name}@Start@NOT`,
      //   draggable: true,
      //   opacity: 1,
      //   visible: true,
      // })
      // circles.push({
      //   setRef: (node) => { this[`${name}@Middle@NOT`] = node },
      //   x: (this.props.widthVideo / 100) * 20,
      //   y: 150,
      //   width: 20,
      //   height: 20,
      //   fill: 'red',
      //   name: `${name}@Middle@NOT`,
      //   draggable: true,
      //   opacity: 1,
      //   visible: true,
      // })
      // arrows.push({
      //   setRef: (node) => { this[`${name}@End@NOT`] = node },
      //   x: (this.props.widthVideo / 100) * 20,
      //   y: 200,
      //   pointerLength: 18,
      //   pointerWidth: 20,
      //   rotation: 90,
      //   fill: 'red',
      //   name: `${name}@End@NOT`,
      //   draggable: true,
      //   id: 'quadLine',
      //   opacity: 1,
      //   visible: true,
      //   // onMouseUp: (e) => {
      //   //       const quadLine = this.layerRef.get('#quadLine')[0];
      //   //       const quadMiddle = this[`${name}@Middle@NOT`];
      //   //       const quadEnd = this[`${name}@End@NOT`]
      //   //       //((y1-y2)/(x1-x2))
      //   //       console.log('TOTO =>',quadMiddle.attrs);
      //   //       const angle = Math.atan((quadMiddle.attrs.y - quadEnd.attrs.y) / (quadMiddle.attrs.x- quadEnd.attrs.x))  * 180/ Math.PI -  Math.PI
      //   //       console.log(angle)
      //   //
      //   //       quadLine.setRotation(angle)
      //   //       console.log('ici Dans la function du siecle');
      //   // },
      // })
      this.setState({ arrows })
    } else if (name === 'circle') {

      const circles = this.state.circles
      circles.push({ radius: 10,
        x: (this.props.widthVideo / 100) * 20,
        y: 150,
        width: 100,
        height: 100,
        fill: 'red',
        name: `circle-${uuid()}`,
        draggable: true,
        fillEnabled: false,
        opacity: 0.25,
      })
      this.setState({ circles })
    } else if (name === 'star') {
      const stars = this.state.stars
      stars.push({ radius: 10,
        x: (this.props.widthVideo / 100) * 20,
        y: 150,
        width: 50,
        height: 50,
        fill: 'red',
        numPoints: 5,
        // fillEnabled: true,
        innerRadius: 20,
        outerRadius: 40,
        name: `star-${uuid()}`,
        draggable: true,
        fillEnabled: false,
        opacity: 0.25,
      })
      this.setState({ stars })
    } else if (name === 'text') {
      const texts = this.state.texts
      texts.push({ radius: 10,
        x: (this.props.widthVideo / 100) * 20,
        y: 150,
        width: 50,
        height: 50,
        fill: 'red',
        name: `text-${uuid()}`,
        text: 'Votre texte.',
        draggable: true,
        fillEnabled: false,
        opacity: 1,
        onClick: (textNode) => {
          const textPosition = textNode.target.getAbsolutePosition()
          const stageBox = this.stageRef.getContainer().getBoundingClientRect()
          const areaPosition = {
            x: textPosition.x + stageBox.left,
            y: textPosition.y + stageBox.top,
          }

          // create textarea and style it
          const textarea = document.createElement('textarea')
          document.body.appendChild(textarea)

          textarea.value = textNode.target.text()
          textarea.className = 'ant-input'
          textarea.style.position = 'absolute'
          textarea.style.zIndex = 3000
          textarea.style.top = `${areaPosition.y}px`
          textarea.style.left = `${areaPosition.x}px`
          textarea.style.width = '200px'// textNode.target.width();
          textarea.id = 'toDestroyText'
          textarea.focus()
          textNode.target.setAttr('width', textNode.target.text().length * 10)

          // TODO:  A CHANGER

          textNode.target.setAttr('fontSize', 20)

          textarea.addEventListener('keydown', ((t) => {
            // hide on enter
            if (t.keyCode === 13) {
              textNode.target.text(textarea.value)
              this.layerRef.draw()
              document.body.removeChild(textarea)
            }
          }))
        },
      })
      this.setState({ texts })
    }
  }
  deleteObject = () => {

    if (this.state.selectedShapeName === '') {
      notification.open({
        message: 'Aucun objet sélectionné',
        description: 'Pour appliquer une action sur un objet sélectionne le premier.',
        icon: <Icon type='smile' style={{ color: '#108ee9' }} />,
      })
      return
    }
    if (this.state.selectedShapeName.split('@NOT').length >= 2) {
      const arrowColors = this.state.arrowColors
      const splitName = this.state.selectedShapeName.split('@')
      this[`${splitName[0]}@Start@NOT`].remove()
      this[`${splitName[0]}@Middle@NOT`].remove()
      this[`${splitName[0]}@End@NOT`].remove()

      arrowColors[`${splitName[0]}@Start@NOT`] = 'stop'
      arrowColors[`${splitName[0]}@Middle@NOT`] = 'stop'
      arrowColors[`${splitName[0]}@End@NOT`] = 'stop'
      this.setState({ arrowColors })
      return
    }
    if (!this[this.state.selectedShapeName]) {
      return
    }
    this[this.state.selectedShapeName].remove()
    this.forceUpdate()

  }

  changeColor = (color) => {

    if (this.state.selectedShapeName.split('@')[1] === 'NOT') {
      const arrowColors = this.state.arrowColors || {}

      arrowColors[this.state.selectedShapeName] = color.hex
      this.setState({ arrowColors })
      return
    }
    const index1 = this.state.rectangles.findIndex(r => r.name === this.state.selectedShapeName)
    const index2 = this.state.arrows.findIndex(r => r.name === this.state.selectedShapeName)
    const index3 = this.state.circles.findIndex(r => r.name === this.state.selectedShapeName)
    const index4 = this.state.stars.findIndex(r => r.name === this.state.selectedShapeName)
    const index5 = this.state.texts.findIndex(r => r.name === this.state.selectedShapeName)

    if (index1 === -1 && index2 === -1 && index3 === -1 && index4 === -1 && index5 === -1) {
      notification.open({
        message: 'Aucun objet sélectionné',
        description: 'Pour appliquer une action sur un objet sélectionne le premier.',
        icon: <Icon type='smile' style={{ color: '#108ee9' }} />,
      })
      return
    }

    if (index1 !== -1) {
      const rectangles = this.state.rectangles
      rectangles[index1].fill = color.hex
      this.setState({ rectangles })
    } else if (index2 !== -1) {
      const arrows = this.state.arrows
      arrows[index2].stroke = color.hex
      arrows[index2].fill = color.hex
      this.setState({ arrows })
    } else if (index3 !== -1) {
      const circles = this.state.circles
      circles[index3].fill = color.hex
      this.setState({ circles })
    } else if (index4 !== -1) {
      const stars = this.state.stars
      stars[index4].fill = color.hex
      this.setState({ stars })
    } else if (index5 !== -1) {
      const texts = this.state.texts
      texts[index5].fill = color.hex
      this.setState({ texts })
    }
  }

  changeOpacity = (opacity) => {

    const index1 = this.state.rectangles.findIndex(r => r.name === this.state.selectedShapeName)
    const index2 = this.state.arrows.findIndex(r => r.name === this.state.selectedShapeName)
    const index3 = this.state.circles.findIndex(r => r.name === this.state.selectedShapeName)
    const index4 = this.state.stars.findIndex(r => r.name === this.state.selectedShapeName)
    const index5 = this.state.texts.findIndex(r => r.name === this.state.selectedShapeName)

    if (index1 === -1 && index2 === -1 && index3 === -1 && index4 === -1 && index5 === -1) {
      notification.open({
        message: 'Aucun objet sélectionné',
        description: 'Pour appliquer une action sur un objet sélectionne le premier.',
        icon: <Icon type='smile' style={{ color: '#108ee9' }} />,
      })
      return
    }

    if (index1 !== -1) {
      const rectangles = this.state.rectangles
      rectangles[index1].opacity = opacity / 100
      this.setState({ rectangles })
    } else if (index2 !== -1) {
      const arrows = this.state.arrows
      arrows[index2].opacity = opacity / 100
      this.setState({ arrows })
    } else if (index3 !== -1) {
      const circles = this.state.circles
      circles[index3].opacity = opacity / 100
      this.setState({ circles })
    } else if (index4 !== -1) {
      const stars = this.state.stars
      stars[index4].opacity = opacity / 100
      this.setState({ stars })
    } else if (index5 !== -1) {
      const texts = this.state.texts
      texts[index5].opacity = opacity / 100
      this.setState({ texts })
    }
  }

  updateList = (checked, id) => {
    const newList = this.state.list
    if (checked) {
      newList.push(id)
      this.setState({ list: newList })
    } else {
      const index = newList.findIndex(i => i.toString() === id.toString())

      if (index !== -1) {
        newList.splice(index, 1)
        this.setState({ list: newList })
      }
    }
  }
  setColorVisibility = () => {
    this.setState({ colorVisible: !this.state.colorVisible })
  }
  setAlphaVisibility = () => {
    this.setState({ alphaVisibility: !this.state.alphaVisibility })
  }

  get videoWidth () {
    const video = this.props.videoElement
    return video.offsetWidth
  }

  get videoHeight () {
    const video = this.props.videoElement
    return video.offsetHeight
  }

  get videoLeft () {
    const video = this.props.videoElement
    const me = ReactDOM.findDOMNode(this)
    return video.getBoundingClientRect().left - me.getBoundingClientRect().left
  }

  render () {
    return (
      <div>
        <Pallete
          topSetings={this.props.topSetings}
          leftSetings={this.props.leftSetings}
          isStarted={this.props.isStarted}
          isLoading={this.props.isLoading}
          alphaVisibility={this.state.alphaVisibility}
          colorVisible={this.state.colorVisible}
          setColorVisibility={this.setColorVisibility}
          setAlphaVisibility={this.setAlphaVisibility}
          selectedShapeName={this.state.selectedShapeName}
          deleteCanvas={this.props.deleteCanvas}
          preSaveCanvas={this.props.preSaveCanvas}
          heightVideo={this.props.heightVideo - 50}
          imageTmp={this.props.imageTmp}
          saveCanvas={() => { this.setState({ selectedShapeName: '' }, (() => { this.setState({ visible: !this.state.visible }) })) }}
          addForm={this.addForm}
          changeColor={this.changeColor}
          changeOpacity={this.changeOpacity}
          changeCourbe={this.changeCourbe}
          deleteObject={this.deleteObject}
          selectedForm={(e) => { this.setState({ selectedForm: e }) }}
          isDrawing={(e) => { this.setState({ isDrawing: e }) }}
        />
        {this.props.imageTmp !== null && (
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', zIndex: '10' }}>
            <div>
              <Stage style={{ marginLeft: this.videoLeft, cursor: this.state.isDrawing ? 'crosshair' : 'default' }} width={this.videoWidth} height={this.videoHeight}
                onMouseDown={this.handleStageMouseDown}
                onMouseMove={this.handleMouseMove}
                onMouseUp={this.handleMouseUp}
                ref={node => { this.stageRef = node }}>
                <Layer ref={node => { this.layerRef = node }}>
                  <Image
                    image={this.props.imageTmp}
                    width={this.videoWidth}
                    height={this.videoHeight}
                    ref={node => { this.imageNode = node }}
                  />
                  {this.state.rectangles.map((rect, i) => (
                    <Rectangle setRef={(node, name) => { this[name] = node }} key={i} {...rect} />
                  ))}
                  {this.state.arrows.map((rect, i) => (
                    <Arrow setRef={(node, name) => { this[name] = node }} key={i} {...rect} />
                  ))}

                  {this.state.circles.map((rect, i) => (
                    <Circle setRef={(node, name) => { this[name] = node }} key={i} {...rect} />
                  ))}
                  {this.state.stars.map((rect, i) => (
                    <Star setRef={(node, name) => { this[name] = node }} key={i} {...rect} />
                  ))}
                  {this.state.texts.map((rect, i) => (
                    <Text setRef={(node, name) => { this[name] = node }} key={i} {...rect} />
                  ))}
                  {this.state.selectedShapeName && this.state.selectedShapeName !== '' && this.state.selectedShapeName.split('@NOT').length < 2 ? (
                    <TransformerComponent selectedShapeName={this.state.selectedShapeName} />
                  ) : null}
                </Layer>

              </Stage>
            </div>
            <Modal
              width={'50vw'}
              closable={false}
              destroyOnClose
              visible={this.state.visible}
              onCancel={() => { this.setState({ visible: !this.state.visible }) }}
              footer={null}
              title={'Information supplémentaire'}>
              <Spin spinning={this.state.loading} tip='Dessin en cours de création...'>
                <h4>Votre dessin: </h4>
                <img width='90%' height='auto' src={this.layerRef && this.layerRef.getCanvas() ? this.layerRef.getCanvas().toDataURL() : ''} />
                <h4 style={{ marginBottom: '0px' }}>Debut du dessin :</h4>
                <Input defaultValue={duration(this.props.timeOfimage, 'minutes').format('h:mm')} disabled />
                <h4>{'Durée de l\'affichage :'}</h4>
                <InputNumber min={1} max={10} defaultValue={3} onChange={(e) => { this.setState({ duration: e }) }} />
                <Button onClick={this.saveCanvas}>Enregistrer</Button>
              </Spin>

            </Modal>
          </div>
        )}
      </div>
    )
  }
}

export default connectStoreon(mapStateToProps, mapDispatchToProps)(DrawingStudio)
