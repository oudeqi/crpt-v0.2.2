import { navigationBarProfile } from './navigation.profile'

/**
 * 打开授信资料录入页面
 */
export function openPageCreditInformation() {
    api.openTabLayout({
        title: '授信资料录入',
        name: 'html/credit_information/index',
        url: 'widget://html/credit_information/index.html',
        bgColor: '#fff',
        reload: true,
        bounces: true,
        navigationBar: navigationBarProfile
    })
}

/**
 * 1. 打开担保业务申请表页面
 */
export function openGuaranteeApplicationIndex({pageParam}) {
    api.openTabLayout({
        title: '担保业务申请表',
        name: 'html/guarantee_application_index/index',
        url: 'widget://html/guarantee_application_index/index.html',
        bgColor: '#fff',
        reload: true,
        bounces: true,
        pageParam: pageParam,
        navigationBar: navigationBarProfile
    })
}

/**
 * 2. 打开反担保人列表页面
 */

/**
 * 3. 文件送达地址列表页面
 */

/**
 * 4. 其他附件上传页面
 */

/**
 * 1.1 打开房产信息录入页面
 */
export function openGuaranteeApplicationHouse() {
    api.openTabLayout({
        title: '房产信息',
        name: 'html/guarantee_application_house/index',
        url: 'widget://html/guarantee_application_house/index.html',
        bgColor: '#fff',
        reload: true,
        bounces: true,
        navigationBar: navigationBarProfile
    })
}
/**
 * 1.2 打开车辆信息录入页面
 */
export function openGuaranteeApplicationCar() {
    api.openTabLayout({
        title: '车辆信息',
        name: 'html/guarantee_application_car/index',
        url: 'widget://html/guarantee_application_car/index.html',
        bgColor: '#fff',
        reload: true,
        bounces: true,
        navigationBar: navigationBarProfile
    })
}

/**
 * 1.3 打开家庭成员信息录入页面
 */
export function openGuaranteeApplicationFamily() {
    api.openTabLayout({
        title: '家庭成员信息',
        name: 'html/guarantee_application_family/index',
        url: 'widget://html/guarantee_application_family/index.html',
        bgColor: '#fff',
        reload: true,
        bounces: true,
        navigationBar: navigationBarProfile
    })
}
