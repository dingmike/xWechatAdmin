<template>
  <transition :name="transition" mode="in-out" appear :appear-active-class="enterClass" :enter-active-class="enterClass" :leave-active-class="leaveClass" @beforeEnter="beforeEnter" @afterEnter="afterEnter" @beforeLeave="beforeLeave" @afterLeave="afterLeave">
    <div :class="classes" v-if="show">
      <div class="modal-background" @click="deactive"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ title }}</p>
          <button class="delete" @click="deactive"></button>
        </header>
        <section class="modal-card-body">
          <slot></slot>
        </section>
        <footer class="modal-card-foot">
          <a class="button is-primary" @click="ok">{{ okText }}</a>
          <a class="button" @click="cancel" v-if="showCancelText">{{ cancelText }}</a>
          <span class="error" v-if="showErrorMsg">{{ errorMsg }}</span>
          <slot name="footerslot"></slot> 
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
import BaseModal from './BaseModal.js'
export default {
  mixins: [BaseModal],
  props: {
    title: {
      type: String
    },
    showErrorMsg: {
      type: Boolean,
      default: false
    },
    okText: {
      type: String,
      default: '确定'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    showCancelText: {
      type: Boolean,
      default: true
    },
    errorMsg: {
      type: String,
      default: '必须选择一项内容'
    }
  },
  computed: {
    classes() {
      return ['modal', 'animated', 'is-active']
    }
  },
  methods: {
    ok() {
      this.$emit('ok')
    },
    cancel() {
      this.$emit('cancel')
    },
    deactive() {
      this.$emit('close')
    }
  }
}
</script>
<style scoped>
.error {
  position: absolute;
  right: 45px;
  color: red;
}
.modal-card{ /*为了兼容IE*/
  margin: inherit;
}
</style>
