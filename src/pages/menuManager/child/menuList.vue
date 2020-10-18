<template>
  <div class="page-container">
    <div class="page-content">
      <div class="tree-wrapper">
        <el-tree :data="tableData"
                 node-key="id"
                 :highlight-current="false"
                 :expand-on-click-node="false"
                 :check-on-click-node="false">
          <div class="tree-node" slot-scope="{ node, data }">
            <template v-if="data.type === 'add'">
              <div class="add-node" @click="addMenu(data)">添加菜单</div>
            </template>
            <template v-else>
              <div class="node-info">{{ data.menuName }}</div>
              <div class="tool-box">
                <i-button class="tree-btn" size="small" type="primary" @click="editMenu(data)">编 辑</i-button>
                <i-button class="tree-btn" size="small" type="error" @click="delClick(data)">删 除</i-button>
              </div>
            </template>
          </div>
        </el-tree>
      </div>
    </div>
    <menuEditModal ref="menuEditModal"></menuEditModal>
    <confirmModal ref="confirmModal"></confirmModal>
  </div>
</template>

<script>
import { arrayToTree } from '../../../assets/share/utils';
import menuEditModal from '../components/menuEditModal';
export default {
  components: {
    menuEditModal
  },
  data () {
    return {
      tableData: []
    };
  },
  methods: {
    addMenu (item) {
      this.$refs.menuEditModal.show({ type: 'add', item: { parentId: item.parentId || 0 }, confirmFn: this.getList });
    },
    getList () {
      this.$ajax.get({
        apiKey: 'menuAllList'
      }).then(data => {
        this.tableData = arrayToTree({
          data,
          nodeHandler: (nodeItem) => {
            nodeItem.children.push({
              type: 'add',
              parentId: nodeItem.id
            });
          }
        });
        this.tableData.push({
          type: 'add',
          parentId: 0
        });
      }).catch(err => {
        this.$message.error(`获取数据失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    editMenu (item) {
      this.$refs.menuEditModal.show({ type: 'edit', item, confirmFn: this.getList });
    },
    delClick (item) {
      this.$refs.confirmModal.show({
        title: '警告',
        content: `是否删除 ${item.menuName}`,
        confirm: () => {
          this.delMenu(item);
        }
      });
    },
    delMenu (item) {
      this.$ajax.post({
        apiKey: 'menuDelete',
        params: {
          id: item.id
        }
      }).then(() => {
        this.getList();
        this.$message.success('删除成功');
      }).catch(err => {
        this.$message.error(`删除失败${err.msg ? ': ' + err.msg : ''}`);
      });
    }
  },
  mounted () {
    this.getList();
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
.page-container {
  @include flex_layout(column, flex-start, center);

  .page-content {
    @include flex_layout(column, center, flex-start);

    .tree-wrapper {
      margin-top: 10px;
      height: 100%;
      width: 100%;
      /deep/ .el-tree-node__content {
        cursor: unset;
        &:hover {
          background-color: white;
        }
      }
      /deep/ .is-current > .el-tree-node__content {
        background-color: white;
      }
      .tree-node {
        @include flex_layout(row, center, center);
        @include flex_set(1, 0);
        height: 100%;

        .node-info {
          min-width: 300px;
        }

        .add-node {
          @include flex_layout(row, center, center);
          width: 35%;
          height: 70%;
          text-align: center;
          border-radius: 4px;
          border: 1px solid $normalGreen;
          color: $normalGreen;
          cursor: pointer;
          transition: all.3s linear;
          &:hover {
            background-color: $lightGreen;
          }
        }
      }
    }
  }
}
.flex-box {
  height: 100%;
  /deep/ .table-wrapper{
    height: calc(100% - 40px);
  }
}
</style>
