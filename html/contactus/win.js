apiready = function apiready() {
  api.parseTapmode();

  document.querySelector('#tel').onclick = function () {
    api.call({
      type: 'tel_prompt',
      number: '10000'
    });
  };
};
