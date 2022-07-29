<docs>
## YuAreaPicker Docs

* 去掉 $sdk，UI 组件库不与 SDK 耦合
</docs>

<template>
  <div class="yu-area_picker" data-com="YuAreaPicker">
    <div class="yu-area_picker-cont"
      :class="{
        'i-placeholder': !district[1]
      }"
    >
      <div v-if="province[1] || city[1] || district[1]">{{ province[1] || '省份' }}&nbsp;&nbsp;{{ city[1] || '城市' }}&nbsp;&nbsp;{{ district[1] || '县区' }}</div>
      <input v-else type="text" :placeholder="placeholder" />
    </div>
    <YuPopup v-model="onPop">
      <div class="yu-area_picker-box">
        <yu-nav-bar class="yu-area_picker-bar" :title="title" :has-back="false"></yu-nav-bar>
        <div class="yu-area_picker-bar_area"><span :class="{'i-active': step === 0}">{{`${province[1] || '省份'}`}}</span><span :class="{'i-active': step === 1}">{{`${city[1] || '城市'}`}}</span><span :class="{'i-active': step === 2}">{{`${district[1] || '县区'}`}}</span></div>
        <div class="yu-area_picker-items">
          <span class="yu-area_picker-item" v-for="(item, index) in nowList" :key="item[0]" @click="fnItemClick(item, index)"
            :class="{
              'i-active': index === nSelect
            }"
          >{{ item[1] }}</span>
        </div>
      </div>
    </YuPopup>
  </div>
</template>

<script>
export default {
  name: 'YuAreaPicker',
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    },
    placeholder: String,
    whiteList: Array,
    findPrev: Function,
    findNext: Function,
    getData: Function
  },
  data () {
    return {
      isLock: false,
      onPop: false,
      title: '选择地区',
      nSelect: null,
      step: 0,
      nowList: null,
      nowProvinceList: [],
      nowCityList: [],
      nowDistrictList: [],
      sCountryCode: '',
      province: [],
      city: [],
      district: []
    }
  },
  created () {
    if (this.value.district_code) {
      this.sCountryCode = this.value.country_code || ''
      this.setArea(this.value.district_code)
    }
  },
  methods: {
    fnInput (districtCode) {
      this.$emit('input', {
        country: '',
        country_code: this.sCountryCode,
        district_code: districtCode,
        location_full_titles: `${this.province[1] || ''},${this.city[1] || ''},${this.district[1] || ''}`,
        location_full_codes: `${this.province[0] || ''},${this.city[0] || ''},${this.district[0] || ''}`,
        metas: {}
      })
    },
    fnItemClick (item, index) {
      if (!this.isLock) {
        this.isLock = true
        this.nSelect = index
        setTimeout(() => {
          let _isEnd = false
          let _items = null
          if (this.step === 0) {
            this.setProvince(item)
            _items = this.nowCityList
            if (_items.length === 1) {
              // 默认选第一个
              this.setCity(_items[0])
              this.nowList = this.nowDistrictList
              this.step = 2
            } else {
              this.nowList = _items
              this.step = 1
            }
            this.nSelect = null
          } else if (this.step === 1) {
            this.setCity(item)
            _items = this.nowDistrictList
            if (_items.length === 0) {
              // 默认选当前
              this.setDistrict(item)
              this.step = 3
              _isEnd = true
            } else {
              this.nowList = _items
              this.step = 2
            }
            this.nSelect = null
          } else if (this.step === 2) {
            this.setDistrict(item)
            this.step = 3
            this.nSelect = null
            _isEnd = true
          }
          if (_isEnd) {
            this.fnClose()
            this.fnInput(this.district[0])
          }
          this.isLock = false
        }, 300)
      }
    },
    setArea (code) {
      this.$sdk.area.findPrev(code, oArea => {
        if (oArea) {
          this.province = oArea.province
          this.city = oArea.city
          this.district = oArea.district || oArea.city
        } else {
          this.$toast.info('获取地区信息异常')
        }
      })
    },
    setProvince (item) {
      this.province = [item[0], item[1], item[2]]
      this.city = []
      this.district = []
      this.getCityList()
    },
    setCity (item) {
      this.city = [item[0], item[1], item[2]]
      this.district = []
      this.getDistrictList()
    },
    setDistrict (item) {
      this.district = [item[0], item[1], item[2]]
    },
    fnOpen () {
      this.onPop = true
      this.$emit('active', true)
      if (this.onPop) {
        this.step = 0
        this.nSelect = null
        this.getProvinceList(err => {
          if (!err) {
            this.nowList = this.nowProvinceList
          }
        })
      }
    },
    fnClose () {
      this.onPop = false
      this.$emit('active', false)
    },
    getProvinceList (cb) {
      this.$sdk.area.getData('main', data => {
        if (data) {
          this.nowProvinceList = data
          cb && cb()
        } else {
          this.$toast.info('获取地区信息异常')
        }
      })
    },
    getCityList (cb) {
      this.$sdk.area.findNext(this.province[0], data => {
        if (data) {
          this.nowCityList = data
          cb && cb()
        } else {
          this.$toast.info('获取地区信息异常')
        }
      })
    },
    getDistrictList (cb) {
      this.$sdk.area.findNext(this.city[0], data => {
        if (data) {
          this.nowDistrictList = data
          cb && cb()
        } else {
          this.$toast.info('获取地区信息异常')
        }
      })
    }
  }
}
</script>

<style>
.yu-area_picker {
  display: block;
  margin: auto;
  width: stretch;
}
.yu-area_picker-cont {
  pointer-events: none;
  text-align: left;
}
.yu-area_picker-cont.i-placeholder > input {
  display: inline-block;
  margin: 0;
  padding: 0;
  border: none;
}
.yu-area_picker-box {
  width: 100%;
}
.yu-area_picker-bar {
  border: none;
}
.yu-area_picker-bar_area {
  padding: 0 30px 15px;
  border: 0 solid #d5d5d5;
  border-width: 0 0 var(--1px);
}
.yu-area_picker-bar_area > span {
  display: inline-block;
  margin: 0 15px 0 0;
}
.yu-area_picker-bar_area > span.i-active {
  color: #4685ee;
}
.yu-area_picker-items {
  padding: 15px 0;
  width: 100vw;
  height: 50vh;
  background-color: #fff;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}
.yu-area_picker-item {
  display: block;
  margin: 0;
  padding: 0 0 0 30px;
  border: none;
  outline: none;
  background: none;
  width: stretch;
  height: 38px;
  line-height: 38px;
  text-align: left;
}
.yu-area_picker-item.i-active {
  color: #4685ee;
}
</style>
