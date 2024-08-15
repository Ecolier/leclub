import SeasonReduceur from './seasons/index.js'
import { initialStateSeasons } from './index.js'

export default (store) => {
  /* Init reduceur */
  store.on('@init', () => ({ coachSeason: { ...initialStateSeasons } }))
  store.on('seasons/populateSeasons', SeasonReduceur.populateSeasons)
  store.on('seasons/setOnboarded', SeasonReduceur.setOnboarded)
  store.on('seasons/changeCurrentTeam', SeasonReduceur.setSeasonCurrentTeam)
  store.on('seasons/changeCurrentSeason', SeasonReduceur.changeCurrentSeason)
  store.on('seasons/setSeason', SeasonReduceur.setSeason)
}
