// import api from '@oj/api'

export default {
  data () {
    return {
      captchaSrc: ''
    }
  },
  methods: {
    validateForm (formName) {
      return new Promise((resolve, reject) => {
        this.$refs[formName].validate(valid => {
          if (!valid) {
            this.$error('please validate the error fields')
          } else {
            resolve(valid)
          }
        })
      })
    },
    getCaptchaSrc () {
      this.captchaSrc = '1234'
      // @TODO when you get the things done start to get the captcha
      // api.getCaptcha().then(res => {
      //   this.captchaSrc = res.data.data
      // })
    }
  }
}
