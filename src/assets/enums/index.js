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

export const functionMapList = [
  {
    label: '酒店预定',
    name: functionType.reserve,
    icon: 'icon-tianjiafangyuanyuding'
  },
  {
    label: '登记入住',
    name: functionType.check,
    icon: 'icon-dengji'
  },
  {
    label: '增加消费',
    name: functionType.consume,
    icon: 'icon-xiaofei01'
  },
  {
    label: '结账离店',
    name: functionType.settle,
    icon: 'icon-jiezhang'
  },
  {
    label: '营业查询',
    name: functionType.businessQuery,
    icon: 'icon-shuju'
  },
  {
    label: '交班管理',
    name: functionType.handover,
    icon: 'icon-jiaoban'
  },
  {
    label: '预定信息',
    name: functionType.reservationQuiry,
    icon: 'icon-dingdan'
  },
  {
    label: '查看房价',
    name: functionType.roomPrice,
    icon: 'icon-fangjia'
  },
  {
    label: '系统设置',
    name: functionType.systemSetting,
    icon: 'icon-dengji'
  },
  {
    label: '会员充值',
    name: functionType.vipSetting,
    icon: 'icon-huiyuanchongzhi'
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
    value: '0'
  },
  {
    label: '支付宝',
    value: '1'
  },
  {
    label: '现金',
    value: '2'
  },
  {
    label: '扫码枪',
    value: '3'
  },
  {
    label: '刷卡',
    value: '4'
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

// 订单状态
export const orderStatus = {
  // 0-下单未支付 1-已支付 2-已入住 3-已完成 4-退款中 5-退款完成
  unPay: 0,
  payed: 1,
  living: 2,
  complete: 3,
  refunding: 4,
  refunded: 5
};

// 订单状态列表
export const orderStatusList = [
  {
    label: '下单未支付',
    value: 0
  },
  {
    label: '已支付',
    value: 1
  },
  {
    label: '已入住',
    value: 2
  },
  {
    label: '已完成',
    value: 3
  },
  {
    label: '退款中',
    value: 4
  },
  {
    label: '退款完成',
    value: 5
  }
];

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

// 工作状态
export const workStatusMap = {
  workOn: '0',
  workOff: '1'
};

// 优惠券类型
export const couponsType = {
  moneyOff: 0,
  discount: 1,
  exchange: 2
};

// 优惠券类型列表
export const couponsTypeList = [
  {
    value: couponsType.moneyOff,
    label: '满减券'
  },
  {
    value: couponsType.discount,
    label: '折扣券'
  },
  {
    value: couponsType.exchange,
    label: '兑换券'
  }
];

// 优惠券状态
export const couponStatus = {
  down: 0,
  up: 1
};

export const couponStatusList = [
  {
    label: '下架',
    value: couponStatus.down
  },
  {
    label: '上架',
    value: couponStatus.up
  }
];

// 会员充值设置状态
export const vipChargeConfigStatus = {
  off: 0,
  on: 1
};

// 会员充值设置状态列表
export const vipChargeConfigStatusList = [
  {
    label: '停用',
    value: vipChargeConfigStatus.off
  },
  {
    label: '启用',
    value: vipChargeConfigStatus.on
  }
];

// 商城物品状态
export const integralGoodStatus = {
  down: 0,
  up: 1
};

export const integralGoodStatusList = [
  {
    label: '下架',
    value: integralGoodStatus.down
  },
  {
    label: '上架',
    value: integralGoodStatus.up
  }
];

// 消费来源
export const consumeSource = {
  miniProgram: 0,
  cashier: 1
};

export const consumeSourceList = [
  {
    value: consumeSource.miniProgram,
    label: '小程序'
  },
  {
    value: consumeSource.cashier,
    label: '收银'
  }
];

// 支付状态
export const paymentStatus = {
  unPay: 0,
  paySuccess: 1,
  payFail: 2,
  toRefund: 3
};

export const paymentStatusList = [
  {
    value: paymentStatus.unPay,
    label: '未支付'
  },
  {
    value: paymentStatus.paySuccess,
    label: '支付成功'
  },
  {
    value: paymentStatus.payFail,
    label: '支付失败'
  },
  {
    value: paymentStatus.toRefund,
    label: '转入退款'
  }
];

// 经验记录类型
export const recordType = {
  out: 0,
  in: 1
};

export const recordTypeList = [
  {
    value: recordType.out,
    label: '支出'
  },
  {
    value: recordType.in,
    label: '收入'
  }
];

// 经验来源
export const expSource = {
  charge: 0,
  consume: 1
};

export const expSourceList = [
  {
    value: expSource.charge,
    label: '充值赠送'
  },
  {
    value: expSource.consume,
    label: '消费赠送'
  }
];

// 积分来源
export const integralSource = {
  charge: 0,
  deduct: 1,
  consume: 2
};

export const integralSourceList = [
  {
    value: integralSource.charge,
    label: '充值赠送'
  },
  {
    value: integralSource.deduct,
    label: '积分抵扣'
  },
  {
    value: integralSource.consume,
    label: '消费赠送'
  }
];

// 钱包来源
export const walletSource = {
  refund: 0,
  charge: 1,
  consume: 2
};

export const walletSourceList = [
  {
    value: walletSource.refund,
    label: '退款'
  },
  {
    value: walletSource.charge,
    label: '会员充值'
  },
  {
    value: walletSource.consume,
    label: '消费'
  }
];

export const couponExpireStatus = {
  unuse: 0,
  used: 1,
  expired: 2
};

export const couponExpireStatusList = [
  {
    value: couponExpireStatus.unuse,
    label: '未使用'
  },
  {
    value: couponExpireStatus.used,
    label: '已使用'
  },
  {
    value: couponExpireStatus.expired,
    label: '已过期'
  }
];

export const vipActiveStatus = {
  unActive: 0,
  activited: 1
};

export const vipActiveStatusList = [
  {
    value: vipActiveStatus.unActive,
    label: '未激活'
  },
  {
    value: vipActiveStatus.activited,
    label: '已激活'
  }
];

// 会员注册状态
export const registerStatus = {
  unRegister: 0,
  registered: 1,
  withdraw: 2
};

export const registerStatusList = [
  {
    value: registerStatus.unRegister,
    label: '未注册'
  },
  {
    value: registerStatus.registered,
    label: '已注册'
  },
  {
    value: registerStatus.withdraw,
    label: '注销'
  }
];

// 消费时间类型
export const consumeTimeType = {
  before: 1,
  after: 2
};

export const consumeTimeTypeList = [
  {
    value: consumeTimeType.before,
    label: '入住前'
  },
  {
    value: consumeTimeType.before,
    label: '入住后'
  }
];

// 统计类型
export const statisticType = {
  totalTurnover: 1,
  memberRecharge: 2,
  merchandising: 3,
  passengerFlow: 4,
  pay: 5
};

export const statisticTypeList = [
  {
    value: statisticType.totalTurnover,
    label: '营业总额'
  },
  {
    value: statisticType.memberRecharge,
    label: '会员充值'
  },
  {
    value: statisticType.merchandising,
    label: '商品销售'
  },
  {
    value: statisticType.passengerFlow,
    label: '客流统计'
  },
  {
    value: statisticType.pay,
    label: '支出汇总'
  }
];

export const statePayType = {
  // 支付类型 0-房费 1-超时房费 2-押金 3-商品 4-赔偿
  room: 0,
  timeout: 1,
  deposit: 2,
  good: 3,
  reparation: 4
};

export const statePayTypeList = [
  {
    label: '房费',
    value: statePayType.room
  },
  {
    label: '超时房费',
    value: statePayType.timeout
  },
  {
    label: '押金',
    value: statePayType.deposit
  },
  {
    label: '商品',
    value: statePayType.good
  },
  {
    label: '赔偿',
    value: statePayType.reparation
  }
];

export const statePayStatus = {
  fail: 0,
  success: 1
};

export const statePayStatusList = [
  {
    label: '支付成功',
    value: statePayStatus.success
  },
  {
    label: '支付失败',
    value: statePayStatus.fail
  }
];
