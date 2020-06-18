


apiready = function () {
  alert(1)
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  // alert(Vue)
  // const page = new Vue({
  //   el: '#app',
  //   data: {

  //   }
  // })
}