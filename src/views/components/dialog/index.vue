<template>
  <el-dialog ref="mydialog" :title="dialogTitle" :top="top" :close-on-click-modal="false" :lock-scroll="false" :append-to-body="true" :visible.sync="dialogVisible" :width="dialogWidth" :before-close="handleClose">
    <h2 v-if="customizeTitle" slot="title" class="header-title">
      {{ dialogTitle }}
    </h2>
    <slot></slot>
    <div slot="footer" class="dialog-footer" v-if="showFormBtn">
      <template v-if="customBtn">
         <slot name="customBtn"></slot>
      </template>
      <template v-else>
        <slot name="preBtn"></slot>
        <el-button v-if="controlBtn.visible" :disabled="controlBtn.disabled" type="primary" size="mini" @click="saveBtn">
          {{ ReBtnText[0] }}
        </el-button>
        <el-button size="mini" @click="handleClose">
          {{ ReBtnText[1] }}
        </el-button>
        <slot name="lastBtn"></slot>
      </template>
    </div>
  </el-dialog>
</template>

<script>
// :lock-scroll="false" :append-to-body="true"  这两个属性可解决每次打开弹窗都会置顶，不会记录上次滚动的值（解决上次打开如滚动到底部，再次打开还是在底部的现状）
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    top: {
      type: String,
      default: '15vh'
    },
    isAdd: {
      type: Boolean,
      default: false
    },
    changeTitle: {
      type:  Boolean,
      default: true
    },
    customizeTitle: {
      type: Boolean,
      default: false
    },
    dialogWidth: {
      type: String,
      default: '950px'
    },
    showFormBtn: {
      type: Boolean,
      default: true
    },
    checkCallBack: {
      type: Function,
      default: () => { 
        return true
      }
    },
    controlBtn: {
      type: Object,
      default: () => { 
        return {
          visible: true, disabled: false 
        }
      }
    },
    resetBtnText: {
      type: Array,
      default: () => []
    },
    customBtn: {
      type: Boolean,
      default: false
    },
    btnHtml: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      btnText: ['保存', '取消']
    }
  },
  computed: {
    dialogTitle() {
      if (this.changeTitle) {
        return this.isAdd ? `新增${this.title}` : `修改${this.title}`
      } else {
        return this.title
      }
    },
    ReBtnText() {
      return this.btnText = Object.assign({}, this.btnText, this.resetBtnText)
    }
  },
  methods: {
    handleClose () {
      this.$emit('update:dialogVisible', !this.dialogVisible)
    },
    saveBtn () {
      let formIndex = -1
      this.$refs.mydialog.$children.filter((item, index) => {
        if (item.$el.nodeName === 'FORM') {
          formIndex = index
        }
      })
      if (formIndex === -1) return
      this.$refs.mydialog.$children[formIndex].validate(async valid => {
        if (valid && await this.checkCallBack()) {
          this.handleClose()
          this.$emit('success')
        }
      })
    },

  }
}
</script>

<style>
.header-title {
  font-size: 16px;
  color: #212121;
  border-left: 4px solid #46A0FC;
  padding-left: 10px;
  margin-top: 0;
  margin-left: 20px;
}
</style>