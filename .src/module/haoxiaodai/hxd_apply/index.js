import './index.less'
import { qa, intro } from './config';
import service from './service'
import Utils from '../../../utils';

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
      productInfo: {
        short: "销",
        name: "好销贷",
        loan: "300"
      },
      introduction: intro,
      QA: qa
    },
    methods: {
      handleFolder() {
        this.isFolder = !this.isFolder;
      },
      async handleGetProductDetail() {
        try {
          const res = await service.getProductInfo({ productId: pageParam.productId })
          console.log(JSON.stringify(res))
        } catch (error) {

        }
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