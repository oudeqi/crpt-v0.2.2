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
<<<<<<< HEAD
        navigationBar: navigationBarProfile
    })
}

/**
 * 1. 打开担保业务申请表页面
 */
export function openGuaranteeApplicationIndex({pageParam}) {
=======
        slidBackEnabled: false,
        animation: {
            type: 'none'
        },
        navigationBar: navigationBarProfile
    })
}
/**
 * 打开担保业务申请表页面
 */
export function openGuaranteeApplicationIndex() {
>>>>>>> c8ac6dbe75536b43ec11782d2f6bad6ae1517b0c
    api.openTabLayout({
        title: '担保业务申请表',
        name: 'html/guarantee_application_index/index',
        url: 'widget://html/guarantee_application_index/index.html',
        bgColor: '#fff',
        reload: true,
        bounces: true,
<<<<<<< HEAD
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
export function openAttachmentInfo({pageParam}) {
    api.openTabLayout({
        title: '附件上传',
        name: 'html/attachment_info/index',
        url: 'widget://html/attachment_info/index.html',
        bgColor: '#fff',
        reload: true,
        bounces: true,
        pageParam: pageParam,
        navigationBar: navigationBarProfile
    })
}
/**
 * 1.1 打开房产信息录入页面
 */
export function openGuaranteeApplicationHouse({pageParam}) {
    api.openTabLayout({
        title: '房产信息',
        name: 'html/guarantee_application_house/index',
        url: 'widget://html/guarantee_application_house/index.html',
        bgColor: '#fff',
        reload: true,
        bounces: true,
        pageParam: pageParam,
        navigationBar: navigationBarProfile
    })
}
/**
 * 1.2 打开车辆信息录入页面
 */
export function openGuaranteeApplicationCar({pageParam}) {
    api.openTabLayout({
        title: '车辆信息',
        name: 'html/guarantee_application_car/index',
        url: 'widget://html/guarantee_application_car/index.html',
        bgColor: '#fff',
        reload: true,
        bounces: true,
        pageParam: pageParam,
        navigationBar: navigationBarProfile
    })
}

/**
 * 1.3 打开家庭成员信息录入页面
 */
export function openGuaranteeApplicationFamily({pageParam}) {
    api.openTabLayout({
        title: '家庭成员信息',
        name: 'html/guarantee_application_family/index',
        url: 'widget://html/guarantee_application_family/index.html',
        bgColor: '#fff',
        reload: true,
        bounces: true,
        pageParam: pageParam,
        navigationBar: navigationBarProfile
    })
}

export function closeCurrentWinAndRefresh({winName, frameName, script}) {
    //  关闭当前win并刷新指定页面
    api.execScript({
        name: winName,
        frameName: frameName,
        script: script
    });
    setTimeout(() => {
        api.closeWin()
    }, 300)
}
=======
        slidBackEnabled: false,
        animation: {
            type: 'none'
        },
        navigationBar: navigationBarProfile
    })
}
>>>>>>> c8ac6dbe75536b43ec11782d2f6bad6ae1517b0c
