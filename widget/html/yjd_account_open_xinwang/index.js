apiready = function apiready() {
  var statusBar = document.querySelector('#status_bar');
  $api.fixStatusBar(statusBar);
  var offset = $api.offset(statusBar);

  var _ref = api.pageParam || {},
      url = _ref.url,
      productId = _ref.productId;

  api.openFrame({
    name: 'yjd_account_open_xinwang_frm',
    // url: url.includes('http://') ? url : 'http://' + url,
    url: 'widget://html/yjd_account_open_xinwang/xw-openaccount-test.html',
    // TODO  这里需要透传productId到新网h5，再透传到success页面
    rect: {
      x: 0,
      y: offset.h,
      w: 'auto',
      h: 'auto'
    },
    pageParam: {
      productId: productId
    },
    progress: {
      type: 'page' // 加载进度效果类型，默认值为 default，取值范围为 default|page，为 page 时，进度效果为仿浏览器类型，固定在页面的顶部
      // title: '', // type 为 default 时显示的加载框标题，字符串类型
      // text: '', // type 为 default 时显示的加载框内容，字符串类型
      // color: '#45C01A', // type 为 page 时进度条的颜色，默认值为 #45C01A，支持#FFF，#FFFFFF，rgb(255,255,255)，rgba(255,255,255,1.0)等格式
      // height:  3, // type 为 page 时进度条高度，默认值为3，数字类型

    }
  });
};
