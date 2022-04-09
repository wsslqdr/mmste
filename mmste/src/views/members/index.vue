<template>
  <div>
    <el-form
        :inline="true"
        :model="searchMap"
        class="demo-form-inline"
        style="margin-top: 20px"
        ref="searchForm"
    >
      <el-form-item prop="MemberNumber">
        <el-input
            v-model="searchMap.MemberNumber"
            placeholder="部号"
            v-if="!isDialog"
        ></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item prop="duty">
        <el-select v-model="searchMap.duty" placeholder="职务" v-if="!isDialog">
          <el-option label="部长" value="1"></el-option>
          <el-option label="组长" value="2"></el-option>
          <el-option label="部员" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="JoinDate" v-if="!isDialog">
        <el-date-picker
            v-model="searchMap.JoinDate"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchData">查询</el-button>
        <el-button type="primary" @click="addData" v-if="!isDialog&&loginUser">新增</el-button>
        <el-button @click="resetForm('searchForm')" v-if="!isDialog">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="list"
        height="500"
        border
        style="width: 100%"
        @current-change="clickCurrentChange"
    >
      <el-table-column prop="MemberNumber" label="部号" width="180">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="duty" label="职务" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.duty | roleFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" width="180" label="电话"></el-table-column>
      <el-table-column
          prop="JoinDate"
          label="入部日期"
          v-if="!isDialog"
          width="180"
      >
      </el-table-column>
      <el-table-column label="操作" v-if="!isDialog&&loginUser" width="100">
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
        :layout="
        isDialog
          ? 'prev, pager, next'
          : 'total, sizes, prev, pager, next, jumper'
      "
        :total="total"
    >
    </el-pagination>
    <!--    弹窗-->
    <el-dialog title="部员管理" :visible.sync="dialogFormVisible" width="500px">
      <el-form
          :model="member"
          ref="memberForm"
          label-width="100px"
          label-position="right"
          style="width: 400px"
          :rules="rules"
      >
        <el-form-item prop="MemberNumber" label="部号">
          <el-input v-model="member.MemberNumber" placeholder="部号"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="姓名">
          <el-input v-model="member.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item prop="duty" label="职务">
          <el-select v-model="member.duty" placeholder="职务">
            <el-option label="部长" value="1"></el-option>
            <el-option label="组长" value="2"></el-option>
            <el-option label="部员" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="JoinDate" label="入职日期">
          <el-date-picker
              v-model="member.JoinDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="phone" label="电话">
          <el-input v-model="member.phone" placeholder="电话"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
            type="primary"
            @click="
            member._id === null
              ? addNewMember('memberForm')
              : updateMember('memberForm')
          "
        >确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import members from "../../api/members";
import {getUserAdmin} from "../../api/login";
//职位
const roleOptions = [
  {type: "1", name: "部长"},
  {type: "2", name: "组长"},
  {type: "3", name: "部员"}
];

export default {
  props: {
    isDialog: Boolean
  },
  data() {
    return {
      loginUser: false,
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      searchMap: {
        MemberNumber: "",
        name: "",
        duty: "",
        JoinDate: ""
      },
      dialogFormVisible: false,
      rules: {
        MemberNumber: [
          {required: true, message: "请输入部号", trigger: "blur"}
        ],
        name: [{required: true, message: "请输入姓名", trigger: "blur"}],
        duty: [{required: true, message: "请输入职务", trigger: "blur"}]
      },
      member: {
        _id: null,
        MemberNumber: "",
        name: "",
        duty: "",
        JoinDate: "",
        phone: ""
      }
    };
  },
  methods: {
    handleEdit(id) {
      members.getById(id).then(res => {
        const resp = res.data;
        if (resp.flag) {
          this.member = resp.data;
        }
      });
      this.addData();
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
    handleDele(id) {
      // alert("删除" + id)
      this.$confirm("此操作将永久删除该部员信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(() => {
            members.deleteById(id).then(res => {
              const resp = res.data;
              console.log(resp);
              if (resp.flag) {
                this.fetchData();
              }
            });
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
    },
    clickCurrentChange(currentRow) {
      this.$emit("option-member", currentRow);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      members
          .search(this.currentPage, this.pageSize, this.searchMap)
          .then(res => {
            const resp = res.data;
            this.list = resp.data.rows;
            this.total = resp.data.total;
          });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      members
          .search(this.currentPage, this.pageSize, this.searchMap)
          .then(res => {
            const resp = res.data;
            this.list = resp.data.rows;
            this.total = resp.data.total;
          });
    },
    fetchData() {
      members.getList().then(res => {
        const resp = res.data;
        console.log(resp)
        this.list = resp.data.rows;
        // console.log(resp.data.rows)
      });
      members
          .search(this.currentPage, this.pageSize, this.searchMap)
          .then(res => {
            const resp = res.data;
            this.list = resp.data.rows;
            this.total = resp.data.total;
          });
    },
    searchData() {
      this.currentPage = 1;
      members
          .search(this.currentPage, this.pageSize, this.searchMap)
          .then(res => {
            const resp = res.data;
            console.log(this.searchMap);
            console.log(res.data);
            this.list = resp.data.rows;
            this.total = resp.data.total;
          });
    },
    addData() {
      this.dialogFormVisible = true;
      this.clearStatus();
      //回调函数，所有元素渲染后进行清空操作
      this.$nextTick(() => {
        this.$refs["memberForm"].resetFields();
      });
    },
    updateMember(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log('update', this.member)
          members.update(this.member).then(res => {
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
          });
        } else {
          alert("false");
        }
        this.clearStatus();
      });
      // console.log("update")
    },
    clearStatus() {
      this.member._id = null;
      this.member.MemberNumber = null;
      this.member.name = null;
      this.member.duty = null;
      this.member.JoinDate = null;
      this.member.phone = null;
    },
    addNewMember(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          members.add(this.member).then(res => {
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
          });
        } else {
          alert("false");
        }
        this.clearStatus();
      });
      // console.log("add")
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {
    this.fetchData();
    this.isAdmin();
  },
  filters: {
    roleFilter(type) {
      const obj = roleOptions.find(item => {
        return item.type === type;
      });
      return obj.name;
    }
  }
};
</script>

<style scoped></style>
