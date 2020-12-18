<template>
  <Tabs v-model="tabIndex" :animated="false">
    <TabPane label="消费记录" name="#1">
      <consumeRecordTable v-if="tabIndex === '#1'" />
    </TabPane>
    <TabPane label="积分记录" name="#2">
      <couponRecordTable v-if="tabIndex === '#2'" />
    </TabPane>
    <TabPane label="钱包记录" name="#3">
      <experienceRecordTable v-if="tabIndex === '#3'" />
    </TabPane>
    <TabPane label="经验记录" name="#4">
      <integralRecordTable v-if="tabIndex === '#4'" />
    </TabPane>
    <TabPane label="等级记录" name="#5">
      <levelRecordTable v-if="tabIndex === '#5'" />
    </TabPane>
    <TabPane label="优惠券记录" name="#6">
      <walletRecordTable v-if="tabIndex === '#6'" />
    </TabPane>
  </Tabs>
</template>

<script>
import consumeRecordTable from './consumeRecordTable';
import couponRecordTable from './couponRecordTable';
import experienceRecordTable from './experienceRecordTable';
import integralRecordTable from './integralRecordTable';
import levelRecordTable from './levelRecordTable';
import walletRecordTable from './walletRecordTable';
export default {
  components: {
    consumeRecordTable,
    couponRecordTable,
    experienceRecordTable,
    integralRecordTable,
    levelRecordTable,
    walletRecordTable
  },
  data () {
    return {
      tabIndex: '#1'
    };
  }
};
</script>

<style scoped lang="scss">
/deep/ .ivu-tabs-card > .ivu-tabs-content {
  height: 500px;
}
</style>
