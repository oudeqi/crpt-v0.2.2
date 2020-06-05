import './index.css'
import '../form.css'
import { http, CitySelector, setRefreshHeaderInfo } from '../../../config.js'
import { Validation, NumberLimit } from '../form.js'
import Utils from '../../../utils'

class Service {
  // 担保业务申请-文书送达地址查询
  querySendAddress (gtCreditId) {
    return http.get('/crpt-guarantee/guarantor/document/address/query?gtCreditId=' + gtCreditId)
  }
  // 担保业务申请-文书送达地址保存
  saveApply (params) {
    return http.post('/crpt-guarantee/guarantor/document/address/insert', { body: params })
  }
}

class PageController extends Service {

  constructor() {
    super(...arguments)
    const { gtCreditId, gtId } = api.pageParam || {}
    this.initData = {
      gtId, // 担保申请的id
      gtCreditId // 担保授信id
    }
  }

  __renderBaseDocument (data) {
    $api.byId('custName').value = data.custName || ''
    $api.byId('address').value = data.addrProvince ? `${data.addrProvince}/${data.addrCity}/${data.addrCounty}` : ''
    $api.byId('address').dataset.province = data.addrProvince || ''
    $api.byId('address').dataset.provinceCode = data.addrProvinceCode || ''
    $api.byId('address').dataset.city = data.addrCity || ''
    $api.byId('address').dataset.cityCode = data.addrCityCode || ''
    $api.byId('address').dataset.county = data.addrCounty || ''
    $api.byId('address').dataset.countyCode = data.addrCountyCode || ''
    $api.byId('addrDetail').value = data.addrDetail || ''
    $api.byId('custAddresseeName').value = data.custAddresseeName || ''
    $api.byId('custAddresseePhone').value = data.custAddresseePhone || ''
    $api.byId('custSpouseName').value = data.custSpouseName || ''
    $api.byId('peiouAddress').value = data.spAddrProvince ? `${data.spAddrProvince}/${data.spAddrCity}/${data.spAddrCounty}` : ''
    $api.byId('peiouAddress').dataset.province = data.spAddrProvince || ''
    $api.byId('peiouAddress').dataset.provinceCode = data.spAddrProvinceCode || ''
    $api.byId('peiouAddress').dataset.city = data.spAddrCity || ''
    $api.byId('peiouAddress').dataset.cityCode = data.spAddrCityCode || ''
    $api.byId('peiouAddress').dataset.county = data.spAddrCounty || ''
    $api.byId('peiouAddress').dataset.countyCode = data.spAddrCountyCode || ''
    $api.byId('spAddrDetail').value = data.spAddrDetail || ''
    $api.byId('custSpouseAddresseeName').value = data.custSpouseAddresseeName || ''
    $api.byId('custSpouseAddresseePhone').value = data.custSpouseAddresseePhone || ''
  }

  __renderListDocument (array) {
    const list = $api.byId('list')
    list.innerHTML = ''
    array.forEach((item, index) => {
      const tpl = `
      <div class="item">
        <div class="item-header">
          担保人${index + 1}
        </div>
        <div class="item-body">
          <div class="collapse" collapse="show">
            <div class="collapse-header" click-trigger="header">担保人地址</div>
            <div class="collapse-body">
              <div class="form">
                <div class="form-item">
                  <div class="form-label">担保人</div>
                  <div class="form-crtl">
                    <div class="txt-input">
                      <input type="text" select-trigger="name" value="${item.gtName || ''}" placeholder="请输入">
                    </div>
                  </div>
                </div>
                <div class="form-item">
                  <div class="form-label">送达地址</div>
                  <div class="form-crtl">
                    <div class="city-select">
                      <input type="text"
                        data-province="${item.gtAddrProvince || ''}"
                        data-province-code="${item.gtAddrProvinceCode || ''}"
                        data-city="${item.gtAddrCity || ''}"
                        data-city-code="${item.gtAddrCityCode || ''}"
                        data-county="${item.gtAddrCounty || ''}"
                        data-county-code="${item.gtAddrCountyCode || ''}"
                        value="${item.gtAddrProvince ? `${item.gtAddrProvince}/${item.gtAddrCity}/${item.gtAddrCounty}` : ''}"
                        click-trigger="address" select-trigger="address" readonly placeholder="城市/区域">
                      <span></span>
                    </div>
                  </div>
                </div>
                <div class="form-item">
                  <div class="form-label"></div>
                  <div class="form-crtl">
                    <div class="txt-input">
                      <input type="text" value="${item.gtAddrDetail || ''}" select-trigger="addressDetail" placeholder="详细地址">
                    </div>
                  </div>
                </div>
                <div class="form-item">
                  <div class="form-label">收件人</div>
                  <div class="form-crtl">
                    <div class="txt-input">
                      <input type="text" value="${item.gtAddresseeName || ''}" select-trigger="receiveName" placeholder="请输入">
                    </div>
                  </div>
                </div>
                <div class="form-item">
                  <div class="form-label">联系电话</div>
                  <div class="form-crtl">
                    <div class="txt-input">
                      <input type="text" value="${item.gtAddresseePhone || ''}" select-trigger="phone" placeholder="请输入">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="collapse" collapse="show">
            <div class="collapse-header" click-trigger="header">担保人配偶地址</div>
            <div class="collapse-body">
              <div class="form">
                <div class="form-item">
                  <div class="form-label">担保人配偶</div>
                  <div class="form-crtl">
                    <div class="txt-input">
                      <input type="text" value="${item.gtSpouseName || ''}" select-trigger="peiouName" placeholder="请输入">
                    </div>
                  </div>
                </div>
                <div class="form-item">
                  <div class="form-label">送达地址</div>
                  <div class="form-crtl">
                    <div class="city-select">
                      <input type="text"
                        data-province="${item.gtSpAddrProvince || ''}"
                        data-province-code="${item.gtSpAddrProvinceCode || ''}"
                        data-city="${item.gtSpAddrCity || ''}"
                        data-city-code="${item.gtSpAddrCityCode || ''}"
                        data-county="${item.gtSpAddrCounty || ''}"
                        data-county-code="${item.gtSpAddrCountyCode || ''}"
                        value="${item.gtSpAddrProvince ? `${item.gtSpAddrProvince}/${item.gtSpAddrCity}/${item.gtSpAddrCounty}` : ''}"
                        click-trigger="address" select-trigger="peiouAddress" readonly placeholder="城市/区域">
                      <span></span>
                    </div>
                  </div>
                </div>
                <div class="form-item">
                  <div class="form-label"></div>
                  <div class="form-crtl">
                    <div class="txt-input">
                      <input type="text" value="${item.gtSpAddrDetail || ''}" select-trigger="peiouAddressDetail" placeholder="详细地址">
                    </div>
                  </div>
                </div>
                <div class="form-item">
                  <div class="form-label">收件人</div>
                  <div class="form-crtl">
                    <div class="txt-input">
                      <input type="text" value="${item.gtSpouseAddresseeName || ''}" select-trigger="peiouReceiveName" placeholder="请输入">
                    </div>
                  </div>
                </div>
                <div class="form-item">
                  <div class="form-label">联系电话</div>
                  <div class="form-crtl">
                    <div class="txt-input">
                      <input type="text" value="${item.gtSpouseAddresseePhone || ''}" select-trigger="peiouPhone" placeholder="请输入">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      `
      $api.append(list, tpl)
    })
  }

  __pageDataFillBack (data) {
    const { documentBase, gtCounterList } = data || {}
    this.__renderBaseDocument(documentBase || {})
    this.__renderListDocument(gtCounterList || [])
  }

  async getPageData () {
    api.showProgress({ title: '加载中...', text: '', modal: false })
    try {
      const res = await this.querySendAddress(this.initData.gtCreditId)
      if (res.code === 200) {
        this.__pageDataFillBack(res.data)
      }
    } catch (error) {
      api.toast({ msg: error.msg || '出错啦', location: 'middle' })
    }
    api.hideProgress()
    api.refreshHeaderLoadDone()
  }

  __bindCollapseEvent () {
    document.querySelector('body').addEventListener('click', e => {
      const header = $api.closest(event.target, '[click-trigger="header"]')
      if (header) {
        const collapse = $api.closest(event.target, '.collapse')
        if (collapse) {
          let visiable = $api.attr(collapse, 'collapse')
          if (visiable === 'show') {
            visiable = 'hide'
          } else {
            visiable = 'show'
          }
          $api.attr(collapse, 'collapse', visiable)
        }
      }
    })
  }
  __initAddress () {
    document.querySelector('body').addEventListener('click', e => {
      const address = $api.closest(event.target, '[click-trigger="address"]')
      if (address) {
        CitySelector(selected => {
          let a = selected[0]
          let b = selected[1]
          let c = selected[2]
          e.target.value = `${a.name}/${b.name}/${c.name}`
          e.target.dataset.province = a.name
          e.target.dataset.provinceCode = a.id
          e.target.dataset.city = b.name
          e.target.dataset.cityCode = b.id
          e.target.dataset.county  = c.name
          e.target.dataset.countyCode = c.id
        })
      }
    })
  }

  bindEvent () {
    this.__initAddress()
    this.__bindCollapseEvent()
  }

  __initValidation () {
    const cfg = {
      custName: {
        valid: {
          required: '请填写借款人姓名',
        },
        get: function () {
          return $api.byId('custName').value
        }
      },
      address: {
        valid: {
          required: '请选择借款人文书送达地址',
        },
        get: function () {
          return $api.byId('address').value || ''
        }
      },
      addrProvince: {
        get: function () {
          return $api.byId('address').dataset.province || ''
        }
      },
      addrProvinceCode: {
        get: function () {
          return $api.byId('address').dataset.provinceCode || ''
        }
      },
      addrCity: {
        get: function () {
          return $api.byId('address').dataset.city || ''
        }
      },
      addrCityCode: {
        get: function () {
          return $api.byId('address').dataset.cityCode || ''
        }
      },
      addrCounty: {
        get: function () {
          return $api.byId('address').dataset.county || ''
        }
      },
      addrCountyCode: {
        get: function () {
          return $api.byId('address').dataset.countyCode || ''
        }
      },
      addrDetail: {
        valid: {
          required: '请填写借款人文书送达详细地址',
        },
        get: function () {
          return $api.byId('addrDetail').value
        }
      },
      custAddresseeName: {
        valid: {
          required: '请填写借款人收件姓名',
        },
        get: function () {
          return $api.byId('custAddresseeName').value
        }
      },
      custAddresseePhone: {
        valid: {
          required: '请填写借款人收件联系电话',
          pattern: [/^1[3456789]\d{9}$/, '手机号码格式不正确'],
        },
        get: function () {
          return $api.byId('custAddresseePhone').value
        }
      },
      custSpouseName: {
        get: function () {
          return $api.byId('custSpouseName').value
        }
      },
      peiouAddress: {
        get: function () {
          return $api.byId('peiouAddress').value || ''
        }
      },
      spAddrProvince: {
        get: function () {
          return $api.byId('peiouAddress').dataset.province || ''
        }
      },
      spAddrProvinceCode: {
        get: function () {
          return $api.byId('peiouAddress').dataset.provinceCode || ''
        }
      },
      spAddrCity: {
        get: function () {
          return $api.byId('peiouAddress').dataset.city || ''
        }
      },
      spAddrCityCode: {
        get: function () {
          return $api.byId('peiouAddress').dataset.cityCode || ''
        }
      },
      spAddrCounty: {
        get: function () {
          return $api.byId('peiouAddress').dataset.county || ''
        }
      },
      spAddrCountyCode: {
        get: function () {
          return $api.byId('peiouAddress').dataset.countyCode || ''
        }
      },
      spAddrDetail: {
        get: function () {
          return $api.byId('spAddrDetail').value
        }
      },
      custSpouseAddresseeName: {
        get: function () {
          return $api.byId('custSpouseAddresseeName').value
        }
      },
      custSpouseAddresseePhone: {
        valid: {
          pattern: [/^1[3456789]\d{9}$/, '借款人配偶手机号码格式不正确'],
        },
        get: function () {
          return $api.byId('custSpouseAddresseePhone').value
        }
      },
      gtCounterList: {
        shape: {
          gtName: {
            required: '请填写担保人姓名',
          },
          gtAddress: {
            required: '请选择担保人文书送达地址',
          },
          gtAddrDetail: {
            required: '请填写担保人文书送达详细地址'
          },
          gtAddresseeName: {
            required: '请填写担保人收件姓名'
          },
          gtAddresseePhone: {
            required: '请填写担保人收件联系电话',
            pattern: [/^1[3456789]\d{9}$/, '手机号码格式不正确'],
          },
          // gtSpouseName: {
          //   required: '请填写担保人配偶姓名'
          // },
          // gtSpAddress: {
          //   required: '请选择担保人配偶文书送达地址'
          // },
          // gtSpAddrDetail: {
          //   required: '请填写担保人配偶文书送达详细地址'
          // },
          // gtSpouseAddresseeName: {
          //   required: '请填写担保人配偶收件姓名'
          // },
          gtSpouseAddresseePhone: {
            pattern: [/^1[3456789]\d{9}$/, '担保人配偶手机号码格式不正确'],
          },
        },
        get: function () {
          let data = []
          let list = $api.domAll($api.byId('list'), '.item')
          for (key of Object.keys(list)) {
            let item = list[key]
            data.push({
              gtName: $api.dom(item, '[select-trigger="name"]').value,
              // 担保人地址
              gtAddress: $api.dom(item, '[select-trigger="address"]').value || '',
              gtAddrProvince: $api.dom(item, '[select-trigger="address"]').dataset.province || '',
              gtAddrProvinceCode: $api.dom(item, '[select-trigger="address"]').dataset.provinceCode || '',
              gtAddrCity: $api.dom(item, '[select-trigger="address"]').dataset.city || '',
              gtAddrCityCode: $api.dom(item, '[select-trigger="address"]').dataset.cityCode || '',
              gtAddrCounty: $api.dom(item, '[select-trigger="address"]').dataset.county || '',
              gtAddrCountyCode: $api.dom(item, '[select-trigger="address"]').dataset.countyCode || '',

              gtAddrDetail: $api.dom(item, '[select-trigger="addressDetail"]').value,
              gtAddresseeName: $api.dom(item, '[select-trigger="receiveName"]').value,
              gtAddresseePhone: $api.dom(item, '[select-trigger="phone"]').value,
              gtSpouseName: $api.dom(item, '[select-trigger="peiouName"]').value,
              // 担保人配偶地址
              gtSpAddress: $api.dom(item, '[select-trigger="peiouAddress"]').value || '',
              gtSpAddrProvince: $api.dom(item, '[select-trigger="peiouAddress"]').dataset.province || '',
              gtSpAddrProvinceCode: $api.dom(item, '[select-trigger="peiouAddress"]').dataset.provinceCode || '',
              gtSpAddrCity: $api.dom(item, '[select-trigger="peiouAddress"]').dataset.city || '',
              gtSpAddrCityCode: $api.dom(item, '[select-trigger="peiouAddress"]').dataset.cityCode || '',
              gtSpAddrCounty: $api.dom(item, '[select-trigger="peiouAddress"]').dataset.county || '',
              gtSpAddrCountyCode: $api.dom(item, '[select-trigger="peiouAddress"]').dataset.countyCode || '',

              gtSpAddrDetail: $api.dom(item, '[select-trigger="peiouAddressDetail"]').value,
              gtSpouseAddresseeName: $api.dom(item, '[select-trigger="peiouReceiveName"]').value,
              gtSpouseAddresseePhone: $api.dom(item, '[select-trigger="peiouPhone"]').value,
            })
          }
          return data
        }
      }
    }
    return new Validation(cfg)
  }

  submit () {
    this.__initValidation().validate({
      error: function (msg) {
        api.toast({ msg, location: 'middle' })
      },
      success: async (data) => {
        console.log(JSON.stringify(data))
        const sendData = {
          ...data,
          ...this.initData
        }
        api.showProgress({ title: '加载中...', text: '', modal: false })
        try {
          const res = await this.saveApply(sendData)
          if (res.code === 200) {
            api.toast({ msg: '保存成功', location: 'middle' })
            Utils.Router.closeCurrentWinAndRefresh({
                winName: 'html/danbaostep2/index',
                script: 'window.location.reload();'
            })
          }
        } catch (error) {
          api.toast({ msg: error.msg || '出错啦', location: 'middle' })
        }
        api.hideProgress()
      }
    })
  }

}

apiready = function () {

  const ctrl = new PageController()
  ctrl.bindEvent()
  ctrl.getPageData()

  setRefreshHeaderInfo(function(ret, err) {
    ctrl.getPageData()
  })

  $api.byId('save').onclick = function () {
    ctrl.submit()
  }

  api.addEventListener({
    name: 'navitembtn'
  }, (ret, err) => {
    if (ret.type === 'left') {
      api.closeWin()
    }
  })

}
