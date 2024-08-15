import TrainingsReduceur from './trainings/index.js'

export default (store) => {
  store.on('@init', () => ({ trainings: {} }))
  store.on('trainings/setTrainingVideo', TrainingsReduceur.setTrainingVideo)
  store.on('trainings/setTrainingUploadState', TrainingsReduceur.setTrainingUploadState)
  store.on('trainings/removeTrainingUploadState', TrainingsReduceur.removeTrainingUploadState)
  store.on('trainings/setTraining', TrainingsReduceur.setTraining)
  store.on('trainings/setTrainings', TrainingsReduceur.setTrainings)
}
