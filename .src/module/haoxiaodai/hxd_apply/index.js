import './index.less'
import { qa, intro } from './config';

apiready = function () {
  const pageParam = api.pageParam || {}
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
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
    },
  })

}