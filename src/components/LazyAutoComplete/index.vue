<template>
  <div class="infinite">
    <el-input size="mini" :style="inputStyle" :placeholder="placeholder" v-model.trim="name" @keyup.native="getData" @blur="handleBlur" @clear="clear" clearable />
    <!-- 如用v-if 会先走infiniteHandler 坑 -->
    <div v-show="visible && lists.length" class="infinite-contain el-popper" x-placement="bottom-start">
      <div class="infinite-wrap">
        <ul class="infinite-li">
          <li v-for="(item, index) in lists" :key="index" @click.prevent="handleSelect(item)">
            {{ item[filedName] }}
          </li>
        </ul>
        <InfiniteLoading :spinner="spinner" ref="infiniteLoading" :distance="distance" @infinite="infiniteHandler">
          <div slot="spinner" class="txt">拼命加载中...</div> <!-- //加载中的文字 -->
          <div slot="no-more" class="txt">已加载完毕!</div> <!--//加载完毕的文字 -->
          <div slot="no-results" class="txt">暂无数据:(</div>  <!-- //没有数据的文字 -->
        </InfiniteLoading>
      </div>
      <div x-arrow class="popper__arrow" style="left:35px"></div>
    </div>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
export default {
  components: { InfiniteLoading },
  props: {
    placeholder: {
      type: String,
      default: '请输入内容，模糊查询'
    },
    lists: {
      type: Array,
      default: () => []
    },
    inputStyle: {
      type: Object,
      default: () => {}
    },
    spinner: {
      validator(str) {
        str = str ? str : 'default'
        return /[str]/.test(['bubbles', 'circles', 'default', 'spiral', 'waveDots'])
      }
    },
    distance: {
      type: Number,
      defalut: 50
    },
    filedName: {
      type: String,
      default: 'name'
    },
    propsName: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      name: undefined,
      page: 1,
      visible: false
    }
  },
  watch: {
    propsName(name) {
      this.name = name ? name : undefined
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.close)
      } else {
        document.body.removeEventListener('click', this.close)
      }
    }
  },
  methods: {
    getData(name) {
      // 连续输入，只发一次请求
      clearTimeout(this.timeout)
      this.timeout = setTimeout(_ => {
        console.log('getData')
        this.$emit('getData', { name: this.name, page: 1 }, this.state)
        this.visible = true
      }, 500)
    },
    close() {
      this.visible = false
    },
    handleBlur() {
      this.name = undefined // 输入后没有选择直接搜索，name没有清除，watch也没有触发
      this.$emit('handleSelect', undefined)
    },
    clear() {
      this.$emit('handleSelect', undefined)
    },
    handleSelect(row) {
      console.log('select')
      this.name = row[this.filedName]
      this.$emit('handleSelect', row)
    },
    infiniteHandler($state) {
      console.log('loadmore')
      this.state = $state
      this.$emit('loadmore',  { name: this.name, page: ++this.page }, $state)
    }
  }
}
</script>

<style scoped>
.infinite {
  position: relative
}
.infinite-contain {
  position: absolute;
  left: 0;
  z-index: 5;
  width: 100%;
  margin: 5px 0;
  padding: 12px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  border-radius: 4px;
  border: 1px solid #dfe4ed;
  background-color: #fff;
}
.infinite-wrap {
  max-height: 260px;
  overflow: auto;
  box-sizing: border-box;
}
.infinite-li {
  margin:0;
  padding:0;
  line-height: 30px;
  color: #606266;
  font-size: 14px;
  text-align:center;
  list-style: none;
}
.infinite-li > li{
  text-align: left;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}
.txt {
  color: #606266;
}
</style>
