<template>
  <div class="org-tree">
    <div class="tree-wrapper">
      <div class="title">{{title || treeTitle}}</div>
      <div class="content">
        <el-tree  ref="Tree"
                  :data="treeData"
                  :props="treeProps"
                  node-key="id"
                  :highlight-current="false"
                  :expand-on-click-node="false"
                  :indent="8"
                  default-expand-all
                  @node-click="onNodeClick">
          <div class="custom-tree-node" slot-scope="{ node }">
            <span>{{ node.label }}</span>
          </div>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { userType } from '../../assets/enums';
export default {
  name: 'OrgTree',
  props: {
    title: {
      type: String,
      default: ''
    },
    treeApi: {
      type: String,
      default: 'agentGetHotelAgentTree'
    },
    params: {
      type: Object,
      default () {
        return {};
      }
    },
    allSelectable: {
      type: Boolean,
      default: false
    },
    treeProps: {
      type: Object,
      default () {
        return {
          label: 'name',
          children: 'list'
        };
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    treeTitle () {
      switch (this.userInfo.type) {
        case userType.brand:
          return '酒店列表';
        case userType.agent:
          return '品牌列表';
        case userType.admin:
          return '代理商列表';
        default:
          return '酒店列表';
      }
    }
  },
  data () {
    return {
      treeData: [],
      curNodeEl: null
    };
  },
  methods: {
    getTree () {
      this.$ajax.get({
        apiKey: this.treeApi,
        params: this.params,
        loading: false,
      }).then(data => {
        this.treeData = data || [];
        this.addLeafMark(this.treeData);
        this.treeData.length > 0 && this.$nextTick(() => {
          const child = this.getNextDeepChild(this.$refs.Tree.$el, 'el-tree-node');
          const leafNode = this.getFistLeafNode(child, this.treeData);
          this.onNodeClick(leafNode.data, null, { $el: leafNode.el });
        });
      }).catch(err => {
        this.$message.error(`获取${this.title}信息失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    getNextDeepChild (parentNode, className) {
      const child = Object.values(parentNode.querySelectorAll(`.${className}`));
      return child.filter(item => item.parentNode === parentNode);
    },
    addLeafMark (data, level = 1) {
      let len = data.length;
      while (len--) {
        data[len].leaf = level === this.params.level;
        if (data[len].list && data[len].list.length > 0) {
          this.addLeafMark(data[len].list, level + 1);
        }
      }
    },
    getFistLeafNode (eleList, list, level = 1) {
      for (let i = 0, len = eleList.length; i < len; i++) {
        if (level === this.params.level) {
          return { el: eleList[0], data: list[0] };
        } else {
          const _children = this.getNextDeepChild(
            eleList[i].querySelector('.el-tree-node__children'),
            'el-tree-node'
          );
          if (_children && _children.length > 0) {
            const leaf = this.getFistLeafNode(_children, list[i].list, level + 1);
            if (leaf) return leaf;
          }
        }
      }
      return null;
    },
    onNodeClick (data, vnode, com) {
      if (!data.leaf && !this.allSelectable) return;
      this.$nextTick(() => {
        if (this.curNodeEl !== com.$el.querySelector('.el-tree-node__content')) {
          if (this.curNodeEl) {
            this.curNodeEl.setAttribute('class', this.curNodeEl.getAttribute('class').replace(/ click-active/, ''));
          }
          this.curNodeEl = com.$el.querySelector('.el-tree-node__content');
          this.curNodeEl.setAttribute('class', this.curNodeEl.getAttribute('class') + ' click-active');
          this.$emit('nodeClick', { data, isDefault: !vnode });
        }
      });
    }
  },
  created () {
    this.getTree();
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
.org-tree {
  padding: 15px 15px;
  margin-right: 10px;
  height: 100%;
  min-width: 200px;
  border-right: 1px solid $lightGray;
  background-color: #FFFFFF;
  border-radius: 5px;

  .tree-wrapper {
    @include flex_layout(column, flex-start, center);
    height: 100%;
    .title {
      @include flex_layout(row, flex-start, center);
      margin-top: -10px;
      width: 100%;
      height: 45px;
      font-weight: bold;
      border-bottom: 2px solid #bfbfbf;
    }
    .content {
      margin: 20px 0;
      width: 100%;
      height: calc(100% - 45px);
      overflow-y: auto;
    }

    /deep/ .click-active {
      background-color: $lightGray;
    }
  }
}
</style>
