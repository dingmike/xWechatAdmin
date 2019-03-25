<template>
<nav class="pagination">
  <a :class="{'is-disabled':index===1}" class="button" @click="page(index-1)">上一页</a>
  <a :class="{'is-disabled':index===count}" class="button" @click="page(index+1)">下一页</a>
  <ul>
    <li :key="1" v-show="count>0 && index>1" @click="page(1)">
      <a class="button">1</a>
    </li>
    <li :key="2" v-show="count>5 && index>5">
      <span>...</span>
    </li>
    <li :key="3" v-show="count>0 && index>4" @click="page(index-3)">
      <a class="button" v-text="index-3"></a>
    </li>
    <li :key="4" v-show="count>0 && index>3" @click="page(index-2)">
      <a class="button" v-text="index-2"></a>
    </li>
    <li :key="5" v-show="count>0 && index>2" @click="page(index-1)">
      <a class="button" v-text="index-1"></a>
    </li>
    <li :key="6" v-show="count>0" @click="page(index)">
      <a class="button is-primary" :class="{'is-loading': loading}" v-text="index"></a>
    </li>
    <li :key="7" v-show="(index)<count" @click="page(index+1)">
      <a class="button" v-text="index+1"></a>
    </li>
    <li :key="8" v-show="(index+1)<count" @click="page(index+2)">
      <a class="button" v-text="index+2"></a>
    </li>
    <li :key="9" v-show="(index+2)<count" @click="page(index+3)">
      <a class="button" v-text="index+3"></a>
    </li>
    <li :key="10" v-show="(index+4)<count">
      <span>...</span>
    </li>
    <li :key="11" v-show="(index+3)<count" @click="page(count)">
      <a class="button" v-text="count"></a>
    </li>
    <template v-if="count>4">
      <span class="fast-text">到第</span>
      <li :key="12">
        <a class="button">
          <input type="text" class="fast-number" v-model="fastNumber" @keyup.enter="fast($event, fastNumber)">
        </a>
      </li>
      <span class="fast-text">页</span>
      <a class="fast-text button" @click="fast($event, fastNumber)">确定</a>
    </template>
  </ul>
</nav>
</template>
<script>
export default {
  props: {
    index: {
      type: Number,
      require: true
    },
    count: {
      type: Number,
      require: true
    },
    loading: {
      type: Boolean,
      require: true
    }
  },
  data () {
    return {
      fastNumber: ''
    }
  },
  methods: {
    page (index) {
      if ((!this.loading) && (index !== this.index) && (index > 0) && (index <= this.count)) this.$emit('change', index)
    },
    fast (event, index) {
      index = Number(index)
      event.currentTarget.blur()
      this.page(index)
      this.fastNumber = ''
      if (index) {
        setTimeout(function() {
          window.scrollTo(0, 0)
        }, 100)
      }
    }
  }
}
</script>
<style lang="scss">
.pagination {
    font-size: 1rem;
    margin: -0.25rem;
}

.pagination .fast-number {
  width: 25px;
  border: none;
  outline: none;
}

.pagination .fast-text {
  margin: 0 10px;
}

.pagination.is-small {
    font-size: 0.75rem;
}

.pagination.is-medium {
    font-size: 1.25rem;
}

.pagination.is-large {
    font-size: 1.5rem;
}

.pagination,
.pagination-list {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    text-align: center;
}

.pagination-ellipsis,
.pagination-link,
.pagination-next,
.pagination-previous {
    -moz-appearance: none;
    -webkit-appearance: none;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    border: 1px solid transparent;
    border-radius: 3px;
    box-shadow: none;
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    font-size: 1rem;
    height: 2.25em;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: flex-start;
    line-height: 1.5;
    padding: calc(0.375em - 1px) calc(0.625em - 1px);
    position: relative;
    vertical-align: top;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-size: 1em;
    padding-left: 0.5em;
    padding-right: 0.5em;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    margin: 0.25rem;
    text-align: center;
}
.pagination-ellipsis.is-active,
.pagination-ellipsis.is-focused,
.pagination-ellipsis:active,
.pagination-ellipsis:focus,
.pagination-link.is-active,
.pagination-link.is-focused,
.pagination-link:active,
.pagination-link:focus,
.pagination-next.is-active,
.pagination-next.is-focused,
.pagination-next:active,
.pagination-next:focus,
.pagination-previous.is-active,
.pagination-previous.is-focused,
.pagination-previous:active,
.pagination-previous:focus {
    outline: none;
}

.pagination-ellipsis[disabled],
.pagination-link[disabled],
.pagination-next[disabled],
.pagination-previous[disabled] {
    cursor: not-allowed;
}

.pagination-link,
.pagination-next,
.pagination-previous {
    border-color: #dbdbdb;
    min-width: 2.25em;
}
.pagination-link:hover,
.pagination-next:hover,
.pagination-previous:hover {
    border-color: #b5b5b5;
    color: #363636;
}
.pagination-link:focus,
.pagination-next:focus,
.pagination-previous:focus {
    border-color: #00d1b2;
}
.pagination-link:active,
.pagination-next:active,
.pagination-previous:active {
    box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2);
}

.pagination-link[disabled],
.pagination-next[disabled],
.pagination-previous[disabled] {
    background-color: #dbdbdb;
    border-color: #dbdbdb;
    box-shadow: none;
    color: #7a7a7a;
    opacity: 0.5;
}

.pagination-next,
.pagination-previous {
    padding-left: 0.75em;
    padding-right: 0.75em;
    white-space: nowrap;
}

.pagination-link.is-current {
    background-color: #00d1b2;
    border-color: #00d1b2;
    color: #fff;
}

.pagination-ellipsis {
    color: #b5b5b5;
    pointer-events: none;
}

.pagination-list {
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
}
@media screen and (max-width: 768px) {
    .pagination {
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
    }
    .pagination-next,
    .pagination-previous {
        -webkit-box-flex: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
        -ms-flex-negative: 1;
        flex-shrink: 1;
    }
    .pagination-list li {
        -webkit-box-flex: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
        -ms-flex-negative: 1;
        flex-shrink: 1;
    }
}
@media screen and (min-width: 769px), print {
    .pagination-list {
        -webkit-box-flex: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
        -ms-flex-negative: 1;
        flex-shrink: 1;
        -webkit-box-pack: start;
        -ms-flex-pack: start;
        justify-content: flex-start;
        -webkit-box-ordinal-group: 2;
        -ms-flex-order: 1;
        order: 1;
    }
    .pagination-previous {
        -webkit-box-ordinal-group: 3;
        -ms-flex-order: 2;
        order: 2;
    }
    .pagination-next {
        -webkit-box-ordinal-group: 4;
        -ms-flex-order: 3;
        order: 3;
    }
    .pagination {
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
    }
    .pagination.is-centered .pagination-previous {
        -webkit-box-ordinal-group: 2;
        -ms-flex-order: 1;
        order: 1;
    }
    .pagination.is-centered .pagination-list {
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-ordinal-group: 3;
        -ms-flex-order: 2;
        order: 2;
    }
    .pagination.is-centered .pagination-next {
        -webkit-box-ordinal-group: 4;
        -ms-flex-order: 3;
        order: 3;
    }
    .pagination.is-right .pagination-previous {
        -webkit-box-ordinal-group: 2;
        -ms-flex-order: 1;
        order: 1;
    }
    .pagination.is-right .pagination-next {
        -webkit-box-ordinal-group: 3;
        -ms-flex-order: 2;
        order: 2;
    }
    .pagination.is-right .pagination-list {
        -webkit-box-pack: end;
        -ms-flex-pack: end;
        justify-content: flex-end;
        -webkit-box-ordinal-group: 4;
        -ms-flex-order: 3;
        order: 3;
    }
}
</style>
