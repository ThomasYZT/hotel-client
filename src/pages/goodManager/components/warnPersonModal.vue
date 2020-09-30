<template>
  <div class="modal-wrapper">
    <el-dialog title="预警接收人管理"
               :visible.sync="visible"
               width="40%"
               center
               @close="reset">
      <div class="dialog-wrapper">
        <i-transfer :data="warnPeopleList"
                    :titles="titles"
                    :target-keys="targetKeys"
                    :render-format="render"
                    @on-change="transferChange"></i-transfer>
      </div>
      <span slot="footer" class="dialog-footer">
        <i-button class="dialog-cancel-btn" @click="cancel">取 消</i-button>
        <i-button class="dialog-confirm-btn" type="primary" @click="confirm">确 定</i-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { userType } from '../../../assets/enums';
export default {
  data () {
    return {
      visible: false,
      isLoading: false,
      confirmFn: null,
      cancelFn: null,
      item: {},
      titles: ['酒店全部用户', '预警接收人'],
      warnPeopleList: [],
      targetKeys: []
    };
  },
  methods: {
    show ({ item, confirmFn, cancelFn }) {
      this.item = item;
      Promise.all([
        this.getWarnListByHotelId(item),
        this.getAllUser(item)
      ]).then(() => {
        if (confirmFn) {
          this.confirmFn = confirmFn;
        }

        if (cancelFn) {
          this.cancelFn = cancelFn;
        }
        this.visible = true;
      });
    },
    getAllUser (item) {
      return new Promise((resolve, reject) => {
        this.$ajax.get({
          apiKey: 'userPageList',
          params: {
            pageNum: 1,
            pageSize: 100000,
            type: userType.hotel,
            typeId: item.hotelId
          }
        }).then(data => {
          this.warnPeopleList = data.data.map(item => {
            return {
              ...item,
              label: item.name,
              key: item.id
            };
          });
          resolve(data);
        }).catch(err => {
          this.$message.error('获取全部用户失败');
          reject(err);
        });
      });
    },
    getWarnListByHotelId (item) {
      return new Promise((resolve, reject) => {
        this.$ajax.get({
          apiKey: 'goodWarnGetByHotelId',
          params: {
            hotelId: item.hotelId
          }
        }).then(data => {
          this.targetKeys = data.map(item => item.userId);
          resolve(data);
        }).catch(err => {
          this.$message.error('获取预警接收人列表失败');
          reject(err);
        });
      });
    },
    cancel () {
      this.cancelFn && this.cancelFn();
      this.reset();
    },
    confirm () {
      this.$ajax.post({
        apiKey: 'goodWarnAdd',
        params: {
          hotelId: this.item.hotelId,
          userIds: this.targetKeys
        },
        config: {
          headers: { 'Content-Type': 'application/json;charset-UTF-8' }
        }
      }).then(() => {
        this.$message.success('设置成功');
        this.reset();
      }).catch(err => {
        this.$message.error(`设置失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    render (item) {
      return item.name;
    },
    transferChange (newTargetKeys) {
      this.targetKeys = newTargetKeys;
    },
    reset () {
      this.confirmFn = null;
      this.cancelFn = null;
      this.isLoading = false;
      this.item = {};
      this.warnPeopleList = [];
      this.targetKeys = [];
      this.visible = false;
    }
  }
};
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/scss/base";
  .dialog-wrapper {
    @include flex_layout(row, center, flex-start);
    max-height: 300px;
    overflow-y: auto;
    .form-wrapper {
      width: 70%;
    }
  }

</style>
