import React, { useState, useEffect } from 'react'
import Stopwatch from './Stopwatch/stopwatch'
import Tabs from './Tabs/Tabs'
import Laps from './Laps/Laps'
import TutorialModal from './TutorialModal/tutorialModal.js'
import { useStoreon } from 'storeon/react'
import i18n from 'i18n-js'
import '@/i18n'
import { Button, message, Icon, Modal, notification, Avatar } from 'antd'
import { callApi } from '@/utils/callApi'
import { closePreSequencageTutorialModal } from '@/actions/coach.js'
import './presequencage.css'

export default (props) => {

  const { coach } = useStoreon('coach')
  const [timeStarted, setTimeStarted] = useState(false)
  const [timerRef, setTimerRef] = useState(null)
  const [lastLap, setLastLap] = useState(0)
  const [events, setEvents] = useState([])
  const [rapport, setRapport] = useState(null)
  const [activeOnglet, setActiveOnglet] = useState('laps')
  const [scoreModalVisible, setScoreModalVisible] = useState(false)
  const [tutorialModalVisible, setTutorialModalVisible] = useState(coach.presequencageTutorial)
  const [scoreTeamDomicile, setScoreTeamDomicile] = useState(0)
  const [scoreTeamAway, setScoreTeamAway] = useState(0)
  const [teams, setTeams] = useState(null)

  useEffect(() => {
    fetchSequencage()
    fetchTeamName()
  }, [])

  useEffect(() => {
    if ((events && events.length > 0) || lastLap !== 0) {
      saveInLocalStorage()
    }
  }, [events, lastLap])

  useEffect(() => {
    if (activeOnglet === 'laps') {
      const tabElement = document.getElementsByClassName('ant-tabs-nav')
      if (tabElement && tabElement.length > 0) {
        tabElement[0].children[0].style.display = 'flex'
        tabElement[0].children[0].style.width = '100%'
      }
    }
  }, [activeOnglet])

  const fetchTeamName = async () => {
    const body = await callApi(`app/coach/getTeamNamePresequencage/${coach._id}?matchId=${props.matchId}`, 'get')
    setTeams(body.teams)
    setScoreTeamDomicile(body.teams.clubHome.score)
    setScoreTeamAway(body.teams.clubAway.score)
  }

  const fetchSequencage = async () => {
    const body = await callApi(`app/coach/preset/${coach._id}?matchId=${props.matchId}`, 'get')
    if (!body.laps && !body.endTime) {
      let presequencage = localStorage.getItem(`presequencage-${props.matchId}`)
      if (presequencage) {
        presequencage = JSON.parse(presequencage)
        setLastLap(presequencage.lastLap)
        setEvents(presequencage.events)
      }
    } else {
      setEvents(body.laps || [])
      setLastLap(body.endTime || 0)
    }
  }

  const saveInLocalStorage = () => {
    const presequencage = {
      lastLap,
      events,
    }
    localStorage.setItem(`presequencage-${props.matchId}`, JSON.stringify(presequencage))
  }

  const deleteEvent = (index) => {
    const newEvent = [...events]
    newEvent.splice(index, 1)
    setEvents(newEvent)
  }

  const resetPresequencage = async () => {

    await callApi(`app/coach/preset/${coach._id}?matchId=${props.matchId}`, 'delete')
    setEvents([])
    setLastLap(0)
    localStorage.removeItem(`presequencage-${props.matchId}`)
  }

  const createLap = (time, playerNumber, eventType = null) => {
    const laps_container = document.getElementById('laps_container')

    if (eventType !== 'lost' && eventType !== 'win') { eventType = 'moment' }
    const event = {
      name: playerNumber,
      value: time,
      type: eventType,
    }
    setLastLap(time)
    setEvents([...events, event])
    const messageType = eventType === 'win' ? 'success' : eventType === 'lost' ? 'error' : 'info'
    const messageContent = eventType === 'win' ? i18n.t('VideoPlayer.seekbar.ballWin') : eventType === 'lost' ? i18n.t('VideoPlayer.seekbar.ballLoss') : i18n.t('Common_word.highlight')
    message[messageType](messageContent, 0.5)
    laps_container.scrollTop = laps_container.scrollHeight
  }

  const createRapport = () => {
    const rapport = {
      players: [],
      total: { win: 0, lost: 0 },
      time: {
        first: { win: 0, lost: 0 },
        second: { win: 0, lost: 0 },
        third: { win: 0, lost: 0 },
        fourth: { win: 0, lost: 0 },
        fifth: { win: 0, lost: 0 },
        sixth: { win: 0, lost: 0 },
      },
    }
    events.forEach(lap => {
      if (lap.type === 'win' || lap.type === 'lost') {
        const index = rapport.players.findIndex(p => p.numero === lap.name)
        if (index !== -1) {
          if (lap.type === 'win') {
            rapport.players[index].win += 1
          } else {
            rapport.players[index].lost += 1
          }
        } else if (lap.type === 'win') {
          rapport.players.push({ numero: lap.name, win: 1, lost: 0 })
        } else {
          rapport.players.push({ numero: lap.name, win: 0, lost: 1 })
        }
        if (lap.type === 'win') {
          rapport.total.win += 1
          if (lap.value >= 0 && lap.value < 900000) {
            rapport.time.first.win += 1
          } else if (lap.value >= 900000 && lap.value < 1800000) {
            rapport.time.second.win += 1
          } else if (lap.value >= 1800000 && lap.value < 2700000) {
            rapport.time.third.win += 1
          } else if (lap.value >= 2700000 && lap.value < 3600000) {
            rapport.time.fourth.win += 1
          } else if (lap.value >= 3600000 && lap.value < 4500000) {
            rapport.time.fifth.win += 1
          } else if (lap.value >= 4500000 && lap.value < 5400000) {
            rapport.time.sixth.win += 1
          }
        } else {
          rapport.total.lost += 1
          if (lap.value >= 0 && lap.value < 900000) {
            rapport.time.first.lost += 1
          } else if (lap.value >= 900000 && lap.value < 1800000) {
            rapport.time.second.lost += 1
          } else if (lap.value >= 1800000 && lap.value < 2700000) {
            rapport.time.third.lost += 1
          } else if (lap.value >= 2700000 && lap.value < 3600000) {
            rapport.time.fourth.lost += 1
          } else if (lap.value >= 3600000 && lap.value < 4500000) {
            rapport.time.fifth.lost += 1
          } else if (lap.value >= 4500000 && lap.value < 5400000) {
            rapport.time.sixth.lost += 1
          }
        }
      }
    })
    rapport.players.sort((a, b) => a.numero - b.numero)
    setRapport(rapport)
    return rapport
  }

  const savePresequencage = () => {
    const rapportPresequencage = createRapport()
    const save = () => {
      const score = {
        coachTeamScore: scoreTeamDomicile,
        opponentTeamScore: scoreTeamAway,
      }
      setScoreModalVisible(false)
      callApi(`app/coach/presetMatch/${coach._id}`, 'post', {
        laps: events,
        endTime: parseInt(timerRef.getAttribute('data-value'), 10),
        matchId: props.matchId,
        score,
        rapport: rapportPresequencage,
      }).then((res) => {
        localStorage.removeItem(`presequencage-${props.matchId}`)
        notification.success({
          message: i18n.t('Presequencage.modal.success'),
          description: res.message,
        })
      }).catch(e => {
        notification.error({
          message: i18n.t('Presequencage.modal.erreur'),
          description: e,
        })
      })
    }
    Modal.confirm({
      title: i18n.t('Presequencage.modal.title'),
      content: i18n.t('Presequencage.modal.content'),
      onOk () {
        save()
      },
    })
  }

  // const handleChangeOnglet = (value) => {
  //   if (value !== activeOnglet) {
  //     setActiveOnglet(value)
  //   }
  //   if (value === 'rapport' && !rapport) {
  //     createRapport(events)
  //   }
  // }

  const openScoreModal = () => {
    setTimeStarted(false)
    setTimeStarted(false)
    setScoreModalVisible(true)
  }

  const changeScoreTeam = (team, action) => {
    if (team === 'domicile') {
      if (action === 'add') {
        setScoreTeamDomicile(scoreTeamDomicile + 1)
      } else if (scoreTeamDomicile > 0) {
        setScoreTeamDomicile(scoreTeamDomicile - 1)
      }
    } else if (action === 'add') {
      setScoreTeamAway(scoreTeamAway + 1)
    } else if (scoreTeamAway > 0) {
      setScoreTeamAway(scoreTeamAway - 1)
    }
  }

  const closeTutorialModal = () => {
    if (coach.presequencageTutorial) {
      closePreSequencageTutorialModal(coach._id)
    }
    setTutorialModalVisible(false)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: `${screen.width > 425 ? 'relative' : ''}`, justifyContent: 'space-between' }}>
      <Icon type={'question-circle'} className={'tutorial-popup-button'} onClick={() => setTutorialModalVisible(!tutorialModalVisible)}/>
      <TutorialModal coach={coach} closeTutorialModal={closeTutorialModal} tutorialModalVisible={tutorialModalVisible} />
      <div style={{ padding: '0 20px' }}>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Stopwatch defaultValue={lastLap} setTimeStarted={setTimeStarted} timeStarted={timeStarted} setTimerRef={setTimerRef} lastLap={lastLap} resetPresequencage={resetPresequencage} openScoreModal={openScoreModal}/>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* <Button type={activeOnglet === 'laps' ? 'primary' : 'default'} onClick={() => handleChangeOnglet('laps')}>
              {i18n.t('Presequencage.laps')}
              </Button>
              <p style={{ fontSize: '3rem', margin: '0 10px' }}>/</p>
              <Button type={activeOnglet === 'rapport' ? 'primary' : 'default'} onClick={() => handleChangeOnglet('rapport')}>
              {i18n.t('Presequencage.rapport')}
            </Button> */}
          </div>
          {/* <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Button type={'default'} onClick={openScoreModal}>
              {i18n.t('Presequencage.end')}
              <Icon type='right' style={{ marginLeft: '10px' }}/>
            </Button>
          </div> */}
        </div>
        {/* {activeOnglet !== 'laps' && (
          <div style={{ maxWidth: '500px', width: '100%', margin: '10px auto', maxHeight: '60vh', overflow: 'auto' }}>
            <Rapport rapport={rapport}/>
          </div>
        )} */}
      </div>
      {activeOnglet === 'laps' && (
        <div id={'laps_container'} style={{ maxWidth: '500px', width: '100%', margin: '10px auto', maxHeight: '30vh', overflow: 'auto', padding: '0 20px' }}>
          <Laps laps={events} onRemove={deleteEvent}/>
        </div>
      )}
      {activeOnglet === 'laps' && (
        <Tabs coach={coach} timerRef={timerRef} createLap={createLap}/>
      )}
      <Modal
        title={i18n.t('Sheets.match.match_score')}
        visible={scoreModalVisible}
        onOk={savePresequencage}
        onCancel={() => { setScoreModalVisible(false) }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <Button type='primary' shape='circle' icon='plus' onClick={() => { changeScoreTeam('domicile', 'add') }}/>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <Avatar src={teams ? teams.clubHome.urlLogo : ''} size={100} alt='domicile' style={{ margin: '10px' }}/>
                <p style={{ textAlign: 'center',
                  width: '150px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>{teams ? teams.clubHome.name : i18n.t('Common_word.homeTeam')}</p>
              </div>
              <p style={{ fontSize: '2rem', fontWeight: '500', margin: '0 10px' }}>{scoreTeamDomicile}</p>
              <Button type='primary' shape='circle' icon='minus' onClick={() => { changeScoreTeam('domicile', 'remove') }}/>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <Button type='primary' shape='circle' icon='plus' onClick={() => { changeScoreTeam('away', 'add') }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <Avatar src={teams ? teams.clubAway.urlLogo : ''} size={100} alt='exterieur' style={{ margin: '10px' }}/>
                <p style={{ flex: 1,
                  textAlign: 'center',
                  width: '150px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>{teams ? teams.clubAway.name : i18n.t('Common_word.awayTeam')}</p>
              </div>
              <p style={{ fontSize: '2rem', fontWeight: '500', margin: '0 10px' }}>{scoreTeamAway}</p>
              <Button type='primary' shape='circle' icon='minus' onClick={() => { changeScoreTeam('away', 'remove') }} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
