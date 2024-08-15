import { callApi } from '@/utils/callApi'
import store from '@/store'

export async function fetchTrainings (data = {}) {
  try {
    const state = store.get()
    const coachId = state.coach._id
    const { currentSeason } = state.coachSeason

    if (!currentSeason) {
      return
    }

    data.team = data.team || currentSeason.team
    data.season = data.season || currentSeason.season

    const res = await callApi(`${coachId}/trainings?season=${data.season}&team=${data.team}`, 'get')
    store.dispatch('trainings/setTrainings', res.trainings)
  } catch (err) {
    store.dispatch('notifications/error', err)
  }
}

