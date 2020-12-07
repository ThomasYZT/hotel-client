import ajax from '../../assets/api';

const actions = {
  getAllRoomType ({ commit, dispatch }, hotelId) {
    return new Promise((resolve, reject) => {
      if (hotelId === null || hotelId === undefined) {
        return reject({ msg: '缺省参数' });
      }
      ajax.get({
        apiKey: 'roomTypeGetAllList',
        params: {
          hotelId
        },
        loading: false
      }).then(data => {
        resolve(data || []);
      }).catch(err => {
        reject(err);
      });
    });
  },
  getAllRoom ({ commit, dispatch }, { hotelId, roomTypeId = 0 } = {}) {
    return new Promise((resolve, reject) => {
      if (hotelId === null || hotelId === undefined) {
        return reject({ msg: '缺省参数' });
      }
      ajax.post({
        apiKey: 'roomPageList',
        params: {
          hotelId: hotelId,
          roomTypeId: roomTypeId,
          status: 0,
          pageNum: 1,
          pageSize: 999999
        }
      }).then(data => {
        resolve(data.data || []);
      }).catch(err => {
        reject(err);
      });
    });
  }
};

export default {
  actions
};
