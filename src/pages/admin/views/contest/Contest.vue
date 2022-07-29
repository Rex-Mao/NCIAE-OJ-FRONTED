<template>
  <div class="view">
    <Panel :title="title">
      <el-form label-position="top">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label="$t('m.ContestTitle')" required>
              <el-input v-model="contest.title" :placeholder="$t('m.ContestTitle')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('m.ContestDescription')" required>
              <Simditor v-model="contest.description"></Simditor>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Contest_Start_Time')" required>
              <el-date-picker
                v-model="contest.startTime"
                type="datetime"
                :placeholder="$t('m.Contest_Start_Time')">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Contest_End_Time')" required>
              <el-date-picker
                v-model="contest.endTime"
                type="datetime"
                :placeholder="$t('m.Contest_End_Time')">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Contest_Status')">
              <el-switch
                v-model="contest.cStatus"
                active-text=""
                inactive-text="">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Contest_Public')">
              <el-switch
                v-model="contest.cPublic"
                active-text=""
                inactive-text="">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="!contest.cPublic">
            <el-form-item :label="$t('m.Contest_Password')">
              <el-input v-model="contest.password" :placeholder="$t('m.Contest_Password')"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item :label="$t('m.Real_Time_Rank')">
              <el-switch
                v-model="contest.real_time_rank"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </el-col> -->

          <!-- <el-col :span="24">
            <el-form-item :label="$t('m.Allowed_IP_Ranges')">
              <div v-for="(range, index) in contest.allowed_ip_ranges" :key="index">
                <el-row :gutter="20" style="margin-bottom: 15px">
                  <el-col :span="8">
                    <el-input v-model="range.value" :placeholder="$t('m.CIDR_Network')"></el-input>
                  </el-col>
                  <el-col :span="10">
                    <el-button plain icon="el-icon-fa-plus" @click="addIPRange"></el-button>
                    <el-button plain icon="el-icon-fa-trash" @click="removeIPRange(range)"></el-button>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
      <save @click.native="saveContest"></save>
    </Panel>
  </div>
</template>

<script>
  import api from '../../api.js'
  import Simditor from '../../components/Simditor.vue'

  export default {
    name: 'CreateContest',
    components: {
      Simditor
    },
    data () {
      return {
        title: 'Create Contest',
        disableRuleType: false,
        contest: {
          title: '',
          description: '',
          startTime: '',
          endTime: '',
          // rule_type: 'ACM',
          password: '',
          cStatus: true,
          cPublic: false
        },
        real_time_rank: true
      }
    },
    methods: {
      saveContest () {
        let funcName = this.$route.name === 'edit-contest' ? 'editContest' : 'createContest'
        this.contest.cStatus = this.contest.cStatus ? 0 : -2
        let data = Object.assign({}, this.contest)
        api[funcName](data).then(res => {
          this.$router.push({name: 'contest-list', query: {refresh: 'true'}})
        }).catch(() => {
        })
      }
    },
    mounted () {
      if (this.$route.name === 'edit-contest') {
        this.title = 'Edit Contest'
        this.disableRuleType = true
        api.getContest(this.$route.params.contestId).then(res => {
          let data = res.data.data
          this.contest = data
        }).catch(() => {
        })
      }
    }
  }
</script>
