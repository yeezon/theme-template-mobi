<docs>
## YkAccountUser Docs
</docs>

<template>
  <div class="yk-account_user" data-com="YkAccountUser">
    <YuHeader :is-fixed="true">
      <YuNavBar title="个人信息" />
    </YuHeader>
    <router-view class='yk-account_user-sub_view' @change="fnAccountChange" />
    <div class="yu-cells yk-account_user-main_view">
      <YuCell label="头像" @click="fnAvatar" :is-link="true">
        <div class="yk-account_user-avatar" :style="{ backgroundImage: `url(${oAccount.avatar_url})` }" />
      </YuCell>
      <YuCell label="昵称" :placeholder="oAccount.name" @click="fnGo('/account/user/edit?name=' + oAccount.name)" :is-link="true" />
      <YuCell label="邮箱地址" :placeholder="oAccount.notify_email" @click="fnGo('/account/user/edit?notify_email=' + oAccount.notify_email)" :is-link="true" />
      <YuCell label="手机号码" :placeholder="oAccount.notify_phone" @click="fnGo('/account/user/edit?notify_phone=' + oAccount.notify_phone)" :is-link="true" />
      <YuCell label="真实姓名" :placeholder="oAccount.real_name" @click="fnGo('/account/user/edit?real_name=' + oAccount.real_name)" :is-link="true" />
      <YuCell label="身份证号码" :placeholder="oAccount.indentity_card" @click="fnGo('/account/user/edit?indentity_card=' + oAccount.indentity_card)" :is-link="true" />
      <YuField
        type="date"
        label="生日"
        :value="birthday"
        @change="fnBirthday"
      />
      <YuField
        type="select"
        label="性别"
        :value="oAccount.sex"
        :options="sexOptions"
        @change="fnSex"
      >
        <span slot="val">{{ sexLabel }}</span>
      </YuField>
      <input type="file" accept="image/*" @change="fnAddAvatar" ref="file" style="display: none;">
    </div>
  </div>
</template>

<script>
import Date from '@/utils/date'

export default {
  componentName: 'YkAccountUser',
  props: {
    account: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      sexOptions: [
        {
          value: 'undefined',
          label: '保密'
        },
        {
          value: 'male',
          label: '男'
        },
        {
          value: 'female',
          label: '女'
        }
      ]
    }
  },
  computed: {
    oAccount () {
      return this.$store.state.account.oInfo || {}
    },
    birthday () {
      return (Date(this.oAccount.birthday, 'YYYY-MM-DD') || '')
    },
    sexLabel () {
      let _sex = this.oAccount.sex
      if (_sex === 'male') {
        _sex = '男'
      } else if (_sex === 'female') {
        _sex = '女'
      } else {
        _sex = '保密'
      }
      return _sex
    }
  },
  methods: {
    fnGo (path) {
      this.$router.push(path)
    },
    fnAvatar () {
      this.$refs.file.click()
    },
    fnAddAvatar (evt) {
      console.log(evt.target.files[0])
    },
    fnSex (val) {
      if (val !== this.oAccount.sex) {
        this.fnAccountSave({
          sex: val
        }, err => {
          if (err) {
            this.$toast.info(err)
          }
        })
      }
    },
    fnBirthday (val) {
      if (val !== this.oAccount.birthday) {
        this.fnAccountSave({
          birthday: val
        }, err => {
          if (err) {
            this.$toast.info(err)
          }
        })
      }
    },
    fnAccountSave (oNotify, cb) {
      this.$sdk.account.save(oNotify, data => {
        let err = null
        if (data && data.res) {
          if (data.res.code === 200) {
            this.fnAccountChange(data.res.customer || {})
          } else {
            err = data.res.message || '修改用户数据获取出错'
          }
        } else {
          err = '修改用户数据请求异常'
        }
        cb && cb(err)
      })
    },
    fnAccountChange (oAccount) {
      this.$store.dispatch('setAccountUser', {
        user: oAccount || {}
      })
    }
  }
}
</script>

<style scoped>
  .yk-account_user {
    /*min-height: var(--100vh);*/
  }
  .yk-account_user-sub_view ~ .yk-account_user-main_view {
    display: none;
  }
  .yk-account_user-main_view {
    border-width: 0 0 var(--1px);
  }
  .yk-account_user-avatar {
    margin: 1px 1px 1px auto;
    width: 62px;
    height: 62px;
    border: 3px solid #fff;
    border-radius: 50%;
    box-shadow: 0 0 0 1px #d5d5d5;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
  }
</style>
