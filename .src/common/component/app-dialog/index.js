import './index.css'

const AppDialog = {
  template: `
    <div class="dialog-mask" @click="onMaskClick">
      <div class="dialog">
        <div v-if="title" class="dialog-header">{{title}}</div>
        <div class="dialog-content">
          <slot></slot>
        </div>
        <div v-if="btns && btns.length > 0" class="dialog-footer" id="dialog_footer">
          <div v-for="(item, index) in btns" :key="index" :index="index" @click="onBtnClick(index)" class="dialog-btn" tapmode="active" id="close">{{item}}</div> 
        </div>
      </div>
    </div>
  `,
  props: ['title', 'btns'],
  methods: {
    onBtnClick (index) {
      this.$emit('btn-click', index)
    },
    onMaskClick (e) {
      if (e.target.className.includes('dialog-mask')) {
        this.$emit('update:show', false)
      }
    }
  }
}

export default AppDialog