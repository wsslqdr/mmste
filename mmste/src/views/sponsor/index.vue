<template>
  <div>
    <el-form
        :inline="true"
        :model="searchMap"
        class="demo-form-inline"
        style="margin-top: 20px"
        ref="searchForm"
    >
      <el-form-item prop="sponsorName">
        <el-input
            v-model="searchMap.sponsorName"
            placeholder="赞助商名称"
        ></el-input>
      </el-form-item>
      <el-form-item prop="chargeMember">
        <el-input
            v-model="searchMap.chargeMember"
            placeholder="负责人"
            @click.native="dialogMemberVisible = true"
            readonly
        ></el-input>
      </el-form-item>
      <el-form-item prop="beginDate">
        <el-date-picker
            v-model="searchMap.beginDate"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="开始日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="endDate">
        <el-date-picker
            v-model="searchMap.endDate"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchData">查询</el-button>
        <el-button type="primary" @click="addData" v-show="loginUser">新增</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
        <el-button @click="sponsorStatus">状态</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" height="500" border style="width: 100%">
      <el-table-column prop="sponsorName" label="赞助商名称" width="180">
      </el-table-column>
      <el-table-column prop="phone" width="180" label="电话"></el-table-column>
      <el-table-column prop="cash" sortable width="180" label="金额">
      </el-table-column>
      <el-table-column prop="beginDate" sortable label="开始日期" width="180">
      </el-table-column>
      <el-table-column prop="endDate" sortable label="结束日期" width="180">
      </el-table-column>
      <el-table-column prop="chargeMember" label="负责人" width="180">
      </el-table-column>
      <el-table-column label="操作" v-if="loginUser" width="100">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row._id)" type="text" size="small"
          >编辑
          </el-button
          >
          <el-button @click="handleDele(scope.row._id)" type="text" size="small"
          >删除
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
    >
    </el-pagination>
    <!--    弹窗-->
    <el-dialog title="赞助管理" :visible.sync="dialogFormVisible" width="500px">
      <el-form
          :model="sponsor"
          ref="sponsorForm"
          label-width="100px"
          label-position="right"
          style="width: 400px"
          :rules="rules"
      >
        <el-form-item prop="sponsorName" label="赞助商名称">
          <el-input
              v-model="sponsor.sponsorName"
              placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="电话">
          <el-input v-model="sponsor.phone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item prop="cash" label="赞助金额">
          <el-input v-model="sponsor.cash" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item prop="beginDate" label="开始日期">
          <el-date-picker
              v-model="sponsor.beginDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="endDate" label="结束日期">
          <el-date-picker
              v-model="sponsor.endDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="chargeMember" label="负责人">
          <el-input
              v-model="sponsor.chargeMember"
              placeholder="请输入"
              readonly
              @click.native="editOptionMember"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearStatus">取 消</el-button>
        <el-button
            type="primary"
            @click="
            sponsor._id === null
              ? addNewSponsor('sponsorForm')
              : updateSponsor('sponsorForm')
          "
        >确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
        title="选择负责人"
        :visible.sync="dialogMemberVisible"
        width="500"
    >
      <members :is-dialog="true" @option-member="optionMember"></members>
    </el-dialog>
  </div>
</template>

<script>
import sponsor from "../../api/sponsor";
import members from "../../views/members";
import {getUserAdmin} from "../../api/login";

export default {
  data() {
    return {
      loginUser: false,
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      dialogFormVisible: false,
      searchMap: {
        sponsorName: "",
        beginDate: "",
        endDate: "",
        chargeMember: ""
      },
      dialogMemberVisible: false,
      rules: {
        sponsorName: [
          {required: true, message: "请输入赞助商名称", trigger: "blur"}
        ],
        beginDate: [
          {required: true, message: "请输入开始日期", trigger: "blur"}
        ],
        endDate: [
          {required: true, message: "请输入结束日期", trigger: "blur"}
        ],
        phone: [{required: true, message: "请输入电话", trigger: "blur"}],
        cash: [{required: true, message: "请输入金额", trigger: "blur"}]
      },
      sponsor: {
        _id: null,
        sponsorName: "",
        beginDate: "",
        endDate: "",
        chargeMember: "",
        phone: "",
        cash: ""
      },
      isEdit: false
    };
  },
  components: {
    members
  },
  methods: {
    editOptionMember() {
      this.isEdit = true;
      this.dialogMemberVisible = true;
    },
    //鉴权 不是管理不显示页面
    isAdmin() {
      const loginUser = localStorage.getItem("token")
      getUserAdmin(loginUser).then(res => {
        const resp = res.data
        if (resp.data.admin === "1") {
          // console.log("inside")
          this.loginUser = true;
        }
        // console.log(this.loginUser)
      })
    },
    optionMember(currentRow) {
      if (this.isEdit) {
        this.sponsor.chargeMember = currentRow.name;
        this.isEdit = false;
      } else {
        this.searchMap.chargeMember = currentRow.name;
        this.searchMap.id = currentRow.id;
      }
      this.dialogMemberVisible = false;
    },
    handleEdit(id) {
      // alert("编辑" + id)
      sponsor.getById(id).then(res => {
        const resp = res.data;
        if (resp.flag) {
          this.sponsor = resp.data;
        }
        // console.log(resp)
      });
      this.addData();
    },
    handleDele(id) {
      this.$confirm("此操作将永久删除赞助商信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(() => {
            sponsor.deleteById(id).then(res => {
              const resp = res.data;
              if (resp.flag) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.fetchData();
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
    },
    fetchData() {
      sponsor
          .search(this.currentPage, this.pageSize, this.searchMap)
          .then(res => {
            const resp = res.data;
            this.list = resp.data.rows;
            this.total = resp.data.total;
            console.log(resp.data.rows);
          });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    searchData() {
      this.currentPage = 1;
      sponsor
          .search(this.currentPage, this.pageSize, this.searchMap)
          .then(res => {
            const resp = res.data;
            console.log(this.searchMap);
            console.log(res.data);
            this.list = resp.data.rows;
            this.total = resp.data.total;
          });
    },
    sponsorStatus() {
      console.log(this.sponsor);
    },
    addData() {
      this.clearStatus();
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["sponsorForm"].resetFields();
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      sponsor
          .search(this.currentPage, this.pageSize, this.searchMap)
          .then(res => {
            const resp = res.data;
            this.list = resp.data.rows;
            this.total = resp.data.total;
          });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      sponsor
          .search(this.currentPage, this.pageSize, this.searchMap)
          .then(res => {
            const resp = res.data;
            this.list = resp.data.rows;
            this.total = resp.data.total;
          });
    },
    addNewSponsor(formName) {
      console.log("addNewSponsor");
      this.$refs[formName].validate(valid => {
        if (valid) {
          sponsor.add(this.sponsor).then(res => {
            const resp = res.data;
            if (resp.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "error"
              });
            }
            this.clearStatus();
          });
        } else {
          alert("false");
        }
      });
    },
    clearStatus() {
      this.sponsor._id = null;
      this.sponsor.sponsorName = null;
      this.sponsor.beginDate = null;
      this.sponsor.endDate = null;
      this.sponsor.chargeMember = null;
      this.sponsor.phone = null;
      this.sponsor.cash = null;
      this.dialogFormVisible = false;
    },
    updateSponsor(formName) {
      console.log("updateSponsor");
      this.$refs[formName].validate(valid => {
        if (valid) {
          sponsor.update(this.sponsor).then(res => {
            const resp = res.data;
            if (resp.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "error"
              });
            }
            this.clearStatus();
          });
        } else {
          alert("false");
        }
      });
    }
  },
  mounted() {
    this.fetchData();
    this.isAdmin();
  }
};
</script>

<style scoped></style>
