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
  roomAttrs: 'FJSX',
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

export const functionType = {
  // 酒店预订
  reserve: 1,
  // 登记入住
  check: 2,
  // 结账离店
  settle: 3,
  // 交班管理
  handover: 4,
  // 查看房价
  roomPrice: 5,
  // 增加消费
  consume: 6,
  // 营业查询
  businessQuery: 7,
  // 预定信息
  reservationQuiry: 8,
  // 系统设置
  systemSetting: 9,
  // 会员设置
  vipSetting: 10,
  // 添加工具
  addTool: -1
};

export const functionList = [
  {
    label: '登记入住',
    name: functionType.check
  },
  {
    label: '增加消费',
    name: functionType.consume
  },
  {
    label: '结账离店',
    name: functionType.settle
  },
  {
    label: '营业查询',
    name: functionType.businessQuery
  },
  {
    label: '交班管理',
    name: functionType.handover
  },
  {
    label: '预定信息',
    name: functionType.reservationQuiry
  },
  {
    label: '查看房价',
    name: functionType.roomPrice
  },
  {
    label: '系统设置',
    name: functionType.systemSetting
  },
  {
    label: '会员设置',
    name: functionType.vipSetting
  }
];

export const roomStatus = {
  // 空净房
  clean: 0,
  // 已预定
  reserved: 1,
  // 在住
  live: 2,
  // 钟点房
  hourRoom: 3,
  // 退房卫生
  outClearing: 4,
  // 续房卫生
  refillClearing: 5,
  // 故障
  error: 6
};

export const roowStatusList = [
  // 0-空净房 1-已预订 2-在住 3-钟点房 4-退房卫生 5-续房卫生 6-故障房
  {
    label: '空净房',
    value: roomStatus.clean,
    bgColor: '#47FB9A'
  },
  {
    label: '已预订',
    value: roomStatus.reserved,
    bgColor: '#C499FF'
  },
  {
    label: '在住',
    value: roomStatus.live,
    bgColor: '#FC9AA0'
  },
  {
    label: '钟点房',
    value: roomStatus.hourRoom,
    bgColor: '#FC0100'
  },
  {
    label: '退房卫生',
    value: roomStatus.outClearing,
    bgColor: '#FEFF00'
  },
  {
    label: '续房卫生',
    value: roomStatus.refillClearing,
    bgColor: '#DF2DC5'
  },
  {
    label: '故障房',
    value: roomStatus.error,
    bgColor: '#7F8081'
  }
];

export const orderType = {
  hotel: 0,
  mobile: 1,
  machine: 2,
  miniProgram: 3,
  other: 4
};

export const orderTypeList = [
  {
    label: '酒店',
    value: orderType.hotel
  },
  {
    label: '电话',
    value: orderType.mobile
  },
  {
    label: '自助机',
    value: orderType.machine
  },
  {
    label: '小程序',
    value: orderType.miniProgram
  },
  {
    label: '其他',
    value: orderType.other
  }
];

export const ordainRoomTypeList = [
  {
    label: '普通房',
    value: 0
  },
  {
    label: '钟点房',
    value: 1
  }
];

export const payTypeList = [
  {
    label: '微信',
    value: 0
  },
  {
    label: '支付宝',
    value: 1
  },
  {
    label: '现金',
    value: 2
  },
  {
    label: '扫码枪',
    value: 3
  }
];

export const payTargetList = [
  {
    label: '房费',
    value: 0
  },
  {
    label: '押金',
    value: 1
  },
  {
    label: '商品',
    value: 2
  },
  {
    label: '赔偿',
    value: 3
  }
];

export const orderStatus = {
  // 0-下单未支付 1-已支付 2-已入住 3-已完成 4-退款中 5-退款完成
  unPay: 0,
  payed: 1,
  living: 2,
  complete: 3,
  refunding: 4,
  refunded: 5
};

export const hourRoomChargeTypeList = [
  {
    label: '封顶',
    value: 0
  },
  {
    label: '按小时计价',
    value: 1
  }
];
