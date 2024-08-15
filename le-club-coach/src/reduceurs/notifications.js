import { message } from 'antd'

export default (store) => {
  store.on('notifications/error', (state, err) => {
    message.error(err)
  })
  store.on('notifications/success', (state, msg) => {
    message.success(msg)
  })
}
