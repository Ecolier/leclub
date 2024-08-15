import { clone, get, set } from 'lodash'

export default class MatchesReduceur {

  static setMatches (state, newMatches) {
    const matches = clone(state.matches)
    for (const m of newMatches) {
      matches[m._id] = Object.assign({}, matches[m._id] || {}, m)
    }
    return { matches }
  }

  static setMatchVideo (state, data) {
    const matches = clone(state.matches)
    const match = clone(matches[data.matchId])
    if (match) {
      match.videoHome = clone(data.videoHome)
      match.videoAway = clone(data.videoAway)
    }
    set(matches, data.matchId, match)
    return { matches }
  }

  static updateMatchVideo (state, data) {
    const matches = clone(state.matches)
    const match = matches[data.matchId]
    if (!match) {
      return
    }

    const videoHomeId = get(match, 'videoHome._id')
    const videoAwayId = get(match, 'videoAway._id')

    if (videoHomeId === data.videoId) {
      set(match, 'videoHome', data.video)
    }
    if (videoAwayId === data.videoId) {
      set(match, 'videoAway', data.video)
    }

    set(matches, data.matchId, match)
    return { matches }
  }

  static setMatchVideoWhitelist (state, data) {
    const matches = clone(state.matches)
    const match = get(matches, data.matchId, {})

    const videoHomeId = get(match, 'videoHome._id')
    const videoAwayId = get(match, 'videoAway._id')

    if (videoHomeId === data.videoId) {
      set(matches, [data.matchId, 'videoHome', 'whitelist'], clone(data.whitelist))
    }

    if (videoAwayId === data.videoId) {
      set(matches, [data.matchId, 'videoAway', 'whitelist'], clone(data.whitelist))
    }

    set(matches, data.matchId, match)
    return { matches }
  }

  static setMatchUploadState (state, data) {
    const matches = clone(state.matches)
    const match = get(matches, data.matchId, {})
    set(matches, data.matchId, {
      ...match,
      upload: {
        state: data.state,
        percent: data.percent || 0,
      },
    })
    return { matches }
  }

  static removeMatchUploadState (state, data) {
    const matches = clone(state.matches)
    const match = get(matches, data.matchId, {})
    set(matches, data.matchId, {
      ...match,
      upload: undefined,
    })
    return { matches }
  }

  static setMatch (state, data) {
    const matches = clone(state.matches)
    matches[data.matchId] = Object.assign({}, matches[data.matchId] || {}, data.match)
    return { matches }
  }

  static setMatchPlayers (state, data) {
    const matches = clone(state.matches)
    set(matches, [data.matchId, 'players'], data.players)
    return { matches }
  }

}
