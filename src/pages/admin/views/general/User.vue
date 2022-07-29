<template>
  <div class="view">
    <Panel :title="$t('m.User_User') ">
      <div slot="header">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-button v-show="selectedUsers.length"
                       type="warning" icon="el-icon-fa-trash"
                       @click="deleteUsers(selectedUserIDs)">Delete
            </el-button>
          </el-col>
          <el-col :span="selectedUsers.length ? 16: 24">
            <el-input v-model="keyword" prefix-icon="el-icon-search" placeholder="Keywords"></el-input>
          </el-col>
        </el-row>
      </div>
      <el-table
        v-loading="loadingTable"
        element-loading-text="loading"
        @selection-change="handleSelectionChange"
        ref="table"
        :data="userList"
        style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column prop="uid" label="ID"></el-table-column>

        <el-table-column prop="nickname" label="Username"></el-table-column>

        <el-table-column prop="regtime" label="Create Time">
          <template slot-scope="scope">
            {{scope.row.regtime | localtime }}
          </template>
        </el-table-column>

        <el-table-column prop="email" label="Email"></el-table-column>

        <el-table-column prop="roles" label="Highest Authority">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.roles.length !== 0" placement="bottom-start">
              <div slot="content" v-for="item in scope.row.roles" :key="item.roleId">
                {{ item.rolename }}
              </div>
              <el-tag> {{ scope.row.roles[0].rolename }}</el-tag>
            </el-tooltip>
            <el-tooltip v-else>
              <el-tag type="danger" > No Authority </el-tag>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="Option" width="200">
          <template slot-scope="{row}">
            <icon-btn name="Edit" icon="edit" @click.native="openUserDialog(row.uid)"></icon-btn>
            <icon-btn name="Delete" icon="trash" @click.native="deleteUsers([row.uid])"></icon-btn>
          </template>
        </el-table-column>
      </el-table>
      <div class="panel-options">
        <el-pagination
          class="page"
          layout="prev, pager, next"
          @current-change="currentChange"
          :page-size="pageSize"
          :total="total">
        </el-pagination>
      </div>
    </Panel>

    <!-- <Panel>
      <span slot="title">{{$t('m.Import_User')}}
        <el-popover placement="right" trigger="hover">
          <p>Only support csv file without headers, check the <a
            href="http://docs.onlinejudge.me/#/onlinejudge/guide/import_users">link</a> for details</p>
          <i slot="reference" class="el-icon-fa-question-circle import-user-icon"></i>
        </el-popover>
      </span>
      <el-upload v-if="!uploadUsers.length"
                 action=""
                 :show-file-list="false"
                 accept=".csv"
                 :before-upload="handleUsersCSV">
        <el-button size="small" icon="el-icon-fa-upload" type="primary">Choose File</el-button>
      </el-upload>
      <template v-else>
        <el-table :data="uploadUsersPage">
          <el-table-column label="Username">
            <template slot-scope="{row}">
              {{row[0]}}
            </template>
          </el-table-column>
          <el-table-column label="Password">
            <template slot-scope="{row}">
              {{row[1]}}
            </template>
          </el-table-column>
          <el-table-column label="Email">
            <template slot-scope="{row}">
              {{row[2]}}
            </template>
          </el-table-column>
        </el-table>
        <div class="panel-options">
          <el-button type="primary" size="small"
                     icon="el-icon-fa-upload"
                     @click="handleUsersUpload">Import All
          </el-button>
          <el-button type="warning" size="small"
                     icon="el-icon-fa-undo"
                     @click="handleResetData">Reset Data
          </el-button>
          <el-pagination
            class="page"
            layout="prev, pager, next"
            :page-size="uploadUsersPageSize"
            :current-page.sync="uploadUsersCurrentPage"
            :total="uploadUsers.length">
          </el-pagination>
        </div>
      </template>
    </Panel> -->

    <!-- <Panel :title="$t('m.Generate_User')">
      <el-form :model="formGenerateUser" ref="formGenerateUser">
        <el-row type="flex" justify="space-between">
          <el-col :span="4">
            <el-form-item label="Prefix" prop="prefix">
              <el-input v-model="formGenerateUser.prefix" placeholder="Prefix"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="Suffix" prop="suffix">
              <el-input v-model="formGenerateUser.suffix" placeholder="Suffix"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="Start Number" prop="number_from" required>
              <el-input-number v-model="formGenerateUser.number_from" style="width: 100%"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="End Number" prop="number_to" required>
              <el-input-number v-model="formGenerateUser.number_to" style="width: 100%"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="Password Length" prop="password_length" required>
              <el-input v-model="formGenerateUser.password_length"
                        placeholder="Password Length"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="generateUser" icon="el-icon-fa-users" :loading="loadingGenerate">Generate & Export
          </el-button>
          <span class="userPreview" v-if="formGenerateUser.number_from && formGenerateUser.number_to &&
                                          formGenerateUser.number_from <= formGenerateUser.number_to">
            The usernames will be {{formGenerateUser.prefix + formGenerateUser.number_from + formGenerateUser.suffix}},
            <span v-if="formGenerateUser.number_from + 1 < formGenerateUser.number_to">
              {{formGenerateUser.prefix + (formGenerateUser.number_from + 1) + formGenerateUser.suffix + '...'}}
            </span>
            <span v-if="formGenerateUser.number_from + 1 <= formGenerateUser.number_to">
              {{formGenerateUser.prefix + formGenerateUser.number_to + formGenerateUser.suffix}}
            </span>
          </span>
        </el-form-item>
      </el-form>
    </Panel> -->
    <!--对话框-->
    <el-dialog :title="$t('m.User_Info')" :visible.sync="showUserDialog" :close-on-click-modal="false">
      <el-table
        v-loading="loadingTable"
        element-loading-text="loading"
        @selection-change="handleRoleSelectionChange"
        ref="multipleTable"
        :data="roles"
        style="width: 100%">
        <el-table-column type="selection" width="55" ></el-table-column>

        <el-table-column prop="roleId" label="Role ID"></el-table-column>

        <el-table-column prop="rolename" label="Role Name"></el-table-column>

        <el-table-column prop="description" label="Description"></el-table-column>

      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="toggleSelection(roles)">Show User's Role</el-button>
        <cancel @click.native="showUserDialog = false">Cancel</cancel>
        <save @click.native="saveUserRoles()"></save>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import papa from 'papaparse'
  import api from '../../api.js'
  import utils from '@/utils/utils'

  export default {
    name: 'User',
    data () {
      return {
        // 一页显示的用户数
        pageSize: 10,
        // 用户总数
        total: 0,
        // 用户列表
        userList: [
          {
            roles: [
              {
                roleId: null,
                rolename: null,
                description: null
              }]
          }
        ],
        uploadUsers: [],
        uploadUsersPage: [],
        uploadUsersCurrentPage: 1,
        uploadUsersPageSize: 15,
        // 搜索关键字
        keyword: '',
        // 是否显示用户对话框
        showUserDialog: false,
        // 当前用户model
        user: {},
        roles: [],
        selectedRoles: [],
        loadingTable: false,
        loadingGenerate: false,
        // 当前页码
        currentPage: 0,
        selectedUsers: [],
        formGenerateUser: {
          prefix: '',
          suffix: '',
          number_from: 0,
          number_to: 0,
          password_length: 8
        }
      }
    },
    mounted () {
      this.getUserList(1)
    },
    methods: {
      // 切换页码回调
      currentChange (page) {
        this.currentPage = page
        this.getUserList(page)
      },
      // 提交修改用户的信息
      saveUserRoles () {
        var selectedFullRoleIds = []
        this.selectedRoles.forEach(
          (role) => selectedFullRoleIds.push(role.roleId)
        )
        api.editUserRoles(this.user.uid, selectedFullRoleIds).then(res => {
          // 更新列表
          this.getUserList(this.currentPage)
        }).then(() => {
          this.showUserDialog = false
        }).catch(() => {
        })
      },
      // 打开用户对话框
      openUserDialog (uid) {
        this.showUserDialog = true
        this.selectedRoles = []
        api.getRoles().then(res => {
          this.roles = res.data.data.roles
        })
        api.getUser(uid).then(res => {
          this.user = res.data.data.user
          this.user.password = ''
          this.selectedRoles = res.data.data.roles
        })
      },
      // 获取用户列表
      getUserList (page) {
        this.loadingTable = true
        api.getUserList((page - 1) * this.pageSize, this.pageSize, this.keyword).then(res => {
          this.loadingTable = false
          this.total = res.data.data.total
          this.userList = res.data.data.results
        }, res => {
          this.loadingTable = false
        })
      },
      toggleSelection (rows) {
        if (rows) {
          var roleIds = []
          if (this.selectedRoles !== null) {
            roleIds = this.selectedRoles.map(role => role.roleId)
          }
          rows.forEach(row => {
            if (roleIds.indexOf(row.roleId) > -1) {
              this.$refs.multipleTable.toggleRowSelection(row)
            }
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      },
      deleteUsers (ids) {
        this.$confirm('Sure to delete all the user authority?', 'confirm', {
          type: 'warning'
        }).then(() => {
          api.deleteUsers(ids).then(res => {
            this.getUserList(this.currentPage)
          }).catch(() => {
            this.getUserList(this.currentPage)
          })
        }, () => {
        })
      },
      handleSelectionChange (val) {
        this.selectedUsers = val
      },
      handleRoleSelectionChange (val) {
        this.selectedRoles = val
      },
      generateUser () {
        this.$refs['formGenerateUser'].validate((valid) => {
          if (!valid) {
            this.$error('Please validate the error fields')
            return
          }
          this.loadingGenerate = true
          let data = Object.assign({}, this.formGenerateUser)
          api.generateUser(data).then(res => {
            this.loadingGenerate = false
            let url = '/admin/generate_user?file_id=' + res.data.data.file_id
            utils.downloadFile(url).then(() => {
              this.$alert('All users created successfully, the users sheets have downloaded to your disk.', 'Notice')
            })
            this.getUserList(1)
          }).catch(() => {
            this.loadingGenerate = false
          })
        })
      },
      handleUsersCSV (file) {
        papa.parse(file, {
          complete: (results) => {
            let data = results.data.filter(user => {
              return user[0] && user[1] && user[2]
            })
            let delta = results.data.length - data.length
            if (delta > 0) {
              this.$warning(delta + ' users have been filtered due to empty value')
            }
            this.uploadUsersCurrentPage = 1
            this.uploadUsers = data
            this.uploadUsersPage = data.slice(0, this.uploadUsersPageSize)
          },
          error: (error) => {
            this.$error(error)
          }
        })
      },
      handleUsersUpload () {
        api.importUsers(this.uploadUsers).then(res => {
          this.getUserList(1)
          this.handleResetData()
        }).catch(() => {
        })
      },
      handleResetData () {
        this.uploadUsers = []
      }
    },
    computed: {
      selectedUserIDs () {
        let ids = []
        for (let user of this.selectedUsers) {
          ids.push(user.uid)
        }
        return ids
      }
    },
    watch: {
      'keyword' () {
        this.currentChange(1)
      },
      'user.admin_type' () {
        if (this.user.admin_type === 'Super Admin') {
          this.user.problem_permission = 'All'
        } else if (this.user.admin_type === 'Regular User') {
          this.user.problem_permission = 'None'
        }
      },
      'uploadUsersCurrentPage' (page) {
        this.uploadUsersPage = this.uploadUsers.slice((page - 1) * this.uploadUsersPageSize, page * this.uploadUsersPageSize)
      }
    }
  }
</script>

<style scoped lang="less">
  .import-user-icon {
    color: #555555;
    margin-left: 4px;
  }

  .userPreview {
    padding-left: 10px;
  }

  .notification {
    p {
      margin: 0;
      text-align: left;
    }
  }
</style>
