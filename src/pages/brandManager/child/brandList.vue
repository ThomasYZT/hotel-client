<template>
  <div class="page-container">
    <div class="page-content">
      <div class="flex-box">
        <div class="left-box">
          <org-tree v-if="isAdmin" :params="orgParams" @nodeClick="onNodeClick"></org-tree>
        </div>
        <div class="data-box right-box">
          <div class="operation-wrapper flex-box">
            <div class="tool-wrapper left-box">
              <i-button v-if="showAddBtn" type="primary" @click="addItem">添加</i-button>
            </div>
            <div class="filter-block right-box">
              <div class="filter-item">
                <div class="filter-label">品牌名称：</div>
                <i-input v-model="filterPrams.name" placeholder="品牌名称模糊查询" clearable @on-clear="getList" search @on-search="getList"></i-input>
              </div>
              <i-button class="short-width-btn" shape="circle" type="primary" @click="getList">查询</i-button>
            </div>
          </div>
          <table-com v-if="showTable"
                     :data="tableData"
                     :page-num.sync="pageNum"
                     :page-size.sync="pageSize"
                     :total-size="totalSize"
                     :config="tableConfig"
                     :getList="getList">
            <template slot="col5"
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
          <no-data v-else></no-data>
        </div>
      </div>
    </div>
    <editModal ref="editModal"></editModal>
    <confirmModal ref="confirmModal"></confirmModal>
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
      return {
        typeId: this.userInfo.id,
        type: this.userInfo.type,
        level: 1
      };
    },
    isAdmin () {
      return this.userInfo.type === userType.admin;
    },
    showTable () {
      return !this.isAdmin || Object.keys(this.nodeData).length > 0;
    },
    showAddBtn () {
      return (this.isAdmin && Object.keys(this.nodeData).length > 0) || !this.isAdmin;
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
      nodeData: {}
    };
  },
  methods: {
    onNodeClick ({ data, isDefault }) {
      this.nodeData = data;
      if (!isDefault) {
        this.getList();
      }
    },
    getList () {
      const agentId = this.isAdmin ? this.nodeData.id : this.userInfo.id;
      this.$ajax.post({
        apiKey: 'brandPageList',
        params: {
          agentId,
          ...this.filterPrams,
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
          agentId: this.isAdmin ? this.nodeData.id : this.userInfo.id
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
        apiKey: 'brandDelete',
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
    height: calc(100% - 40px);
  }
}
</style>
