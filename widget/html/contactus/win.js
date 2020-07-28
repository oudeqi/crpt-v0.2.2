apiready = function apiready() {
  api.addEventListener({
    name: 'navitembtn'
  }, function (ret, err) {
    if (ret.type === 'left') {
      api.closeWin();
    }
  });
  api.parseTapmode(); // document.querySelector('#tel').onclick = function () {
  //   api.call({
  //       type: 'tel_prompt',
  //       number: '10000'
  //   });
  // }
};
