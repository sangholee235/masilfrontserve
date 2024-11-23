<template>
  <div class="container mt-3" v-if="userInfo">
    <div class="row mb-4">
      <div class="col">
        <div class="navbar">
          <div class="navbar-brand ms-3">
            <h1>정보 수정</h1>
          </div>
        </div>
      </div>
    </div>
    <form @submit="onSubmit" @reset="onReset">
      <div class="form-group" id="input-group-username">
        <label for="username">이름 :</label>
        <input
          type="text"
          id="username"
          ref="username"
          v-model="userName"
          class="form-control"
          placeholder="이름을 입력해주세요"
          required
        />
      </div>

      <div class="form-group" id="input-group-userid">
        <label for="userid">아이디 :</label>
        <input
          type="text"
          id="userid"
          ref="userid"
          v-model="userId"
          class="form-control"
          readonly
          required
        />
      </div>

      <div class="form-group" id="input-group-userpwd">
        <label for="userpwd">비밀번호 :</label>
        <input
          type="password"
          id="userpwd"
          ref="userpwd"
          v-model="userPwd"
          class="form-control"
          placeholder="비밀번호를 입력해주세요"
          required
        />
      </div>

      <div class="form-group" id="input-group-pwdcheck">
        <label for="pwdcheck">비밀번호 확인 :</label>
        <input
          type="password"
          id="pwdcheck"
          ref="pwdcheck"
          v-model="pwdCheck"
          class="form-control"
          placeholder="비밀번호를 다시 입력해주세요"
          required
        />
        <div v-if="pwdCheck && !pwdCheckResult" class="invalid-feedback">
          비밀번호가 일치하지 않습니다
        </div>
      </div>

      <div class="form-group" id="input-group-email">
        <label for="emailid">이메일 :</label>
        <div class="input-group">
          <input
            type="text"
            id="emailid"
            ref="emailid"
            v-model="emailId"
            class="form-control"
            placeholder="이메일 아이디"
            required
          />
          <span class="input-group-text">@</span>
          <select
            id="emaildomain"
            ref="emaildomain"
            v-model="emailDomain"
            class="form-control"
            required
          >
            <option value="">선택</option>
            <option value="google.com">google.com</option>
            <option value="naver.com">naver.com</option>
            <option value="hanmail.net">hanmail.net</option>
            <option value="ssafy.com">ssafy.com</option>
          </select>
        </div>
      </div>

      <div class="text-center">
        <button type="submit" class="btn btn-submit">수정</button>
        <button type="reset" class="btn btn-cancel">취소</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { modify } from "@/api/member";

export default {
  name: "UserModify",
  data() {
    return {
      userName: "",
      userId: "",
      userPwd: "",
      pwdCheck: "",
      emailId: "",
      emailDomain: "",
      pwdCheckMsg: "",
    };
  },
  components: {},
  computed: {
    ...mapState("memberStore", ["userInfo"]),
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
      this.$router.push({ name: "mypage" });
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
      else this.modifyMember();
    },
    modifyMember() {
      let user = {
        userName: this.userName,
        userId: this.userId,
        userPwd: this.userPwd,
        emailId: this.emailId,
        emailDomain: this.emailDomain,
      };
      modify(
        user,
        ({ data }) => {
          if (data.message === "success") {
            this.$router.push({ name: "mypage" });
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
  },
  created() {
    this.userName = this.userInfo.userName;
    this.userId = this.userInfo.userId;
    this.emailId = this.userInfo.emailId;
    this.emailDomain = this.userInfo.emailDomain;
  },
};
</script>

<style scoped>
/* 기본적인 스타일 추가 */
.container {
  max-width: 800px;
  margin: 0 auto;
}
.row {
  margin-bottom: 20px;
}
.form-group {
  margin-bottom: 15px;
}
.input-group {
  display: flex;
  align-items: center;
}
.input-group-text {
  background-color: #f8f9fa;
}
input,
select {
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
}
button {
  margin: 10px 5px;
}
.invalid-feedback {
  color: red;
  font-size: 0.875rem;
}

/* 수정 및 취소 버튼 스타일 */
.btn-submit {
  background-color: black;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
}

.btn-submit:hover {
  background-color: #333;
}

.btn-cancel {
  background-color: black;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
}

.btn-cancel:hover {
  background-color: #333;
}

/* Navbar 스타일 수정 */
.navbar {
  display: flex;
  justify-content: center; /* 텍스트를 가로로 가운데 정렬 */
  align-items: center; /* 텍스트를 세로로 가운데 정렬 */
}

.navbar-brand {
  margin: 0; /* 기본 여백 제거 */
}
</style>
