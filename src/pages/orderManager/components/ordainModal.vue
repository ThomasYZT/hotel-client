<template>
  <div class="modal-wrapper">
    <el-dialog title="酒店预定"
               :visible.sync="visible"
               :close-on-click-modal="false"
               width="65%"
               custom-class="form-dialog"
               @close="cancel"
               center>
      <div class="dialog-wrapper">
        <div class="form-wrapper">
          <i-form ref="Form"
                  inline
                  :disabled="isLoading || isComplete"
                  :model="formData"
                  :rules="formRule"
                  :label-width="150"
                  label-position="right">
            <div class="form-item-wrapper">
              <div class="form-item-block">
                <FormItem class="inline-form-item" label="预定方式" prop="orderType">
                  <i-select v-model="formData.orderType"
                            placeholder="请选择"
                            :disabled="true">
                    <i-option v-for="item in orderTypeList"
                              :value="item.value"
                              :key="item.value">
                      {{ item.label }}
                    </i-option>
                  </i-select>
                </FormItem>
                <FormItem class="inline-form-item" label="联系电话" prop="mobile">
                  <i-input type="text" placeholder="联系电话" v-model.trim="formData.mobile" />
                </FormItem>
                <FormItem class="inline-form-item" label="客户姓名" prop="customer">
                  <i-input type="text" placeholder="客户姓名" v-model.trim="formData.customer" />
                </FormItem>
                <FormItem class="inline-form-item" label="预计住店开始时间" prop="startTime">
                  <i-date-picker v-model="formData.startTime"
                                 :editable="false"
                                 :options="dateOptions"
                                 transfer
                                 type="datetime"
                                 format="yyyy-MM-dd"
                                 style="width: 100%;"
                                 placeholder="预计住店开始时间"></i-date-picker>
                </FormItem>
                <FormItem class="inline-form-item" label="预计住店结束时间" prop="endTime">
                  <i-date-picker v-model="formData.endTime"
                                 :editable="false"
                                 :options="dateOptions"
                                 transfer
                                 type="datetime"
                                 format="yyyy-MM-dd"
                                 style="width: 100%;"
                                 placeholder="预计住店结束时间"></i-date-picker>
                </FormItem>
                <FormItem class="block-form-item" label="备注" prop="remark">
                  <i-input type="textarea" :autosize="{minRows: 2,maxRows: 2}" placeholder="备注" v-model.trim="formData.remark" />
                </FormItem>
                <div v-if="!isComplete" class="form-item-block table-block">
                  <i-button type="primary" style="margin-bottom: 10px" @click="addItem">添加</i-button>
                  <table-com :data="formData.orderRoomVos"
                             :has-page="false"
                             :config="tableConfig">
                    <template slot="col0"
                              slot-scope="{ item }">
                      <el-table-column :prop="item.prop"
                                       :label="item.label">
                        <template slot-scope="{ row, $index }">
                          <FormItem :label-width="0"
                                    :prop="'orderRoomVos.' + $index + '.type'">
                            <i-select v-model="row.type"
                                      transfer
                                      placeholder="类型">
                              <i-option v-for="item in ordainRoomTypeList"
                                        :value="item.value"
                                        :key="item.value">
                                {{ item.label }}
                              </i-option>
                            </i-select>
                          </FormItem>
                        </template>
                      </el-table-column>
                    </template>
                    <template slot="col1"
                              slot-scope="{ item }">
                      <el-table-column :prop="item.prop"
                                       :label="item.label">
                        <template slot-scope="{ row, $index }">
                          <FormItem :label-width="0"
                                    :prop="'orderRoomVos.' + $index + '.roomType'">
                            <i-select v-model="row.roomTypeId"
                                      transfer
                                      placeholder="房间类型"
                                      @on-change="roomTypeChange($event, $index)">
                              <i-option v-for="item in roomTypeList"
                                        :value="item.id"
                                        :key="item.id">
                                {{ item.typeName }}
                              </i-option>
                            </i-select>
                          </FormItem>
                        </template>
                      </el-table-column>
                    </template>
                    <template slot="col2"
                              slot-scope="{ item }">
                      <el-table-column :prop="item.prop"
                                       :label="item.label">
                        <template slot-scope="{ row, $index }">
                          <FormItem :label-width="0"
                                    :prop="'orderRoomVos.' + $index + '.roomNumber'">
                            <i-select v-if="!isRoomListSelect"
                                      v-model="row.roomId"
                                      transfer
                                      placeholder="房号"
                                      @on-change="roomIdChange($event, $index)">
                              <i-option v-for="item in roomListMap[row.roomTypeId] || []"
                                        :value="item.id"
                                        :key="item.id">
                                {{ item.roomNumber }}
                              </i-option>
                            </i-select>
                          </FormItem>
                        </template>
                      </el-table-column>
                    </template>
                    <template slot="col3"
                              slot-scope="{ item }">
                      <el-table-column :prop="item.prop"
                                       :label="item.label">
                        <template slot-scope="{ row, $index }">
                          <FormItem :label-width="0"
                                    :prop="'orderRoomVos.' + $index + '.num'">
                            <i-input type="text" placeholder="入住人数" v-model.trim="row.num" />
                          </FormItem>
                        </template>
                      </el-table-column>
                    </template>
                    <template slot="col4"
                              slot-scope="{ item }">
                      <el-table-column :prop="item.prop"
                                       :label="item.label">
                        <template slot-scope="{ row, $index }">
                          <FormItem :label-width="0"
                                    :prop="'orderRoomVos.' + $index + '.price'">
                            <i-input type="text" placeholder="房价" v-model.trim="row.price" />
                          </FormItem>
                        </template>
                      </el-table-column>
                    </template>
                    <template slot="col5"
                              slot-scope="{ item }">
                      <el-table-column :prop="item.prop"
                                       :label="item.label">
                        <template slot-scope="{ row, $index }">
                          <FormItem :label-width="0"
                                    :prop="'orderRoomVos.' + $index + '.cashPledge'">
                            <i-input type="text" placeholder="押金" v-model.trim="row.cashPledge" />
                          </FormItem>
                        </template>
                      </el-table-column>
                    </template>
                  </table-com>
                </div>
                <div v-else class="form-item-block">
                  <div class="result-block" v-for="result in orderResult" :key="result.orderCode">
                    <div><span>订单编号：</span><span>{{result.orderCode}}</span></div>
                    <div><span>房间类型：</span><span>{{result.roomType}}</span></div>
                    <div><span>房间号：</span><span>{{result.roomNumber}}</span></div>
                    <div><span>预定状态：</span><span :class="[result.status === 1 ? 'success' : 'error']">{{result.msg}}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </i-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <i-button v-if="!isComplete" style="margin-right: 10px" type="primary" @click="confirm">确 定</i-button>
        <i-button v-else style="margin-right: 10px" type="primary" @click="checkin">登记入住</i-button>
        <i-button @click="cancel">取 消</i-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { orderTypeList, ordainRoomTypeList } from '../../../assets/enums';
import { tableConfig } from './tableConfig';
import defaultsDeep from 'lodash/defaultsDeep';
import { mapGetters, mapActions } from 'vuex';
export default {
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  data (vm) {
    const validatePhoneNum = (rule, value, callback) => {
      if (!value) callback();
      if (this.$validator.isMobile(value) || this.$validator.isTelephone(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的联系电话'));
      }
    };

    const dateCompare = (rule, value, callback) => {
      if (vm.formData.startTime && vm.formData.endTime) {
        if (vm.formData.startTime <= vm.formData.endTime) {
          callback();
        } else {
          callback(new Error('结束日期必须大于开始日日期'));
        }
      } else {
        callback();
      }
    };
    return {
      tableConfig,
      orderTypeList,
      ordainRoomTypeList,
      visible: false,
      isLoading: false,
      isComplete: false,
      isRoomListSelect: false,
      roomTypeList: [],
      roomList: [],
      roomListMap: {},
      item: {},
      orderResult: [],
      formData: {
        userId: 0,
        startTime: new Date(),
        endTime: new Date(this.$date().add(1, 'day')),
        orderRoomVos: [{}]
      },
      dateOptions: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      confirmFn: null,
      cancelFn: null,
      formRule: {
        orderType: [
          { required: true, type: 'number', message: '请选择预定方式', trigger: 'blur' }
        ],
        startTime: [
          { required: true, type: 'date', message: '请选择预计住店开始时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, type: 'date', message: '请选择预计住店结束时间', trigger: ['change', 'blur'] },
          { validator: dateCompare, trigger: 'blur' }
        ],
        type: [
          { required: true, type: 'number', message: '请选择类型', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: validatePhoneNum, trigger: 'blur' }
        ],
        customer: [
          { required: true, message: '请输入客户姓名', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    ...mapActions([
      'getAllRoom',
      'getAllRoomType'
    ]),
    show ({ item, activeRoom = {}, confirmFn, cancelFn }) {
      if (!item) return;
      this.getAllRoomType(item.hotelId).then(roomTypeList => {
        this.getAllRoom({
          hotelId: item.hotelId,
          status: 0
        }).then(roomList => {
          this.roomList = roomList || [];
          this.roomTypeList = roomTypeList || [];
          this.item = item;

          if (activeRoom && Object.keys(activeRoom).length > 0) {
            this.roomTypeChange(activeRoom.roomTypeId, 0);
            this.roomIdChange(activeRoom.id, 0);
          }

          this.formData = defaultsDeep({}, item, this.formData);

          if (confirmFn) {
            this.confirmFn = confirmFn;
          }

          if (cancelFn) {
            this.cancelFn = cancelFn;
          }
          this.visible = true;
        }).catch(err => {
          this.reset();
          this.$message.error(`获取房间列表失败${err.msg ? ': ' + err.msg : ''}`);
        });
      }).catch(err => {
        this.reset();
        this.$message.error(`获取房间类型失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    cancel () {
      this.cancelFn && this.cancelFn();
      this.reset();
    },
    confirm () {
      this.$refs.Form.validate(valid => {
        if (valid) {
          this.submitForm();
        }
      });
    },
    submitForm () {
      this.isLoading = true;
      const formData = defaultsDeep({}, this.formData);
      formData.startTime = this.$date(this.formData.startTime).format('YYYY-MM-DD');
      formData.endTime = this.$date(this.formData.endTime).format('YYYY-MM-DD');
      formData.orderRoomVos.forEach(item => {
        item.price = this.$util.toCent(item.price);
        item.cashPledge = this.$util.toCent(item.cashPledge);
      });
      this.$ajax.post({
        apiKey: 'orderSubmit',
        params: formData,
        loading: false,
        config: {
          headers: { 'Content-Type': 'application/json;charset-UTF-8' }
        }
      }).then(res => {
        this.$message.success('预定成功');
        this.confirmFn && this.confirmFn();
        this.orderResult = res;
        this.isComplete = true;
      }).catch(err => {
        this.isLoading = false;
        this.$message.error(`预定失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    checkin () {
      this.$emit('checkin', this.formData.mobile);
      this.reset();
    },
    addItem () {
      this.formData.orderRoomVos.push({});
    },
    roomTypeChange (roomTypeId, $index) {
      if (roomTypeId === null || roomTypeId === undefined) return;
      this.roomListMap[roomTypeId] = this.roomList.filter(item => item.roomTypeId === roomTypeId);
      this.resetRoomListSelect();
      Object.assign(this.formData.orderRoomVos[$index] = {}, this.getRoomTypeParams(roomTypeId));
    },
    roomIdChange (roomId, $index) {
      if (roomId === null || roomId === undefined) return;
      Object.assign(this.formData.orderRoomVos[$index], this.getRoomParams(roomId));
    },
    getRoomTypeParams (roomTypeId) {
      const roomTypeItem = this.roomTypeList.find(item => item.id === roomTypeId);
      return {
        roomType: roomTypeItem.typeName,
        roomTypeId: roomTypeItem.id,
        num: roomTypeItem.num,
        price: this.$util.toYuan(roomTypeItem.price),
        cashPledge: this.$util.toYuan(roomTypeItem.cashPledge)
      };
    },
    getRoomParams (roomId) {
      const roomItem = this.roomList.find(item => item.id === roomId);
      return {
        roomId: roomItem.id,
        roomNumber: roomItem.roomNumber
      };
    },
    resetRoomListSelect () {
      this.isRoomListSelect = true;
      this.$nextTick(() => {
        this.isRoomListSelect = false;
      });
    },
    reset () {
      this.$refs.Form.resetFields();
      this.formData = {
        userId: 0,
        orderRoomVos: [{}]
      };
      this.roomTypeList = [];
      this.roomList = [];
      this.roomListMap = {};
      this.item = {};
      this.orderResult = [];
      this.confirmFn = null;
      this.cancelFn = null;
      this.isComplete = false;
      this.visible = false;
      this.isLoading = false;
    }
  }
};
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/scss/base";
  /deep/ .el-dialog__body {
    padding: 25px 0 30px;
    overflow-y: auto;
  }
  .dialog-wrapper {
    @include flex_layout(row, center, flex-start);
    padding: 0 25px 0;
    max-height: 450px;
    .form-wrapper {
      width: 100%;

      .form-item-wrapper {

        .form-item-block {
          margin-right: 20px;
          font-size: 13px;
          color: #333333;

          .form-item-block-title {
            font-size: 16px;
            margin-bottom: 10px;
          }

          .result-block {
            width: 50%;
            display: inline-block;
            padding: 20px 50px;

            .success {
              color: $normalGreen;
            }

            .error {
              color: red;
            }
          }

          &:last-child {
            margin: 0;
          }
        }
      }

      .table-block {
        height: 150px;
        /deep/ .ivu-form-item {
          width: 100%;
        }
      }
    }
  }

</style>
