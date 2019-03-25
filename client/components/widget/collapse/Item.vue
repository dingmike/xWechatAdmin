<template>
  <div class="card collapse-item" :class="{ 'is-fullwidth': $parent.isFullwidth, 'is-active': isActived }">
    <header class="card-header touchable" role="tab" :aria-expanded="selected ? 'true' : 'fase'" @click="toggle">
      <h3 class="card-header-title">{{ title }}</h3>
      <slot name="headSlot"></slot>
      <span class="card-header-icon">
        <i class="fa fa-angle-right"></i>
      </span>
      <slot name="move"></slot>
    </header>
    <transition
      name="collapsed-fade"
      :css="false"
      appear
      @before-appear="before"
      @appear="enter"
      @appear-cancel="cancel"
      @before-enter="before"
      @enter="enter"
      @enter-cancel="cancel"
      @leave="leave"
      @leave-cancel="cancel"
    >
    <div class="card-content" v-show="isActived">
      <div class="card-content-box">
        <slot></slot>
      </div>
    </div>
  </transition>
</div>
</template>

<script>
/* eslint-disable */
import anime from 'animejs'

export default {
  props: {
    selected: Boolean,
    title: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      isActived: this.selected
    }
  },

  created () {
    this._isCollapseItem = true
  },

  mounted () {
    this.$on('open', this.$parent.openByIndex)
    if (this.isActived) {
      this.$emit('open', this.index)
    }
  },

  beforeDestroy () {
    if (this.anime && this.targets) {
      anime.remove(this.targets)
    }
    this.$off('open', this.$parent.openByIndex)
  },

  computed: {
    index () {
      return this.$parent.$collapseItems.indexOf(this)
    }
  },

  methods: {
    toggle () {
      if ((this.isActived = !this.isActived)) {
        this.$emit('open', this.index)
      }
    },

    getAnime (targets) {
      if (this.anime) return this.anime
      return this.anime = anime({ targets })
    },

    cancel () {
      this.anime.pause()
    },

    before (targets) {
      if (!this.targets) this.targets = targets
      targets.removeAttribute('style')
    },

    enter (targets, done) {
      const height = targets.scrollHeight
      targets.style.height = 0
      targets.style.opacity = 0
      this.getAnime(targets).play({
        targets,
        duration: 377,
        easing: 'easeOutExpo',
        opacity: [0, 1],
        height,
        complete () {
          targets.removeAttribute('style')
          done()
        }
      })
    },

    leave (targets, complete) {
      this.getAnime(targets).play({
        targets,
        duration: 377,
        easing: 'easeOutExpo',
        opacity: [1, 0],
        height: 0,
        complete
      })
    }
  }
}
</script>

<style lang="scss">
.collapse-item {
  .card-header {
    cursor: pointer;
  }
  .card-header-icon {
    transition: transform .377s ease;
  }
  .card-content {
    padding-top: 0;
    padding-bottom: 0;
    overflow: hidden;
  }
  .card-content-box {
    padding-top: 20px;
    padding-bottom: 20px;
  }

  &.is-active {
    > .card-header {
      > .card-header-icon {
        transform: rotate(90deg);
      }
    }
  }
}
.card-header:hover{
  .updown{
    visibility: visible;
  }
}
.updown {
  width:30px;
  position: absolute;
  right: -30px;
  top: 0px;
  cursor: pointer;
  visibility: hidden;
  z-index: 200;
  span{
    text-align: center;
    color: #666;
    display: block;
    &:hover{
      color: #333;
    }
  }
}
</style>
