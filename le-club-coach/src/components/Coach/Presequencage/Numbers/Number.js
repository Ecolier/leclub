import React, { useState, useEffect } from 'react'
import { Button } from 'antd'
import DoubleClickButton from '../DoubleClickButton/DoubleClickButton'
import './Number.scss'

export default (props) => {
  const { timerRef, createLap } = props
  const [nbPlayers, setNbPlayers] = useState(12)

  useEffect(() => {
    const container = document.getElementById('numbers_container')
    container.scrollTop = container.scrollHeight
  }, [nbPlayers])

  const addPlayers = () => {
    setNbPlayers(nbPlayers + 1)
  }

  const renderNumber = () => {
    const render = []
    for (let i = 1; i < nbPlayers; i++) {
      render.push(
        <DoubleClickButton
          key={i}
          style={{ width: '25%', height: '10vh' }}
          onClick={() => { createLap(parseInt(timerRef.getAttribute('data-value'), 10), i, 'win') }}
          onDoubleClick={() => { createLap(parseInt(timerRef.getAttribute('data-value'), 10), i, 'lost') }}
        >
          <Button style={{ width: '100%', height: '10vh' }} type='secondary'>
            {i}
          </Button>
        </DoubleClickButton>
      )
    }
    render.push(<Button type='primary' icon='plus' style={{ width: '25%', height: '10vh' }} onClick={addPlayers} key={render.length + 1} />)
    return render
  }
  return (
    <div id={'numbers_container'} style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', overflow: 'auto', maxHeight: '35vh' }}>
      {renderNumber()}
    </div>
  )
}
