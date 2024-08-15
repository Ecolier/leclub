import './PlaybackControl.css'
import React from 'react'
import PlayerContext from './context'

const AVAILABLE_RATES = [
  0.25,
  0.5,
  1,
  2,
  4,
  8,
  16,
]

export default () => {
  const player = React.useContext(PlayerContext)
  const [playback, setPlayback] = React.useState(player.playbackRate)

  React.useEffect(() => {
    return player.subscribe('statechange', () => {
      setPlayback(player.playbackRate)
    })
  })

  function handleChange (evt) {
    const value = evt.target.value
    player.playbackRate = value
  }

  return (
    <div className='leClub-player-controls-item player-playback-control' style={{ color: 'white' }}>
      <select value={player.playbackRate} onChange={handleChange}>
        {AVAILABLE_RATES.map(r => (
          <option key={r} value={r}>{r.toFixed(2)}x</option>
        ))}
      </select>
    </div>
  )
}
