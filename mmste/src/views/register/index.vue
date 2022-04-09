<template>
  <div class="register-container">
    <el-form
      :model="form"
      status-icon
      :rules="rules"
      ref="form"
      label-width="100px"
      class="register-form"
    >
      <h2 class="register-title">注册</h2>
      <el-form-item label="账号" prop="username">
        <el-input
          type="username"
          v-model="form.username"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input
          type="nickname"
          v-model="form.nickname"
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
      <el-form-item label="确认密码" prop="checkPass">
        <el-input
          type="password"
          v-model="form.checkPass"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <a href="/login">已注册？立即登录</a>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {register} from "../../api/login";

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.checkPass !== "") {
          this.$refs.form.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      form: {
        username: "",
        nickname: "",
        password: "",
        checkPass: ""
      },
      rules: {
        password: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ],
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("submit!");
          register(
            this.form.username,
            this.form.nickname,
            this.form.password
          ).then(res => {
            console.log(res.data);
            if (res.data.flag) {
              this.$router.push("/login");
            } else {
              this.$message({
                message: "注册失败！",
                type: "warning"
              });
            }
          });
          console.log("submit完成");
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

<style>
.register-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("../../assets/bg.jpg");
  background-size: cover;
}

.register-form {
  width: 350px;
  margin: 160px auto;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 30px;
  border-radius: 20px;
}

.register-title {
  text-align: center;
}
</style>
