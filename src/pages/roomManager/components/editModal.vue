<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '添加房间信息' : '编辑房间信息'"
               :visible.sync="visible"
               width="50%"
               custom-class="form-dialog"
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
                <FormItem class="form-item-block" label="房间号" prop="roomNumber">
                  <i-input type="text" placeholder="房间号" v-model.trim="formData.roomNumber" />
                </FormItem>
                <FormItem class="form-item-block" label="房间类型" prop="roomTypeId">
                  <i-input type="text" placeholder="房间类型" v-model.trim="formData.roomTypeId" />
                </FormItem>
                <FormItem class="form-item-block" label="楼层" prop="floorId">
                  <i-input type="text" placeholder="楼层" v-model.trim="formData.floorId" />
                </FormItem>
                <FormItem class="form-item-block" label="分机号" prop="phoneExt">
                  <i-input type="text" placeholder="分机号" v-model.trim="formData.phoneExt" />
                </FormItem>
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
    return {
      visible: false,
      isLoading: false,
      type: '',
      editItem: {},
      formData: {
        roomNumber: '',
        roomTypeId: '',
        floorId: '',
        phoneExt: '',
        remark: '',
        isAttribute: 1,
        attributeList: []
      },
      confirmFn: null,
      cancelFn: null,
      formRule: {
        roomNumber: [
          { required: true, message: '请输入房间号', trigger: 'blur' }
        ],
        roomTypeId: [
          { required: true, message: '请选择房间类型', trigger: 'blur' }
        ],
        floorId: [
          { required: true, message: '请选择楼层', trigger: 'blur' }
        ],
        phoneExt: [
          { required: true, message: '请输入分机号', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show ({ type = '', item, confirmFn, cancelFn }) {
      if (!type || (type === 'edit' && !item)) return;
      this.formData = defaultsDeep({}, item, this.formData);
      this.$util.valueToStr(this.formData);
      this.formData.attributeList.push({
        attributeValue: '12',
        dictionaryId: '12',
        roomId: item.id
      });

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
        apiKey: this.type === 'add' ? 'roomAdd' : 'roomUpdate',
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
        roomNumber: '',
        roomTypeId: '',
        floorId: '',
        isAttribute: 1,
        attributeList: []
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
