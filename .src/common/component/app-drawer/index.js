import './index.css'

const AppDrawer = {
  template: `
    <div class="full-mask" @click="onMaskClick">
      <div class="drawer">
        <div class="drawer-content">
          <slot></slot>
        </div>
        <div class="drawer-close" @click="onClick"></div>
      </div>
    </div>
  `,
  methods: {
    onClick () {
      this.$emit('on-close')
    },
    onMaskClick (e) {
      if (e.target.className.includes('dialog-mask')) {
        this.$emit('update:show', false)
      }
    }
  }
}

export default AppDrawer