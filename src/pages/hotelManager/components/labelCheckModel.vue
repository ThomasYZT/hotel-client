<template>
  <div class="modal-wrapper">
    <el-dialog title="选择酒店标签"
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
                <div class="filter-label">标签名称：</div>
                <i-input v-model="filterParams.name" placeholder="标签名称" clearable @on-clear="getList" search @on-search="getList"></i-input>
              </div>
              <i-button class="short-width-btn" shape="circle" type="primary" @click="getList">查询</i-button>
            </div>
          </div>
          <table-com ref="Table"
                     :data="tableData"
                     :has-page="false"
                     :config="labelCheckTableConfig"
                     :getList="getList"
                     @selectChange="onSelectChange">
            <template slot="col0"
                      slot-scope="{ item }">
              <el-table-column type="selection"
                               :min-width="item.minWidth">
              </el-table-column>
            </template>
            <template slot="col2"
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
          </table-com>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <i-button style="margin-right: 10px" type="primary" @click="confirm">确 定</i-button>
        <i-button @click="cancel">取 消</i-button>
      </span>
    </el-dialog>
    <confirmModal ref="confirmModal"></confirmModal>
  </div>
</template>

<script>
import { labelCheckTableConfig } from '../../labelManager/child/tableConfig';
export default {
  data () {
    return {
      labelCheckTableConfig,
      tableData: [],
      checkedList: [],
      filterParams: {
        name: ''
      },
      visible: false,
      confirmFn: null,
      cancelFn: null
    };
  },
  methods: {
    show ({ checkedList = [], confirmFn, cancelFn }) {
      if (confirmFn) {
        this.confirmFn = confirmFn;
      }

      if (cancelFn) {
        this.cancelFn = cancelFn;
      }
      this.checkedList = checkedList;
      this.visible = true;
      this.getList();
    },
    cancel () {
      this.cancelFn && this.cancelFn();
      this.reset();
    },
    confirm () {
      this.confirmFn && this.confirmFn(this.checkedList);
      this.reset();
    },
    reset () {
      this.tableData = [];
      this.filterParams = {
        purpose: '',
        title: ''
      };
      this.visible = false;
      this.confirmFn = null;
      this.cancelFn = null;
    },
    getList () {
      this.$ajax.post({
        apiKey: 'labelPageList',
        params: {
          pageNum: 1,
          pageSize: 99999,
          ...this.filterParams
        }
      }).then(data => {
        this.tableData = data.data || [];
        this.totalSize = data.totalSize || 0;
        this.$refs.Table.toggleRowSelections(this.tableData.filter(row => {
          return !!this.checkedList.find(checked => checked.id === row.id);
        }));
      }).catch(err => {
        this.$message.error(`获取数据失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    onSelectChange (selection) {
      selection.forEach(item => {
        if (!this.checkedList.find(checked => checked.id === item.id)) {
          this.checkedList.push(item);
        }
      });
      console.log(this.checkedList)
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
