const topName = 'vipManager';

export default {
  vipManager: {
    path: '/vipManager',
    component: () => import('../../pages/routerView/index.vue'),
    meta: {
      menuName: '会员管理',
      iconClass: 'icon-huiyuan',
      activePath: `${topName}.vipManager`,
      isMenu: true
    },
    children: {
      vipList: {
        path: '/vipManager/vipList',
        name: 'vipList',
        component: () => import('../../pages/vipManager/child/vipInfo.vue'),
        meta: {
          menuName: '会员列表',
          iconClass: 'icon-huiyuan',
          activePath: `${topName}.vipList`,
          isMenu: true
        }
      },
      couponsList: {
        path: '/vipManager/couponsList',
        name: 'couponsList',
        component: () => import('../../pages/vipManager/child/coupons.vue'),
        meta: {
          menuName: '优惠券管理',
          iconClass: 'icon-huiyuan',
          activePath: `${topName}.couponsList`,
          isMenu: true
        }
      },
      vipLevel: {
        path: '/vipManager/vipLevel',
        name: 'vipLevel',
        component: () => import('../../pages/vipManager/child/vipLevel.vue'),
        meta: {
          menuName: '会员等级管理',
          iconClass: 'icon-huiyuan',
          activePath: `${topName}.vipLevel`,
          isMenu: true
        }
      },
      vipCharge: {
        path: '/vipManager/vipCharge',
        name: 'vipCharge',
        component: () => import('../../pages/vipManager/child/vipCharge.vue'),
        meta: {
          menuName: '会员充值管理',
          iconClass: 'icon-huiyuan',
          activePath: `${topName}.vipCharge`,
          isMenu: true
        }
      },
      integralMall: {
        path: '/vipManager/integralMall',
        name: 'integralMall',
        component: () => import('../../pages/vipManager/child/integralMall.vue'),
        meta: {
          menuName: '积分商城管理',
          iconClass: 'icon-huiyuan',
          activePath: `${topName}.integralMall`,
          isMenu: true
        }
      }
    }
  }
};
