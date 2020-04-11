<template>
  <div class="announcement view">
    <Panel :title="$t('m.General_Announcement')">
      <div class="list">
        <el-table
          v-loading="loading"
          element-loading-text="loading"
          ref="table"
          :data="announcementList"
          style="width: 100%">
          <el-table-column
            width="100"
            prop="nid"
            label="ID">
          </el-table-column>
          <el-table-column
            prop="noticeTitle"
            label="Title">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="CreateTime">
            <template slot-scope="scope">
              {{ scope.row.createTime | localtime }}
            </template>
          </el-table-column>
          <el-table-column
            prop="lastUpdateTime"
            label="LastUpdateTime">
            <template slot-scope="scope">
              {{scope.row.lastUpdateTime | localtime }}
            </template>
          </el-table-column>
          <el-table-column
            prop="nickname"
            label="Author">
          </el-table-column>
          <el-table-column
            width="100"
            prop="visible"
            label="Visible">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.visible"
                         active-text=""
                         inactive-text=""
                         @change="handleVisibleSwitch(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="Option"
            width="200">
            <div slot-scope="scope">
              <icon-btn name="Edit" icon="edit" @click.native="openAnnouncementDialog(scope.row.nid)"></icon-btn>
              <icon-btn name="Delete" icon="trash" @click.native="deleteAnnouncement(scope.row.nid)"></icon-btn>
            </div>
          </el-table-column>
        </el-table>
        <div class="panel-options">
          <el-button type="primary" size="small" @click="openAnnouncementDialog(null)" icon="el-icon-plus">Create</el-button>
          <el-pagination
            v-if="!contestID"
            class="page"
            layout="prev, pager, next"
            @current-change="currentChange"
            :page-size="pageSize"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </Panel>
    <!--对话框-->
    <el-dialog :title="announcementDialogTitle" :visible.sync="showEditAnnouncementDialog"
               @open="onOpenEditDialog" :close-on-click-modal="false">
      <el-form label-position="top">
        <el-form-item :label="$t('m.Announcement_Title')" required>
          <el-input
            v-model="announcement.title"
            :placeholder="$t('m.Announcement_Title')" class="title-input">
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('m.Announcement_Content')" required>
          <Simditor v-model="announcement.content"></Simditor>
        </el-form-item>
        <div class="visible-box">
          <span>{{$t('m.Announcement_visible')}}</span>
          <el-switch
            v-model="announcement.visible"
            active-text=""
            inactive-text="">
          </el-switch>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <cancel @click.native="cancelDialog"></cancel>
          <save type="primary" @click.native="submitAnnouncement"></save>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import Simditor from '../../components/Simditor.vue'
  import api from '../../api.js'

  export default {
    name: 'Announcement',
    components: {
      Simditor
    },
    data () {
      return {
        contestID: '',
        // 显示编辑公告对话框
        showEditAnnouncementDialog: false,
        // 公告列表
        announcementList: [],
        // 一页显示的公告数
        pageSize: 15,
        // 总公告数
        total: 0,
        // 当前公告id
        currentAnnouncementId: null,
        mode: 'create',
        // 公告 (new | edit) model
        announcement: {
          title: '',
          visible: true,
          content: ''
        },
        // 对话框标题
        announcementDialogTitle: 'Edit Announcement',
        // 是否显示loading
        loading: true,
        // 当前页码
        currentPage: 0
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.contestID = this.$route.params.contestId
        if (this.contestID) {
          this.getContestAnnouncementList()
        } else {
          this.getAnnouncementList(1)
        }
      },
      // 切换页码回调
      currentChange (page) {
        this.currentPage = page
        this.getAnnouncementList(page)
      },
      getAnnouncementList (page) {
        this.loading = true
        api.getAnnouncementList((page - 1) * this.pageSize, this.pageSize).then(res => {
          this.loading = false
          this.total = res.data.data.total
          this.announcementList = res.data.data.results
          for (let announcement of this.announcementList) {
            announcement.visible = announcement.visible === 1
          }
        }, res => {
          this.loading = false
        })
      },
      getContestAnnouncementList () {
        this.loading = true
        api.getContestAnnouncementList(this.contestID).then(res => {
          this.loading = false
          this.announcementList = res.data.data
        }).catch(() => {
          this.loading = false
        })
      },
      // 打开编辑对话框的回调
      onOpenEditDialog () {
        // todo 优化
        // 暂时解决 文本编辑器显示异常bug
        setTimeout(() => {
          if (document.createEvent) {
            let event = document.createEvent('HTMLEvents')
            event.initEvent('resize', true, true)
            window.dispatchEvent(event)
          } else if (document.createEventObject) {
            window.fireEvent('onresize')
          }
        }, 0)
      },
      cancelDialog () {
        this.currentAnnouncementId = null
        this.showEditAnnouncementDialog = false
      },
      // 提交编辑
      // 默认传入MouseEvent
      submitAnnouncement (data = undefined) {
        let funcName = ''
        if (!data.noticeTitle) {
          data = {
            nid: this.currentAnnouncementId,
            nickname: 'RexALun',
            noticeTitle: this.announcement.title,
            noticeContent: this.announcement.content,
            visible: this.announcement.visible === true ? 1 : 0
          }
        }
        if (this.contestID) {
          data.contest_id = this.contestID
          funcName = this.mode === 'edit' ? 'updateContestAnnouncement' : 'createContestAnnouncement'
        } else {
          funcName = this.mode === 'edit' ? 'updateAnnouncement' : 'createAnnouncement'
        }
        api[funcName](data).then(res => {
          this.showEditAnnouncementDialog = false
          this.init()
        }).catch()
      },
      // 删除公告
      deleteAnnouncement (announcementId) {
        this.$confirm('Are you sure you want to delete this announcement?', 'Warning', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          // then 为确定
          this.loading = true
          let funcName = this.contestID ? 'deleteContestAnnouncement' : 'deleteAnnouncement'
          api[funcName](announcementId).then(res => {
            this.loading = true
            this.init()
          })
        }).catch(() => {
          // catch 为取消
          this.loading = false
        })
      },
      openAnnouncementDialog (id) {
        this.showEditAnnouncementDialog = true
        if (id !== null) {
          this.currentAnnouncementId = id
          this.announcementDialogTitle = 'Edit Announcement'
          this.announcementList.find(item => {
            if (item.nid === this.currentAnnouncementId) {
              this.announcement.title = item.noticeTitle
              this.announcement.visible = item.visible
              this.announcement.content = item.noticeContent
              this.mode = 'edit'
            }
          })
        } else {
          this.announcementDialogTitle = 'Create Announcement'
          this.announcement.title = ''
          this.announcement.visible = true
          this.announcement.content = ''
          this.mode = 'create'
        }
      },
      handleVisibleSwitch (row) {
        this.mode = 'edit'
        console.log(row)
        this.submitAnnouncement({
          nid: row.nid,
          nickname: row.nickname,
          noticeTitle: row.noticeTitle,
          noticeContent: row.noticeContent,
          visible: row.visible === true ? 1 : 0
        })
      }
    },
    watch: {
      $route () {
        this.init()
      }
    }
  }
</script>

<style lang="less" scoped>
  .title-input {
    margin-bottom: 20px;
  }

  .visible-box {
    margin-top: 10px;
    width: 205px;
    float: left;
  }
</style>
