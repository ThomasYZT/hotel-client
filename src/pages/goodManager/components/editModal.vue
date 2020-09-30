<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '添加商品' : '编辑商品'"
               :visible.sync="visible"
               width="40%"
               center
               @close="reset">
      <div class="dialog-wrapper">
        <div class="form-wrapper">
          <i-form ref="Form"
                  :disabled="isLoading"
                  :model="formData"
                  :rules="formRule"
                  :label-width="120"
                  label-position="left">
            <div class="form-item-wrapper">
              <FormItem label="商品名称" prop="name">
                <i-input type="text" placeholder="商品名称" v-model="formData.name" />
              </FormItem>
              <FormItem label="商品代码" prop="code">
                <i-input type="text" placeholder="商品代码" v-model="formData.code" />
              </FormItem>
              <FormItem label="商品数量" prop="number">
                <i-input type="text" placeholder="商品数量" v-model="formData.number" />
              </FormItem>
              <FormItem label="单价" prop="unitPrice">
                <i-input type="text" placeholder="单价" v-model="formData.unitPrice" />
              </FormItem>
              <FormItem label="单位" prop="unit">
                <i-input type="text" placeholder="单位" v-model="formData.unit" />
              </FormItem>
              <FormItem label="库存预警数量" prop="warnCount">
                <i-input type="text" placeholder="库存预警数量" v-model="formData.warnCount" />
              </FormItem>
              <FormItem label="商品状态" prop="status">
                <i-switch size="large" :true-value="'1'" :false-value="'0'" v-model="formData.status">
                  <span slot="open">下架</span>
                  <span slot="close">上架</span>
                </i-switch>
              </FormItem>
              <!--<FormItem label="图片" prop="attributeList">
                <img-uploader></img-uploader>
              </FormItem>-->
              <FormItem label="描述" prop="remark">
                <i-input type="text" placeholder="描述" v-model="formData.remark" />
              </FormItem>
            </div>
          </i-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <i-button class="dialog-cancel-btn" @click="cancel">取 消</i-button>
        <i-button class="dialog-confirm-btn" type="primary" @click="confirm">确 定</i-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import defaultsDeep from 'lodash/defaultsDeep';
export default {
  data () {
    return {
      visible: false,
      isLoading: false,
      type: '',
      editItem: {},
      formData: {
        name: '',
        code: '',
        number: '',
        unitPrice: '',
        unit: '',
        warnCount: '',
        status: '0',
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
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        unitPrice: [
          { required: true, message: '请选择楼层', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请输入单位', trigger: 'blur' }
        ],
        warnCount: [
          { required: true, message: '请输入库存预警数量', trigger: 'blur' }
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
      this.$util.valueToStr(this.formData);

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
.dialog-wrapper {
  @include flex_layout(row, center, flex-start);
  max-height: 300px;
  overflow-y: auto;
  .form-wrapper {
    width: 70%;
  }
}

</style>
