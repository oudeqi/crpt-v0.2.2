> # 产融宝App

<img src="https://ftp.bmp.ovh/imgs/2020/06/d6fbcac62b6b2038.png" width="200"  align="middle" />



## 安装
![](https://ftp.bmp.ovh/imgs/2020/06/776d4d2a9635e40b.jpeg)

## 相关项目
_业务员端_

## 版本记录

### 0.3.0（2020/07/30， 线上）
  - 新增押金贷产品流程（支用、还款）
  - 新增好销宝产品（授信、支用）
  - 新增贷款试算功能
  - 新增新网开户及我的钱包

### 0.2.0（2020/06/19 17:00 + 00:00， 内测)
  - 新增担保贷产品流程（申请、授信）
  - 修复一些兼容性bug
  - 更换全新UI

### 0.1.0（2020/04， 内测)
  - 登录注册认证功能
  - 首页、订单、还款、我的
  - 其他假页面
  

## 待办



## 新版目录结构( version >= 0.3.0)
```
├── app                     // 入口文件
│   ├── index.html          
│   └── index.js
├── common                  //  公共文件
│   ├── page                //  页面级
│   │   ├── agreement       
│   └── component           //  组件级
│       └── popup
├── router                  //  路由
│   ├── profile.js          
│   └── index.js
├── tablayout               //  页面
│   ├── wallet              //  希望钱包页
│   │   ├── index.html
│   │   ├── index.js
│   │   ├── index.less
│   │   └── service.js
│   ├── index               //  首页
│   │   ├── index.html
│   │   ├── index.js
│   │   ├── index.less
│   │   └── service.js
│   └── my
│       ├── index.html
│       ├── index.js
│       ├── index.less
│       └── service.js
├── module                  //  产品业务模块
│   ├── guarantee           //  担保贷
│   │   ...
│   │   └── apply/
│   ├── haoxiaodai            //  好销宝
│   │   ...
│   │   └── apply/
│   └── yajindai             //  押金贷
│       ...
│       └── apply/
├── styles                  //  通用样式
│   ├── _variable.less
│   └── form.less
├── http                    //  ajax
│   ├── index.js
│   └── config.js
├── utils                   //  工具库
│   ├── index.js            //  Util类
│   ├── file                //  插件类
│   │   └── index.js
│   ├── ocr
│   │   ├── baidu
│   │   │   └── index.js
│   │   └── index.js
│   └── ui
│       ├── index.js
│       ├── loading.js
│       ├── picker.js
│       └── toast.js
...

```

## 开发、代码管理、打包

1. 开发模式，对应dev数据库
```bash
yarn dev
```

2. 开发模式，对应test数据库
```bash
yarn testing
```

3. 打包test包
```bash
yarn uat
```

4. 打包prod包
```bash
yarn prod
```

5. 推送至gitlab仓库
```bash
git checkout dev
git push
```

6. 推送至github仓库，需先配置xxx github源
```bash
git push xxx master:dev
```

## 其他注意事项
#### css图片使用相对路径
- App Store2019年12月23日的公告，自2020年4月起，App Store将不再接受使用UIWebView的新应用，自2020年12月起将不再接受使用UIWebView的应用的版本更新。

- fillInput UIInput 不能同时使用

- 云编译时使用自己的仓库，需要建立widget文件夹，并且不能有其他文件夹，如果有会打包失败，提示“获取代码失败！请检查用户名、密码是否正确以及Git服务”，为了解决这个问题，把src重命名为.src

#### 测试账号

``` bash
htt 18349267630 123456
zyg 13279932396 123456
yjj 15982303824 1
13279930003/123456
18989193368 123456 企业名称 新兴县渔悦水产养殖有限公司1 智道新喜科技有限公司
13602145280 123456
13279930000
13279930003

10cbc5c5-6b9e-48b3-bebe-91b64ecd3a46
Bearer 71107506-5eb5-420f-ab3a-3e6f750c350b

1	13279930000	123456	Authorization: Bearer e74f20c2-cdce-425b-af24-a9d356c30dcf
4	13279930003	123456	Authorization: Bearer 10cbc5c5-6b9e-48b3-bebe-91b64ecd3a46

# 企业名称 四川东雄农业科技有限公司
# 法定代表人 万国东
# 法人唯一标识 51092219690504357X
# 统一社会信用代码 9151070431459311XW

# 新兴县渔悦水产养殖有限公司1
# 企业代码 91445321MA4WWGKRXR
# 法人 朱博才
# 法人唯一标识 44010619741107183X

# 李骁航 00008030-001618D211BA802E
# 宋学龙 00008020-000D39513C23002E
# 李阳 00008020-001550CE0CBB002E
# 张新朋 a4bd87dbfa471115726300a9eba30aefd5d94686
# 娟娟 1a5e75dd120fb8a5644299095805df7bacf68f70
# 高榕 242b6ae2c4031dc6c206eeaf4a060b5a0a01d7ed
# 欧威 865fda05c45872119d510b788614d0c2562f619a

# 何婷婷 00008030-000E2CDE2600802E
# 王安才 1118030392205ce5cfc0afa46b30bf468b6884f7


```
create-rollup-config rollup-watch

## 使用其他编辑器，通过java指令启动真机调试服务


```bash
// jar包的路径地址需要换成自己本地
// server start
java -jar /Users/nardo/WebstormProjects/webStorm-APICloud/wifisync_tools/wifisync.jar /Users/nardo/WebstormProjects /Users/nardo/WebstormProjects/webStorm-APICloud/wifisync_tools

// server ip:port
java -jar /Users/nardo/WebstormProjects/webStorm-APICloud/wifisyncmanager.jar 1 /Users/nardo/WebstormProjects/webStorm-APICloud/wifisync_tools/config_info

// 全量同步
java -jar /Users/nardo/WebstormProjects/webStorm-APICloud/wifisyncmanager.jar 2 /Users/nardo/WebstormProjects/webStorm-APICloud/wifisync_tools/config_info /Users/nardo/WebstormProjects/widget /Users/nardo/WebstormProjects

// 增量同步
java -jar /Users/nardo/WebstormProjects/webStorm-APICloud/wifisyncmanager.jar 3 /Users/nardo/WebstormProjects/webStorm-APICloud/wifisync_tools/config_info /Users/nardo/WebstormProjects/widget /Users/nardo/WebstormProjects

```

`
