import React from 'react'
import { Icon } from 'antd'
import i18n from 'i18n-js'
import '@/i18n'

export default (props) => {
  const { laps, onRemove } = props

  const addZero = (n) => {
    return n < 10 ? `0${n}` : n
  }

  const renderLaps = (lap, lapKey) => {
    const lapTime = new Date(lap.value)
    let hundredthsLap = Math.round(lapTime.getMilliseconds() / 10)
    const secondsLap = lapTime.getSeconds()
    const minutesLap = lapTime.getMinutes()
    const hoursLap = lapTime.getHours() - 1
    if (hundredthsLap === 100) {
      hundredthsLap = 0
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
        <Icon type='minus-circle' theme='twoTone' twoToneColor='red' style={{ marginRight: '10px', cursor: 'pointer', fontSize: '1.2rem' }} onClick={() => onRemove(lapKey)}/>
        <div style={{ flex: 1 }}>
          {lap.type !== 'win' && lap.type !== 'lost' ? (
            <p>{i18n.t('Common_word.highlight')} - {lap.name.name}</p>
          ) : (
            <p>{i18n.t('Common_word.playerNum')}: {lap.name} - {lap.type === 'win' ? i18n.t('VideoPlayer.seekbar.ballWin') : i18n.t('VideoPlayer.seekbar.ballLoss')}</p>
          )}
        </div>
        <p>{addZero(hoursLap)}:{addZero(minutesLap)}:{addZero(secondsLap)}:{addZero(hundredthsLap)}</p>
      </div>
    )
  }

  return (
    laps.map((lap, lapKey) => (
      <div style={{ width: '100%' }} key={lapKey}>
        {renderLaps(lap, lapKey)}
        <hr/>
      </div>
    ))
  )
}
