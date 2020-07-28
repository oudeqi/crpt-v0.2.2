import './index.less'
import { qa, intro } from './config';
import service from './service'
import Utils from '../../../utils';
import filter from './../../../utils/filter'
import Router from '../../../router';

apiready = function () {
  const pageParam = api.pageParam || {}
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  api.closeWin({
    name: 'hxd_a_supply'
  })
  const page = new Vue({
    el: '#app',
    data: {
      isFolder: true,
      hasApply: !!pageParam.hasApply, // 是否是申请过，默认为false
      mapRes: {
        0: '我要申请',
        1: '授信处理中',
        2: '授信成功',
        3: '我要申请'  // 拒绝了也可以重新申请
      },
      productInfo: {
        productShort: '',
        creditAmount: '',
        producName: '',
        // signedContract: [],
        productSlogan: ''
      },
      contractList: [],
      creditStatus: 0,
      introduction: intro,
      QA: qa,
      btnText: '我要申请',
      isChecked: false,
    },
    computed: {
      creditAmountTn: function () {
        return filter.toThousands(this.productInfo.creditAmount)
      },
    },
    methods: {
      handleFolder() {
        this.isFolder = !this.isFolder;
      },
      handleCheckBox(event) {
        this.isChecked = event.target.checked
      },
      handleSubmit() {
        if (!this.isChecked) {
          Utils.UI.toast('请先同意协议')
          return
        }
        this.handlePostJFSign()
      },
      handleToAgreement(id) {
        Router.openPage({
          key: 'pdf_agreement', params: {
            pageParam: {
              type: 'pdf',
              id: id
            }
          }
        })
      },
      async handlePostJFSign() {
        Utils.UI.showLoading('加载中')
        try {
          const res = await service.postSignJF({
            productId: pageParam.productId
          })
          if (res.code === 200) {
            Router.openPage({
              key: 'hxd_a_success',
              params: {
                pageParam: {
                  productId: pageParam.productId
                }
              }
            })
          }
        } catch (error) {
          if (error.msg) {
            Utils.UI.toast(`${error.code} : ${error.msg}`)
          }else {
            Utils.UI.toast(`服务超时`)
          }
          // 服务超时
          if(error.message) {
            Router.openPage({
              key: 'com_product_list'
            })
          }
        }
        Utils.UI.hideLoading()
      },
      async handleGetProductDetail() {
        Utils.UI.showLoading('加载中')
        try {
          // const mapRes = await filterDict('creditStatus')
          // if (mapRes.code === 200) {
          //   this.mapRes = mapRes
          // }
          let form = {
            productId: pageParam.productId
          }
          if(this.hasApply) {
            Object.assign(form, {
              query: 0
            })
          }
          const res = await service.getProductInfo(form)
          if (res.code === 200) {
            this.productInfo = {
              productShort: '销',
              creditAmount: res.data.creditAmount,
              producName: res.data.productName,
              // unsignContract: [{ contractFileId: '669', contractName: '韭菜的自我修养' }], // 先搞个假的
              // unsignContract: [res.data.unsignContract || {}],// 后端只返回了一个合同，并且是对象不是list
              // signContract: [res.data.signContract || {}],// 后端只返回了一个合同，并且是对象不是list
              productSlogan: res.data.productSlogan
            }
            // 优先展示已签署，已签署没有，再展示未签署
            this.contractList = res.data.signedContract
              ? [res.data.signedContract]
              : res.data.unsignContract && [res.data.unsignContract] || []

            this.btnText = this.mapRes[res.data.creditStatus]
            this.creditStatus = res.data.creditStatus

          }
        } catch (error) {
          if (error.msg) {
            Utils.UI.toast(`${error.code} : ${error.msg}`)
          }
        }
        Utils.UI.hideLoading()
      }
    },
    mounted() {

      Utils.UI.setRefreshHeaderInfo({
        success: () => {
          this.handleGetProductDetail()
          setTimeout(() => {
            api.refreshHeaderLoadDone()
          }, 0);
        },
        fail: () => {
          api.refreshHeaderLoadDone()
        },
      })

      this.handleGetProductDetail()

      // api.openFrame({
      //   name: 'cbpage',
      //   url: 'http://192.168.43.119:3000/crpt-h5/xw_callback/close',
      //   rect: {
      //     x: 0,
      //     y: 60,
      //     w: 'auto',
      //     h: 'auto'
      //   },
      //   pageParam: {
      //     name: 'test'
      //   }
      // });
    }
  })

}