export const repeatFlag = (list) => {
  if (!list || list.length === 0) return;
  const _map = new Map();
  list.forEach(item => {
    if (item.orderMobile) {
      if (_map.has(item.orderMobile)) {
        const _repeat = _map.get(item.orderMobile);
        item.related = _repeat.related = true;
        item.relatedColor = _repeat.relatedColor = _repeat.relatedColor ? _repeat.relatedColor : rgb();
      } else {
        _map.set(item.orderMobile, item);
      }
    }
  });
};

function rgb () {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return '(' + r + ',' + g + ',' + b + ')';
}
