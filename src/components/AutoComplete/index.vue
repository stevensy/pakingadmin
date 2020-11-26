<template>
  <el-autocomplete
    v-model="name"
    ref="autoCom"
    :size="autoSize"
    :style="autoStyle"
    :disabled="disabled"
    clearable
    :debounce="0"
    :fetch-suggestions="querySearch(queryArgs)"
    @select="handleSelect"
    @blur="handleBlur"
    @focus="handleFocus"
    @clear="handleClear"
    :placeholder="placeholderTxt"
  />
</template>

<script>
export default {
  props: {
    propsName: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    autoSize: {
      type: String,
      default: 'mini'
    },
    autoStyle: {
      type: String,
      default: 'width: 100%'
    },
    placeholderTxt: {
      type: String,
      default: '请输入内容,模糊查询'
    },
    queryArgs: {
      type: Object,
      default: () => {}
    },
    checkQuery: {
      type: Function,
      default: () => true
    },
    getDataApi: {
      type: Function,
      default: () => {}
    },
    datas: {
      type: Array,
      default: () => []
    },
    needSelect: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    propsName(n) {
      this.name = n ? n : undefined
    },
    name(n) {
      if (!n) {
        this.$emit('handleSelect', {}, this.queryArgs)
      } else {
        if (this.needSelect) {
          this.selected = false
        }
      }
    }
  },
  data() {
    return {
      name: this.propsName ? this.propsName : undefined,
      selected: false
    }
  },
  methods: {
    querySearch() {
      return (queryString, cb) => {
        if (!(queryString && this.checkQuery(this.queryArgs))) {
          if(this.datas && this.datas.length)
            cb(this.datas)
          else {
            cb([])
          }
          return
        }
        if(this.datas && this.datas.length) {
          let results = queryString ? this.datas.filter(this.createStateFilter(queryString)) : this.datas
          cb(results)
          this.$refs.autoCom.activated = true
        } else {
          this.getDataApi(queryString, this.queryArgs).then(res => {
            // 调用 callback 返回建议列表的数据
            cb(res)
          })
        }
      }
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(row) {
      if(this.needSelect){
        this.selected = true
      }
      this.$emit('handleSelect', row, this.queryArgs)
    },
    handleBlur() {
      if(this.needSelect && !this.selected) {
        this.name = undefined
      }
      this.$emit('handleBlur', this.name, this.queryArgs)
    },
    handleFocus() {
      this.$emit('handleFocus', this.name, this.queryArgs)
    },
    handleClear() {
      this.$refs.autoCom.activated = true
      this.$emit('clear', this.name, this.queryArgs)
    }
  }
}
</script>
