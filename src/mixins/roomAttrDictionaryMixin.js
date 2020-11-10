import { mapActions } from 'vuex';
import { dictionaryCodeType } from '../assets/enums';
export default {
  data () {
    return {
      roomAttrs: []
    };
  },
  methods: {
    ...mapActions([
      'getDictionaryByCode'
    ]),
    getRoomAttrsList (hotelId, needAll = true) {
      if (!hotelId) {
        this.$message.error('缺省参数');
        return;
      }
      return this.getDictionaryByCode({
        hotelId,
        typeCode: dictionaryCodeType.roomAttrs
      }).then(data => {
        this.roomAttrs = needAll ? [{ id: 0, dictName: '全部属性' }].concat(data || []) : [];
      });
    }
  }
};
