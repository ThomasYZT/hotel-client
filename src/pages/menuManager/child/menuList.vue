<template>
  <div class="page-container">
    <div class="page-header">
      <breadcrumb></breadcrumb>
    </div>
    <div class="page-content">
      <div class="tool-wrapper">
        <i-button class="normal-width-btn" type="primary" @click="addMenu">添加菜单</i-button>
      </div>
      <div class="table-wrapper">
        <table-com :hasPage="false"
                   :data="tableData"
                   :config="menuTableConfig"
                   :getList="getList">
          <template slot="col4"
                    slot-scope="{ item }">
            <el-table-column :prop="item.prop"
                             :label="item.label"
                             :width="item.width || ''">
              <template slot-scope="{ row }">
                <i-button type="primary" shape="circle" class="normal-width-btn" @click="editMenu(row)">编 辑</i-button>
                <i-button type="error" shape="circle" class="normal-width-btn" @click="delClick(row)">删 除</i-button>
              </template>
            </el-table-column>
          </template>

        </table-com>
      </div>
    </div>
    <menuEditModal ref="menuEditModal" :menuList="menuList"></menuEditModal>
    <confirmModal ref="confirmModal"></confirmModal>
  </div>
</template>

<script>
import { arrayToTree } from '../../../assets/share/utils';
import menuEditModal from '../components/menuEditModal';
import { menuTableConfig } from './tableConfig.js';
import ajax from '../../../assets/api';
export default {
  components: {
    menuEditModal
  },
  data () {
    return {
      treeProps: {
        children: 'children',
        label: 'menuName'
      },
      menuTableConfig,
      tableData: [],
      menuList: []
    };
  },
  methods: {
    addMenu () {
      this.$refs.menuEditModal.show({ type: 'add' });
    },
    getList () {
      ajax.get('menuAllList').then(data => {
        this.menuList = data;
        this.menuList.unshift({
          menuName: '一级菜单',
          id: 0
        });
        this.tableData = arrayToTree({ data });
      }).catch(err => {
        this.$message.error(`获取数据失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    editMenu (item) {
      this.$refs.menuEditModal.show({ type: 'edit', item });
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
      this.$ajax.get('menuDelete', {
        id: item.id
      }).then(() => {
        this.getList();
        this.$message.success('删除成功');
      }).catch(err => {
        console.log(err);
        this.$message.error(`删除失败${err.msg ? ': ' + err.msg : ''}`);
      });
    }
  },
  mounted () {

  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
.page-container {
  padding: 10px 20px;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-color: #FFFFFF;

  .page-header {
    @include flex_layout(row, flex-start, center);
    height: 50px;
  }
  .page-content {
    @include flex_layout(column, center, center);
    height: calc(100% - 50px);
    .tool-wrapper {
      width: 100%;
    }
    .table-wrapper {
      height: 100%;
      width: 100%;

    }
  }
}

</style>
