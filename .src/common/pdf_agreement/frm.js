apiready = function () {
  var pdfReader = api.require('pdfReader');
  pdfReader.openPdfView({
    rect: {
      x: 0,
      y: 0,
      w: 'auto',
      h: 'auto'
    },
    path: 'https://gateway.crpt-cloud.liuheco.com/crpt-file/file/download/1287970120248987648',
    fixedOn: api.frameName,
    fixed: true
  }, function (ret) {
    // alert(JSON.stringify(ret));
  });
}
