import { clone, set } from 'lodash'

export default class TrainingsReduceur {

  static setTrainingVideo (state, data) {
    console.log('TODO: setTrainingVideo')
  }

  static setTrainingUploadState (state, data) {
    const trainings = clone(state.trainings)
    const training = clone(trainings[data.trainingId])
    if (!training) {
      return
    }
    training.upload = {
      state: data.state,
      percent: data.percent || 0,
    }
    set(trainings, data.trainingId, training)
    return { trainings }
  }

  static removeTrainingUploadState (state, data) {
    const trainings = clone(state.trainings)
    const training = clone(trainings[data.trainingId])
    if (!training) {
      return
    }
    training.upload = undefined
    set(trainings, data.trainingId, training)
    return { trainings }
  }

  static setTrainings (state, newTrainings) {
    const trainings = clone(state.trainings)
    for (const training of newTrainings) {
      trainings[training._id] = Object.assign({}, trainings[training._id] || {}, training)
    }
    return { trainings }
  }

  static setTraining (state, training) {
    const trainings = clone(state.trainings)
    trainings[training._id] = Object.assign({}, trainings[training._id] || {}, training)
    return { trainings }
  }

}
