export const arrayToTree = ({
  data, rootId = 0, idKey = 'id', pidKey = 'parentId', childKey = 'children', nodeHandler = () => {}
}) => {
  if (!Array.isArray(data)) return data;

  const childMap = [];
  data.forEach(item => {
    const k = 'map_' + item[pidKey];
    if (!childMap[k]) {
      childMap[k] = [];
    }

    childMap[k].push(item);
  });

  function makeTree (map, pid = rootId) {
    const k = 'map_' + pid;
    const item = map[k] ? map[k] : [];
    if (item.length === 0) {
      return [];
    }

    const tree = [];
    item.forEach(item => {
      item[childKey] = makeTree(map, item[idKey]);
      tree.push(item);
      nodeHandler(item);
    });

    return tree;
  }

  return makeTree(childMap);
};

export const treeTraverse = (tree, condition) => {
  let len = tree.length;
  while (len--) {
    if (condition(tree[len])) return true;
    if (tree[len].children) {
      if (treeTraverse(tree[len].children, condition)) return true;
    }
  }
  return false;
};
