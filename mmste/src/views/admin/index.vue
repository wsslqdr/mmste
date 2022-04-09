<template>
  <el-table
      :data="list"
      border
      height="500"
      style="width: 100%"
      v-if="loginUser"
  >
    <el-table-column
        fixed
        prop="nickname"
        label="昵称"
        width="150">
    </el-table-column>
    <el-table-column
        prop="username"
        label="用户名"
        width="120">
    </el-table-column>
    <el-table-column
        prop="password"
        label="密码"
        width="120">
    </el-table-column>
    <el-table-column
        label="管理员"
        width="120">
      <template slot-scope="scope">
        <el-switch
            v-model="scope.row.admin"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
            @change="changeAdmin(scope)"
        >
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column
        label="操作"
        width="100">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
        <el-button type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!--  不是管理员，提示以下信息-->
  <h3 v-else>你没有管理员权限，暂时无法使用这个页面，请联系管理员获取权限！</h3>

</template>

<script>
import admin from "../../api/admin"
import {getUserAdmin} from "../../api/login"

const roleOptions = [
  {type: "0", name: "否"},
  {type: "1", name: "是"}
];

export default {
  methods: {
    fetchData() {
      admin.getUserData().then(res => {
        const resp = res.data
        this.list = resp.data.rows
      })
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
    changeAdmin(scope) {
      const data = scope.row
      console.log(data)
      admin.updateAdmin(data).then(res => {
        if (res.data.flag) {
          this.$message({
            message: res.data.message,
            type: "success"
          });
          this.fetchData()
        } else {
          this.$message({
            message: res.data.message,
            type: "error"
          });
        }
      })

    }
  },
  data() {
    return {
      loginUser: false,
      list: [],
      value: true,
      userData: {
        _id: '',
        username: '',
        nickname: '',
        password: '',
        token: '',
        admin: Boolean,
      }
    }
  },
  created() {
    this.isAdmin()
  },
  mounted() {
    this.fetchData();
  },
  filters: {
    roleFilter(type) {
      const obj = roleOptions.find(item => {
        return item.type === type;
      });
      return obj.name;
    }
  }
}
</script>

<style scoped></style>
