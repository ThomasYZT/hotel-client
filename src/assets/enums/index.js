export const userType = {
  admin: -1,
  agent: 2,
  brand: 1,
  hotel: 0
};

export const storageKey = {
  userInfo: 'hotel:userinfo'
};

export const storageStatusMap = {
  lost: 2,
  retrieve: 1,
  consign: 0
};

export const storageStatusList = [
  {
    value: storageStatusMap.consign,
    name: '寄存'
  },
  {
    value: storageStatusMap.retrieve,
    name: '取出'
  },
  {
    value: storageStatusMap.lost,
    name: '遗失'
  }
];

export const genderMap = {
  unknown: 0,
  male: 1,
  female: 2
};

export const genderList = [
  {
    label: '未知',
    value: genderMap.unknown
  },
  {
    label: '男',
    value: genderMap.male
  },
  {
    label: '女',
    value: genderMap.female
  }
];

export const blacklistStatusList = [
  {
    label: '启用',
    value: 1
  },
  {
    label: '停用',
    value: 0
  }
];

export const dictionaryCodeType = {
  window: 'FJSX',
  floor: 'FLOOR',
  vipLevel: 'VIPLEVEL',
  consignType: 'CONSIGNTYPE'
};

export const attachType = {
  img: 0,
  voice: 1,
  video: 2,
  file: 3
};
