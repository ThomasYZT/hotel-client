<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '添加房间类型' : '编辑房间类型'"
               :visible.sync="visible"
               :close-on-click-modal="false"
               width="50%"
               custom-class="form-dialog"
               @close="cancel"
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
                <FormItem class="block-form-item" label="房间类型名称" prop="typeName">
                  <i-input type="text" placeholder="房间类型名称" v-model.trim="formData.typeName" />
                </FormItem>
                <FormItem class="inline-form-item" label="价格" prop="price">
                  <i-input type="text" placeholder="价格" v-model.trim="formData.price" />
                </FormItem>
                <FormItem class="inline-form-item" label="押金" prop="cashPledge">
                  <i-input type="text" placeholder="押金" v-model.trim="formData.cashPledge" />
                </FormItem>
                <FormItem class="inline-form-item" label="入住人数" prop="num">
                  <i-input type="text" placeholder="入住人数" v-model.trim="formData.num" />
                </FormItem>
                <FormItem class="block-form-item" label="标签" prop="dictionaryId">
                  <i-select v-model="formData.attributeList"
                            multiple
                            transfer
                            placeholder="请选择">
                    <i-option v-for="item in attributeList"
                              :value="item.id"
                              :key="item.id">
                      {{ item.dictName }}
                    </i-option>
                  </i-select>
                </FormItem>
                <FormItem class="block-form-item" label="图片" prop="attachList">
                  <img-uploader v-model="formData.attachList"></img-uploader>
                </FormItem>
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
import { mapActions } from 'vuex';
export default {
  data () {
    const validateMoney = (rule, value, callback) => {
      if (!value) callback();
      this.$validator.validateMoney(value).then(() => {
        callback();
      }).catch(err => {
        callback(err);
      });
    };
    const validateNumber = (rule, value, callback) => {
      if (!value) callback();
      if (this.$validator.isBothNumber(value)) {
        callback();
      } else {
        callback(new Error('请输入数字'));
      }
    };
    return {
      visible: false,
      isLoading: false,
      type: '',
      formData: {
        attachId: 0,
        attachList: []
      },
      attributeList: [],
      confirmFn: null,
      cancelFn: null,
      formRule: {
        typeName: [
          { required: true, message: '请输入房间类型名称', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { validator: validateMoney, trigger: 'blur' }
        ],
        cashPledge: [
          { required: true, message: '请输入押金', trigger: 'blur' },
          { validator: validateMoney, trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入入住人数', trigger: 'blur' },
          { validator: validateNumber, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    ...mapActions([
      'getAttachInfo'
    ]),
    show ({ type = '', item, confirmFn, cancelFn }) {
      if (!type || !item) return;
      // this.formData = defaultsDeep({}, item, this.formData);
      this.$util.valueToStr(this.formData);
      this.type = type;

      Promise.all([
        this.getAttributeList(item.hotelId),
        this.getRoomTypeAttribute(item.id)
      ]).then(([attributeList, attributeInfo]) => {
        this.attributeList = attributeList;
        this.formData = defaultsDeep({}, {
          ...item,
          attributeList: attributeInfo.map(item => item.dictionaryId)
        }, this.formData);

        if (confirmFn) {
          this.confirmFn = confirmFn;
        }

        if (cancelFn) {
          this.cancelFn = cancelFn;
        }
        if (type === 'edit') {
          this.formData.price = this.$util.toYuan(this.formData.price);
          this.formData.cashPledge = this.$util.toYuan(this.formData.cashPledge);
          this.formData.num = item.num;
        }

        if (type === 'add' || (type === 'edit' && !item.attachId)) {
          this.visible = true;
        } else {
          this.getAttachInfo(item.attachId).then(data => {
            this.formData.attachList = data;
            this.visible = true;
          });
        }
        this.visible = true;
      }).catch(() => {
        this.$message.error(`获取数据失败`);
        this.reset();
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
      this.$ajax.post({
        apiKey: this.type === 'add' ? 'roomTypeAdd' : 'roomTypeUpdate',
        params: {
          ...this.formData,
          price: this.$util.toCent(this.formData.price),
          cashPledge: this.$util.toCent(this.formData.cashPledge),
          attributeList: this.formData.attributeList.map(id => ({
            dictionaryId: id
          }))
        },
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
        attachId: 0,
        attachList: []
      };
      this.confirmFn = null;
      this.cancelFn = null;
      this.visible = false;
      this.isLoading = false;
      this.type = '';
    },
    getRoomTypeAttribute (roomTypeId) {
      return new Promise((resolve, reject) => {
        if (this.type === 'add') return resolve([]);
        this.$ajax.get({
          apiKey: 'roomTypeGetRoomTypeAttribute',
          params: {
            roomTypeId: roomTypeId
          },
          loading: false
        }).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },
    getAttributeList (hotelId) {
      return new Promise((resolve, reject) => {
        this.$ajax.get({
          apiKey: 'dicGetByTypeCode',
          params: {
            hotelId: hotelId,
            typeCode: 'FJLXSX'
          },
          loading: false
        }).then(data => {
          resolve(data || []);
        }).catch(err => {
          reject(err);
        });
      });
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
