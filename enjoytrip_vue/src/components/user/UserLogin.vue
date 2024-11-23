<template>
  <b-container class="d-flex justify-content-center">
    <div class="login-wrapper">
      <h1 class="login-title text-center">MASIL</h1>
      <b-card class="p-4 login-card">
        <!-- 로그인 실패 시 경고 메시지 -->
        <b-alert v-if="isLoginError" show variant="danger" class="login-error">
          아이디 또는 비밀번호를 확인하세요.
        </b-alert>
        <b-form>
          <b-form-group label="아이디" label-for="userid" label-class="login-label" class="mb-3">
            <b-form-input
              id="userid"
              v-model="user.userId"
              required
              placeholder="아이디 입력"
              @keyup.enter="confirm"
              class="login-input"
            ></b-form-input>
          </b-form-group>
          <b-form-group label="비밀번호" label-for="userpwd" label-class="login-label" class="mb-4">
            <b-form-input
              type="password"
              id="userpwd"
              v-model="user.userPwd"
              required
              placeholder="비밀번호 입력"
              @keyup.enter="confirm"
              class="login-input"
            ></b-form-input>
          </b-form-group>
          <div class="d-flex justify-content-between align-items-center mb-4">
            <b-form-checkbox
              id="checkbox-saveid"
              v-model="saveIdCheck"
              value="true"
              unchecked-value="false"
              class="login-checkbox"
            >
              아이디 저장
            </b-form-checkbox>
            <router-link :to="{ name: 'find' }" class="login-link"
              >아이디/비밀번호 찾기</router-link
            >
          </div>
          <b-button
            type="button"
            variant="dark"
            class="btn-block login-button mb-3"
            @click="confirm"
          >
            로그인
          </b-button>
          <!-- 회원가입 버튼 -->
          <b-button
            type="button"
            variant="success"
            class="btn-block signup-button"
            @click="movePage"
          >
            회원가입
          </b-button>
        </b-form>
      </b-card>
    </div>
  </b-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "UserLogin",
  data() {
    return {
      saveIdCheck: "false",
      user: {
        userId: null,
        userPwd: null,
      },
    };
  },
  created() {
    if (this.$cookies.isKey("saveid")) {
      this.saveIdCheck = "true";
      this.user.userId = this.$cookies.get("saveid");
    }
  },
  computed: {
    ...mapState("memberStore", ["isLogin", "isLoginError", "userInfo"]),
  },
  methods: {
    ...mapActions("memberStore", ["userConfirm", "getUserInfo"]),
    async confirm() {
      await this.userConfirm(this.user);
      let token = sessionStorage.getItem("access-token");

      if (this.isLogin) {
        await this.getUserInfo(token);
        if (this.saveIdCheck === "true") {
          this.$cookies.set("saveid", this.user.userId);
        } else {
          this.$cookies.remove("saveid");
        }
        this.$router.push({ name: "home" });
      }
    },
    movePage() {
      this.$router.push({ name: "join" });
    },
  },
};
</script>

<style scoped>
/* 화면 전체 중앙 정렬 */
.login-wrapper {
  width: 50%;
}

/* 제목 스타일 */
.login-title {
  font-size: 4rem;
  font-weight: bold;
}

/* 카드 스타일 */
.login-card {
  border: none;
  box-shadow: none;
  border-radius: 0;
}

/* 경고 메시지 스타일 */
.login-error {
  margin-bottom: 20px;
  font-size: 0.9rem;
}

/* 폼 라벨 스타일 */
.login-label {
  font-size: 1rem;
  font-weight: normal;
  margin-bottom: 0.5rem;
}

/* 입력 필드 스타일 */
.login-input {
  height: 40px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* 체크박스 스타일 */
.login-checkbox {
  font-size: 0.9rem;
  margin: 0;
}

/* 링크 스타일 */
.login-link {
  font-size: 0.9rem;
  color: #6c757d;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}

/* 버튼 스타일 */
.login-button,
.signup-button {
  width: 100%;
  padding: 10px 0;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
}

.login-button {
  background-color: black;
  color: white;
}

.signup-button {
  background-color: black;
  color: white;
}
</style>
