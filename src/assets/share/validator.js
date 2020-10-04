export default {
  /**
   * 是否都是数字
   * @param {String} val 输入值
   */
  isBothNumber: function (val) {
    return /^\d+$/.test(val);
  },
  /**
   * 是否是邮箱
   * @param {String} val 输入值
   */
  isEmail: function (val) {
    return /^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$/.test(val);
  },
  /**
   * 是否是手机号码
   * @param {String} val 输入值
   */
  isMobile: function (val) {
    return this.isBothNumber(val) && /^1\d{10}$/.test(val);
  },
  /**
   * 是否是座机号码
   * @param {String} val 输入值
   */
  isTelephone: function (val) {
    return /^([0-9]{3,4}(-)?)?[0-9]{7,8}$/.test(val);
  },
  /**
   * 是否是数值
   * @param {String} val 输入值
   */
  isNumber: function (val) {
    return !isNaN(Number(val));
  },

  /**
   * 是否是身份证
   * @param {String} val 输入值
   */
  isIdCard: function (val) {
    return (
      /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/.test(val) &&
      IdentityCodeValid(val));
  },
  /**
   * 校验是否是2位数的钱，默认位数为1到10位
   */
  validateMoney (value, minLength = 0, maxLength = 10) {
    return new Promise((resolve, reject) => {
      if (this.isNumber(value)) {
        if (value < 0) reject(new Error('请输入正确金额'));

        const numStr = String(value);
        // 有小数
        if (numStr.indexOf('.') !== -1) {
          const numSplit = numStr.split('.');
          // 小数位位数为0
          if (numSplit[1].length === 0) {
            reject(new Error('请输入正确金额'));
          } else if (numSplit[1].length > 2) { // 小数位数字大于2
            reject(new Error('小数点后不能超过2位'));
          } else {
            if (numSplit[0].length > maxLength) {
              reject(new Error('超过最大金额'));
            } else if (numStr.length < minLength) {
              reject(new Error('小于最小金额'));
            } else {
              resolve();
            }
          }
        } else {
          // 校验整数是否超过范围
          if (numStr.length > maxLength) {
            reject(new Error('超过最大金额'));
          } else if (numStr.length < minLength) {
            reject(new Error('小于最小金额'));
          } else {
            resolve();
          }
        }
      } else {
        reject(new Error('请输入正确金额'));
      }
    });
  }
};

// 身份证详情校验
/**
 * @return {boolean}
 */
function IdentityCodeValid (code) {
  const city = { 11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江 ', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏 ', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外' };
  let tip = '';
  let pass = true;

  if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$/i.test(code)) {
    tip = '身份证号格式错误';
    pass = false;
  } else if (!city[code.substr(0, 2)]) {
    tip = '地址编码错误';
    pass = false;
  } else {
    // 18位身份证需要验证最后一位校验位
    if (code.length === 18) {
      code = code.split('');
      // ∑(ai×Wi)(mod 11)
      // 加权因子
      const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      // 校验位
      const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      let sum = 0;
      let ai = 0;
      let wi = 0;
      for (let i = 0; i < 17; i++) {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      const last = parity[sum % 11];
      if ((parity[sum % 11] + '').toLowerCase() !== code[17].toLowerCase()) {
        tip = '校验位错误';
        pass = false;
      }
    }
  }
  return pass;
}
