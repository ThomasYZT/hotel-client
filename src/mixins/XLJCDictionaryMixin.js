import { mapActions } from 'vuex';
import { dictionaryCodeType } from '../assets/enums';
export default {
  data () {
    return {
      consignTypeList: []
    };
  },
  methods: {
    ...mapActions([
      'getDictionaryByCode'
    ]),
    getConsignTypeList (hotelId, needAll = true) {
      if (!hotelId) {
        this.$message.error('缺省参数');
        return;
      }
      return this.getDictionaryByCode({
        hotelId,
        typeCode: dictionaryCodeType.consignType
      }).then(data => {
        this.consignTypeList = needAll ? [{ id: 0, dictName: '全部类型' }].concat(data || []) : [];
      });
    }
  }
};
