import { mapActions } from 'vuex';
import { dictionaryCodeType } from '../assets/enums';
export default {
  data () {
    return {
      vipLevelList: []
    };
  },
  methods: {
    ...mapActions([
      'getDictionaryByCode'
    ]),
    getVipList (hotelId, needAll = true) {
      if (!hotelId) {
        this.$message.error('缺省参数');
        return;
      }
      return this.getDictionaryByCode({
        hotelId,
        typeCode: dictionaryCodeType.vipLevel
      }).then(data => {
        this.vipLevelList = needAll ? [{ id: 0, dictName: '全部等级' }].concat(data || []) : (data || []);
      });
    }
  }
};
