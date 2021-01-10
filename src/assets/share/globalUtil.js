export default {
  valueToStr: (params, excludePrams = []) => {
    Object.keys(params).forEach(prop => {
      params[prop] = params[prop] !== undefined && params[prop] !== null
        ? typeof params[prop] === 'object'
          ? params[prop]
          : excludePrams && excludePrams.includes(prop)
            ? params[prop]
            : String(params[prop])
        : '';
    });
  },
  removeProp: (obj, propsList) => {
    Object.keys(obj).forEach(prop => {
      if (propsList.includes(prop)) {
        delete obj[prop];
      }
    });
    return obj;
  },
  toCent (val) {
    return Number(val) * 100;
  },
  toYuan (val) {
    return val ? String(parseFloat((Number(val) / 100).toFixed(2))) : '';
  },
  sumArr (arr, unit, transfrom) {
    if (!arr.every(value => isNaN(value))) {
      const sum = arr.reduce((prev, curr) => {
        const value = Number(curr);
        if (!isNaN(value)) {
          return prev + curr;
        } else {
          return prev;
        }
      }, 0);
      return transfrom ? transfrom(sum) + unit : sum + unit;
    } else {
      return 'N/A';
    }
  }
};
