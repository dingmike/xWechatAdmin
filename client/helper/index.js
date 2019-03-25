import Vue from 'vue'
import Notification from 'vue-bulma-notification'
import Message from 'vue-bulma-message'
import ImageModal from 'components/widget/ImageModal.vue'
const ImageModalComponent = Vue.extend(ImageModal)
const openImageModal = (propsData = {
  visible: true,
  Url: ''
}) => {
  return new ImageModalComponent({
    el: document.createElement('div'),
    propsData
  })
}

const NotificationComponent = Vue.extend(Notification)
const openNotification = (propsData = {
  title: '',
  message: '',
  type: '',
  direction: '',
  duration: 4500,
  container: '.notifications'
}) => {
  return new NotificationComponent({
    el: document.createElement('div'),
    propsData
  })
}

const MessageComponent = Vue.extend(Message)
const openMessage = (propsData = {
  title: '',
  message: '',
  type: '',
  direction: '',
  duration: 1500,
  container: '.messages'
}) => {
  return new MessageComponent({
    el: document.createElement('div'),
    propsData
  })
}

export default {
  openNotification,
  openMessage,
  openImageModal,

  showMsg (msg, type = '') {
    openNotification({
      message: msg,
      type: type
    })
  },

  showSuccess (msg) {
    this.showMsg(msg, 'success')
  },

  showError (msg) {
    this.showMsg(msg, 'danger')
  },

  showTopMsg (msg, type = '') {
    openMessage({
      title: '错误提示！',
      message: msg,
      type: type
    })
  },

  showTopSuccess (msg) {
    this.showTopMsg(msg, 'success')
  },

  showTopError (msg) {
    this.showTopMsg(msg, 'danger')
  },
  showBigImg (url) {
    const imageModal = openImageModal({
      visible: true,
      Url: url
    })
    imageModal.$children[0].active()
  }
}
