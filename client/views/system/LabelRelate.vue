<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-ancestor">
        <div class="tile is-parent cl-form">
          <article class="tile is-child box">
            <div class="block">
              <div class="label-list">
                <div class="label-select level-1" v-for="label1 in labelTree.childs">
                  <div class="select-item">
                    <input type="checkbox" class="label-checkbox" :id="'label-' + label1.id" v-model="relation" :value="label1.id" @change="change(label1)">
                    <label :for="'label-' + label1.id">{{ label1.title }}</label>
                  </div>
                  <div class="label-select level-2" v-for="label2 in label1.childs">
                    <div class="select-item">
                      <input type="checkbox" class="label-checkbox" :id="'label-' + label2.id"  v-model="relation" :value="label2.id" @change="change(label2)">
                      <label :for="'label-' + label2.id">{{ label2.title }}</label>
                    </div>
                    <div class="label-select level-3" v-for="label3 in label2.childs">
                      <div class="select-item">
                        <input type="checkbox" class="label-checkbox" :id="'label-' + label3.id"  v-model="relation" :value="label3.id" @change="change(label3)">
                        <label :for="'label-' + label3.id">{{ label3.title }}</label>
                      </div>
                      <div class="label-select level-4" v-for="label4 in label3.childs">
                        <div class="select-item">
                          <input type="checkbox" class="label-checkbox" :id="'label-' + label4.id"  v-model="relation" :value="label4.id" @change="change(label4)">
                          <label :for="'label-' + label4.id">{{ label4.title }}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label"></label>
                </div>
                <div class="control">
                  <button class="button is-primary" @click="submit(false)">提交</button>
                  <button class="button is-link">取消</button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import helper from '../../helper'

export default {
  data () {
    return {
      title: '标签关联',
      id: 0,
      relation: [],
      labelTree: {}
    }
  },
  created () {
    var id = parseInt(this.$route.params.id)
    if (isNaN(id) || id < 0) {
      id = 0
    }
    this.id = id
    var rootId = parseInt(this.$route.params.root_id)
    console.log('root_id:' + rootId)
    this.$api.label.admin.getRelation(id).then((relation) => {
      relation.forEach((item) => {
        this.relation.push(item.relate_id)
      })
      this.$label.getLabelList().then((labelList) => {
        var obj = _.cloneDeep(this.$label.getRootLabelTree())
        var labelTree = obj[rootId - 1]
        console.log(obj)

        this.setChecked(labelTree)
        this.labelTree = labelTree
      })
    })
  },
  methods: {
    setChecked (label) {
      var childSelected = false
      var labelChecked = this.relation.indexOf(label.id) !== -1
      label.childs.forEach((item) => {
        if (this.setChecked(item)) {
          childSelected = true
        }
      })
      if (childSelected) {
        this.addRelation(label.id)
      } else if (label.childs.length > 0) {
        this.deleteRelation(label.id)
        labelChecked = false
      }
      return childSelected || labelChecked
    },
    resetRelation () {
      this.setChecked(this.labelTree)
    },
    change (label) {
      console.log(this.relation)
      var checked = this.relation.indexOf(label.id) !== -1
      // this.setChildChecked(label, checked)
      // label.checked = !label.checked
      // console.log(label.checked)
      label.childs.forEach((item) => {
        this.setChildChecked(item, checked)
      })
      this.resetRelation()
    },
    setChildChecked (label, checked) {
      if (checked) {
        this.addRelation(label.id)
      } else {
        this.deleteRelation(label.id)
      }
      label.childs.forEach((item) => {
        this.setChildChecked(item, checked)
      })
    },
    addRelation (id) {
      if (this.relation.indexOf(id) === -1) {
        this.relation.push(id)
      }
    },
    deleteRelation (id) {
      this.relation = _.without(this.relation, id)
    },
    submit () {
      var list = []
      this.relation.forEach((item) => {
        var label = this.$label.getLabel(item)
        if (label.childs.length === 0) {
          list.push(item)
        }
      })
      console.log(list)
      // return
      this.$api.label.admin.updateRelation(this.id, list).then((res) => {
        console.log(res)
        // this.$router.push('/system/label_list')
        helper.showSuccess('编辑成功')
        // this.$label.getLabelList(true)
      })
      .catch((e) => {
        console.log(e)
        helper.showError(e.message)
      })
    }
  }
}
</script>

<style scoped>
.button {
  margin: 5px 0 0;
}

.control .button {
  margin: inherit;
}

.control button.jump-to-add-btn{
  margin-left:10px;
}

.level-2, .level-3, .level-4{
  padding-left:40px;
}
</style>
