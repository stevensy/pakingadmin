<template>
  <div class="ztree-container">
    <el-form-item v-if="showSeach" :label="label">
      <el-input id="input" v-model.trim="name" size="mini" :placeholder="placeholder" @keyup.enter.native="handleBlur">
        <el-button slot="append" icon="el-icon-search" @click="handleBlur"></el-button>
      </el-input>
    </el-form-item>
    <p v-if="hidden" style="padding-left: 10px">暂无匹配数据</p>
    <div class="ztree" :id="ztreeId" :style="{height: maxHeight ? maxHeight + 'px' : 'auto'}"></div>
  </div>
</template>

<script>
import $ from "jquery";
if (!window.jQuery) {
  window.jQuery = $;
}

require("./lib/jquery.ztree.all");
require("./lib/jquery.ztree.exhide");

export default {
  name: "VueMagicTree",
  props: {
    setting: {
      type: Object,
      require: false,
      default: () => {}
    },
    placeholder: {
      type: String,
      default: '输入关键字模糊查询'
    },
    label: {
      type: String,
      default: ''
    },
    nodes: {
      type: Array,
      require: true,
      default: () => []
    },
    parentField: {
      type: String,
      default: ""
    },
    showSeach: {
      type: Boolean,
      default: false
    },
    maxHeight: {
      type: Number,
      default: 0
    },
    defaultExpand: { // 默认展开第一个节点
      type: Boolean,
      default: true
    },
    defaultSelect: { // 默认选中第一个节点
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      hidden: false,
      ztreeId: "ztree_" + parseInt(Math.random() * 1e10),
      ztreeObj: null,
      name: undefined,
      list: [],
      zTreeCache: null,
      ztreeSetting: {
        edit: {
          enable: false,
          drag: {
            isMove: true
          },
          showRemoveBtn: false,
          showRenameBtn: false
        },
        check: {
          enable: false
        },
        data: {
          simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "pid",
            rootPId: null
          },
          // 设置图标库(采用iconfont class形式)
          iconMap: {
            0: "iconjianyuede",
            1: "icon-xuexiaodanwei",
            2: "iconhuiyuan"
          },
          // 设置对应每个节点的节点类型，与数据中customType对应
          key: {
            nodeType: "customType"
          }
        },
        view: {
          // 开启图标显示功能
          showIcon: true,
          addHoverDom: false,
          removeHoverDom: false
        },
        callback: {
          onAsyncError: (...arg) => {
            this.$emit("onAsyncError", ...arg);
          },
          onAsyncSuccess: (...arg) => {
            this.$emit("onAsyncSuccess", ...arg);
          },
          onCheck: (evt, treeId, treeNode) => {
            console.log("check", treeNode);
            this.$emit("checkedNode", treeNode);
          },
          onClick: (evt, treeId, treeNode) => {
            console.log("click", treeNode);
            if (this.parentField) {
              this.$emit("choose", treeNode, this.parentField);
            } else {
              this.$emit("choose", treeNode);
            }
          },
          onCollapse: (...arg) => {
            this.$emit("onCollapse", ...arg);
          },
          onDblClick: (...arg) => {
            this.$emit("onDblClick", ...arg);
          },
          onDrag: (...arg) => {
            this.$emit("onDrag", ...arg);
          },
          onDragMove: (...arg) => {
            this.$emit("onDragMove", ...arg);
          },
          onDrop: (...arg) => {
            this.$emit("onDrop", ...arg);
          },
          onExpand: (evt, treeId, treeNode) => {
            console.log("expand", treeNode);
            this.$emit("onExpand", treeNode);
          },
          onMouseDown: (...arg) => {
            this.$emit("onMouseDown", ...arg);
          },
          onMouseUp: (...arg) => {
            this.$emit("onMouseUp", ...arg);
          },
          onRemove: (...arg) => {
            this.$emit("onRemove", ...arg);
          },
          onRename: (...arg) => {
            this.$emit("onRename", ...arg);
          },
          onRightClick: (...arg) => {
            this.$emit("onRightClick", ...arg);
          }
        }
      }
    };
  },
  watch: {
    nodes: {
      handler: function(nodes) {
        this.list = nodes;
        this.zTreeCache = nodes;
        // update tree
        if (this.ztreeObj) {
          this.ztreeObj.destroy();
        }
        this.$nextTick(() => {
          this.name = undefined
          this.ztreeObj = $.fn.zTree.init(
            $("#" + this.ztreeId),
            Object.assign({}, this.ztreeSetting, this.setting),
            this.list
          );
          let node = this.ztreeObj.getNodes()[0];
          if (node && node.children && node.children.length) {
            if (this.defaultExpand) {
              this.ztreeObj.expandNode(node, true);
            }
            if (this.defaultSelect) {
              this.ztreeObj.selectNode(
                this.ztreeObj.getNodeByParam("id", node && node.id, null),
                false
              );
            }
          }
          if (this.ztreeObj.getNodes().length) {
            if (this.parentField) {
              this.$emit("firstTreeData", node, this.parentField);
            } else {
              this.$emit("firstTreeData", node);
            }
          }
          if (this.showSeach) {
            this.fuzzySearch(this.ztreeId, "#input", null, true)
          }
        });
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    needSearchTree(id) {
      this.fuzzySearch(this.ztreeId, id, null, true)
    },
    init() {
      // 如果有选中的就展开选中的,如果没有则选中第一个节点及展开
      let node = null;
      this.list.forEach(item => {
        if (item.checked && !item.chkDisabled) {
          node = this.ztreeObj.getNodeByParam("id", item.id, null);
          // expandNode(nodeId, expandFlag, sonSign, focus, callback)
          // expandNode nodeId: 需要展开/折叠的节点数据  expandFlag: 展开true  sonSign: 全部子孙节点展开true, 只影响此节点false focus: 展开/折叠保证焦点在可视区内true, 展开/折叠后不设置作何焦点
          this.ztreeObj.selectNode(node);
          this.ztreeObj.expandNode(node, true, false, false);
          // 需要联动子节点 因为后端不作处理需要手动把子节点选中
          this.ztreeObj.checkNode(node, true, true);
          // 子节点禁用
          //this.disabledChildrenNode(node, true);
          this.$emit("selectTree", node);
          console.log("select", node);
        }
      });
    },
    handleBlur() {
      this.searchNodeLazy(this.name);
      return
      this.ztreeObj.destroy();
      let tempList =  this.searchNodesFromCache(this.name)
      if(this.name){
        let treeObj = $.fn.zTree.init(
          $("#" + this.ztreeId),
          Object.assign({}, this.ztreeSetting, this.setting),
          tempList
        );
        treeObj.expandAll(true);

      }else{
        $.fn.zTree.init(
          $("#" + this.ztreeId),
          Object.assign({}, this.ztreeSetting, this.setting),
          this.list
        );
      }
      this.$nextTick(() => {
        let node = this.ztreeObj.getNodes()[0];
        if(node){
          this.ztreeObj.selectNode(this.ztreeObj.getNodeByParam("id", node && node.id, null), false);
          this.$emit('choose', node)
        }

      })
    },
    clearSearch() {
      this.hidden = false
      this.ztreeObj = $.fn.zTree.init(
        $("#" + this.ztreeId),
        Object.assign({}, this.ztreeSetting, this.setting),
        this.list
      );
      // 展开树的第一个节点
      let node = this.ztreeObj.getNodes()[0];
      this.ztreeObj.expandNode(node, true);
    },
    searchNodesFromCache(value) {
      var filterList = this.zTreeCache.filter(function (item) {
        return item.name.indexOf(value) > -1;
      });
      return this.getTreeNodes(filterList);

    },
    getTreeNodes(list) {
      var pIdList = list.map(function (item) {
        return item.pid;
      });
      pIdList = Array.from(new Set(pIdList));
      pIdList = pIdList.filter(function (pId) {
        return list.findIndex(function (item) {
          return item.id === pId;
        }) === -1;
      });
      pIdList = pIdList.filter(function (item) { return item != undefined; });
      if (!pIdList.length || (pIdList.length === 1 && pIdList[0] === 'null')) {
        return list;
      }
      var pList = this.zTreeCache.filter(function (node) {
        return pIdList.findIndex(function (pId) {
          return node.id === pId;
        }) > -1;
      });
      list = list.concat(pList);
      return this.getTreeNodes(list)
    },
    searchNodesFromCache(value) {
      var filterList = this.zTreeCache.filter(function (item) {
        return item.name.indexOf(value) > -1;
      });
      return this.getTreeNodes(filterList);

    },
    getParentData(node, parentNodes = []){
      if (!node.pid) return
      this.list.forEach(item => {
        if (item.id === node.pid) {
          this.getParentData(item, parentNodes)
          if (!parentNodes.filter(pItem => pItem.id === item.id).length) {
            parentNodes.push(item)
          }
        }
      })
      return parentNodes
    },
    fuzzySearch(zTreeId, searchField, isHighLight, isExpand) {
      this.zTreeSearchObj = $.fn.zTree.getZTreeObj(zTreeId); //get the ztree object by ztree id
      if (!this.zTreeSearchObj) {
        // alert("fail to get ztree object");
        return
      }
      this.nameKey = this.zTreeSearchObj.setting.data.key.name; //get the key of the node name
      this.isHighLight = isHighLight === false ? false : true; //default true, only use false to disable highlight
      this.isExpand = isExpand ? true : false; // not to expand in default
      this.zTreeSearchObj.setting.view.nameIsHTML = isHighLight; //allow use html in node name for highlight use

      var metaChar = "[\\[\\]\\\\^\\$\\.\\|\\?\\*\\+\\(\\)]"; //js meta characters
      this.rexMeta = new RegExp(metaChar, "gi"); //regular expression to match meta characters
      //listen to change in input element
      // $(searchField).bind("input propertychange", function() {
      //   var _keywords = $(this).val();
      //   searchNodeLazy(_keywords); //call lazy load
      // });

      this.timeoutId = null;
      this.lastKeyword = "";
      
    },
    // keywords filter function
    ztreeFilter(zTreeObj, _keywords) {
      if (!_keywords) {
        _keywords = ""; //default blank for _keywords
      }
      let nameKey = this.nameKey
      let isHighLight = this.isHighLight
      let rexMeta = this.rexMeta
      // function to find the matching node
      function filterFunc(node) {
        if (node && node.oldname && node.oldname.length > 0) {
          node[nameKey] = node.oldname; //recover oldname of the node if exist
        }
        zTreeObj.updateNode(node); //update node to for modifications take effect
        if (_keywords.length == 0) {
          //return true to show all nodes if the keyword is blank
          zTreeObj.showNode(node);
          zTreeObj.expandNode(node, this.isExpand);
          return true;
        }
        //transform node name and keywords to lowercase
        if (
          node[nameKey] &&
          node[nameKey].toLowerCase().indexOf(_keywords.toLowerCase()) != -1
        ) {
          if (isHighLight) {
            //highlight process
            //a new variable 'newKeywords' created to store the keywords information
            //keep the parameter '_keywords' as initial and it will be used in next node
            //process the meta characters in _keywords thus the RegExp can be correctly used in str.replace
            var newKeywords = _keywords.replace(rexMeta, function(matchStr) {
              //add escape character before meta characters
              return "\\" + matchStr;
            });
            node.oldname = node[nameKey]; //store the old name
            var rexGlobal = new RegExp(newKeywords, "gi"); //'g' for global,'i' for ignore case
            //use replace(RegExp,replacement) since replace(/substr/g,replacement) cannot be used here
            node[nameKey] = node.oldname.replace(rexGlobal, function(
              originalText
            ) {
              //highlight the matching words in node name
              var highLightText = originalText
              return highLightText;
            });
            zTreeObj.updateNode(node); //update node for modifications take effect
          }
          zTreeObj.showNode(node); //show node with matching keywords
          return true; //return true and show this node
        }

        zTreeObj.hideNode(node); // hide node that not matched
        return false; //return false for node not matched
      }
      var nodesShow = zTreeObj.getNodesByFilter(filterFunc); //get all nodes that would be shown
      this.processShowNodes(nodesShow, _keywords); //nodes should be reprocessed to show correctly
    },
    // excute lazy load once after input change, the last pending task will be cancled
    searchNodeLazy(_keywords) {
      if (this.timeoutId) {
        //clear pending task
        clearTimeout(this.timeoutId);
      }
      this.timeoutId = setTimeout(() => {
        if (this.lastKeyword === _keywords) {
          return;
        }
        this.ztreeFilter(this.zTreeSearchObj, _keywords); //lazy load ztreeFilter function
        // $(searchField).focus();//focus input field again after filtering
        this.lastKeyword = _keywords;
      }, 500);
    },
    /**
     * reprocess of nodes before showing
     */
    processShowNodes(nodesShow, _keywords) {
      let zTreeObj = this.zTreeSearchObj
      if (nodesShow && nodesShow.length > 0) {
        this.hidden = false
        //process the ancient nodes if _keywords is not blank
        if (_keywords.length > 0) {
          $.each(nodesShow, function(n, obj) {
            var pathOfOne = obj.getPath(); //get all the ancient nodes including current node
            if (pathOfOne && pathOfOne.length > 0) {
              //i < pathOfOne.length-1 process every node in path except self
              for (var i = 0; i < pathOfOne.length - 1; i++) {
                zTreeObj.showNode(pathOfOne[i]); //show node
                if (n === 0) {
                  zTreeObj.expandNode(pathOfOne[i], true); //expand node
                }
                
              }
            }
          });
        } else {
          this.hidden = false
          //show all nodes when _keywords is blank and expand the root nodes
          var rootNodes = zTreeObj.getNodesByParam("level", "0"); //get all root nodes
          $.each(rootNodes, function(n, obj) {
            zTreeObj.expandNode(obj, true); //expand all root nodes
          });
        }
      } else {
        this.hidden = true
      }
    },
    onReset(id) {
      this.ztreeObj = $.fn.zTree.init(
        $("#" + this.ztreeId),
        Object.assign({}, this.ztreeSetting, this.setting),
        this.list
      );
      let node;
      if (id) {
        node = this.ztreeObj.getNodeByParam("id", id, null);
        this.ztreeObj.selectNode(node, false);
      } else {
        node = this.ztreeObj.getNodes()[0];
        this.ztreeObj.selectNode(
          this.ztreeObj.getNodeByParam("id", node && node.id, null),
          false
        );
      }
      // 选中节点及展开
      this.ztreeObj.expandNode(node, true);
      if (this.parentField) {
        this.$emit("choose", node, this.parentField);
      } else {
        this.$emit("choose", node);
      }
    },
    // 是否禁用(当前节点也会禁用) inheritChildren: 关联子节点(默认关联) inheritParent: 关联父节点
    disabledNode(disabled, inheritChildren = true, inheritParent = false) {
      let zTree = this.ztreeObj,
        nodes = zTree.getSelectedNodes();

      for (let i = 0, l = nodes.length; i < l; i++) {
        zTree.setChkDisabled(
          nodes[i],
          disabled,
          inheritParent,
          inheritChildren
        );
      }
    },
    // 禁用子节点
    disabledChildrenNode(nodes, disabled) {
      // nodes 当前节点, disabled 是否禁用
      if (!Object.keys(nodes).length) {
        return;
      }
      // 只禁用子节点 取出所有子节点递归禁用
      // nodes = this.ztreeObj.transformToArray(nodes)
      this.getzTreeChildrenNode(nodes, [], item => {
        item.checked = disabled;
        // 取消禁用updateNode 方法有bug,没有实时刷新只有鼠标移上去才更新, 用disabledNode方法来解决
        if (disabled) {
          item.chkDisabled = disabled;
          this.ztreeObj.updateNode(nodes);
        } else {
          this.disabledNode(false, true, false);
        }
      });
    },
    // 当前节点下所有子节点
    getzTreeChildrenNode(treeNode, result = [], callback) {
      //检测是否为父节点
      if (treeNode.isParent) {
        var childrenNodes = treeNode.children; //查询子节点
        if (childrenNodes && childrenNodes.length) {
          //子节点push到arr中
          for (var i = 0; i < childrenNodes.length; i++) {
            callback && callback(childrenNodes[i]);
            result.push(childrenNodes[i]);
            result = this.getzTreeChildrenNode(childrenNodes[i], result); //循环调用
          }
        }
      }
      return result; //返回
    },
    // 获取当前节点中所有父级节点
    getParentNodes(node, result = []){
      if(node != null){
        let curNode = node.getParentNode()
        if (!curNode) return
        result.push(curNode)
        this.getParentNodes(curNode, result)
      }
      return result
    },
    /**
     * 刷新当前选择节点的父节点
     */
    refreshParentNode() {
      /*根据 zTree 的唯一标识 tId 快速获取节点 JSON 数据对象*/
      let parentNode = this.ztreeObj.getNodeByTId(nodes[0].parentTId);
      /*选中指定节点*/
      this.ztreeObj.selectNode(parentNode);
      this.ztreeObj.reAsyncChildNodes(parentNode, "refresh", false);
    },
    refreshNode() {
      /*获取 zTree 当前被选中的节点数据集合*/
      let nodes = this.ztreeObj.getSelectedNodes();
      /*强行异步加载父节点的子节点。[setting.async.enable = true 时有效]*/
      this.ztreeObj.reAsyncChildNodes(nodes[0], "refresh", false);
    }
  }
};
</script>

<style scoped>
/* beauty ztree! */
.ztree-container {
  overflow: auto;
}
.ztree {
  text-align: left;
  font-size: 14px;
  overflow: auto;
}

/* .ztree >>> .node-iconfont {
    font-size: 20px;
  } */
.ztree >>> li {
  list-style-type: none;
  white-space: nowrap;
  outline: none;
}

.ztree >>> li ul {
  position: relative;
  padding: 0 0 0 20px;
  margin: 0;
}

.ztree >>> .line:before {
  position: absolute;
  top: 0;
  left: 10px;
  height: 100%;
  content: "";
  border-right: 1px dotted #dbdbdb;
}

.ztree >>> .roots_docu:before,
.ztree >>> .roots_docu:after,
.ztree >>> .center_docu:before,
.ztree >>> .bottom_docu:before,
.ztree >>> .center_docu:after,
.ztree >>> .bottom_docu:after {
  position: absolute;
  content: "";
  border: 0 dotted #dbdbdb;
}

.ztree >>> .roots_docu:before {
  left: 10px;
  height: 50%;
  top: 50%;
  border-left-width: 1px;
}

.ztree >>> .roots_docu:after {
  top: 50%;
  left: 11px;
  width: 50%;
  border-top-width: 1px;
}

.ztree >>> .center_docu:before {
  left: 10px;
  height: 100%;
  border-left-width: 1px;
}

.ztree >>> .center_docu:after {
  top: 50%;
  left: 11px;
  width: 50%;
  border-top-width: 1px;
}

.ztree >>> .bottom_docu:before {
  left: 10px;
  height: 50%;
  border-left-width: 1px;
}

.ztree >>> .bottom_docu:after {
  top: 50%;
  left: 11px;
  width: 50%;
  border-top-width: 1px;
}

.ztree >>> li a {
  display: inline-block;
  line-height: 22px;
  height: 22px;
  margin: 0;
  cursor: pointer;
  transition: none;
  vertical-align: middle;
  color: #555555;
}

.ztree >>> .node_name {
  display: inline-block;
  padding: 0 3px;
  border-radius: 4px;
}

.ztree >>> .curSelectedNode .node_name {
  color: #000;
  background-color: #c9e9f7;
}

.ztree >>> .curSelectedNode_Edit {
  height: 20px;
  opacity: 0.8;
  color: #000;
  border: 1px #6cc2e8 solid;
  background-color: #9dd6f0;
}

.ztree >>> .tmpTargetNode_inner {
  opacity: 0.8;
  color: #fff;
  background-color: #4fcbf0;
  filter: alpha(opacity=80);
}

.ztree >>> .rename {
  font-size: 12px;
  line-height: 22px;
  width: 80px;
  height: 22px;
  margin: 0;
  padding: 0;
  vertical-align: top;
  border: 0;
  background: none;
}

.ztree >>> .button {
  position: relative;
  display: inline-block;
  line-height: 22px;
  height: 22px;
  width: 22px;
  cursor: pointer;
  text-align: center;
  vertical-align: middle;
}

.ztree >>> .button.edit {
  color: #25ae88;
}

.ztree >>> .button.remove {
  color: #cb4042;
}

.ztree >>> .button.chk {
  position: relative;
  width: 14px;
  height: 14px;
  margin: 0 4px 0 0;
  border: 1px solid #d7dde4;
  border-radius: 2px;
  background: #fff;
}

.ztree >>> .chk.radio_true_full,
.ztree >>> .chk.radio_false_full,
.ztree >>> .chk.radio_true_full_focus,
.ztree >>> .chk.radio_false_full_focus,
.ztree >>> .chk.radio_false_disable,
.ztree >>> .chk.radio_true_disable,
.ztree >>> .chk.radio_true_part,
.ztree >>> .chk.radio_false_part,
.ztree >>> .chk.radio_true_part_focus,
.ztree >>> .chk.radio_false_part_focus {
  border-radius: 8px;
}

.ztree >>> .button.chk:after {
  position: absolute;
  top: 1px;
  left: 4px;
  width: 4px;
  height: 8px;
  content: "";
  transition: -webkit-transform 0.2s ease-in-out;
  transition: transform 0.2s ease-in-out;
  transition: transform 0.2s ease-in-out, -webkit-transform 0.2s ease-in-out;
  -webkit-transform: rotate(0deg) scale(0);
  transform: rotate(0deg) scale(0);
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
}

.ztree >>> .button.checkbox_false_full_focus {
  border-color: #ccc;
}

.ztree >>> .button.checkbox_true_full,
.ztree >>> .button.checkbox_true_full_focus,
.ztree >>> .button.checkbox_true_part,
.ztree >>> .button.checkbox_true_part_focus,
.ztree >>> .button.checkbox_true_disable {
  border-color: #39f;
  background-color: #39f;
}

.ztree >>> .button.checkbox_true_full:after,
.ztree >>> .button.checkbox_true_full_focus:after,
.ztree >>> .button.checkbox_true_disable:after {
  -webkit-transform: rotate(45deg) scale(1);
  transform: rotate(45deg) scale(1);
}

.ztree >>> .button.checkbox_true_part:after,
.ztree >>> .button.checkbox_true_part_focus:after {
  top: 5px;
  left: 1px;
  width: 10px;
  height: 1px;
  -webkit-transform: rotate(0deg) scale(1);
  transform: rotate(0deg) scale(1);
  border-right: 0;
}

.ztree >>> .button.radio_true_full,
.ztree >>> .chk.radio_true_full_focus,
.ztree >>> .chk.radio_true_part,
.ztree >>> .chk.radio_true_part_focus {
  border-color: #39f;
}

.ztree >>> .button.radio_true_full:after,
.ztree >>> .chk.radio_true_full_focus:after,
.ztree >>> .chk.radio_true_part:after,
.ztree >>> .chk.radio_true_part_focus:after {
  top: 3px;
  left: 3px;
  width: 8px;
  -webkit-transform: rotate(0deg) scale(1);
  transform: rotate(0deg) scale(1);
  border: 0;
  border-radius: 4px;
  background: #39f;
}

.ztree >>> .button.checkbox_true_disable,
.ztree >>> .button.checkbox_false_disable,
.ztree >>> .chk.radio_false_disable,
.ztree >>> .chk.radio_true_disable {
  cursor: not-allowed;
}

.ztree >>> .button.checkbox_false_disable {
  background-color: #f3f3f3;
}

.ztree >>> .button.noline_close:before,
.ztree >>> .button.noline_open:before,
.ztree >>> .button.root_open:before,
.ztree >>> .button.root_close:before,
.ztree >>> .button.roots_open:before,
.ztree >>> .button.roots_close:before,
.ztree >>> .button.bottom_open:before,
.ztree >>> .button.bottom_close:before,
.ztree >>> .button.center_open:before,
.ztree >>> .button.center_close:before {
  position: absolute;
  top: 5px;
  left: 5px;
  content: "";
  transition: -webkit-transform ease 0.3s;
  transition: transform ease 0.3s;
  transition: transform ease 0.3s, -webkit-transform ease 0.3s;
  -webkit-transform: rotateZ(0deg);
  transform: rotateZ(0deg);
  -webkit-transform-origin: 25% 50%;
  transform-origin: 25% 50%;
  border: 6px solid;
  border-color: transparent transparent transparent #666;
}

.ztree >>> .button.noline_open:before,
.ztree >>> .button.root_open:before,
.ztree >>> .button.roots_open:before,
.ztree >>> .button.bottom_open:before,
.ztree >>> .button.center_open:before {
  -webkit-transform: rotateZ(90deg);
  transform: rotateZ(90deg);
}

.ztree >>> .button.ico_loading {
  margin-right: 2px;
  background: url("data:image/gif;base64,R0lGODlhEAAQAKIGAMLY8YSx5HOm4Mjc88/g9Ofw+v///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgAGACwAAAAAEAAQAAADMGi6RbUwGjKIXCAA016PgRBElAVlG/RdLOO0X9nK61W39qvqiwz5Ls/rRqrggsdkAgAh+QQFCgAGACwCAAAABwAFAAADD2hqELAmiFBIYY4MAutdCQAh+QQFCgAGACwGAAAABwAFAAADD1hU1kaDOKMYCGAGEeYFCQAh+QQFCgAGACwKAAIABQAHAAADEFhUZjSkKdZqBQG0IELDQAIAIfkEBQoABgAsCgAGAAUABwAAAxBoVlRKgyjmlAIBqCDCzUoCACH5BAUKAAYALAYACgAHAAUAAAMPaGpFtYYMAgJgLogA610JACH5BAUKAAYALAIACgAHAAUAAAMPCAHWFiI4o1ghZZJB5i0JACH5BAUKAAYALAAABgAFAAcAAAMQCAFmIaEp1motpDQySMNFAgA7")
    0 center no-repeat;
}

.ztree >>> .tmpTargetzTree {
  opacity: 0.8;
  background-color: #2ea9df;
  filter: alpha(opacity=80);
}

.ztree >>> .tmpzTreeMove_arrow {
  position: absolute;
  width: 18px;
  height: 18px;
  color: #4fcbf0;
}

.ztree >>> .ztree.zTreeDragUL {
  overflow: hidden;
  position: absolute;
  width: auto;
  height: auto;
  margin: 0;
  padding: 0;
  opacity: 0.8;
  border: 1px #176b53 dotted;
  background-color: #dbdbdb;
  filter: alpha(opacity=80);
}

.zTreeMask {
  position: absolute;
  z-index: 10000;
  opacity: 0;
  background-color: #cfcfcf;
  filter: alpha(opacity=0);
}
</style>
