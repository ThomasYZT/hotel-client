<template>
  <div class="modal-wrapper">
    <el-dialog title="增加房客"
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
                  :label-width="100"
                  label-position="right">
            <div class="form-item-wrapper">
              <div class="form-item-block">
                <div class="form-item-block table-block">
                  <i-button type="primary" style="margin-bottom: 10px" size="small" @click="addUser">添加</i-button>
                  <table-com class="good-table"
                             :data="formData.customers"
                             :has-page="false"
                             :config="userTableConfig">
                    <template slot="col0"
                              slot-scope="{ item }">
                      <el-table-column :prop="item.prop"
                                       :label="item.label"
                                       :min-width="item.minWidth">
                        <template slot-scope="{ row, $index }">
                          <FormItem :label-width="0" :prop="'customers.' + $index + '.phone'">
                            <i-input type="text"
                                     search enter-button
                                     placeholder="手机号码"
                                     v-model.trim="row.phone"
                                     @on-search="getUserByPhone(row.phone, $index)" />
                          </FormItem>
                        </template>
                      </el-table-column>
                    </template>
                    <template slot="col1"
                              slot-scope="{ item }">
                      <el-table-column :prop="item.prop"
                                       :label="item.label"
                                       :min-width="item.minWidth">
                        <template slot-scope="{ row, $index }">
                          <FormItem :label-width="0" :prop="'customers.' + $index + '.idCard'">
                            <i-input type="text"
                                     search enter-button
                                     placeholder="请输入身份证号码"
                                     v-model.trim="row.idCard"
                                     @on-search="getByIdCard(row.idCard, $index)" />
                          </FormItem>
                        </template>
                      </el-table-column>
                    </template>
                    <template slot="col2"
                              slot-scope="{ item }">
                      <el-table-column :prop="item.prop"
                                       :label="item.label">
                        <template slot-scope="{ row, $index }">
                          <FormItem :label-width="0" :prop="'customers.' + $index + '.name'">
                            <i-input type="text" placeholder="请输入姓名" v-model.trim="row.name" />
                          </FormItem>
                        </template>
                      </el-table-column>
                    </template>
                    <template slot="col3"
                              slot-scope="{ item }">
                      <el-table-column :prop="item.prop"
                                       :label="item.label">
                        <template slot-scope="{ row, $index }">
                          <div class="operate-block">
                            <FormItem :label-width="0" :prop="'customers.' + $index + '.sex'">
                              <i-select v-model="row.sex"
                                        transfer
                                        placeholder="请选择性别">
                                <i-option v-for="item in genderList"
                                          :value="item.value"
                                          :key="item.value">
                                  {{ item.label }}
                                </i-option>
                              </i-select>
                            </FormItem>
                          </div>
                        </template>
                      </el-table-column>
                    </template>
                    <template slot="col4"
                              slot-scope="{ item }">
                      <el-table-column :prop="item.prop"
                                       :label="item.label"
                                       :min-width="item.minWidth">
                        <template slot-scope="{ row, $index }">
                          <div class="operate-block">
                            <i-button :disabled="$index + 1 <= formData.num" type="error" size="small" @click="delUser($index)">删除</i-button>
                          </div>
                        </template>
                      </el-table-column>
                    </template>
                  </table-com>
                </div>
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
import { genderList, genderMap } from '../../../assets/enums';
import { userTableConfig } from './tableConfig';
export default {
  data () {
    return {
      genderList,
      genderMap,
      userTableConfig,
      visible: false,
      isLoading: false,
      formData: {
        customers: []
      }
    };
  },
  methods: {
    show ({ code, hotelId }) {
      console.log(code, hotelId)
      this.code = code;
      this.hotelId = hotelId;
      this.visible = true;
    },
    addUser () {
      this.formData.customers.push({});
    },
    delUser (index) {
      this.formData.customers.splice(index, 1);
    },
    getUserByPhone (phone, $index) {
      if (!phone) return;
      this.$ajax.get({
        apiKey: 'customerGetByPhone',
        params: {
          phone
        }
      }).then(res => {
        if (res) {
          this.$set(this.formData.customers[$index], 'idCard', res.idCard);
          this.$set(this.formData.customers[$index], 'name', res.name);
          this.$set(this.formData.customers[$index], 'sex', res.sex);
        } else {
          return Promise.reject(new Error());
        }
      }).catch(() => {
        this.$message.error('查询不到此用户，请手动填写信息');
      });
    },
    getByIdCard (idCard, $index) {
      if (!idCard) return;
      this.$ajax.get({
        apiKey: 'vipUserGetByIdCard',
        params: {
          idCard
        }
      }).then(res => {
        if (res) {
          this.$set(this.formData.customers[$index], 'phone', res.phone);
          this.$set(this.formData.customers[$index], 'name', res.name);
          this.$set(this.formData.customers[$index], 'sex', res.sex);
        } else {
          return Promise.reject(new Error());
        }
      }).catch(() => {
        this.$message.error('查询不到此用户，请手动填写信息');
      });
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
      this.$ajax.post({
        apiKey: 'orderAddCustomer',
        params: {
          code: this.code,
          customers: this.formData.customers.map(item => ({
            ...item,
            hotelId: this.hotelId
          }))
        },
        config: {
          headers: { 'Content-Type': 'application/json;charset-UTF-8' }
        },
        loading: false
      }).then(() => {
        this.$message.success('修改成功');
        this.confirmFn && this.confirmFn();
        this.reset();
      }).catch(res => {
        this.$message.error(`修改失败${res.msg ? ': ' + res.msg : ''}`);
      });
    },
    reset () {
      this.$refs.Form.resetFields();
      this.formData = {
        customers: []
      };
      this.code = '';
      this.hotelId = '';
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
