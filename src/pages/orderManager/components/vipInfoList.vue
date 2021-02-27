<template>
  <div class="modal-wrapper">
    <el-dialog title="会员列表"
               :visible.sync="visible"
               :close-on-click-modal="false"
               custom-class="form-dialog"
               width="70%"
               center
               @close="cancel">
      <div class="dialog-wrapper">
        <div class="data-box">
          <div class="operation-wrapper flex-box">
            <div class="filter-block right-box">
              <div class="filter-item">
                <div class="filter-label">姓名：</div>
                <i-input v-model="filterParams.name" placeholder="姓名模糊查询" clearable @on-clear="getList" search @on-search="getList"></i-input>
              </div>
              <div class="filter-item">
                <div class="filter-label">身份证号：</div>
                <i-input v-model="filterParams.idCard" placeholder="身份证号查询" clearable @on-clear="getList" search @on-search="getList"></i-input>
              </div>
              <div class="filter-item">
                <div class="filter-label">手机号码：</div>
                <i-input v-model="filterParams.phone" placeholder="手机号码模糊查询" clearable @on-clear="getList" search @on-search="getList"></i-input>
              </div>
              <i-button class="short-width-btn" shape="circle" type="primary" @click="getList">查询</i-button>
            </div>
          </div>
          <table-com :data="tableData"
                     :page-num.sync="pageNum"
                     :page-size.sync="pageSize"
                     :total-size="totalSize"
                     :config="vipListConfig"
                     :getList="getList">
            <template slot="col2"
                      slot-scope="{ item }">
              <el-table-column :prop="item.prop"
                               :label="item.label"
                               :fixed="item.fixed"
                               :min-width="item.minWidth">
                <template slot-scope="{ row }">
                  <span v-if="row.sex === 1">男</span>
                  <span v-else-if="row.sex === 2">女</span>
                  <span v-else>未知</span>
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
                  <div class="operate-block">
                    <i-button type="primary" class="table-btn" size="small" @click="showTopUp(row)">充 值</i-button>
                  </div>
                </template>
              </el-table-column>
            </template>
          </table-com>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <i-button style="margin-right: 10px" type="primary" @click="confirm">确 定</i-button>
        <i-button @click="cancel">取 消</i-button>
      </span>
    </el-dialog>
    <confirmModal ref="confirmModal"></confirmModal>
    <vipTopUp ref="vipTopUp"></vipTopUp>
  </div>
</template>

<script>
import { vipListConfig } from './tableConfig';
import vipTopUp from './vipTopUp';
export default {
  components: {
    vipTopUp
  },
  data () {
    return {
      vipListConfig,
      tableData: [],
      brandId: '',
      hotelId: '',
      pageNum: 1,
      pageSize: 10,
      totalSize: 0,
      filterParams: {
        name: '',
        phone: '',
        idCard: ''
      },
      visible: false,
      confirmFn: null,
      cancelFn: null
    };
  },
  methods: {
    show ({ brandId, hotelId, confirmFn, cancelFn }) {
      if (brandId === undefined || brandId === null) return;
      if (confirmFn) {
        this.confirmFn = confirmFn;
      }

      if (cancelFn) {
        this.cancelFn = cancelFn;
      }
      this.brandId = brandId;
      this.hotelId = hotelId;
      this.visible = true;
      this.getList();
    },
    cancel () {
      this.cancelFn && this.cancelFn();
      this.reset();
    },
    confirm () {
      this.confirmFn && this.confirmFn();
      this.reset();
    },
    reset () {
      this.tableData = [];
      this.brandId = '';
      this.hotelId = '';
      this.filterParams = {
            name: '',
            phone: '',
            idCard: ''
      };
      this.visible = false;
      this.confirmFn = null;
      this.cancelFn = null;
    },
    showTopUp(row) {
      this.$refs.vipTopUp.show({
        brandId: this.brandId,
        hotelId: this.hotelId,
        vipInfoId: row.id,
        confirmFn: () => { this.getList(); }
      });
    },
    getList () {
      this.$ajax.post({
        apiKey: 'vipInfoPageList',
        params: {
          brandId: this.brandId,
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
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
.dialog-wrapper {
  height: 400px;

  /deep/ .table-wrapper{
    height: calc(100% - 40px);
  }
}
</style>
