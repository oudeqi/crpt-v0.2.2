import './index.less'
import { qa, intro } from './config';
import service from './service'
import Utils from '../../../utils';
import filterDict from '../../../utils/dict_filter/filter'
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
      agreements: [
        { id: 1, title: "授信合同1111" },
        { id: 2, title: "授信合同高校的" }
      ],
      mapRes: {
        0: '我要申请',
        1: '授信处理中',
        2: '授信成功',
        3: '授信失败'
      },
      productInfo: {
        productShort: '',
        creditAmount: '',
        producName: '',
        signedContract: '',
        productSlogan: ''
      },
      creditStatus: 0,
      introduction: intro,
      QA: qa,
      btnText: '我要申请',
      isChecked: false,
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
          key: 'agreement', params: {
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
          if(res.code === 200) {
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
          const res = await service.getProductInfo({ productId: pageParam.productId })
          if (res.code === 200) {
            this.productInfo = {
              productShort: '销',
              creditAmount: res.data.creditAmount,
              producName: res.data.productName,
              // unsignContract: [{ contractFileId: '669', contractName: '韭菜的自我修养' }], // 先搞个假的
              unsignContract: [res.data.unsignContract || {}],// 后端只返回了一个合同，并且是对象不是list
              signContract: [res.data.signContract || {}],// 后端只返回了一个合同，并且是对象不是list
              productSlogan: res.data.productSlogan
            }
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
    }
  })

}