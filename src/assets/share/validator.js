export default {
  /**
   * 是否都是数字
   * @param {String} val 输入值
   */
  isBothNumber: function (val) {
    return /^\d+$/.test(val);
  }
};
