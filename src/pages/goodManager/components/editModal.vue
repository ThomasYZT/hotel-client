<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '添加商品信息' : '编辑商品信息'"
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
                <FormItem class="inline-form-item" label="商品名称" prop="name">
                  <i-input type="text" placeholder="商品名称" v-model.trim="formData.name" />
                </FormItem>
                <FormItem class="inline-form-item" label="商品代码" prop="code">
                  <i-input type="text" placeholder="商品代码" v-model.trim="formData.code" />
                </FormItem>
                <FormItem class="inline-form-item" label="商品数量" prop="number">
                  <i-input-number style="width: 100%;" type="text" placeholder="商品数量" v-model="formData.number" />
                </FormItem>
                <FormItem class="inline-form-item" label="单价" prop="unitPrice">
                  <i-input type="text" placeholder="单价" v-model.trim="formData.unitPrice" />
                </FormItem>
                <FormItem class="inline-form-item" label="单位" prop="unit">
                  <i-input type="text" placeholder="单位" v-model.trim="formData.unit" />
                </FormItem>
                <FormItem class="inline-form-item" label="库存预警数量" prop="warnCount">
                  <i-input-number style="width: 100%;" type="text" placeholder="库存预警数量" v-model.trim="formData.warnCount" />
                </FormItem>
                <FormItem class="inline-form-item" label="商品状态" prop="status">
                  <i-switch size="large" :true-value="'1'" :false-value="'0'" v-model="formData.status">
                    <span slot="open">下架</span>
                    <span slot="close">上架</span>
                  </i-switch>
                </FormItem>
                <!--<FormItem label="图片" prop="attributeList">
                <img-uploader></img-uploader>
              </FormItem>-->
                <FormItem class="block-form-item" label="描述" prop="remark">
                  <i-input type="textarea" placeholder="描述" v-model.trim="formData.remark" />
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
export default {
  data () {
    const validateNumber = (rule, value, callback) => {
      if (!value) callback();
      if (this.$validator.isNumber(value)) {
        callback();
      } else {
        callback(new Error('请输入数字'));
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
      editItem: {},
      formData: {
        name: '',
        code: '',
        number: 0,
        unitPrice: '',
        unit: '',
        warnCount: 0,
        status: '1',
        remark: ''
      },
      confirmFn: null,
      cancelFn: null,
      formRule: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入商品代码', trigger: 'blur' }
        ],
        number: [
          { required: true, type: 'number', message: '请输入数量', trigger: 'blur' }
        ],
        unitPrice: [
          { required: true, message: '请选择楼层', trigger: 'blur' },
          { validator: validateMoney, trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请输入单位', trigger: 'blur' }
        ],
        warnCount: [
          { required: true, type: 'number', message: '请输入库存预警数量', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择商品状态', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show ({ type = '', item, confirmFn, cancelFn }) {
      if (!type || (type === 'edit' && !item)) return;
      this.formData = defaultsDeep({}, item, this.formData);
      this.$util.valueToStr(this.formData, ['number', 'warnCount']);

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
      this.$ajax.post({
        apiKey: this.type === 'add' ? 'goodAdd' : 'goodUpdate',
        params: this.formData,
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
        name: '',
        code: '',
        number: '',
        unitPrice: '',
        unit: '',
        warnCount: '',
        status: '0',
        remark: ''
      };
      this.confirmFn = null;
      this.cancelFn = null;
      this.visible = false;
      this.isLoading = false;
      this.type = '1';
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
