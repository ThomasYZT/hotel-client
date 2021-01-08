<template>
  <Tabs v-model="tabIndex" :animated="false">
    <TabPane label="收款记录" name="#1">
      <receiveRecordTable v-if="tabIndex === '#1'" />
    </TabPane>
    <TabPane label="退款记录" name="#2">
      <refundRecordTable v-if="tabIndex === '#2'" />
    </TabPane>
    <TabPane label="会员充值" name="#3">
      <rechargeRecordTable v-if="tabIndex === '#3'" />
    </TabPane>
  </Tabs>
</template>

<script>
import receiveRecordTable from './receiveRecordTable';
import refundRecordTable from './refundRecordTable';
import rechargeRecordTable from './rechargeRecordTable';
export default {
  components: {
    receiveRecordTable,
    refundRecordTable,
    rechargeRecordTable
  },
  data () {
    return {
      tabIndex: '#1'
    };
  }
};
</script>

<style scoped lang="scss">
.ivu-tabs {
  height: calc(100% - 40px) !important;
}
/deep/ .ivu-tabs-content {
  height: calc(100% - 80px) !important;
}
/deep/ .ivu-tabs-tabpane {
  height: 100%;
}
</style>
