<template>
  <div class="page-container">
    <div class="page-header">
      <breadcrumb></breadcrumb>
    </div>
    <div class="page-content">
      <div class="flex-box">
        <div class="left-box">
          <org-tree v-if="showOrgTree" :params="orgParams" @nodeClick="onNodeClick"></org-tree>
        </div>
        <div class="right-box">
          <div class="flex-box">
            <div class="left-box">
              <org-tree title="数据类型"
                        tree-api="dicTypeGetAllList"
                        :params="typeOrgTreeParams"
                        :treeProps="{ label: 'name', children: 'list' }"
                        @nodeClick="onTypeNodeClick"></org-tree>
            </div>
            <div class="right-box">
              <div class="tool-wrapper">
                <i-button class="normal-width-btn" type="primary" @click="addItem">添加字典</i-button>
              </div>
              <table-com v-if="showTable"
                         :data="tableData"
                         :page-num.sync="pageNum"
                         :page-size.sync="pageSize"
                         :total-size="totalSize"
                         :config="tableConfig"
                         :getList="getList">
                <template slot="col2"
                          slot-scope="{ item }">
                  <el-table-column :prop="item.prop"
                                   :label="item.label"
                                   :fixed="item.fixed"
                                   :min-width="item.minWidth">
                    <template slot-scope="{ row }">
                      <div class="operate-block">
                        <i-button type="primary" class="table-btn" size="small" @click="editItem(row)">编 辑</i-button>
                        <i-button type="error" class="table-btn" size="small" @click="delClick(row)">删 除</i-button>
                      </div>
                    </template>
                  </el-table-column>
                </template>
              </table-com>
            </div>
          </div>
        </div>
      </div>
    </div>

    <editModal ref="editModal"></editModal>
  </div>
</template>

<script>
import editModal from '../components/editModal';
import { tableConfig } from './tableConfig.js';
import { userType } from '../../../assets/enums';
import { mapGetters } from 'vuex';
export default {
  components: {
    editModal
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    orgParams () {
      let level;
      switch (this.userInfo.type) {
        case userType.admin:
          level = 3;
          break;
        case userType.agent:
          level = 2;
          break;
        case userType.brand:
          level = 1;
          break;
      }
      return {
        typeId: this.userInfo.id,
        type: this.userInfo.type,
        level
      };
    },
    showOrgTree () {
      return [userType.admin, userType.agent, userType.brand].includes(this.userInfo.type);
    },
    showTable () {
      return (!this.showOrgTree && Object.keys(this.typeNodeData).length > 0) ||
        (Object.keys(this.nodeData).length > 0 && Object.keys(this.typeNodeData).length > 0);
    }
  },
  data () {
    return {
      tableConfig,
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      totalSize: 0,
      filterPrams: {
        name: ''
      },
      typeOrgTreeParams: { level: 1 },
      nodeData: {},
      typeNodeData: {}
    };
  },
  methods: {
    onNodeClick ({ data, isDefault }) {
      this.nodeData = data;
      if (!isDefault) {
        this.getList();
      }
    },
    onTypeNodeClick ({ data, isDefault }) {
      this.typeNodeData = data;
      if (!isDefault) {
        this.getList();
      }
    },
    getList () {
      this.$ajax.post({
        apiKey: 'dicPageList',
        params: {
          typeCode: this.typeNodeData.code,
          hotelId: this.showOrgTree ? this.nodeData.id : this.userInfo.id,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      }).then(data => {
        this.tableData = data.data || [];
        this.totalSize = data.totalSize || 0;
      }).catch(err => {
        this.$message.error(`获取数据失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    addItem () {
      this.$refs.editModal.show({
        type: 'add',
        item: {
          typeCode: this.typeNodeData.code,
          hotelId: this.showOrgTree ? this.nodeData.id : this.userInfo.id
        },
        confirmFn: this.getList
      });
    },
    editItem (item) {
      this.$refs.editModal.show({ type: 'edit', item, confirmFn: this.getList });
    },
    delClick (item) {
      this.$refs.confirmModal.show({
        title: '警告',
        content: `是否删除 ${item.name}`,
        confirm: () => {
          this.delItem(item);
        }
      });
    },
    delItem (item) {
      this.$ajax.get({
        apiKey: 'dicDelete',
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

  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
.flex-box {
  height: 100%;
  /deep/ .table-wrapper{
    height: calc(100% - 42px);
  }
}
</style>
