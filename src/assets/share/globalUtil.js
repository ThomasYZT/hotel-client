export default {
  valueToStr: (params) => {
    Object.keys(params).forEach(prop => {
      params[prop] = params[prop] !== undefined && params[prop] !== null
        ? typeof params[prop] === 'object'
          ? params[prop]
          : String(params[prop])
        : '';
    });
  }
};
