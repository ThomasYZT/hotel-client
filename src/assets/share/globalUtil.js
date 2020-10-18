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
  }
};
