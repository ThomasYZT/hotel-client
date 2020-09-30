<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '添加房间' : '编辑房间'"
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
                  :label-width="80"
                  label-position="left">
            <div class="form-item-wrapper">
              <FormItem label="房间号" prop="roomNumber">
                <i-input type="text" placeholder="房间号" v-model="formData.roomNumber" />
              </FormItem>
              <FormItem label="房间类型" prop="roomTypeId">
                <i-input type="text" placeholder="房间类型" v-model="formData.roomTypeId" />
              </FormItem>
              <FormItem label="楼层" prop="floorId">
                <i-input type="text" placeholder="楼层" v-model="formData.floorId" />
              </FormItem>
              <FormItem label="分机号" prop="phoneExt">
                <i-input type="text" placeholder="分机号" v-model="formData.phoneExt" />
              </FormItem>
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
.dialog-wrapper {
  @include flex_layout(row, center, center);
  .form-wrapper {
    width: 70%;
  }
}

</style>
