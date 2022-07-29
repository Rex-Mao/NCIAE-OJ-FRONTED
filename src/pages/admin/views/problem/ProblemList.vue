<template>
  <div class="view">
    <Panel :title="contestId ? this.$i18n.t('m.Contest_Problem_List') : this.$i18n.t('m.Problem_List')">
      <div slot="header">
        <el-input
          v-model="keyword"
          prefix-icon="el-icon-search"
          placeholder="Keywords">
        </el-input>
      </div>
      <el-table
        v-loading="loading"
        element-loading-text="loading"
        ref="table"
        :data="problemList"
        style="width: 100%">
        <el-table-column
          width="100"
          prop="pid"
          label="ID">
        </el-table-column>
        <el-table-column
          width="150"
          label="Display ID">
          <template slot-scope="{row}">
            <span v-show="!row.isEditing">{{isContestMode ? row.displayId : row.pid}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Title">
          <template slot-scope="{row}">
            <span v-show="!row.isEditing">{{isContestMode ? row.problem.title : row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="author"
          label="Author">
          <template slot-scope="{row}">
            <span v-show="!row.isEditing">{{isContestMode? row.problem.author : row.author}}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="Operation"
          width="250">
          <div slot-scope="scope">
            <icon-btn v-if="isContestMode && scope.row.problem.status === 0" name="This is a Public Problem" icon="star"></icon-btn>
            <icon-btn v-if="(!isContestMode && scope.row.status === 0) || (isContestMode && scope.row.problem.status === 1)" 
                      name="Edit" icon="edit" @click.native="goEdit((isContestMode ? scope.row.cpid : scope.row.pid))"></icon-btn>
            <!-- @TODO get the public problem when you rebuild the project -->
            <!-- <icon-btn v-if="contestId && (isContestMode && scope.row.problem.status === 1)" name="Make Public" icon="clone"
                      @click.native="makeContestProblemPublic(scope.row.cpid)"></icon-btn> -->
            <!-- <icon-btn icon="download" name="Download TestCase"
                      @click.native="downloadTestCase(scope.row.pid)"></icon-btn> -->
            <icon-btn icon="trash" name="Delete Problem"
                      @click.native="deleteProblem((isContestMode ? scope.row.cpid : scope.row.pid))"></icon-btn>
          </div>
        </el-table-column>
      </el-table>
      <div class="panel-options">
        <el-button type="primary" size="small"
                   @click="goCreateProblem" icon="el-icon-plus">Create
        </el-button>
        <el-button v-if="contestId" type="primary"
                   size="small" icon="el-icon-plus"
                   @click="addProblemDialogVisible = true">Add From Public Problem
        </el-button>
        <el-pagination
          class="page"
          layout="prev, pager, next"
          @current-change="currentChange"
          :page-size="pageSize"
          :total="total">
        </el-pagination>
      </div>
    </Panel>
    <el-dialog title="Add Contest Problem"
               v-if="contestId"
               width="80%"
               :visible.sync="addProblemDialogVisible"
               @close-on-click-modal="false">
      <add-problem-component :contestID="contestId" @on-change="getProblemList"></add-problem-component>
    </el-dialog>
  </div>
</template>

<script>
  import api from '../../api.js'
  import utils from '@/utils/utils'
  import AddProblemComponent from './AddPublicProblem.vue'

  export default {
    name: 'ProblemList',
    components: {
      AddProblemComponent
    },
    data () {
      return {
        pageSize: 10,
        total: 0,
        problemList: [],
        keyword: '',
        loading: false,
        currentPage: 1,
        routeName: '',
        contestId: '',
        // for make public use
        isContestMode: false,
        currentProblemID: '',
        currentRow: {},
        InlineEditDialogVisible: false,
        makePublicDialogVisible: false,
        addProblemDialogVisible: false
      }
    },
    mounted () {
      this.routeName = this.$route.name
      this.contestId = this.$route.params.contestId
      if (this.routeName === 'contest-problem-list') {
        this.isContestMode = true
      }
      this.getProblemList(this.currentPage)
    },
    methods: {
      goEdit (problemId) {
        if (this.routeName === 'problem-list') {
          this.$router.push({name: 'edit-problem', params: {problemId: problemId}})
        } else if (this.routeName === 'contest-problem-list') {
          this.$router.push({name: 'edit-contest-problem', params: {problemId: problemId, contestId: this.contestId}})
        }
      },
      goCreateProblem () {
        if (this.routeName === 'problem-list') {
          this.$router.push({name: 'create-problem'})
        } else if (this.routeName === 'contest-problem-list') {
          this.$router.push({name: 'create-contest-problem', params: {contestId: this.contestId}})
        }
      },
      // 切换页码回调
      currentChange (page) {
        this.currentPage = page
        this.getProblemList(page)
      },
      getProblemList (page = 1) {
        this.loading = true
        let funcName = this.routeName === 'problem-list' ? 'getProblemList' : 'getContestProblemList'
        let params = {
          limit: this.pageSize,
          offset: (page - 1) * this.pageSize,
          keyword: this.keyword,
          cid: this.contestId
        }
        api[funcName](params).then(res => {
          this.loading = false
          this.total = res.data.data.total
          for (let problem of res.data.data.results) {
            problem.isEditing = false
          }
          this.problemList = res.data.data.results
        }, res => {
          this.loading = false
        })
      },
      deleteProblem (id) {
        this.$confirm('Sure to delete this problem? The associated submissions will be deleted as well.', 'Delete Problem', {
          type: 'warning'
        }).then(() => {
          let funcName = this.routeName === 'problem-list' ? 'deleteProblem' : 'deleteContestProblem'
          api[funcName](id).then(() => [
            this.getProblemList(this.currentPage - 1)
          ]).catch(() => {
          })
        }, () => {
        })
      },
      makeContestProblemPublic (problemID) {
        this.$prompt('Please input display id for the public problem', 'confirm').then(({value}) => {
          api.makeContestProblemPublic({id: problemID, display_id: value}).catch()
        }, () => {
        })
      },
      updateProblem (row) {
        let data = Object.assign({}, row)
        let funcName = ''
        if (this.contestId) {
          data.cid = this.contestId
          funcName = 'editContestProblem'
        } else {
          funcName = 'editProblem'
        }
        api[funcName](data).then(res => {
          this.InlineEditDialogVisible = false
          this.getProblemList(this.currentPage)
        }).catch(() => {
          this.InlineEditDialogVisible = false
        })
      },
      downloadTestCase (problemID) {
        let url = '/admin/test_case?problem_id=' + problemID
        utils.downloadFile(url)
      },
      getPublicProblem () {
        api.getProblemList()
      }
    },
    watch: {
      '$route' (newVal, oldVal) {
        this.contestId = newVal.params.contestId
        this.routeName = newVal.name
        this.getProblemList(this.currentPage)
      },
      'keyword' () {
        this.currentChange()
      }
    }
  }
</script>

<style scoped lang="less">
</style>
