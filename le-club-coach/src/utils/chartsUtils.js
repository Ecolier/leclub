import i18n from 'i18n-js'

export const formatChartData = (data, label, title) => {
  if (!data) {
    return {}
  }
  if (label === i18n.t('SeasonsStats.goal_for')) {
    return {
      labels: data.map(matchDay => matchDay.day),
      datasets: [
        {
          label: title,
          backgroundColor: 'rgba(234, 23, 140, 0.3)',
          data: data.map(matchDay => matchDay.goalsFor),
        },
      ],
    }
  } else if (label === i18n.t('SeasonsStats.goal_against')) {
    return {
      labels: data.map(matchDay => matchDay.day),
      datasets: [
        {
          label: title,
          backgroundColor: 'rgba(234, 23, 140, 0.3)',
          data: data.map(matchDay => matchDay.goalsTaken),
        },
      ],
    }
  }
}
