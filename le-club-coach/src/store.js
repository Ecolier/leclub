import { createStoreon } from 'storeon'
import coach from '@/reduceurs/coach.js'
import currentSeason from '@/reduceurs/seasons.js'
import matches from '@/reduceurs/matches.js'
import trainings from '@/reduceurs/trainings.js'
import notifications from '@/reduceurs/notifications.js'
import mobile from '@/reduceurs/mobile.js'

export default createStoreon([
  require('@/router').createRouter,
  currentSeason,
  coach,
  matches,
  trainings,
  notifications,
  mobile,
  process.env.NODE_ENV !== 'production' && require('storeon/devtools').storeonLogger,
  // process.env.NODE_ENV !== 'production' && require('storeon/devtools')
])
