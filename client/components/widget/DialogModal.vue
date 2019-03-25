<template>
  <transition :name="transition" mode="in-out" appear :appear-active-class="enterClass" :enter-active-class="enterClass" :leave-active-class="leaveClass" @beforeEnter="beforeEnter" @afterEnter="afterEnter" @beforeLeave="beforeLeave" @afterLeave="afterLeave">
    <div :class="classes" v-if="show">
      <div class="modal-background" @click="deactive"></div>
      <div class="modal-card" :style="{width:dialogWidth}">
        <header class="modal-card-head" v-if="showHead">
          <p class="modal-card-title">{{ title }}</p>
          <button class="delete" @click="deactive"></button>
        </header>
        <section class="modal-card-body">
          <slot></slot>
          <span class="error" v-if="showErrorMsg">{{ errorMsg }}</span>
        </section>
        <footer class="modal-card-foot" v-if="showFoot">
          <a class="button" @click="cancel" v-if="showCancelText">{{ cancelText }}</a>
          <a class="button is-primary" @click="ok">{{ okText }}</a>
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
    showFoot: {
      type: Boolean,
      default: true
    },
    showHead: {
      type: Boolean,
      default: true
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
    },
    dialogWidth: {
      type: String,
      default: ''
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
.modal{
  z-index: 1200;
}
.error {
  color: red;
  display: block;
  text-align: center;
}
.delete{
  background-color: #fff;
}
.delete:hover::before, .delete:hover::after{
  background-color: #999;
}
.delete:after, .delete:before{
  background-color: #ccc;
  width:70%;
}
.modal-card{ /*为了兼容IE*/
  margin: inherit;
  border-radius: 5px;
}
.modal-card-head{
  text-align: center;
  background: #fff;
  border-bottom: 1px solid #fff;
}
.modal-card-title{
  font-size: 16px;
}
.modal-card-foot{
  display: block;
  background: #fff;
  border-top: 1px solid #fff;
  text-align: center;
}
.button{
  font-size: 14px;
  width:100px;
  height:35px;
  margin-right: 20px;
}
</style>
