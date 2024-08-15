import React, { useContext, Fragment } from 'react'
import { useVideoCurrentTime } from './Time'
import PlayerContext from './context'

function CurrentTime () {
  const currentTime = useVideoCurrentTime() || 0
  const minutes = Math.floor(currentTime / 60).toString().padStart(2, '0')
  const seconds = (Math.floor(currentTime) % 60).toString().padStart(2, '0')
  return <React.Fragment>{ `${minutes}:${seconds}` }</React.Fragment>
}

const Chrono = () => {
  const player = useContext(PlayerContext)
  const chronoStyle = {
    position: 'absolute',
    padding: '3px 7px',
    margin: '5px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    fontSize: '1.2rem',
    color: 'white',
    width: 'fit-content',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'flex-start',
  }
  return (
    <Fragment>
      {player.overlayPortal(<div style={chronoStyle}><CurrentTime /></div>)}
    </Fragment>
  )
}

export default Chrono
