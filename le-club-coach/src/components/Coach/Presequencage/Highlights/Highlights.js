import React from 'react'
import { Button } from 'antd'
import DoubleClickButton from '../DoubleClickButton/DoubleClickButton'
import './Highlights.scss'

export default (props) => {
  const renderHighligts = () => {
    return props.coach.prefStudio.tags.map((tag, key) => (
      <DoubleClickButton
        key={key}
        onClick={() => { props.createLap(parseInt(props.timerRef.getAttribute('data-value'), 10), tag, 'moment') }}
        onDoubleClick={() => { props.createLap(parseInt(props.timerRef.getAttribute('data-value'), 10), tag, 'moment') }}
        style={{ width: '33.333%', height: '10vh' }}
      >
        <Button type='secondary' size={'large'} className={'highlights-btn'} style={{ backgroundColor: tag.color, width: '100%', height: '10vh' }}>
          <p style={{ whiteSpace: 'pre-line' }}>
            {tag.name}
          </p>
        </Button>
      </DoubleClickButton>

    ))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
      {renderHighligts()}
    </div>
  )
}
