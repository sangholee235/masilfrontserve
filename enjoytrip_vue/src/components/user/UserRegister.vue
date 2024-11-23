<template>
  <b-container class="d-flex justify-content-center">
    <div class="register-wrapper">
      <h1 class="register-title text-center">회원가입</h1>
      <b-card class="p-4 register-card">
        <b-form @submit="onSubmit" @reset="onReset">
          <b-form-group
            id="input-group-username"
            label="이름:"
            label-for="username"
            label-class="register-label"
            class="mb-3"
          >
            <b-form-input
              id="username"
              ref="username"
              v-model="userName"
              required
              placeholder="이름을 입력해주세요"
              class="register-input"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-userid"
            label="아이디:"
            label-for="userid"
            label-class="register-label"
            :state="idCheckResult"
            class="mb-3"
          >
            <b-form-input
              id="userid"
              ref="userid"
              v-model="userId"
              required
              placeholder="아이디를 입력해주세요"
              class="register-input"
            ></b-form-input>
            <b-form-invalid-feedback>{{ idCheckMsg }}</b-form-invalid-feedback>
            <b-form-valid-feedback>{{ idCheckMsg }}</b-form-valid-feedback>
          </b-form-group>

          <b-form-group
            id="input-group-userpwd"
            label="비밀번호:"
            label-for="userpwd"
            label-class="register-label"
            class="mb-3"
          >
            <b-form-input
              id="userpwd"
              ref="userpwd"
              type="password"
              v-model="userPwd"
              required
              placeholder="비밀번호를 입력해주세요"
              class="register-input"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-pwdcheck"
            label="비밀번호 확인:"
            label-for="pwdcheck"
            label-class="register-label"
            :state="pwdCheckResult"
            class="mb-3"
          >
            <b-form-input
              id="pwdcheck"
              ref="pwdcheck"
              type="password"
              v-model="pwdCheck"
              required
              placeholder="비밀번호를 다시 입력해주세요"
              class="register-input"
            ></b-form-input>
            <b-form-invalid-feedback>{{ pwdCheckMsg }}</b-form-invalid-feedback>
            <b-form-valid-feedback>비밀번호가 일치합니다</b-form-valid-feedback>
          </b-form-group>

          <b-form-group
            id="input-group-email"
            label="이메일:"
            label-class="register-label"
            class="mb-4"
          >
            <div class="d-flex">
              <b-form-input
                id="emailid"
                ref="emailid"
                v-model="emailId"
                required
                placeholder="이메일 아이디"
                class="register-input"
              ></b-form-input>
              <span class="email-separator">@</span>
              <b-form-select
                id="emaildomain"
                ref="emaildomain"
                v-model="emailDomain"
                :options="emailDomains"
                required
                class="register-input"
              ></b-form-select>
            </div>
          </b-form-group>

          <b-button type="submit" variant="dark" class="btn-block register-button mb-2">
            회원가입
          </b-button>
          <b-button type="reset" variant="secondary" class="btn-block register-reset-button">
            초기화
          </b-button>
        </b-form>
      </b-card>
    </div>
  </b-container>
</template>

<script>
import { checkId, join } from "@/api/member";

export default {
  name: "UserRegister",
  data() {
    return {
      userName: "",
      userId: "",
      userPwd: "",
      pwdCheck: "",
      emailId: "",
      emailDomain: "",
      emailDomains: [
        { text: "선택", value: "" },
        "google.com",
        "naver.com",
        "hanmail.net",
        "ssafy.com",
      ],
      idCheckBool: null,
      idCheckMsg: "",
      pwdCheckMsg: "",
    };
  },
  computed: {
    idCheckResult() {
      return this.idCheckBool;
    },
    pwdCheckResult() {
      return this.pwdCheck != "" && this.userPwd == this.pwdCheck;
    },
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      this.checkValue();
    },
    onReset(event) {
      event.preventDefault();
      this.userName = "";
      this.userId = "";
      this.userPwd = "";
      this.pwdCheck = "";
      this.emailId = "";
      this.emailDomain = "";
    },
    checkValue() {
      let err = true;
      let msg = "";
      !this.userName && ((msg = "이름을 입력해주세요"), (err = false), this.$refs.username.focus());
      err &&
        !this.userId &&
        ((msg = "아이디를 입력해주세요"), (err = false), this.$refs.userid.focus());
      err &&
        !this.userPwd &&
        ((msg = "비밀번호를 입력해주세요"), (err = false), this.$refs.userpwd.focus());
      err &&
        !this.pwdCheckResult &&
        ((msg = "비밀번호를 확인해주세요"), (err = false), this.$refs.pwdcheck.focus());
      err &&
        !this.emailId &&
        ((msg = "이메일 아이디를 입력해주세요"), (err = false), this.$refs.emailid.focus());
      err &&
        !this.emailDomain &&
        ((msg = "이메일 도메인을 선택해주세요"), (err = false), this.$refs.emaildomain.focus());

      if (!err) alert(msg);
      else this.joinMember();
    },
    joinMember() {
      let user = {
        userName: this.userName,
        userId: this.userId,
        userPwd: this.userPwd,
        emailId: this.emailId,
        emailDomain: this.emailDomain,
      };
      join(
        user,
        ({ data }) => {
          if (data.message === "success") {
            this.$router.push({ name: "login" });
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
  },
  watch: {
    userId(userId) {
      if (userId.length < 5 || userId.length > 16) {
        this.idCheckMsg = "아이디는 5자 이상 16자 이하 입니다.";
        this.idCheckBool = false;
      } else {
        checkId(userId, ({ data }) => {
          if (data == 0) {
            this.idCheckMsg = userId + "는 사용할 수 있습니다.";
            this.idCheckBool = true;
          } else {
            this.idCheckMsg = userId + "는 사용할 수 없습니다.";
            this.idCheckBool = false;
          }
        });
      }
    },
    pwdCheck(pwdCheck) {
      this.pwdCheckMsg = pwdCheck !== "" ? "비밀번호가 일치하지 않습니다" : "";
    },
  },
};
</script>

<style scoped>
/* Wrapper 스타일 */
.register-wrapper {
  width: 50%;
}

/* 제목 스타일 */
.register-title {
  font-size: 4rem;
  font-weight: bold;
}

/* 카드 스타일 */
.register-card {
  border: none;
  box-shadow: none;
  border-radius: 0;
}

/* 입력 필드 스타일 */
.register-input {
  height: 40px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* 라벨 스타일 */
.register-label {
  font-size: 1rem;
  font-weight: normal;
  margin-bottom: 0.5rem;
}

/* 이메일 구분자 */
.email-separator {
  font-size: 1.5rem;
  margin: 0 10px;
}

/* 버튼 스타일 */
.register-button {
  padding: 10px 0;
  font-size: 1rem;
  font-weight: bold;
  background-color: black;
  color: white;
  border: none;
  border-radius: 5px;
}

.register-reset-button {
  padding: 10px 0;
  font-size: 1rem;
  font-weight: bold;
  background-color: gray;
  color: white;
  border: none;
  border-radius: 5px;
}
</style>
