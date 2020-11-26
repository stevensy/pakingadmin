<template>
  <div v-loading="isLoading" class="comp-tree">
    <el-form :inline="true" :mode="queryString">
      <el-form-item class="queryItem" label="城市公司">
        <el-select v-model="queryString.company"   placeholder="请选择城市公司" size="mini">
          <el-option
            v-for="(item, index) in companys"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="queryItem" label="查询部门">
        <el-input  
          placeholder=""
          size="mini"
          suffix-icon="el-icon-search"
          class="input-search"
          v-model="queryString.menu"
        >
        </el-input>
        <!-- <el-button type="primary" size="mini" @click="handleAddTop">新增</el-button> -->
      </el-form-item>
    </el-form>
    <!-- tree -->
    <el-tree
      ref="SlotTree"
      class="tree_list"
      :data="setTree"
      :props="defaultProps"
      :expand-on-click-node="true"
      highlight-current
      :filter-node-method="filterNode"
      :node-key="NODE_KEY"
      @node-click="handleNodeClick"
      :style="{height: cuHeight}"
    >
      <div class="comp-tr-node" slot-scope="{ node, data }">
        <!-- 编辑状态 -->
        <template v-if="node.isEdit">
          <el-input
            v-model="data.label"
            autofocus
            size="mini"
            :ref="'slotTreeInput' + data[NODE_KEY]"
            @blur.stop="handleInput(node, data)"
            @keyup.enter.native="handleInput(node, data)"
          ></el-input>
        </template>

        <!-- 非编辑状态 -->
        <template v-else>
          <!-- 名称： 新增节点增加class（is-new） -->
          <span
            :class="[
              data[NODE_KEY] < NODE_ID_START ? 'is-new' : '',
              'comp-tr-node--name'
            ]"
          >
            {{ data.label }}
          </span>
        </template>
      </div>
    </el-tree>
  </div>
</template>

<script>
export default {
  name: 'component-tree',
  props: {
    companys: {
      type: Array,
      default: () => []
    },
    menuTree: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isLoading: false, // 是否加载
      cuHeight: '', // 高度适配
      queryString: {
        company: '', // 选择的公司
        menu: '', // 查询的部门
      },
      setTree: [], // tree数据
      NODE_KEY: 'id', // id对应字段
      MAX_LEVEL: 3, // 设定最大层级
      NODE_ID_START: 0, // 新增节点id，逐次递减
      startId: null,
      defaultProps: {
        // 默认设置
        children: 'children',
        label: 'name'
      },
      initParam: {
        // 新增参数
        label: '新增菜单',
        pid: 0,
        children: []
      }
    }
  },
  watch: {
    queryString: {
      handler(obj) {
        this.$refs.SlotTree.filter(obj.menu)
      },
      deep: true,
    }
  },
  created () {
    // 初始值
    this.setTree = this.menuTree
    this.startId = this.NODE_ID_START
  },
  mounted () {
    this.$nextTick(_ => {
      const Height = document.querySelector('.aside').offsetHeight - document.querySelector('.aside>h2').offsetHeight - document.querySelector('.input-search').offsetHeight - (71 + 47)
      this.cuHeight = `${Height}px`
    })
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleDelete (_node, _data) {
      // 删除节点
      console.log(_node, _data)
      // 判断是否存在子节点
      if (_data.children && _data.children.length !== 0) {
        this.$message.error('此节点有子级，不可删除！')
        return false
      } else {
        // 删除操作
        const DeletOprate = () => {
          this.$nextTick(() => {
            if (this.$refs.SlotTree) {
              this.$refs.SlotTree.remove(_data)
              this.$message.success('删除成功！')
            }
          })
        }

        // 二次确认
        const ConfirmFun = () => {
          this.$confirm('是否删除此节点？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              DeletOprate()
            })
            .catch(() => {})
        }

        // 判断是否新增： 新增节点直接删除，已存在的节点要二次确认
        // _data[this.NODE_KEY] < this.NODE_ID_START
        //   ? DeletOprate()
        //   : ConfirmFun()

        // 不管是新增节点还是存在节点都要二次确认
        ConfirmFun()
      }
    },
    handleInput (_node, _data) {
      // 修改节点
      console.log(_node, _data)
      // 退出编辑状态
      if (_node.isEdit) {
        this.$set(_node, 'isEdit', false)
      }
    },
    handleEdit (_node, _data) {
      // 编辑节点
      console.log(_node, _data)
      // 设置编辑状态
      if (!_node.isEdit) {
        this.$set(_node, 'isEdit', true)
      }

      // 输入框聚焦
      this.$nextTick(() => {
        if (this.$refs['slotTreeInput' + _data[this.NODE_KEY]]) {
          this.$refs[
            'slotTreeInput' + _data[this.NODE_KEY]
          ].$refs.input.focus()
        }
      })
    },
    handleAdd (_node, _data) {
      // 新增节点
      console.log(_node, _data)
      // 判断层级
      if (_node.level >= this.MAX_LEVEL) {
        this.$message.warning('当前已达到' + this.MAX_LEVEL + '级，无法新增！')
        return false
      }

      // 参数修改
      const obj = JSON.parse(JSON.stringify(this.initParam)) // copy参数
      obj.pid = _data[this.NODE_KEY] // 父id
      obj[this.NODE_KEY] = --this.startId // 节点id：逐次递减id
      // 判断字段是否存在
      if (!_data.children) {
        this.$set(_data, 'children', [])
      }
      // 新增数据
      _data.children.push(obj)

      // 展开节点
      if (!_node.expanded) {
        _node.expanded = true
      }
    },
    handleAddTop () {
      // 添加顶部节点
      const obj = JSON.parse(JSON.stringify(this.initParam)) // copy参数
      obj[this.NODE_KEY] = --this.startId // 节点id：逐次递减id
      this.setTree.push(obj)
    },
    handleNodeClick (node) {
      this.$emit('selectNode', node)
    }
  }
}
</script>

<style lang="scss">
/* common */
.el-form-item.queryItem {
  display: flex;
  margin: 0 0 10px;
  .el-form-item__content {
    flex: 1;
    .el-select {
      width: 100%;
    }
  }
}
.input-search {
  // width: calc(100% - 71px);
  // margin-right: 10px;
}
.el-tree {
  overflow: auto;
}
.comp-tr-node {
  align-items: center;
}
.el-tree-node__content {
  height: auto;
}
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content, .el-tree-node__content:hover{
  background: #eee;
}
.el-tree-node, .el-tree-node__content {
  margin-bottom: 2px;
}
.comp-tr-node {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-content: center;
}
// 显示按钮
.show-btns {
  opacity: 1;
}

/* common end */
.comp-tree {
  width: 100%;
  .tree_list {
    margin-top: 20px;
  }
  // 自定义节点
  .comp-tr-node {
    // label
    .comp-tr-node--name {
      // 新增
      &.is-new {
        // font-weight: bold;
      }
    }
    // button
    .comp-tr-node--btns {
      opacity: 0;
      transition: opacity 0.1s;
      .el-button {
        transform: scale(0.7); // 缩小按钮
        & + .el-button {
          margin-left: -1px;
        }
      }
    }
  }
  // 高亮显示按钮
  .is-current {
    & > .el-tree-node__content {
      .comp-tr-node--btns {
        @extend .show-btns;
      }
    }
  }
  // 悬浮显示按钮
  .el-tree-node__content {
    &:hover {
      .comp-tr-node--btns {
        @extend .show-btns;
      }
    }
  }
}
</style>
