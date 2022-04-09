<template>
  <div class="header">
    <img src="../../assets/logo.png" class="logo" />
    <span class="title">外联部信息管理系统</span>
    <el-dropdown trigger="click" @command="handleCommand">
      <span class="el-dropdown-link">
        下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-loading" command="a"
          >修改密码</el-dropdown-item
        >
        <el-dropdown-item icon="el-icon-s-home" command="b"
          >退出登录</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        style="width: 400px"
      >
        <el-form-item label="原密码" prop="oldPwd">
          <el-input
            type="password"
            v-model="ruleForm.oldPwd"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input
            type="password"
            v-model="ruleForm.newPwd"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="newPwd2">
          <el-input
            type="password"
            v-model="ruleForm.newPwd2"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { logout } from "../../api/login";
import passwordApi from "../../api/password";

export default {
  data() {
    var validateOldPass = (rule, value, callback) => {
      passwordApi.checkPwd(this.user.id, value).then(res => {
        const resp = res.data;
        if (resp.flag) {
          callback();
        } else {
          callback(new Error(resp.message));
        }
      });
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.newPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      user: JSON.parse(localStorage.getItem("user")),
      dialogFormVisible: false,
      ruleForm: {
        oldPwd: "",
        newPwd: "",
        newPwd2: ""
      },
      rules: {
        oldPwd: [
          { require: true, message: "旧密码不能为空", trigger: "blur" },
          { validator: validateOldPass, trigger: "blur" }
        ],
        newPwd: [
          { require: true, message: "新密码不能为空", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" }
        ],
        newPwd2: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case "a":
          //修改密码
          this.handlePwd();
          break;
        case "b":
          //退出登录
          this.handleLogout();
      }
    },
    handlePwd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["ruleForm"].resetFields();
      });
    },
    handleLogout() {
      logout(localStorage.getItem("token")).then(res => {
        if (res.data.flag) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          this.$router.push("/login");
          this.$message({
            message: res.data.message,
            type: "success"
          });
        } else {
          this.$message({
            message: res.data.message,
            type: "warning"
          });
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          passwordApi
            .updatePwd(this.user.id, this.ruleForm.newPwd)
            .then(res => {
              const resp = res.data;
              if (resp.flag) {
                this.$message({
                  message: res.data.message,
                  type: "success"
                });
                this.handleLogout();
                this.dialogFormVisible = false;
              } else {
                this.$message({
                  message: res.data.message,
                  type: "warning"
                });
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
.logo {
  width: 40px;
  vertical-align: middle;
  padding: 0 10px 0 40px;
}

.title {
  position: absolute;
  color: white;
}

.el-dropdown {
  float: right;
  margin-right: 40px;
}

.el-dropdown-link {
  color: white;
  cursor: pointer;
}
</style>
