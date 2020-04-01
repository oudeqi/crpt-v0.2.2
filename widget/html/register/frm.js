// const getUIInputIndex = i => api.systemType === 'ios' ? i - 1 : i

var resetUIInputPosi = function resetUIInputPosi(dom, id) {
  var UIInput = api.require('UIInput');

  var rect = $api.offset(dom);
  UIInput.resetPosition({
    id: id,
    position: {
      x: rect.l,
      y: rect.t
    }
  });
};

var openUIInput = function openUIInput(dom, form, key) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var cb = arguments.length > 4 ? arguments[4] : undefined;

  var UIInput = api.require('UIInput');

  var rect = $api.offset(dom);
  var maxRows = options.maxRows,
      maxStringLength = options.maxStringLength,
      inputType = options.inputType,
      placeholder = options.placeholder,
      keyboardType = options.keyboardType,
      alignment = options.alignment,
      isCenterVertical = options.isCenterVertical;
  UIInput.open({
    rect: {
      x: rect.l,
      y: rect.t,
      w: rect.w,
      h: rect.h
    },
    fixed: false,
    autoFocus: false,
    maxRows: maxRows || 1,
    maxStringLength: maxStringLength,
    inputType: inputType,
    placeholder: placeholder,
    keyboardType: keyboardType,
    alignment: alignment,
    isCenterVertical: isCenterVertical,
    fixedOn: api.frameName,
    styles: {
      bgColor: 'rgba(0,0,0,0)',
      size: 16,
      color: '#333',
      placeholder: {
        color: '#aaa'
      }
    }
  }, function (ret) {
    cb && cb(ret.id);
    UIInput.value({
      id: ret.id
    }, function (value) {
      form[key] = [ret.id, value && value.msg ? value.msg : ''];
    });
  });
};

apiready = function apiready() {
  var UIInput = api.require('UIInput'); // 表单数据


  var form = {};
  var sendStatus = 'notsend'; // notsend:未发送,sending:发送中,countdown:倒计时中

  var submitStatus = 'notsubmit'; // notsubmit:未提交,submitting:正在提交

  openUIInput($api.byId('tel'), form, 'tel', {
    placeholder: '请输入手机号码',
    keyboardType: 'number',
    maxStringLength: 11
  });
  openUIInput($api.byId('code'), form, 'code', {
    placeholder: '短信验证码',
    keyboardType: 'next',
    maxStringLength: 4
  });
  openUIInput($api.byId('pwd'), form, 'pwd', {
    placeholder: '请输入密码',
    keyboardType: 'next',
    inputType: 'password',
    maxStringLength: 16
  });
  openUIInput($api.byId('repwd'), form, 'repwd', {
    placeholder: '请输入密码',
    keyboardType: 'done',
    inputType: 'password',
    maxStringLength: 16
  });

  function resetInputPosi() {
    resetUIInputPosi($api.byId('tel'), form['tel'][0]);
    resetUIInputPosi($api.byId('code'), form['code'][0]);
    resetUIInputPosi($api.byId('pwd'), form['pwd'][0]);
    resetUIInputPosi($api.byId('repwd'), form['repwd'][0]);
  }

  function radioOnChange() {
    if (this.dataset.type === 'geren') {
      $api.byId('companyName').style.display = 'none';
      UIInput.hide({
        id: form['name'][0]
      });
      resetInputPosi();
    } else {
      $api.byId('companyName').style.display = 'block';
      setTimeout(function () {
        if (form['name']) {
          UIInput.show({
            id: form['name'][0]
          });
        } else {
          openUIInput($api.byId('name'), form, 'name', {
            placeholder: '请输入...',
            isCenterVertical: false,
            maxRows: 2,
            keyboardType: 'next',
            maxStringLength: 40
          });
        }
      }, 150);
      resetInputPosi();
    }
  }

  document.querySelector('#geren').onclick = radioOnChange;
  document.querySelector('#qiye').onclick = radioOnChange;

  document.querySelector('#agreement').onclick = function () {
    api.alert({
      title: '消息',
      msg: '功能开发中...'
    });
  };

  function countDown() {
    var second = 6;
    var timer = setInterval(function () {
      if (second <= 0) {
        sendStatus = 'notsend';
        $api.byId('sendcode').innerHTML = '发送验证码';
        clearInterval(timer);
      } else {
        second--;
        $api.byId('sendcode').innerHTML = second + '秒后重试';
      }
    }, 1000);
  }

  document.querySelector('#sendcode').onclick = function () {
    if (sendStatus === 'notsend') {
      sendStatus = 'sending';
      $api.byId('sendcode').innerHTML = '正在发送中';
      setTimeout(function () {
        sendStatus = 'countdown';
        countDown();
      }, 1000); // http.post('/xxx').then(ret => {
      //   sendStatus = 'countdown'
      //   countDown()
      // }).catch(error => {
      //   sendStatus = 'notsend'
      // })
    }
  };

  document.querySelector('#submit').onclick = function () {
    // alert(JSON.stringify(form))
    if (submitStatus === 'notsubmit') {
      submitStatus = 'submitting';
      $api.addCls($api.byId('submit'), 'loading');
      setTimeout(function () {
        submitStatus = 'notsubmit';
        $api.removeCls($api.byId('submit'), 'loading');
        api.toast({
          msg: '注册成功',
          location: 'middle',
          global: true
        });
        api.closeWin();
      }, 1000); // http.post('/xxx').then(ret => {
      //   api.toast({
      //     msg: '注册成功',
      //     location: 'middle',
      //     global: true
      //   })
      //   api.closeWin()
      // }).catch(error => {
      //
      // }).finally(() => {
      //   submitStatus = 'notsubmit'
      //   $api.removeCls($api.byId('submit'), 'loading')
      // })
    }
  };
};
