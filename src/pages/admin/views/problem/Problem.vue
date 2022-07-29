<template>
  <div class="problem">

    <Panel :title="title">
      <el-form ref="form" :model="problem" :rules="rules" label-position="top" label-width="70px">
        <el-row :gutter="20">
          <el-col :span="6" v-if="this.routeName === 'create-contest-problem' || this.routeName === 'edit-contest-problem'">
            <el-form-item :label="$t('m.Display_ID')"
                          :required="this.routeName === 'create-contest-problem' || this.routeName === 'edit-contest-problem'">
              <el-input :placeholder="$t('m.Display_ID')" v-model="problem.displayId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item prop="title" :label="$t('m.Title')" required>
              <el-input :placeholder="$t('m.Title')" v-model="problem.title"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item prop="description" :label="$t('m.Description')" required>
              <Simditor v-model="problem.description"></Simditor>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item prop="fInput" :label="$t('m.Input_Description')" required>
              <Simditor v-model="problem.fInput"></Simditor>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="fOutput" :label="$t('m.Output_Description')" required>
              <Simditor v-model="problem.fOutput"></Simditor>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="$t('m.Time_Limit') + ' (ms)' " required>
              <el-input type="Number" :placeholder="$t('m.Time_Limit')" v-model="problem.timeLimit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Memory_limit') + ' (KB)' " required>
              <el-input type="Number" :placeholder="$t('m.Memory_limit')" v-model="problem.memoryLimit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="this.routeName === 'create-problem' || this.routeName === 'edit-problem'">
            <el-form-item :label="$t('m.Tag')" :error="error.tags" required>
              <span class="tags" v-if="problem.tags">
                <el-tag
                  v-for="tag in problem.tags"
                  :closable="true"
                  :close-transition="false"
                  :key="tag.tid"
                  type="success"
                  @close="closeTag(tag)"
                >{{tag.tName}}</el-tag>
              </span>
              <el-autocomplete
                v-if="inputVisible"
                size="mini"
                class="input-new-tag"
                v-model="tagInput"
                :trigger-on-focus="false"
                @keyup.enter.native="addTag"
                @blur="addTag"
                @select="addTag"
                :fetch-suggestions="querySearch">
              </el-autocomplete>
              <el-button class="button-new-tag" v-else size="small" @click="inputVisible = true">+ {{$t('m.New_Tag')}}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="problem.samples">
          <el-form-item v-for="(sample, index) in problem.samples" :key="'sample'+index">
            <Accordion :title="'Sample' + (index + 1)">
              <el-button type="warning" size="small" icon="el-icon-delete" slot="header" @click="deleteSample(index)">
                Delete
              </el-button>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item :label="$t('m.Input_Samples')" required>
                    <el-input
                      :rows="5"
                      type="textarea"
                      :placeholder="$t('m.Input_Samples')"
                      v-model="sample.input" @input="change($event)">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('m.Output_Samples')" required>
                    <el-input
                      :rows="5"
                      type="textarea"
                      :placeholder="$t('m.Output_Samples')"
                      v-model="sample.output" @input="change($event)">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </Accordion>
          </el-form-item>
        </div>
        <div class="add-sample-btn">
          <button type="button" class="add-samples" @click="addSample()"><i class="el-icon-plus"></i>{{$t('m.Add_Sample')}}
          </button>
        </div>
        
        <el-form-item style="margin-top: 20px" :label="$t('m.Hint')">
          <Simditor v-model="problem.hint" placeholder=""></Simditor>
        </el-form-item>
        
        <div v-if="problem.checkpoints">
          <el-form-item v-for="(checkpoint, index) in problem.checkpoints" :key="'checkpoint'+index">
            <Accordion :title="'Checkpoint' + (index + 1)">
              <el-button type="warning" size="small" icon="el-icon-delete" slot="header" @click="deleteCheckpoint(index)">
                Delete
              </el-button>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item :label="$t('m.Input_Checkpoints')" required>
                    <el-input
                      :rows="5"
                      type="textarea"
                      :placeholder="$t('m.Input_Checkpoints')"
                      v-model="checkpoint.input">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('m.Output_Checkpoints')" required>
                    <el-input
                      :rows="5"
                      type="textarea"
                      :placeholder="$t('m.Output_Checkpoints')"
                      v-model="checkpoint.output">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </Accordion>
          </el-form-item>
        </div>
        <div class="add-checkpoint-btn">
          <button type="button" class="add-checkpoints" @click="addCheckpoint()"><i class="el-icon-plus"></i>{{$t('m.Add_Checkpoint')}}
          </button>
        </div>
        
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item :label="$t('m.Type')">
              <el-radio-group v-model="rule_type">
                <el-radio label="ACM">ACM</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label="$t('m.IOMode')">
              <el-radio-group v-model="io_mode">
                <el-radio label="Standard IO">Standard IO</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-table
              :data="problem.checkpoints"
              style="width: 100%">
              <el-table-column
                prop="input"
                :label="$t('m.Input')">
              </el-table-column>
              <el-table-column
                prop="output"
                :label="$t('m.Output')">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>

        <el-form-item :label="$t('m.Source')">
          <el-input :placeholder="$t('m.Source')" v-model="problem.author"></el-input>
        </el-form-item>
        <save @click.native="submit()">Save</save>
      </el-form>
    </Panel>
  </div>
</template>

<script>
  import Simditor from '../../components/Simditor'
  import Accordion from '../../components/Accordion'
  import CodeMirror from '../../components/CodeMirror'
  import api from '../../api'

  export default {
    name: 'Problem',
    components: {
      Simditor,
      Accordion,
      CodeMirror
    },
    data () {
      return {
        rules: {
          pid: {required: true, message: 'Display ID is required', trigger: 'blur'},
          title: {required: true, message: 'Title is required', trigger: 'blur'},
          fInput: {required: true, message: 'Input Description is required', trigger: 'blur'},
          fOutput: {required: true, message: 'Output Description is required', trigger: 'blur'}
        },
        loadingCompile: false,
        mode: '',
        contest: {},
        problem: {
          title: '',
          displayId: '',
          tags: [{tid: '', tName: '', tDescription: ''}],
          samples: [{sid: '', pid: '', input: '', output: ''}],
          checkpoints: [{cpid: '', pid: '', input: '', output: ''}],
          languages: []
        },
        reProblem: {
          title: '',
          displayId: '',
          tags: [{tid: '', tName: '', tDescription: ''}],
          samples: [{sid: '', pid: '', input: '', output: ''}],
          checkpoints: [{cpid: '', pid: '', input: '', output: ''}],
          languages: []
        },
        isContestMode: false,
        inputVisible: false,
        tagInput: '',
        template: {},
        title: '',
        spjMode: '',
        disableRuleType: false,
        routeName: '',
        error: {
          tags: '',
          spj: '',
          languages: '',
          testCase: ''
        },
        rule_type: 'ACM',
        io_mode: {'io_mode': 'Standard IO', 'input': 'input.txt', 'output': 'output.txt'}
      }
    },
    mounted () {
      this.routeName = this.$route.name
      console.log(this.$route.name)
      if (this.routeName === 'edit-problem' || this.routeName === 'edit-contest-problem') {
        this.mode = 'edit'
      } else {
        this.mode = 'add'
      }
      if (this.routeName === 'edit-contest-problem' || this.routeName === 'create-contest-problem') {
        this.isContestMode = true
      }
      this.problem = this.reProblem = {
        pid: '',
        addUid: '1',
        title: '',
        description: '',
        fInput: '',
        fOutput: '',
        timeLimit: 1000,
        memoryLimit: 65536,
        tags: [{tid: '', tName: '', tDescription: ''}],
        samples: [{sid: '', pid: '', input: '', output: ''}],
        checkpoints: [{cpid: '', pid: '', input: '', output: ''}],
        specialJudge: 0,
        hint: '',
        author: ''
      }
      let contestID = this.$route.params.contestId
      if (contestID) {
        this.problem.cid = this.reProblem.cid = contestID
        this.disableRuleType = true
        api.getContest(contestID).then(res => {
          this.contest = res.data.data
        })
      }

      // get problem after getting languages list to avoid find undefined value in `watch problem.languages`
      if (this.mode === 'edit') {
        this.title = this.$i18n.t('m.Edit_Problem')
        let funcName = {'edit-problem': 'getProblem', 'edit-contest-problem': 'getContestProblem'}[this.routeName]
        api[funcName](this.$route.params.problemId).then(problemRes => {
          let data = problemRes.data.data
          if (funcName === 'getContestProblem') {
            console.log('This is contest problem mode!')
            this.problem = data.problem
            this.problem.displayId = data.displayId
            this.problem.checkpoints = [{cpid: '', pid: '', input: '', output: ''}]
          } else {
            this.problem = data
          }
        })
      } else {
        this.title = this.$i18n.t('m.Add_Problem')
      }
    },
    watch: {
      '$route' () {
        this.$refs.form.resetFields()
        this.problem = this.reProblem
      }
    },
    methods: {
      change (e) {
        this.$forceUpdate()
      },
      querySearch (queryString, cb) {
        api.getProblemTagList().then(res => {
          let tagList = []
          for (let tag of res.data.data) {
            tagList.push({value: tag.tName})
          }
          cb(tagList)
        }).catch(() => {
        })
      },
      resetTestCase () {
        this.testCaseUploaded = false
        this.problem.test_case_score = []
        this.problem.test_case_id = ''
      },
      addTag () {
        let inputValue = this.tagInput
        if (inputValue) {
          this.problem.tags.push({tid: '', tName: inputValue, tDescription: ''})
        }
        this.inputVisible = false
        this.tagInput = ''
      },
      closeTag (tag) {
        this.problem.tags.splice(this.problem.tags.indexOf(tag), 1)
      },
      addSample () {
        this.problem.samples.push({sid: '', pid: '', input: '', output: ''})
        this.$forceUpdate()
      },
      deleteSample (index) {
        this.problem.samples.splice(index, 1)
        this.$forceUpdate()
      },
      addCheckpoint () {
        if (this.problem.checkpoints === null || this.problem.checkpoints === undefined) {
          this.problem.checkpoints = []
        }
        this.problem.checkpoints.push({cpid: '', pid: '', input: '', output: ''})
        this.$forceUpdate()
      },
      deleteCheckpoint (index) {
        this.problem.checkpoints.splice(index, 1)
        this.$forceUpdate()
      },
      submit () {
        if (!this.problem.samples.length) {
          this.$error('Sample is required')
          return
        }
        for (let sample of this.problem.samples) {
          if (!sample.input || !sample.output) {
            this.$error('Sample input and output is required')
            return
          }
        }
        if (!this.isContestMode) {
          if (!this.problem.tags.length) {
            this.error.tags = 'Please add at least one tag'
            this.$error(this.error.tags)
            return
          }
        } else {
          delete this.problem.tags
        }
        if (this.problem.specialJudge !== 0) {
          if (!this.problem.spj_code) {
            this.error.spj = 'Spj code is required'
            this.$error(this.error.spj)
          } else if (!this.problem.spj_compile_ok) {
            this.error.spj = 'SPJ code has not been successfully compiled'
          }
          if (this.error.spj) {
            this.$error(this.error.spj)
            return
          }
        }
        if (this.rule_type === 'OI') {
          for (let item of this.problem.test_case_score) {
            try {
              if (parseInt(item.score) <= 0) {
                this.$error('Invalid test case score')
                return
              }
            } catch (e) {
              this.$error('Test case score must be an integer')
              return
            }
          }
        }
        this.template = {}

        let funcName = {
          'create-problem': 'createProblem',
          'edit-problem': 'editProblem',
          'create-contest-problem': 'createContestProblem',
          'edit-contest-problem': 'editContestProblem'
        }[this.routeName]
        // edit contest problem 时, contest_id会被后来的请求覆盖掉
        if (funcName === 'editContestProblem') {
          this.problem.cid = this.contest.id
        }
        api[funcName](this.problem).then(res => {
          if (this.routeName === 'create-contest-problem' || this.routeName === 'edit-contest-problem') {
            this.$router.push({name: 'contest-problem-list', params: {contestId: this.$route.params.contestId}})
          } else {
            this.$router.push({name: 'problem-list'})
          }
        }).catch(() => {
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .problem {
    .difficulty-select {
      width: 120px;
    }
    .spj-radio {
      margin-left: 10px;
      &:last-child {
        margin-right: 20px;
      }
    }
    .input-new-tag {
      width: 78px;
    }
    .button-new-tag {
      height: 24px;
      line-height: 22px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .tags {
      .el-tag {
        margin-right: 10px;
      }
    }
    .accordion {
      margin-bottom: 10px;
    }
    .add-samples {
      width: 100%;
      background-color: #fff;
      border: 1px dashed #aaa;
      outline: none;
      cursor: pointer;
      color: #666;
      height: 35px;
      font-size: 14px;
      &:hover {
        background-color: #f9fafc;
      }
      i {
        margin-right: 10px;
      }
    }
    .add-sample-btn {
      margin-bottom: 10px;
    }
    .add-checkpoints {
      width: 100%;
      background-color: #fff;
      border: 1px dashed #aaa;
      outline: none;
      cursor: pointer;
      color: #666;
      height: 35px;
      font-size: 14px;
      &:hover {
        background-color: #f9fafc;
      }
      i {
        margin-right: 10px;
      }
    }
    .add-checkpoint-btn {
      margin-bottom: 10px;
    }

  }
</style>

<style>
  .dialog-compile-error {
    width: auto;
    max-width: 80%;
    overflow-x: scroll;
  }
</style>

