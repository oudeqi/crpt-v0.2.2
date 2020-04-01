apiready = function apiready() {
  document.querySelector('#retry').onclick = function () {
    api.closeWin();
  };
};
