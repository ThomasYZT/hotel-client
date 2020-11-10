import { mapActions } from 'vuex';
import { dictionaryCodeType } from '../assets/enums';
export default {
  data () {
    return {
      floorList: []
    };
  },
  methods: {
    ...mapActions([
      'getDictionaryByCode'
    ]),
    getFloors (hotelId, needAll = true) {
      if (!hotelId) {
        this.$message.error('缺省参数');
        return;
      }
      return this.getDictionaryByCode({
        hotelId,
        typeCode: dictionaryCodeType.floor
      }).then(data => {
        this.floorList = needAll ? [{ id: 0, dictName: '全部楼层' }].concat(data || []) : [];
      });
    }
  }
};
