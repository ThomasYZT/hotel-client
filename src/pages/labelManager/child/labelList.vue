<template>
  <div class="page-container">
    <div class="page-content">
      <div class="flex-box">
        <div class="data-box right-box">
          <div class="operation-wrapper flex-box">
            <div class="tool-wrapper left-box">
              <i-button type="primary" @click="addItem">添加</i-button>
            </div>
            <div class="filter-block right-box">
              <div class="filter-item">
                <div class="filter-label">标签名称：</div>
                <i-input v-model="filterParams.name" placeholder="商品名称模糊查询" clearable @on-clear="getList" search @on-search="getList"></i-input>
              </div>
              <i-button class="short-width-btn" shape="circle" type="primary" @click="getList">查询</i-button>
            </div>
          </div>
          <table-com :data="tableData"
                     :page-num.sync="pageNum"
                     :page-size.sync="pageSize"
                     :total-size="totalSize"
                     :config="tableConfig"
                     :getList="getList">
            <template slot="col1"
                      slot-scope="{ item }">
              <el-table-column :prop="item.prop"
                               :label="item.label"
                               :fixed="item.fixed"
                               min-width="130px">
                <template slot-scope="{ row }">
                  <span v-if="row.isTop === 0">置顶</span>
                  <span v-else>不置顶</span>
                </template>
              </el-table-column>
            </template>
            <template slot="col3"
                      slot-scope="{ item }">
              <el-table-column :prop="item.prop"
                               :label="item.label"
                               :fixed="item.fixed"
                               :min-width="item.minWidth">
                <template slot-scope="{ row }">
                  <div class="operate-block">
                    <i-button type="primary" class="table-btn" size="small" @click="editItem(row)">编 辑</i-button>
                    <i-button type="error" class="table-btn" size="small" @click="delClick(row)">删 除</i-button>
                    <!-- <i-switch size="large" :true-value="1" :false-value="0" v-model="row.status"
                              @on-change="statusChange($event, row)">
                      <span slot="open">置顶</span>
                      <span slot="close">不置顶</span>
                    </i-switch> -->
                  </div>
                </template>
              </el-table-column>
            </template>
          </table-com>
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
import { mapGetters } from 'vuex';
export default {
  components: {
    editModal
  },
  // computed: {
  //   showTable () {
  //     return !this.showOrgTree || Object.keys(this.nodeData).length > 0;
  //   },
  //   showAddBtn () {
  //     return (this.showOrgTree && Object.keys(this.nodeData).length > 0) || !this.showOrgTree;
  //   }
  // },
  data () {
    return {
      tableConfig,
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      totalSize: 0,
      filterParams: {
        name: ''
      },
      nodeData: {}
    };
  },
  methods: {
    getList () {
      this.$ajax.post({
        apiKey: 'labelPageList',
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          ...this.filterParams
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
        item: {},
        confirmFn: this.getList
      });
    },
    editItem (item) {
      this.$refs.editModal.show({ type: 'edit', item, confirmFn: this.getList });
    },
    delClick (item) {
        this.$refs.confirmModal.show({
            title: '警告',
            content: `是否删除 ${item.labelName}`,
            confirm: () => {
            this.delItem(item);
            }
        });
    },
    delItem (item) {
      this.$ajax.get({
        apiKey: 'labelDelete',
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
    if (!this.showOrgTree) {
      this.getList();
    }
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
