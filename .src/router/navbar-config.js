// 主题色
const themeMainColor = 'rgba(102,187,106,1)'
// 导航文字黑色
const textColor = 'rgba(48,49,51,1)'

// 浅色底导航
const navigationBarWhite = {
  hideBackButton: false,
  background: '#fff',
  color: textColor,
  fontSize: 18,
  fontWeight: 'bold',
  leftButtons: [
    {
      text: '',
      color: themeMainColor,
      iconPath: 'widget://image/back_green_big.png',
    }
  ]
}

// 绿色底导航
const navigationBarGreen = {
  hideBackButton: false,
  background: themeMainColor,
  color: '#fff',
  fontSize: 18,
  fontWeight: 'bold',
  leftButtons: [
    {
      text: '',
      color: '#fff',
      iconPath: 'widget://image/back_white_big.png',
    }
  ]
}

export {
  themeMainColor,
  textColor,
  navigationBarWhite,
  navigationBarGreen,
}