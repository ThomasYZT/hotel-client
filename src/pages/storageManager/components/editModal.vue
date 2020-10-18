<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '新增行李寄存' : '编辑寄存信息'"
               :visible.sync="visible"
               :close-on-click-modal="false"
               custom-class="form-dialog"
               width="40%"
               @close="cancel"
               center>
      <div class="dialog-wrapper">
        <div class="form-wrapper">
          <i-form ref="Form"
                  :disabled="isLoading"
                  :model="formData"
                  :rules="formRule"
                  :label-width="80"
                  label-position="left">
            <div class="form-item-wrapper">
              <div class="form-item-block">
                <FormItem label="寄存类型" prop="consignType">
                  <i-select v-model="formData.consignType"
                            placeholder="请选择">
                    <i-option v-for="item in consignTypeList"
                              :value="item.id"
                              :key="item.id">
                      {{ item.dictName }}
                    </i-option>
                  </i-select>
                </FormItem>
                <FormItem label="寄存时间" prop="consignTime">
                  <i-date-picker v-model="formData.consignTime"
                                 :editable="false"
                                 transfer
                                 type="datetime"
                                 format="yyyy-MM-dd HH:mm"
                                 placeholder="寄存时间"></i-date-picker>
                </FormItem>
                <FormItem label="取出时间" prop="retrieveTime">
                  <i-date-picker v-model="formData.retrieveTime"
                                 :editable="false"
                                 transfer
                                 type="datetime"
                                 format="yyyy-MM-dd HH:mm"
                                 placeholder="取出时间"></i-date-picker>
                </FormItem>
              </div>
              <div class="form-item-block">
                <FormItem label="状态" prop="status">
                  <i-select v-model="formData.status">
                    <i-option v-for="item in storageStatusList"
                              :value="String(item.value)"
                              :key="item.value">
                      {{ item.name }}
                    </i-option>
                  </i-select>
                </FormItem>
                <FormItem label="会员ID" prop="vipId">
                  <i-input type="text" placeholder="会员ID" v-model.trim="formData.vipId" />
                </FormItem>
                <FormItem label="描述" prop="remark">
                  <i-input type="text" placeholder="描述" v-model.trim="formData.remark" />
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
import { storageStatusList } from '../../../assets/enums';
export default {
  data () {
    return {
      storageStatusList,
      visible: false,
      isLoading: false,
      type: '',
      formData: {
        consignType: '',
        consignTime: '',
        retrieveTime: '',
        status: '',
        vipId: '',
        remark: ''
      },
      confirmFn: null,
      cancelFn: null,
      formRule: {
        consignType: [
          { required: true, type: 'number', message: '请选择寄存类型', trigger: 'blur' }
        ],
        consignTime: [
          { required: true, type: 'date', message: '请选择寄存时间', trigger: 'blur' }
        ],
        retrieveTime: [
          { required: true, type: 'date', message: '请选择取出时间', trigger: 'blur' }
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
      this.$util.valueToStr(this.formData, ['consignType']);
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
        consignTime: this.$date(this.formData.consignTime).format('YYYY-MM-DD HH:mm:ss'),
        retrieveTime: this.$date(this.formData.retrieveTime).format('YYYY-MM-DD HH:mm:ss')
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
    reset () {
      this.$refs.Form.resetFields();
      this.formData = {
        consignType: '',
        consignTime: '',
        retrieveTime: '',
        status: '',
        vipId: '',
        remark: ''
      };
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
.dialog-wrapper {
  @include flex_layout(row, center, flex-start);
  max-height: 350px;
  overflow-y: auto;
  .form-wrapper {
    width: 90%;

    .form-item-wrapper {
      @include flex_layout(row, space-between, flex-start);

      .form-item-block {
        margin-right: 20px;

        &:last-child {
          margin: 0;
        }
      }
    }
  }
}

</style>
