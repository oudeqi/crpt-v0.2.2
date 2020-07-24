import './index.css'

const AppDialog = {
  template: `
    <div class="full-mask">
      <div class="dialog">
        <div v-if="showClose" class="dialog-close" @click="handleCloseClick()"></div>
        <div v-if="title" class="dialog-header">{{title}}</div>
        <div class="dialog-content">
          <slot></slot>
        </div>
        <div v-if="btns && btns.length > 0" class="dialog-footer">
          <div v-for="(item, index) in btns" :key="index" :index="index" @click="handleBtnClick(index)" class="dialog-btn" tapmode="active" id="close">{{item}}</div> 
        </div>
        <div v-if="countdown" class="dialog-footer">
          <div @click="handleCountdownClick()" :class="['dialog-btn', {disabled: seconds>=0}]" tapmode="active">
            <span>{{countdown.desc}}</span>
            <span v-if="seconds>=0">&nbsp;({{seconds}})</span>
          </div> 
        </div>
      </div>
    </div>
  `,
  props: {
    title: {
      type: String,
      required: false
    },
    btns: {
      type: Array,
      required: false
    },
    countdown: {
      type: Object,
      required: false
    },
    showClose: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      seconds: 0
    }
  },
  mounted() {
    if (this.countdown) {
      this.seconds = this.countdown.seconds
      let timer = setInterval(() => {
        this.seconds--
        if (this.seconds < 0) {
          clearInterval(timer)
        }
      }, 1000)
    }
  },
  methods: {
    handleBtnClick (index) {
      this.$emit('btn-click', index)
    },
    handleCloseClick () {
      this.$emit('close-click')
    },
    handleMaskClick () {
      this.$emit('mask-click')
    },
    handleCountdownClick () {
      if (this.seconds <= 0) {
        this.$emit('countdown-callback')
      }
    }
  }
}

export default AppDialog