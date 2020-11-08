<template>
  <div class="modal-wrapper">
    <el-dialog :title="workStatus === workStatusMap.workOff ? '上班' : '下班'"
               :visible.sync="visible"
               width="30%"
               custom-class="form-dialog"
               @close="cancel"
               :close-on-click-modal="false"
               center>
      <div class="dialog-wrapper">
        <div class="form-wrapper">
          <i-form ref="Form"
                  :disabled="isLoading"
                  :model="formData"
                  :rules="formRule"
                  :label-width="100"
                  label-position="left">
            <div class="form-item-wrapper">
              <FormItem v-if="workStatus === workStatusMap.workOff" label="上班金额" prop="startMoney">
                <i-input type="text" placeholder="上班金额" v-model="formData.startMoney" />
              </FormItem>
              <FormItem v-if="workStatus === workStatusMap.workOn" label="下班金额" prop="endMoney">
                <i-input type="text" placeholder="下班金额" v-model="formData.endMoney" />
              </FormItem>
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
import { workStatusMap } from '../../../assets/enums';
import { mapGetters, mapActions } from 'vuex';
export default {
  computed: {
    ...mapGetters([
      'userInfo',
      'workStatus'
    ])
  },
  data () {
    const validateMoney = (rule, value, callback) => {
      if (!value) callback();
      this.$validator.validateMoney(value).then(() => {
        callback();
      }).catch(err => {
        callback(err);
      });
    };
    return {
      workStatusMap,
      visible: false,
      isLoading: false,
      formData: {},
      formRule: {
        endMoney: [
          { required: true, message: '请输入下班金额', trigger: 'blur' },
          { validator: validateMoney, trigger: 'blur' }
        ],
        startMoney: [
          { required: true, message: '请输入上班金额', trigger: 'blur' },
          { validator: validateMoney, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    ...mapActions([
      'updateWorkStatus'
    ]),
    show () {
      this.formData.hotelUserId = this.userInfo.id;
      this.visible = true;
    },
    cancel () {
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
      const formData = {...this.formData};
      if (this.formData.endMoney) {
        formData.endMoney = this.$util.toCent(this.formData.endMoney);
      }

      if (this.formData.startMoney) {
        formData.startMoney = this.$util.toCent(this.formData.startMoney);
      }
      this.$ajax.post({
        apiKey: this.workStatus === workStatusMap.workOff ? 'workStart' : 'workEnd',
        params: formData,
        loading: false
      }).then(() => {
        this.$message.success('提交成功');
        this.confirmFn && this.confirmFn();
        this.updateWorkStatus(
          this.workStatus === workStatusMap.workOff
            ? workStatusMap.workOn
            : workStatusMap.workOff
        );
        this.reset();
      }).catch(res => {
        this.$message.error(`提交失败${res.msg ? ': ' + res.msg : ''}`);
      });
    },
    reset () {
      this.$refs.Form.resetFields();
      this.formData = {};
      this.visible = false;
      this.isLoading = false;
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
    }
  }

</style>
