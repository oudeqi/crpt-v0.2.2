import './index.less'
import Utils from './../../../utils'
import service from './service';

apiready = function () {
  let pageParam = api.pageParam || {};
  const dialogBox = api.require('dialogBox');

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
      pcd: {},
      hasSelected: false,
      pcdString: '',
      address: '',
      uploadImgType: {
        0: 'camera',
        1: 'album'
      },
      businessLicense: '',
      productId: pageParam.productId || '1'
    },
    methods: {
      handlePickCity() {
        Utils.UI.setCityPicker({
          success: selected => {
            let [province, city, district] = selected
            this.pcd = {
              province: {
                name: province.name,
                code: province.id
              },
              city: {
                name: city.name,
                code: city.id
              },
              district: {
                name: district.name,
                code: district.id
              }
            }
            this.hasSelected = true
            this.pcdString = `${province.name} ${city.name} ${district.name}`
            // dom.innerHTML = `<span class="fc_c_city_label selected">${province.name} ${city.name} ${district.name}</span>`
          },
          data: 'widget://res/city.json',
        })
      },
      handleChangeAddress(event) {
        this.address = event.target.value
      },
      handleUploadPic() {
        Utils.File.actionSheet('请选择', ['相机', '相册'], (index) => {
          Utils.File.getPicture(this.uploadImgType[index], (res, err) => {
            if (res) {
              if (res.data) {
                this.businessLicense = res.data
                Utils.UI.toast('上传成功')
              } else {
                Utils.UI.toast('未上传成功')
              }
            }
          })
        })
      },
      async handleClick() {
        if (!this.address || !this.hasSelected) {
          Utils.UI.toast('请填写企业经营地址')
          return
        }
        if (!this.businessLicense) {
          Utils.UI.toast('请上传营业执照')
          return
        }
        Utils.UI.dialog({title: '请确认提交资料是否正确，提交之后无法修改' , callback: this.handleSubmit})
      },
      async handleSubmit() {
        try {
          Utils.UI.showLoading('提交中')
          const res = await service.postCompanyInfo({
            productId: this.productId,
            provinceName: this.pcd.province.name,
            provinceCode: this.pcd.province.code,
            cityName: this.pcd.city.name,
            cityCode: this.pcd.city.code,
            zoneName: this.pcd.district.name,
            zoneCode: this.pcd.district.code,
            addr: this.address
          }, {
            businessLicense: this.businessLicense,
          })
          console.log(res)
        } catch (error) {
          if (error.msg) {
            Utils.UI.toast(`${error.code} - ${error.msg}`)
          }
          console.log(JSON.stringify(error))
        }
        Utils.UI.hideLoading()
      }
    },
    
  })
}