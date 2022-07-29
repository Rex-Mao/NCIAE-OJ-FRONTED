<template>
  <Row type="flex" justify="space-around">
    <Col :span="20" id="status">
      <Alert :type="status.type" showIcon>
        <span class="title">{{$t('m.' + status.statusName.replace(/ /g, "_"))}}</span>
        <div slot="desc" class="content">
          <!-- <template v-if="isCE">
            <pre>{{submission.statistic_info.err_info}}</pre>
          </template> -->
          <template>
            <span>{{$t('m.Time')}}: {{submission.usedTime}} MS</span>
            <span>{{$t('m.Memory')}}: {{submission.usedMemory}} KB</span>
            <span>{{$t('m.Lang')}}: {{submission.language === undefined ? 'C++' : submission.language.languageName}}</span>
            <span>{{$t('m.Author')}}: {{submission.commitNickname}}</span>
          </template>
        </div>
      </Alert>
    </Col>

    <!--后台返info就显示出来， 权限控制放后台 -->
    <!-- <Col v-if="submission.info && !isCE" :span="20">
      <Table stripe :loading="loading" :disabled-hover="true" :columns="columns" :data="submission.info.data"></Table>
    </Col> -->

    <Col :span="20">
      <Highlight :code="submission.sourceCode" 
      :language="submission.language === undefined ? 'C++' : submission.language.languageName" :border-color="status.color"></Highlight>
    </Col>
    <!-- <Col v-if="submission.can_unshare" :span="20">
      <div id="share-btn">
        <Button v-if="submission.shared"
                type="warning" size="large" @click="shareSubmission(false)">
          {{$t('m.UnShare')}}
        </Button>
        <Button v-else
                type="primary" size="large" @click="shareSubmission(true)">
          {{$t('m.Share')}}
        </Button>
      </div>
    </Col> -->
  </Row>

</template>

<script>
  import api from '@oj/api'
  import {JUDGE_STATUS} from '@/utils/constants'
  import utils from '@/utils/utils'
  import Highlight from '@/pages/oj/components/Highlight'
import { mapActions } from 'vuex'

  export default {
    name: 'submissionDetails',
    components: {
      Highlight
    },
    data () {
      return {
        // columns: [
        //   {
        //     title: this.$i18n.t('m.ID'),
        //     align: 'center',
        //     type: 'index'
        //   },
        //   {
        //     title: this.$i18n.t('m.Status'),
        //     align: 'center',
        //     render: (h, params) => {
        //       return h('Tag', {
        //         props: {
        //           color: JUDGE_STATUS[params.row.result].color
        //         }
        //       }, this.$i18n.t('m.' + JUDGE_STATUS[params.row.result].name.replace(/ /g, '_')))
        //     }
        //   },
        //   {
        //     title: this.$i18n.t('m.Memory'),
        //     align: 'center',
        //     render: (h, params) => {
        //       return h('span', utils.submissionMemoryFormat(params.row.memory))
        //     }
        //   },
        //   {
        //     title: this.$i18n.t('m.Time'),
        //     align: 'center',
        //     render: (h, params) => {
        //       return h('span', utils.submissionTimeFormat(params.row.cpu_time))
        //     }
        //   }
        // ],
        submission: {
          result: '0',
          sourceCode: '',
          language: {
            languageName: ''
          }
        },
        isConcat: false,
        loading: false
      }
    },
    mounted () {
      this.getSubmission()
    },
    methods: {
      ...mapActions['getLanguage'],
      transferLanguage () {
        utils.getLanguages().then(languages => {
          for (let i = 0; i < languages.length; i++) {
            if (this.submission.languageId === languages[i].languageId) {
              this.submission.language = languages[i]
              console.log(this.submission)
            }
          }
        })
      },
      getSubmission () {
        this.loading = true
        api.getSubmission(this.$route.params.id).then(res => {
          this.loading = false
          let data = res.data.data
          if (data.info && data.info.data && !this.isConcat) {
            // score exist means the submission is OI problem submission
            if (data.info.data[0].score !== undefined) {
              this.isConcat = true
              const scoreColumn = {
                title: this.$i18n.t('m.Score'),
                align: 'center',
                key: 'score'
              }
              this.columns.push(scoreColumn)
              this.loadingTable = false
            }
            if (this.isAdminRole) {
              this.isConcat = true
              const adminColumn = [
                {
                  title: this.$i18n.t('m.Real_Time'),
                  align: 'center',
                  render: (h, params) => {
                    return h('span', utils.submissionTimeFormat(params.row.real_time))
                  }
                },
                {
                  title: this.$i18n.t('m.Singal'),
                  align: 'center',
                  key: 'signal'
                }
              ]
              this.columns = this.columns.concat(adminColumn)
            }
          }
          this.submission = data.data
          this.submission.result = data.result
          this.transferLanguage()
        }, () => {
          this.loading = false
        })
      },
      shareSubmission (shared) {
        let data = {id: this.submission.recordId, shared: shared}
        api.updateSubmission(data).then(res => {
          this.getSubmission()
          this.$success(this.$i18n.t('m.Succeeded'))
        }, () => {
        })
      }
    },
    computed: {
      status () {
        return {
          type: JUDGE_STATUS[this.submission.result].type,
          statusName: JUDGE_STATUS[this.submission.result].name,
          color: JUDGE_STATUS[this.submission.result].color
        }
      },
      isCE () {
        return this.submission.result === -2
      },
      isAdminRole () {
        return this.$store.getters.isAdminRole
      }
    }
  }
</script>

<style scoped lang="less">
  #status {
    .title {
      font-size: 20px;
    }
    .content {
      margin-top: 10px;
      font-size: 14px;
      span {
        margin-right: 10px;
      }
      pre {
        white-space: pre-wrap;
        word-wrap: break-word;
        word-break: break-all;
      }
    }
  }

  .admin-info {
    margin: 5px 0;
    &-content {
      font-size: 16px;
      padding: 10px;
    }
  }

  #share-btn {
    float: right;
    margin-top: 5px;
    margin-right: 10px;
  }

  pre {
    border: none;
    background: none;
  }
</style>
