<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '添加协议客户' : '编辑协议客户'"
               :visible.sync="visible"
               width="50%"
               custom-class="form-dialog"
               @close="cancel"
               :close-on-click-modal="false"
               center>
      <div class="dialog-wrapper">
        <div class="form-wrapper">
          <i-form ref="Form"
                  inline
                  :disabled="isLoading"
                  :model="formData"
                  :rules="formRule"
                  :label-width="120"
                  label-position="right">
            <div class="form-item-wrapper">
              <div class="form-item-block">
                <FormItem class="block-form-item" label="公司名称" prop="companyName">
                  <i-input type="text" placeholder="公司名称" v-model.trim="formData.companyName" />
                </FormItem>
                <FormItem class="inline-form-item" label="联系人" prop="name">
                  <i-input type="text" placeholder="联系人" v-model.trim="formData.name" />
                </FormItem>
                <FormItem class="inline-form-item" label="联系电话" prop="phone">
                  <i-input type="text" placeholder="联系电话" v-model.trim="formData.phone" />
                </FormItem>
                <!--<FormItem label="签订时间" prop="signedTime">
                  <i-date-picker v-model="formData.signedTime"
                                 :editable="false"
                                 transfer
                                 type="datetime"
                                 format="yyyy-MM-dd HH:mm"
                                 placeholder="签订时间"></i-date-picker>

                </FormItem>-->
                <FormItem class="block-form-item" label="备注" prop="remark">
                  <i-input type="textarea" placeholder="备注" v-model.trim="formData.remark" />
                </FormItem>
                <FormItem class="block-form-item" label="" prop="remark">
                  <file-uploader></file-uploader>
                </FormItem>
              </div>
              <div class="form-item-block">
                <table-com :data="formData.priceList"
                           :has-page="false"
                           :config="tableConfig">
                  <template slot="col2"
                            slot-scope="{ item }">
                    <el-table-column :prop="item.prop"
                                     :label="item.label"
                                     :fixed="item.fixed"
                                     :min-width="item.minWidth">
                      <template slot-scope="{ row, $index }">
                        <FormItem :label-width="0"
                                  :prop="'priceList.' + $index + '.discountPrice'"
                                  :rules="discountPriceRule">
                          <i-input type="text" placeholder="折扣价格" v-model="row.discountPrice"></i-input>
                        </FormItem>
                      </template>
                    </el-table-column>
                  </template>
                </table-com>
              </div>
            </div>
          </i-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <i-button style="margin-right: 10px" type="primary" @click="confirm">确 定</i-button>
        <i-button @click="cancel">取 消</i-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import defaultsDeep from 'lodash/defaultsDeep';
export default {
  data () {
    const validatePhoneNum = (rule, value, callback) => {
      if (!value) callback();
      if (this.$validator.isMobile(value) || this.$validator.isTelephone(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的联系电话'));
      }
    };
    const validateMoney = (rule, value, callback) => {
      if (!value) callback();
      this.$validator.validateMoney(value).then(() => {
        callback();
      }).catch(err => {
        callback(err);
      });
    };
    return {
      visible: false,
      isLoading: false,
      type: '',
      formData: {
        companyName: '',
        name: '',
        phone: '',
        remark: '',
        priceList: ''
      },
      confirmFn: null,
      cancelFn: null,
      formRule: {
        companyName: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: validatePhoneNum, trigger: 'blur' }
        ]
      },
      discountPriceRule: [
        { required: true, message: `请输入折扣价格`, trigger: 'blur' },
        { validator: validateMoney, trigger: 'blur' }
      ],
      tableConfig: [
        {
          prop: 'typeName',
          label: '房间类型名称'
        },
        {
          prop: 'originalPrice',
          label: '原始价格'
        },
        {
          prop: 'discountPrice',
          label: '折扣价格'
        }
      ]
    };
  },
  methods: {
    show ({ type = '', item, confirmFn, cancelFn }) {
      if (!type || !item) return;
      this.type = type;
      if (confirmFn) {
        this.confirmFn = confirmFn;
      }
      if (cancelFn) {
        this.cancelFn = cancelFn;
      }
      this.formData = defaultsDeep({}, item, this.formData);
      if (type === 'add') {
        this.getAllRoomType(item).then((data) => {
          this.formData.priceList = data.map(item => {
            return {
              ...item,
              originalPrice: String(item.price),
              discountPrice: String(item.price)
            };
          });
          this.visible = true;
        }).catch(err => {
          this.$message.error(`获取所有房间类型失败${err.msg ? ': ' + err.msg : ''}`);
          this.reset();
        });
      } else {
        this.getAgreementPrice(item).then(data => {
          this.formData.priceList = data.map(item => {
            return {
              ...item,
              discountPrice: String(item.discountPrice)
            };
          });
          this.visible = true;
        }).catch(() => {
          this.$message.error('获取协议价格失败');
          this.reset();
        });
      }
    },
    getAllRoomType (item) {
      return new Promise((resolve, reject) => {
        this.$ajax.get({
          apiKey: 'roomTypeGetAllList',
          params: {
            hotelId: item.hotelId
          }
        }).then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },
    getAgreementPrice (item) {
      return new Promise((resolve, reject) => {
        this.$ajax.get({
          apiKey: 'agreementPriceGet',
          params: {
            agreementId: item.id
          }
        }).then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
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
      const formData = {
        ...this.formData
      };
      this.$ajax.post({
        apiKey: this.type === 'add' ? 'agreementAdd' : 'agreementUpdate',
        params: formData,
        loading: false,
        config: {
          headers: { 'Content-Type': 'application/json;charset-UTF-8' }
        }
      }).then(() => {
        this.$message.success(this.type === 'add' ? '添加成功' : '编辑成功');
        this.confirmFn && this.confirmFn();
        this.reset();
      }).catch(err => {
        this.$message.error(`${this.type === 'add' ? '添加' : '编辑'}失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    reset () {
      this.$refs.Form.resetFields();
      this.formData = {
        agentName: '',
        contactName: '',
        phone: '',
        area: [],
        address: '',
        email: '',
        appId: '',
        secret: '',
        mchId: '',
        companyKey: '',
        remark: ''
      };
      this.confirmFn = null;
      this.cancelFn = null;
      this.visible = false;
      this.isLoading = false;
      this.type = '';
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
/deep/ .el-dialog__body {
  padding: 25px 0 30px;
}
.dialog-wrapper {
  @include flex_layout(row, center, flex-start);
  padding: 0 25px 0;
  .form-wrapper {
    width: 100%;

    .form-item-wrapper {

      .form-item-block {
        margin-right: 20px;
        max-height: 350px;
        overflow-y: auto;
        font-size: 13px;
        color: #333333;

        .form-item-block-title {
          font-size: 16px;
          margin-bottom: 10px;
        }

        &:last-child {
          margin: 0;
        }
      }
    }
  }
}

</style>
