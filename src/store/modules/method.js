import ajax from '../../assets/api';

const actions = {
  getAllRoomType ({ commit, dispatch }, hotelId) {
    return new Promise((resolve, reject) => {
      ajax.get({
        apiKey: 'roomTypeGetAllList',
        params: {
          hotelId
        },
        loading: false
      }).then(data => {
        resolve(data);
      }).catch(err => {
        reject(err);
      });
    });
  }
};

export default {
  actions
};
