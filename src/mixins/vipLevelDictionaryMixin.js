import { mapActions } from 'vuex';
export default {
  data () {
    return {
      vipLevelList: []
    };
  },
  methods: {
    ...mapActions([
      'getVipListByBrandId'
    ]),
    getVipList (brandId, needAll = true) {
      if (!brandId) {
        this.$message.error('缺省参数');
        return;
      }
      return this.getVipListByBrandId({
        brandId
      }).then(data => {
        this.vipLevelList = needAll ? [{ id: 0, dictName: '全部等级' }].concat(data || []) : (data || []);
      });
    }
  }
};
