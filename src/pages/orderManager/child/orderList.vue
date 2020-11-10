<template>
  <div class="page-container">
    <div class="page-content">
      <div class="flex-box">
        <div class="left-box">
          <org-tree v-if="showOrgTree" :params="orgParams" @nodeClick="onNodeClick"></org-tree>
        </div>
        <div class="data-box right-box">
          <div class="operation-wrapper flex-box">
            <div class="filter-block right-box">
              <div class="filter-item" style="width: 230px;">
                <div class="filter-label">手机号：</div>
                <i-input v-model="filterParams.mobile" placeholder="手机号查询" clearable @on-clear="getList" search @on-search="getList"></i-input>
              </div>
              <div class="filter-item" style="width: 230px;">
                <div class="filter-label">订单号：</div>
                <i-input v-model="filterParams.code" placeholder="订单号查询" clearable @on-clear="getList" search @on-search="getList"></i-input>
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
            <template slot="col2"
                      slot-scope="{ item }">
              <el-table-column :prop="item.prop"
                               :label="item.label"
                               :fixed="item.fixed"
                               :min-width="item.minWidth">
                <template slot-scope="{ row }">
                  <span>{{roomTypeList.find(item => item.id === row.roomTypeId) ?
                    roomTypeList.find(item => item.id === row.roomTypeId).typeName : ''}}</span>
                </template>
              </el-table-column>
            </template>
            <template slot="col4"
                      slot-scope="{ item }">
              <el-table-column :prop="item.prop"
                               :label="item.label"
                               :fixed="item.fixed"
                               :min-width="item.minWidth">
                <template slot-scope="{ row }">
                  <span>{{orderTypeList.find(item => item.value === row.orderType) ?
                    orderTypeList.find(item => item.value === row.orderType).label : ''}}</span>
                </template>
              </el-table-column>
            </template>
            <template slot="col5"
                      slot-scope="{ item }">
              <el-table-column :prop="item.prop"
                               :label="item.label"
                               :fixed="item.fixed"
                               :min-width="item.minWidth">
                <template slot-scope="{ row }">
                  <span>{{orderStatusList.find(item => item.value === row.status) ?
                    orderStatusList.find(item => item.value === row.status).label : ''}}</span>
                </template>
              </el-table-column>
            </template>
            <template slot="col6"
                      slot-scope="{ item }">
              <el-table-column :prop="item.prop"
                               :label="item.label"
                               :fixed="item.fixed"
                               :min-width="item.minWidth">
                <template slot-scope="{ row }">
                  <span>{{ordainRoomTypeList.find(item => item.value === row.type) ?
                    ordainRoomTypeList.find(item => item.value === row.type).label : ''}}</span>
                </template>
              </el-table-column>
            </template>
            <template slot="col9"
                      slot-scope="{ item }">
              <el-table-column :prop="item.prop"
                               :label="item.label"
                               :fixed="item.fixed"
                               :min-width="item.minWidth">
                <template slot-scope="{ row }">
                  <div class="operate-block">
                    <i-button :disabled="row.status !== orderStatus.unPay" type="primary" class="table-btn" size="small" @click="cancelOrder(row)">取消订单</i-button>
                    <i-button :disabled="![orderStatus.payed, orderStatus.living].includes(row.status)" type="error" class="table-btn" size="small" @click="refundOrder(row)">退款</i-button>
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
import { userType, dictionaryCodeType, orderStatus, orderStatusList, orderTypeList, ordainRoomTypeList } from '../../../assets/enums';
import { mapGetters, mapActions } from 'vuex';
export default {
  components: {
    editModal
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'dictionary'
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
      return !this.showOrgTree || Object.keys(this.nodeData).length > 0;
    },
    showAddBtn () {
      return (this.showOrgTree && Object.keys(this.nodeData).length > 0) || !this.showOrgTree;
    },
    floorList () {
      return this.dictionary[this.userInfo.id]
        ? [{ id: 0, dictName: '全部' }].concat(this.dictionary[this.userInfo.id][dictionaryCodeType.floor])
        : [];
    }
  },
  data () {
    return {
      orderStatus,
      orderStatusList,
      ordainRoomTypeList,
      orderTypeList,
      tableConfig,
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      totalSize: 0,
      filterParams: {
        mobile: '',
        code: ''
      },
      nodeData: {},
      roomTypeList: []
    };
  },
  methods: {
    ...mapActions([
      'getAllRoomType'
    ]),
    onNodeClick ({ data, isDefault }) {
      this.nodeData = data;
      this.getAllRoomType(this.showOrgTree ? this.nodeData.id : this.userInfo.hotelId).then(data => {
        this.roomTypeList = data || [];
      });
      if (!isDefault) {
        this.getList();
      }
    },
    getList () {
      this.$ajax.get({
        apiKey: 'orderPageList',
        params: {
          hotelId: this.showOrgTree ? this.nodeData.id : this.userInfo.hotelId,
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
    cancelOrder (item) {
      this.$refs.confirmModal.show({
        title: '警告',
        content: `是否取消订单 ${item.code}`,
        confirm: () => {
          this.$ajax.post({
            apiKey: 'orderCancel',
            params: {
              code: item.code
            }
          }).then(() => {
            this.getList();
            this.$message.success('取消成功');
          }).catch(err => {
            this.$message.error(`取消失败${err.msg ? ': ' + err.msg : ''}`);
          });
        }
      });
    },
    refundOrder (item) {
      this.$refs.confirmModal.show({
        title: '警告',
        content: `是否退款订单 ${item.code}`,
        confirm: () => {
          this.$ajax.post({
            apiKey: 'orderRefund',
            params: {
              code: item.code
            }
          }).then(() => {
            this.getList();
            this.$message.success('退款成功');
          }).catch(err => {
            this.$message.error(`退款失败${err.msg ? ': ' + err.msg : ''}`);
          });
        }
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
