<template>
  <div class="login-container">
    <el-form
        :model="form"
        status-icon
        :rules="rules"
        ref="form"
        label-width="100px"
        class="login-form"
    >
      <h2 class="login-title">登录</h2>
      <el-form-item label="账号" prop="username">
        <el-input
            type="username"
            v-model="form.username"
            autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
            type="password"
            v-model="form.password"
            autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <a href="/register">没有账号？立即注册</a>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {getUserInfo, login} from "../../api/login";

export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rules: {
        password: [{required: true, message: "请输入密码", trigger: "blur"}],
        username: [{required: true, message: "请输入账号", trigger: "blur"}]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          login(this.form.username, this.form.password).then(res => {
            const resp = res.data;
            // console.log(resp);
            if (resp.flag) {
              getUserInfo(resp.data.token).then(res => {
                const respUser = res.data;
                console.log(respUser)
                if (respUser.flag) {
                  //将信息存储到浏览器的localStorage中
                  localStorage.setItem("user", JSON.stringify(respUser.data));
                  localStorage.setItem("token", resp.data.token);
                  this.$router.push("/");
                } else {
                  //登录失败
                  this.$message({
                    message: res.data.message,
                    type: "warning"
                  });
                }
              });
            } else {
              //登录失败
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
    }
  }
};
</script>

<style scoped>
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("../../assets/bg.jpg");
  background-size: cover;
}

.login-form {
  width: 350px;
  margin: 160px auto;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 30px;
  border-radius: 20px;
}

.login-title {
  text-align: center;
}
</style>
