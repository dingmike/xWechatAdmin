<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <article class="tile is-child box">
            <h1 class="title">Horizontal form</h1>
            <div class="block">
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">From</label>
                </div>
                <div class="control is-grouped">
                  <p class="control is-expanded">
                    <input class="input" type="text" placeholder="Name">
                  </p>
                  <p class="control is-expanded">
                    <input class="input" type="email" placeholder="Email">
                  </p>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">Subject</label>
                </div>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select>
                      <option>General enquiry</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">Question</label>
                </div>
                <div class="control">
                  <textarea class="textarea" placeholder="Explain how we can help you"></textarea>
                </div>
              </div>
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label"></label>
                </div>
                <div class="control">
                  <button class="button is-primary">Submit</button>
                  <button class="button is-link">Cancel</button>
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
import Cleave from 'vue-cleave'
import 'cleave.js/dist/addons/cleave-phone.cn'

export default {
  components: {
    Cleave
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
</style>
