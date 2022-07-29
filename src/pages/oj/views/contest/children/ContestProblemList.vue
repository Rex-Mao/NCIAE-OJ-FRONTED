<template>
  <div>
    <Panel>
      <div slot="title">{{$t('m.Problems_List')}}</div>
      <Table v-if="contestRuleType == 'ACM' || OIContestRealTimePermission"
             :columns="ACMTableColumns"
             :data="problems"
             @on-row-click="goContestProblem"
             :no-data-text="$t('m.No_Problems')"></Table>
      <Table v-else
             :data="problems"
             :columns="OITableColumns"
             @on-row-click="goContestProblem"
             no-data-text="$t('m.No_Problems')"></Table>
    </Panel>
  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import {ProblemMixin} from '@oj/components/mixins'

  export default {
    name: 'ContestProblemList',
    mixins: [ProblemMixin],
    data () {
      return {
        ACMTableColumns: [
          {
            title: '#',
            key: 'displayId',
            sortType: 'asc',
            width: 150
          },
          {
            title: this.$i18n.t('m.Title'),
            render: (h, params) => {
              return h('span', params.row.problem.title)
            }
          },
          {
            title: this.$i18n.t('m.Total'),
            key: 'submitNum'
          },
          {
            title: this.$i18n.t('m.AC_Rate'),
            render: (h, params) => {
              return h('span', this.getACRate(params.row.solvedNum, params.row.submitNum))
            }
          }
        ]
      }
    },
    mounted () {
      this.getContestProblems()
    },
    methods: {
      getContestProblems () {
        this.$store.dispatch('getContestProblems').then(res => {
          if (this.isAuthenticated) {
            if (this.contestRuleType === 'ACM') {
              this.addStatusColumn(this.ACMTableColumns, res.data.data.results)
            } else if (this.OIContestRealTimePermission) {
              this.addStatusColumn(this.ACMTableColumns, res.data.data.results)
            }
          }
        })
      },
      goContestProblem (row) {
        this.$router.push({
          name: 'contest-problem-details',
          params: {
            contestID: this.$route.params.contestID,
            problemID: row.cpid
          }
        })
      }
    },
    computed: {
      ...mapState({
        problems: state => state.contest.contestProblems
      }),
      ...mapGetters(['isAuthenticated', 'contestRuleType', 'OIContestRealTimePermission'])
    }
  }
</script>

<style scoped lang="less">
</style>
