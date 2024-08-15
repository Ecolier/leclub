import React, { useState, useEffect } from 'react'
import './stopwatch.scss'
import { Modal } from 'antd'
import i18n from 'i18n-js'
import '@/i18n'

export default (props) => {
  const [startTS, setStartTS] = useState(null)
  const [diff, setDiff] = useState(new Date(props.defaultValue) || 0)
  const [suspended, setSuspended] = useState(new Date(props.defaultValue))
  const [interval, setInterval] = useState(null)

  useEffect(() => {
    const timerRef = document.getElementById('timerValue')
    if (timerRef && props.setTimerRef) {
      props.setTimerRef(timerRef)
    }
  }, [])

  useEffect(() => {
    setDiff(new Date(props.defaultValue))
    setSuspended(new Date(props.defaultValue))
  }, [props.defaultValue])

  useEffect(() => {
    if (props.timeStarted === true) {
      start()
    } else {
      stop()
    }
  }, [props.timeStarted])

  const start = () => {
    if (startTS) {
      // prevent multi clicks on start
      return
    }
    if (props.setTimeStarted) {
      props.setTimeStarted(true)
    }
    setStartTS(Number(new Date()) - suspended)
    setInterval(requestAnimationFrame(() => { tick(Number(new Date()) - suspended) }))
    setSuspended(0)
  }

  const stop = () => {
    if (props.setTimeStarted) {
      props.setTimeStarted(false)
    }
    cancelAnimationFrame(interval)
    setStartTS(null)
    setSuspended(Number(diff))
  }

  const reset = () => {
    stop()
    Modal.confirm({
      title: i18n.t('LiveEditing.reset'),
      content: i18n.t('Subscribe.warning_message'),
      onOk () {
        cancelAnimationFrame(interval)
        setStartTS(null)
        setDiff(null)
        setSuspended(0)
        setInterval(null)
        if (props.resetPresequencage) {
          props.resetPresequencage()
        }
      },
    })
  }

  const tick = (a) => {
    setDiff(new Date(Number(new Date()) - a))
    setInterval(requestAnimationFrame(() => { tick(a) }))
  }

  const addZero = (n) => {
    return n < 10 ? `0${n}` : n
  }

  let hundredths = diff ? Math.round(diff.getMilliseconds() / 10) : 0
  const seconds = diff ? diff.getSeconds() : 0
  const minutes = diff ? diff.getMinutes() : 0
  const hours = diff ? diff.getHours() - 1 > 0 ? diff.getHours() - 1 : 0 : 0
  if (hundredths === 100) hundredths = 0

  const lastLap = new Date(props.lastLap)
  let hundredthsLap = Math.round(lastLap.getMilliseconds() / 10)
  if (hundredthsLap === 100) hundredthsLap = 0

  return (
    <div id={'stopwatch'}>
      <section className='Chrono'>
        <h1>{addZero(hours)}:{addZero(minutes)}:{addZero(seconds)}:{addZero(hundredths)}</h1>
        <div id={'timerValue'} style={{ display: 'none' }} data-value={Number(diff)}/>
        <div className='buttons'>
          <button onClick={start}>{i18n.t('Common_word.start')}</button>
          <button onClick={stop}>{i18n.t('Common_word.stop')}</button>
          <button onClick={reset}>{i18n.t('Common_word.reset')}</button>
          <button onClick={props.openScoreModal} style={{ color: 'green', borderColor: 'green' }}>{i18n.t('Common_word.end')}</button>
        </div>
      </section>
    </div>
  )
}
