<template>
  <div>
    <el-table
      ref="table"
      v-loading="listLoading"
      :border="isBorder"
      :data="tableData"
      @selection-change="handleSelectionChange"
      @select-all="handleSelectAllChange"
      @row-click="handelRowClickChange"
      :size="tableSize"
      stripe
      @header-dragend="colChange"
      fit
      :max-height="tableHeight"
      highlight-current-row
      :header-cell-style="headerStyle"
      style="width: 100%">
      <slot />
      <template slot="empty">
        <span>{{ emputyTxt }}</span>
      </template>
      <slot name="append" />
    </el-table>
    <el-pagination
      class="pagination"
      v-if="pagination&&pagination.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.page"
      :page-sizes="pagination.pageSizes"
      :page-size="pagination.pageSize"
      :layout="getLayout"
      :total="pagination.total">
    </el-pagination>
  </div>
</template>

<script>
let layout = ['total', 'sizes', 'prev', 'pager', 'next', 'jumper']
export default {
  props: {
    listLoading: {
      type: Boolean,
      default: false
    },
    layout: {
      type: String,
      defalut: layout.join(','),
      validator(value) {
        if (value) {
          let v = value.replace(/\s/g, '').split(',')
          return v.every(item => ~layout.indexOf(item))
        } else {
          return true
        }
      }
    },
    noLayout: {
      type: String,
      default: '',
      validator(value) {
        if (value) {
          let v = value.replace(/\s/g, '').split(',')
          return v.every(item => ~layout.indexOf(item))
        } else {
          return true
        }
      }
    },
    isBorder: {
      type: Boolean,
      default: true
    },
    emputyTxt: {
      type: String,
      default: '暂无数据'
    },
    headerStyle: {
      type: Object,
      default: () => { return { background:'#73B0ED', color: '#fff' } }
    },
    tableHeight: {
      type: String,
      default: ''
    },
    tableData: {
      type: Array,
      default: () => []
    },
    tableSize: {
      type: String,
      default: 'medium'
    },
    pagination: {
      type: [Object, Boolean],
      default: () => {},
      required: false
    }
  },
  computed: {
    getLayout() {
      let noLayout = this.noLayout, arr = []
      if (noLayout) {
       let n = noLayout.replace(/\s/g, '').split(',')
        layout.forEach(item => {
          if (!~n.indexOf(item)) {
            arr.push(item)
          }
        })
        return arr.join(',')
      } else {
        return layout.join(',') || (this.layout.split(',')).join(',')
      }
    }
  },
  methods: {
    /**
     * 拖动表头改变列宽
     */
    colChange (newWidth, oldWidth, column, event) {
      setTimeout(() => {
        // console.log(newWidth, oldWidth, column, event)
        // console.log('拖动表头改变列宽')
        var applyTableColWidths = []
        var applyTable = document.getElementById('applyTable')
        var applyTableColgroup = applyTable.getElementsByTagName('colgroup')[0]
        var applyTableCol = applyTableColgroup.getElementsByTagName('col')
        for (var i = 0; i < applyTableCol.length; i++) {
          applyTableColWidths.push(applyTableCol[i].width)
        }
        // localStorage.setItem('applyTableColWidths', JSON.stringify(applyTableColWidths))
      }, 100)
    },
    handleSelectionChange (val) {
      this.$emit('selectSingle', val)
    },
    handleSelectAllChange (val) {
      this.$emit('selectAll', val)
    },
    handelRowClickChange (row, column, e) {
      // 防止多次触发(如果表格是单选也是触发此事件，点击行会触发两次)
      if (e.preventDefault){
          e.preventDefault() //阻止事件冒泡
      }else{ // IE
          window.event.cancelBubble = true; 
      }
      // 如果哪条不可选中 isSelect 就为false   没有或为true 都可以选中
      if (typeof row.isSelect == 'undefined' || row.isSelect && row.isSelect) {
        this.$emit('rowClick', row, column)
        this.$refs.table.toggleRowSelection(row)
      }
    },
    clearTableData () {
      this.$refs.table.clearSelect()
    },
    handleSizeChange (pageSize) {
      this.$refs.table.bodyWrapper.scrollTop = 0 // 表格置顶
      this.$emit('pagingLoadInfo', { pageSize })
    },
    handleCurrentChange (page) {
      this.$refs.table.bodyWrapper.scrollTop = 0 // 表格置顶
      this.$emit('pagingLoadInfo', { page })
    },
    // 设置选中行
    setCheckedRow(row, selected) {
      this.$nextTick(() => {
        this.$refs.table.toggleRowSelection(row, selected)
      })
    }
  }
}
</script>
