<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '新增行李寄存信息' : '编辑行李寄存信息'"
               :visible.sync="visible"
               :close-on-click-modal="false"
               custom-class="form-dialog"
               width="50%"
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
                <FormItem class="block-form-item" label="手机号" prop="phone">
                  <i-input type="text" placeholder="手机号" clearable @on-clear="clear" search @on-search="getByPhone" v-model.trim="formData.phone" />
                </FormItem>
                <FormItem class="inline-form-item" label="寄存类型" prop="consignType">
                  <i-select v-model="formData.consignType"
                            placeholder="请选择">
                    <i-option v-for="item in consignTypeList"
                              :value="item.id"
                              :key="item.id">
                      {{ item.dictName }}
                    </i-option>
                  </i-select>
                </FormItem>
                <FormItem class="inline-form-item" label="姓名" prop="name">
                  <i-input disabled type="text" placeholder="姓名" v-model.trim="formData.name" />
                </FormItem>
                <FormItem class="inline-form-item" label="性别" prop="sex">
                  <i-radio-group v-model="formData.sex">
                    <i-radio v-for="item in genderList"
                             disabled
                             :key="item.value"
                             :label="item.value">{{item.label}}</i-radio>
                  </i-radio-group>
                </FormItem>
                <FormItem class="block-form-item" label="身份证号" prop="idCard">
                  <i-input disabled type="text" placeholder="身份证号" v-model.trim="formData.idCard" />
                </FormItem>
                <FormItem class="block-form-item" label="房号" prop="roomNumber">
                  <i-input type="text" placeholder="房号" clearable v-model.trim="formData.roomNumber" />
                </FormItem>
                <FormItem class="block-form-item" label="描述" prop="remark">
                  <i-input type="textarea" placeholder="描述" v-model="formData.remark" />
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
import { storageStatusList, genderList } from '../../../assets/enums';
export default {
  data () {
    return {
      genderList,
      storageStatusList,
      visible: false,
      isLoading: false,
      type: '',
      formData: {},
      confirmFn: null,
      cancelFn: null,
      formRule: {
        consignType: [
          { required: true, type: 'number', message: '请选择寄存类型', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ],
        vipId: [
          { required: true, message: '请输入会员ID', trigger: 'blur' }
        ]
      },
      consignTypeList: []
    };
  },
  methods: {
    show ({ type = '', item, consignTypeList, confirmFn, cancelFn }) {
      if (!type || (type === 'edit' && !item)) return;
      this.formData = defaultsDeep({}, item, this.formData);
      this.$util.valueToStr(this.formData, ['consignType', 'sex']);
      this.$util.removeProp(this.formData, ['consignTime', 'retrieveTime']);
      this.consignTypeList = consignTypeList;
      if (confirmFn) {
        this.confirmFn = confirmFn;
      }

      if (cancelFn) {
        this.cancelFn = cancelFn;
      }
      this.type = type;
      this.visible = true;
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
        ...this.formData,
        remark: this.formData.remark
      };
      this.$ajax.post({
        apiKey: this.type === 'add' ? 'storageAdd' : 'storageUpdate',
        params: formData,
        loading: false
      }).then(() => {
        this.$message.success(this.type === 'add' ? '添加成功' : '编辑成功');
        this.confirmFn && this.confirmFn();
        this.reset();
      }).catch(err => {
        this.$message.error(`${this.type === 'add' ? '添加' : '编辑'}失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    getByPhone () {
      this.isLoading = true;
      this.$ajax.get({
        apiKey: 'vipGetByPhone',
        params: {
          phone: this.formData.phone
        },
        loading: false
      }).then(data => {
        if (data && Object.keys(data).length > 0) {
          this.formData = defaultsDeep({}, data);
          this.formData.vipId = this.formData.id;
          delete this.formData.id;
        } else {
          this.$message.error(`未查询到该会员信息，请检查手机号码`);
        }
      }).catch(err => {
        this.$message.error(`获取会员信息失败${err.msg ? ': ' + err.msg : ''}`);
      }).finally(() => {
        this.isLoading = false;
      });
    },
    clear () {
      this.formData = {};
    },
    reset () {
      this.$refs.Form.resetFields();
      this.formData = {};
      this.consignTypeList = [];
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
        max-height: 380px;
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
