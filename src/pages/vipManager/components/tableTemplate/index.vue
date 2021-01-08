<template>
  <Tabs v-model="tabIndex" :animated="false">
    <TabPane label="消费记录" name="#1">
      <consumeRecordTable :vipInfo="vipInfo" v-if="tabIndex === '#1'" />
    </TabPane>
    <TabPane label="积分记录" name="#2">
      <integralRecordTable :vipInfo="vipInfo" v-if="tabIndex === '#2'" />
    </TabPane>
    <TabPane label="钱包记录" name="#3">
      <walletRecordTable :vipInfo="vipInfo" v-if="tabIndex === '#3'" />
    </TabPane>
    <TabPane label="经验记录" name="#4">
      <experienceRecordTable :vipInfo="vipInfo" v-if="tabIndex === '#4'" />
    </TabPane>
    <TabPane label="等级记录" name="#5">
      <levelRecordTable :vipInfo="vipInfo" v-if="tabIndex === '#5'" />
    </TabPane>
    <TabPane label="优惠券记录" name="#6">
      <couponRecordTable :vipInfo="vipInfo" v-if="tabIndex === '#6'" />
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
  props: {
    vipInfo: {
      type: Object,
      default () {
        return {};
      }
    }
  },
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
