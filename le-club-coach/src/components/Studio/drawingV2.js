import React, { Component } from 'react'
import { useStoreon } from 'storeon/react'
import { Stage, Layer, Arrow, Circle, Line, Text, Group, Rect, Image } from 'react-konva'
import { ChromePicker } from 'react-color'
import { Popover, Slider } from 'antd'
import TransformerComponent from './Shape/Transform.js'
import uuid from 'uuid/v1'
import { ClipContext } from '../CutSample/context'
import i18n from 'i18n-js'

class URLImage extends React.Component {

  componentDidMount () {
    this.loadImage()
  }
  componentDidUpdate (oldProps) {
    if (oldProps.src !== this.props.src) {
      this.loadImage()
    }
  }
  componentWillUnmount () {
    this.image.removeEventListener('load', this.handleLoad)
  }
  state = {
    image: null,
  };
  loadImage () {
    // save to "this" to remove "load" handler on unmount
    this.image = new window.Image()
    this.image.src = this.props.src
    this.image.width = this.props.width
    this.image.height = this.props.height
    this.image.addEventListener('load', this.handleLoad)
  }
  handleLoad = () => {
    // after setState react-konva will update canvas and redraw the layer
    // because "image" property is changed
    this.setState({
      image: this.image,
    })
    // if you keep same image object during source updates
    // you will have to update layer manually:
    // this.imageNode.getLayer().batchDraw();
  };
  render () {
    return (
      <Image
        x={this.props.x}
        y={this.props.y}
        image={this.state.image}
        className={this.props.className}
        ref={node => {
          this.imageNode = node
        }}
      />
    )
  }
}

function TextBox (props) {
  const { isDrawing, name, onMouseDown, konvaText, shapeOpacity, textHeight, deleteTextDraw, updateKonvaText, updateShape } = props
  const [isFocus, setFocus] = React.useState(false)
  return (
    <Group
      onMouseDown={onMouseDown}
      name={name}
      draggable={!isDrawing}
      onTransformEnd={updateShape}
      onDragEnd={updateShape}
      onMouseEnter={() => setFocus(true)}
      onMouseLeave={() => setFocus(false)}
    >
      <Rect
        fill={'rgba(0,0,0,.75)'}
        width={320}
        height={textHeight}
        x={5} y={75}
        cornerRadius={6}
      />
      <Text
        fontSize={15}
        lineHeight={1.4}
        text={konvaText}
        x={10} y={82}
        width={300}
        wrap='word'
        fill={'white'}
        opacity={shapeOpacity / 10}
        strokeScaleEnabled={false}
      />
      {isFocus && (
        <React.Fragment>
          <Group>
            <URLImage className='delete-icon' src='../../../assets/trash-solid.svg' x={308} y={81} width={12} height={12}/>
            <Rect
              fill={'transparent'}
              opacity={0}
              width={10}
              height={10}
              x={310} y={81}
              onMouseEnter={() => { const a = document.getElementsByClassName('konva-stage')[0]; a.style.cursor = 'pointer' }}
              onMouseOut={() => { const a = document.getElementsByClassName('konva-stage')[0]; a.style.cursor = 'default' }}
              onClick={() => { deleteTextDraw(name) }}
            />
          </Group>
          <Group>
            <URLImage className='edit-icon' src='../../../assets/edit-solid.svg' x={310} y={94} width={12} height={12}/>
            <Rect
              fill={'transparent'}
              opacity={0}
              width={12}
              height={12}
              x={310} y={94}
              onMouseEnter={() => { const a = document.getElementsByClassName('konva-stage')[0]; a.style.cursor = 'pointer' }}
              onMouseOut={() => { const a = document.getElementsByClassName('konva-stage')[0]; a.style.cursor = 'default' }}
              onClick={() => { updateKonvaText(name) }}
            />
          </Group>
        </React.Fragment>
      )}
    </Group>
  )
}

function CustomArrow (props) {
  const { isDrawing, startPos, endPos, name, onMouseDown, formSelected, freeDraw, isSelected, shapeColor, shapeOpacity, dashed, updateShape } = props
  if (formSelected === 'circle') {
    const dx = startPos.x - endPos.x
    const dy = startPos.y - endPos.y
    const radius = Math.sqrt(dx * dx + dy * dy)
    return (
      <Circle
        onMouseDown={onMouseDown}
        onTransformEnd={updateShape}
        onDragEnd={updateShape}
        radius={radius}
        x={startPos.x}
        y={startPos.y}
        fill='rgba(0, 0, 0, 0.2)'
        stroke={shapeColor}
        strokeWidth={4}
        draggable={!isDrawing}
        name={name}
        opacity={shapeOpacity / 10}
        strokeScaleEnabled={false}
        dash={dashed ? [10, 10] : false}
      />
    )
  } else if (formSelected === 'freeDraw') {
    return (
      <Group
        onMouseDown={onMouseDown}
        name={name}
        draggable={!isDrawing}
        onTransformEnd={updateShape}
        onDragEnd={updateShape}
      >
        <Rect
          fill={isSelected ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
          width={freeDraw.maxMousePosition.right - freeDraw.maxMousePosition.left || 0}
          height={freeDraw.maxMousePosition.bottom - freeDraw.maxMousePosition.top || 0}
          x={freeDraw.maxMousePosition.left} y={freeDraw.maxMousePosition.top}
        />
        <Line
          tension={0}
          bezier
          points={freeDraw.path}
          stroke={shapeColor}
          strokeWidth={5}
          opacity={shapeOpacity / 10}
          strokeScaleEnabled={false}
          shadowColor={'black'}
          shadowBlur={2}
          shadowOffset={{ x: 0, y: 0 }}
          shadowOpacity={1}
          dash={dashed ? [20, 15] : null}
        />
      </Group>
    )
  } else if (formSelected === 'text') {
    return <TextBox {...props} />
  } else if (formSelected === 'rect') {
    return (
      <Rect
        onTransformEnd={updateShape}
        onDragEnd={updateShape}
        onMouseDown={onMouseDown}
        width={endPos.x - startPos.x}
        height={endPos.y - startPos.y}
        x={startPos.x} y={startPos.y}
        draggable={!isDrawing}
        name={name}
        fill='rgba(0, 0, 0, 0.2)'
        stroke={shapeColor}
        strokeWidth={4}
        opacity={shapeOpacity / 10}
        strokeScaleEnabled={false}
        dash={dashed ? [10, 10] : false}
      />
    )
  } else if (formSelected === 'arrow') {
    return (
      <Group
        onMouseDown={onMouseDown}
        name={name}
        draggable={!isDrawing}
        onTransformEnd={updateShape}
        onDragEnd={updateShape}
      >
        <Rect
          fill={isSelected ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
          width={endPos.x - startPos.x}
          height={endPos.y - startPos.y}
          x={startPos.x} y={startPos.y}
        />
        <Arrow
          points={[startPos.x, startPos.y, endPos.x, endPos.y]}
          pointerLength={20}
          pointerWidth={20}
          fill={shapeColor}
          stroke={shapeColor}
          strokeWidth={6}
          opacity={shapeOpacity / 10}
          strokeScaleEnabled={false}
          shadowColor={'black'}
          shadowBlur={2}
          shadowOffset={{ x: 0, y: 0 }}
          shadowOpacity={1}
          dash={dashed ? [20, 15] : null}
          // sceneFunc={(context, b) => {
          //   console.log(b)
          //   context.beginPath();
          //   context.moveTo(startPos.x, startPos.y);
          //   context.quadraticCurveTo(
          //       curvedPoint.x,
          //       curvedPoint.y,
          //       endPos.x,
          //       endPos.y
          //   );
          //   context.setAttr('strokeStyle', 'yellow');
          //   context.setAttr('lineWidth', 6);
          //   context.stroke();
          // }}
        />
        {/* <Circle*/}
        {/* onDragMove={(e) => { updateCurvedPoint(name, {x: e.evt.offsetX, y: e.evt.offsetY}) }}*/}
        {/* radius={5}*/}
        {/* x={curvedPoint.x}*/}
        {/* y={curvedPoint.y}*/}
        {/* fill='rgba(0, 0, 0, 0.2)'*/}
        {/* stroke={'red'}*/}
        {/* strokeWidth={4}*/}
        {/* draggable={true}*/}
        {/* opacity={1}*/}
        {/* />*/}
      </Group>
    )
  }
}

class DrawingStudioV2 extends Component {

  static contextType = ClipContext

  state = {
    arrows: [],
    freeDraw: {
      path: [],
      maxMousePosition: {},
    },
    formSelected: null,
    isDrawing: false,
    arrowStartPos: { x: 0, y: 0 },
    arrowEndPos: { x: 0, y: 0 },
    dashed: false,
    selectedShapeName: null,
    konvaText: '',
    shapeColor: '#ffe205',
    shapeOpacity: 10,
    arrowAnchor: null,
    shouldUnselect: true,
    isKonvaTextUpdate: false,
    stage: null,
    textHeight: null,
    canCheck: true,
    updateShape: false,
  }

  get videoWidth () {
    const video = this.props.videoElement
    return video.offsetWidth
  }

  get videoHeight () {
    const video = this.props.videoElement
    return video.offsetHeight
  }

  handleMouseDown = ({ evt }) => {
    const { offsetX, offsetY } = evt
    const { formSelected, shouldUnselect } = this.state

    if (shouldUnselect) {
      this.setState({ selectedShapeName: null })
    } else {
      this.setState({ shouldUnselect: true })
    }
    if (formSelected) {
      this.setState({
        isDrawing: true,
        arrowStartPos: { x: offsetX, y: offsetY },
        arrowEndPos: { x: offsetX, y: offsetY },
        selectedShapeName: null,
      })
    }
  };

  handleMouseUp = () => {
    const { isDrawing, formSelected, freeDraw, shapeColor, shapeOpacity, dashed } = this.state
    if (isDrawing) {
      const arrows = this.state.arrows
      const uid = uuid()
      if (formSelected === 'freeDraw') {
        // superieur a 4 psk 4 trop petit (c'est juste 1 point)
        if (freeDraw.path.length > 4) {
          arrows.push({ freeDraw, name: `${formSelected}-${uid}`, formSelected, shapeColor, shapeOpacity, dashed })
          this.setState({ isDrawing: false, arrows })
        }
      } else {
        if (this.state.arrowStartPos.x === this.state.arrowEndPos.x && this.state.arrowStartPos.y === this.state.arrowEndPos.y) {
          return this.setState({ isDrawing: false })
        }
        arrows.push({ startPos: this.state.arrowStartPos, endPos: this.state.arrowEndPos, curvedPoint: { x: ((this.state.arrowEndPos.x - this.state.arrowStartPos.x) / 2) + this.state.arrowStartPos.x, y: ((this.state.arrowEndPos.y - this.state.arrowStartPos.y) / 2) + this.state.arrowStartPos.y }, name: `${formSelected}-${uid}`, formSelected, shapeColor, shapeOpacity, dashed })
      }
      this.setState({
        isDrawing: false,
        arrows,
        freeDraw: {
          path: [],
          maxMousePosition: {},
        },
        selectedShapeName: formSelected === 'circle' || formSelected === 'rect' ? `${formSelected}-${uid}` : null,
        formSelected: formSelected === 'circle' || formSelected === 'rect' ? null : formSelected,
        shouldUnselect: true,
        canCheck: false,
      }, () => {
        this.reRender()
      })
    }
  };

  handleMouseMove = ({ evt }) => {
    const { isDrawing, formSelected, selectedShapeName, arrows, arrowAnchor } = this.state
    const { offsetX, offsetY } = evt

    if (isDrawing) {
      if (formSelected === 'freeDraw') {
        const freeDraw = this.state.freeDraw
        freeDraw.path.push(offsetX, offsetY)
        freeDraw.maxMousePosition = {
          top: freeDraw.maxMousePosition.top && freeDraw.maxMousePosition.top < offsetY ? freeDraw.maxMousePosition.top : offsetY,
          right: freeDraw.maxMousePosition.right && freeDraw.maxMousePosition.right > offsetX ? freeDraw.maxMousePosition.right : offsetX,
          bottom: freeDraw.maxMousePosition.bottom && freeDraw.maxMousePosition.bottom > offsetY ? freeDraw.maxMousePosition.bottom : offsetY,
          left: freeDraw.maxMousePosition.left && freeDraw.maxMousePosition.left < offsetX ? freeDraw.maxMousePosition.left : offsetX,
        }
        this.setState({ freeDraw })
      } else if (formSelected) {
        this.setState({
          arrowEndPos: { x: offsetX, y: offsetY },
        })
      }
      if (selectedShapeName) {
        const index = arrows.findIndex(a => a.name === selectedShapeName)
        if (index !== -1) {
          const newArrows = arrows
          if (arrowAnchor === 'top-left') {
            newArrows[index].startPos = { x: offsetX, y: offsetY }
          } else if (arrowAnchor === 'bottom-right') {
            newArrows[index].endPos = { x: offsetX, y: offsetY }
          }
          this.setState({ arrows: newArrows })
        }
      }
    }
  };

  resetStage = () => {
    this.setState({ arrows: [], stage: null })
  }

  deleteShape = () => {
    const { selectedShapeName } = this.state
    const arrows = [...this.state.arrows]
    const index = arrows.findIndex(arrow => arrow.name === selectedShapeName)

    if (index !== -1) {
      arrows.splice(index, 1)
      this.setState({ arrows, selectedShapeName: null, updateShape: true }, () => {
        this.reRender()
      })
    }
  }

  textAreaChange = (evt) => {
    evt.target.style.height = `${evt.target.scrollHeight}px`
    this.setState({ konvaText: evt.target.value })
  }

  textAreaFinish = (evt) => {
    const { konvaText, formSelected, shapeColor, shapeOpacity, selectedShapeName, isKonvaTextUpdate } = this.state
    const arrows = this.state.arrows
    if (isKonvaTextUpdate) {
      const index = arrows.findIndex(a => a.name === selectedShapeName)
      if (index !== -1) {
        arrows[index].konvaText = konvaText
        arrows[index].textHeight = parseInt(evt.target.style.height, 10)
      }
    } else {
      arrows.push({ konvaText, name: `${formSelected}-${uuid()}`, formSelected, shapeColor, shapeOpacity, textHeight: parseInt(evt.target.style.height, 10), canCheck: false })
    }
    this.setState({ isDrawing: false, arrows, formSelected: null, konvaText: '', isKonvaTextUpdate: false, textHeight: null, canCheck: false }, () => {
      this.reRender()
    })
  }

  updateKonvaText = (name) => {
    const { arrows } = this.state
    const index = arrows.findIndex(a => a.name === name)
    if (index !== -1) {
      this.setState({
        selectedShapeName: name,
        konvaText: arrows[index].konvaText,
        textHeight: arrows[index].textHeight,
        formSelected: 'text',
        isKonvaTextUpdate: true,
      })
    }
  }

  selectForm = (form) => {
    this.setState({ formSelected: form, selectedShapeName: null })
    this.context.setDrawing(true)
    this.context.pause()
  }

  pushArrows = () => {
    const { arrows } = this.state

    const png = this.state.stage.getStage().toDataURL().split(',')[1]
    const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
      const byteCharacters = atob(b64Data)
      const byteArrays = []
      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize)
        const byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }
      return new Blob(byteArrays, { type: contentType })
    }
    const blob = b64toBlob(png, 'image/png')
    const file = new File([blob], 'draw.png', { type: 'image/png' })
    this.props.pushDrawings({
      time: this.props.isTrying ? this.context.getRelativeTime().toFixed(1) : this.context.getAbsoluteCurrentTime(),
      file,
      shapes: [].concat(arrows),
    }, () => { this.setState({ canCheck: true, updateShape: false }) })
  }

  reRender = () => {
    this.setState({ selectedShapeName: null }, () => {
      this.pushArrows()
    })
  }

  render () {
    const { arrowEndPos, arrowStartPos, isDrawing, arrows, formSelected, selectedShapeName, freeDraw, konvaText, shapeColor, shapeOpacity, dashed, isKonvaTextUpdate, textHeight } = this.state
    const video = this.props.videoElement
    return (
      <div>
        <div style={{ position: 'absolute', height: '100%', width: '30px', zIndex: '8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            width: '100%',
            borderTopRightRadius: '5px',
            borderBottomRightRadius: '5px',
            padding: '5px',
          }}>
            <svg viewBox='0 0 32 32' style={{ color: 'white', fontSize: '1rem', padding: '5px 0', cursor: 'pointer', backgroundColor: formSelected === 'text' ? 'rgba(255, 255, 255, 0.1)' : 'transparent' }} onClick={() => { this.selectForm('text') }}>
              <path
                fill='white'
                d='M8.143 18.242h3.487l-2.055-6.478-1.907 5.822a.5.5 0 0 0 .475.656zM8.018 8h3.18a.5.5 0 0 1 .472.333l5.476 15.463a.5.5 0 0 1-.471.667h-2.656a.5.5 0 0 1-.477-.35l-.951-3.034H6.526l-1.024 3.043a.5.5 0 0 1-.474.34H2.5a.5.5 0 0 1-.47-.667L7.546 8.332A.5.5 0 0 1 8.017 8zm17.908 10.543a3.459 3.459 0 0 1-.608.307 5.09 5.09 0 0 1-.844.218l-.714.134c-.67.12-1.15.265-1.441.436-.492.29-.737.74-.737 1.351 0 .544.15.937.452 1.179.302.242.668.363 1.1.363.685 0 1.316-.202 1.893-.604.577-.402.877-1.135.9-2.2v-1.184zm-1.932-1.485c.588-.075 1.009-.168 1.262-.28.454-.193.681-.495.681-.904 0-.499-.173-.843-.519-1.033-.346-.19-.854-.285-1.524-.285-.752 0-1.285.186-1.598.558-.223.276-.372.648-.446 1.117h-3.072c.067-1.064.365-1.94.894-2.624.841-1.073 2.286-1.609 4.333-1.609 1.333 0 2.517.265 3.552.793 1.035.529 1.552 1.527 1.552 2.994v5.584c0 .387.008.856.023 1.407.022.417.085.7.19.849.104.149.26.272.469.369 0 .259-.21.469-.47.469h-2.993a3.545 3.545 0 0 1-.2-.693 8.348 8.348 0 0 1-.09-.737 6.54 6.54 0 0 1-1.519 1.217c-.685.395-1.46.592-2.323.592-1.102 0-2.012-.314-2.73-.943-.72-.63-1.079-1.521-1.079-2.675 0-1.497.577-2.58 1.732-3.25.632-.365 1.563-.626 2.792-.782l1.083-.134z'
              />
            </svg>
            <svg viewBox='0 0 32 32' style={{ color: 'white', fontSize: '1rem', padding: '5px 0', cursor: 'pointer', backgroundColor: formSelected === 'arrow' ? 'rgba(255, 255, 255, 0.1)' : 'transparent' }} onClick={() => { this.selectForm('arrow') }}>
              <path
                fill='white'
                d='M21.765 9h-7.71a1.5 1.5 0 1 1 0-3H25.17a1.5 1.5 0 0 1 1.5 1.5v11.331a1.5 1.5 0 0 1-3 0V11.34L8.56 26.447a1.5 1.5 0 0 1-2.122-2.121L21.765 9z'
              />
            </svg>
            <svg viewBox='0 0 32 32' style={{ color: 'white', fontSize: '1rem', padding: '5px 0', cursor: 'pointer', backgroundColor: formSelected === 'circle' ? 'rgba(255, 255, 255, 0.1)' : 'transparent' }} onClick={() => { this.selectForm('circle') }}>
              <path
                fill='white'
                d='M16 28C9.373 28 4 22.627 4 16S9.373 4 16 4s12 5.373 12 12-5.373 12-12 12zm0-3a9 9 0 1 0 0-18 9 9 0 0 0 0 18z'
              />
            </svg>
            <svg viewBox='-65 -50 600 600' style={{ color: 'white', fontSize: '1rem', padding: '5px 0', cursor: 'pointer', backgroundColor: formSelected === 'rect' ? 'rgba(255, 255, 255, 0.1)' : 'transparent' }} onClick={() => { this.selectForm('rect') }}>
              <path
                fill='white'
                d='M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z'
              />
            </svg>
            <svg viewBox='0 0 32 32' style={{ color: 'white', fontSize: '1rem', padding: '5px 0', cursor: 'pointer', backgroundColor: formSelected === 'freeDraw' ? 'rgba(255, 255, 255, 0.1)' : 'transparent' }} onClick={() => { this.selectForm('freeDraw') }}>
              <path
                fill='white'
                d='M15.927 21.69c-.798 2.363-.373 3.84.597 3.84 2.51 0 3.989-4.696 3.632-8.46-1.86.548-3.45 2.312-4.23 4.62zm6.586 1.193c-.96 3.43-2.922 5.646-5.989 5.646-3.696 0-4.791-3.798-3.44-7.799 1.063-3.144 3.305-5.66 6.14-6.52-.462-.83-1.035-1.606-1.526-1.933-.965-.643-2.076-.643-2.686-.114-.898.778-1.535 1.895-2.68 4.47l-.127.284c-1.057 2.378-1.626 3.46-2.527 4.532-.624.743-1.454 1.346-2.364 1.554-1.404.32-2.684-.36-3.422-1.855-1.054-2.132-.77-3.971.607-8.332.882-2.797 1.15-3.998 1.038-5.142-.019-.193-.13-.324-.42-.465a2.36 2.36 0 0 0-.738-.214 1.5 1.5 0 1 1 .243-2.99c.486.04 1.129.178 1.802.504 1.155.56 1.967 1.515 2.1 2.875.165 1.705-.15 3.12-1.151 6.292-1.129 3.577-1.35 5.012-.792 6.144.057.115.104.19.136.235.182-.075.453-.285.665-.536.654-.778 1.143-1.71 2.082-3.82l.127-.285c1.331-2.994 2.102-4.344 3.457-5.518 1.693-1.467 4.283-1.469 6.314-.115 1.2.8 2.37 2.523 3.064 4.141 3.91.247 6.057 1.98 6.057 6.48 0 .804-.223 1.587-.604 2.348a1.5 1.5 0 1 1-2.682-1.345c.188-.374.286-.719.286-1.002 0-2.247-.599-3.125-2.343-3.403.096 1.75-.105 4.013-.627 5.883z'
              />
            </svg>
            <div style={{ width: '100%', padding: '5px 0' }}>
              <hr style={{ width: '100%' }} />
            </div>
            <svg viewBox='0 0 32 32' style={{ color: 'white', fontSize: '1rem', padding: '5px 0', cursor: 'pointer', backgroundColor: !formSelected ? 'rgba(255, 255, 255, 0.1)' : 'transparent' }} onClick={() => { this.selectForm(null) }}>
              <path
                fill='white'
                d='M18.483 17.1l4.973 7.373a1 1 0 0 1-.27 1.388l-.829.56a1 1 0 0 1-1.388-.27l-5.085-7.539-3.328 4.48c-.475.275-.866.207-1.055-.12-.097-.168-.14-.405-.115-.7L10.27 7.456c.075-.87.753-1.218 1.507-.786l12.245 8.225c.758.434.781 1.128.067 1.54l-5.606.666z'
              />
            </svg>
            <Popover placement='right' content={dashed ? (<div><span style={{ color: 'red' }}>{i18n.t('Common_word.desactivate')}</span> {i18n.t('Studio.dashMode')}</div>) : (<div><span style={{ color: 'green' }}>{i18n.t('Common_word.activate')}</span> {i18n.t('Studio.dashMode')}</div>)} >
              <svg viewBox='-13 0 32 25' style={{ color: 'white', fontSize: '1rem', padding: '5px 0', cursor: 'pointer', backgroundColor: dashed ? 'rgba(255, 255, 255, 0.1)' : 'transparent', borderRadius: '5px' }} onClick={() => { this.setState({ dashed: !dashed }) }}>
                <line strokeDasharray='4' x1='0' y1='3' x2='30' y2='3' strokeWidth='3' stroke='white' transform='rotate(-45 20 20)'/>
              </svg>
            </Popover>
            <Popover placement='right' title={i18n.t('Common_word.color')} content={(
              <ChromePicker
                color={shapeColor}
                onChange={(e) => {
                  if (selectedShapeName) {
                    const index = arrows.findIndex(a => a.name === selectedShapeName)
                    if (index !== -1) {
                      const newArrows = arrows
                      newArrows[index].shapeColor = e.hex
                      this.setState({ shapeColor: e.hex, arrows: newArrows })
                    }
                  } else {
                    this.setState({ shapeColor: e.hex })
                  }
                }}
                disableAlpha={false}
              />
            )}>
              <svg viewBox='-65 -50 600 600' style={{ color: 'white', fontSize: '1rem', padding: '5px 0', cursor: 'pointer' }}>
                <path
                  fill='white'
                  d='M204.3 5C104.9 24.4 24.8 104.3 5.2 203.4c-37 187 131.7 326.4 258.8 306.7 41.2-6.4 61.4-54.6 42.5-91.7-23.1-45.4 9.9-98.4 60.9-98.4h79.7c35.8 0 64.8-29.6 64.9-65.3C511.5 97.1 368.1-26.9 204.3 5zM96 320c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm32-128c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128-64c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 64c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z'
                />
              </svg>
            </Popover>
            <Popover placement='right' title={'Transparence'} content={(
              <div style={{ width: '300px' }}>
                <Slider
                  min={0}
                  max={10}
                  marks={{ 0: 0, 10: 10 }}
                  onChange={(e) => {
                    if (selectedShapeName) {
                      const index = arrows.findIndex(a => a.name === selectedShapeName)
                      if (index !== -1) {
                        const newArrows = arrows
                        newArrows[index].shapeOpacity = e
                        this.setState({ shapeOpacity: e, arrows: newArrows })
                      }
                    } else {
                      this.setState({ shapeOpacity: e })
                    }
                  }}
                  value={shapeOpacity} />
              </div>
            )}>
              <svg viewBox='-65 -50 600 600' style={{ color: 'white', fontSize: '1rem', padding: '5px 0', cursor: 'pointer' }}>
                <path
                  fill='white'
                  d='M8 256c0 136.966 111.033 248 248 248s248-111.034 248-248S392.966 8 256 8 8 119.033 8 256zm248 184V72c101.705 0 184 82.311 184 184 0 101.705-82.311 184-184 184z'
                />
              </svg>
            </Popover>
            <svg viewBox='0 0 32 32' style={{ color: 'white', fontSize: '1rem', padding: '5px 0', cursor: 'pointer' }} onClick={() => { this.deleteShape() }}>
              <path
                fill='white'
                d='M14.266 2a1 1 0 0 0-.993.89L13.15 4H4.5a.5.5 0 0 0-.5.5V6h24V4.5a.5.5 0 0 0-.5-.5h-8.707l-.122-1.11a1 1 0 0 0-.994-.89h-3.411zM6 7l1.827 19.19A2.002 2.002 0 0 0 9.818 28h12.364a2 2 0 0 0 1.99-1.81L26 7H6z'
              />
            </svg>
          </div>
        </div>
        {formSelected === 'text' && (
          <div style={{ position: 'absolute', top: '75px', left: '5px', zIndex: '1000' }}>
            <textarea
              autoFocus={formSelected === 'text'}
              id='konvaText'
              rows='1'
              value={konvaText}
              onChange={this.textAreaChange}
              onKeyPress={(evt) => { if (evt.key === 'Enter' && !evt.shiftKey) { this.textAreaFinish(evt) } }}
              style={{ height: textHeight || 'auto', width: '290px', borderRadius: '6px', backgroundColor: 'rgba(0,0,0,.75)', border: '1px solid rgba(122,138,153,.6)', color: '#fff', padding: '.5rem', outline: 'none', resize: 'none', overflow: 'hidden' }}
            />
          </div>
        )}
        {this.context.drawing && this.context.player.paused && (
          <Stage
            width={this.videoWidth}
            height={this.videoHeight}
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
            onMouseMove={this.handleMouseMove}
            style={{ cursor: formSelected ? 'crosshair' : 'default', zIndex: '5' }}
            className={'konva-stage'}
            ref={node => {
              if (!this.state.stage) {
                this.setState({ stage: node })
              }
            }}
          >
            <Layer>
              <Image
                x={0}
                y={0}
                width={video.offsetWidth}
                height={video.offsetHeight}
                image={video}
              />

              {isDrawing && ((arrowStartPos.x !== arrowEndPos.x || arrowStartPos.y !== arrowEndPos.y) || freeDraw.path.length !== 0) && (
                <CustomArrow startPos={arrowStartPos} endPos={arrowEndPos} formSelected={formSelected} freeDraw={freeDraw} shapeColor={shapeColor} shapeOpacity={shapeOpacity} dashed={dashed} curvedPoint={{ x: ((this.state.arrowEndPos.x - this.state.arrowStartPos.x) / 2) + this.state.arrowStartPos.x, y: ((this.state.arrowEndPos.y - this.state.arrowStartPos.y) / 2) + this.state.arrowStartPos.y }}/>
              )}
              {arrows.map(arrow => {
                if (isKonvaTextUpdate && arrow.formSelected === 'text' && arrow.name === selectedShapeName) { return null }
                return (
                  <CustomArrow
                    key={arrow.name}
                    isDrawing={isDrawing}
                    curvedPoint={arrow.curvedPoint}
                    startPos={arrow.startPos}
                    endPos={arrow.endPos}
                    name={arrow.name}
                    formSelected={arrow.formSelected}
                    onMouseDown={() => { this.setState({ selectedShapeName: arrow.name, shouldUnselect: false }) }}
                    freeDraw={arrow.freeDraw}
                    konvaText={arrow.konvaText}
                    isSelected={selectedShapeName === arrow.name}
                    shapeColor={arrow.shapeColor}
                    shapeOpacity={arrow.shapeOpacity}
                    textHeight={arrow.textHeight}
                    dashed={arrow.dashed}
                    deleteTextDraw={(name) => { this.setState({ selectedShapeName: name }, () => { this.deleteShape() }) }}
                    updateKonvaText={this.updateKonvaText}
                    updateShape={() => this.reRender()}
                    rerender={() => { this.forceUpdate() }}
                    updateCurvedPoint={(name, point) => {
                      const index = arrows.findIndex(a => a.name === name)
                      if (index !== -1) {
                        const newArrows = arrows
                        newArrows[index].curvedPoint = point
                        this.setState({ arrows: newArrows })
                      }
                    }}
                  />
                )
              })}
              {/* {(this.props.drawings && !this.state.canCheck) || this.state.updateShape ? this.pushArrows() : null}*/}
              {selectedShapeName && (
                <TransformerComponent stage={this.state.stage} selectedShapeName={selectedShapeName} shouldUnselect={() => {
                  this.setState({ shouldUnselect: false })
                }}/>
              )}
            </Layer>
          </Stage>
        )}
      </div>
    )
  }
}

export default React.forwardRef((initialProps, ref) => {
  const { coach } = useStoreon('coach')
  return React.createElement(DrawingStudioV2, {
    ...initialProps,
    coach,
    ref,
  })
})
