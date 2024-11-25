<template>
  <div class="main" data-aos="fade-up" data-aos-duration="200">
    <!-- 왼쪽 검은색 영역 -->
    <div class="left-side" style="display: flex; flex-direction: column">
      <div class="center-text">마실 [마실 ː] :</div>
      <h3 style="color: gray">이 동네 저 동네 싸 돌아다니는 행위</h3>
    </div>

    <!-- 오른쪽 영역 (로그인 폼) -->
    <div class="right-side">
      <!-- 로그인 폼을 이곳에 삽입 -->
      <b-container class="d-flex justify-content-center">
        <div class="login-wrapper">
          <h1 class="login-title text-center">M A S I L</h1>
          <b-card class="p-4 login-card">
            <!-- 로그인 실패 시 경고 메시지 -->
            <b-alert
              v-if="isLoginError"
              show
              variant="danger"
              class="login-error"
            >
              아이디 또는 비밀번호를 확인하세요.
            </b-alert>
            <b-form>
              <b-form-group
                label="아이디"
                label-for="userid"
                label-class="login-label"
                class="mb-3"
              >
                <b-form-input
                  id="userid"
                  v-model="user.userId"
                  required
                  placeholder="아이디 입력"
                  @keyup.enter="confirm"
                  class="login-input"
                ></b-form-input>
              </b-form-group>
              <b-form-group
                label="비밀번호"
                label-for="userpwd"
                label-class="login-label"
                class="mb-4"
              >
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
              <div
                class="d-flex justify-content-between align-items-center mb-4"
              >
                <b-form-checkbox
                  id="checkbox-saveid"
                  v-model="saveIdCheck"
                  value="true"
                  unchecked-value="false"
                  class="login-checkbox"
                >
                  아이디 저장
                </b-form-checkbox>
                <router-link :to="{ name: 'find' }" class="login-link">
                  아이디/비밀번호 찾기
                </router-link>
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
                variant="dark"
                class="btn-block login-button mb-3"
                @click="movePage"
              >
                회원가입
              </b-button>
              <!-- 비회원으로 이용하기 텍스트 링크 -->
              <router-link to="/attraction" class="guest-link">
                비회원으로 이용하기
              </router-link>
            </b-form>
          </b-card>
        </div>
      </b-container>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "AppHome",
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

        // 로그인 성공 시 /attraction 페이지로 이동
        this.$router.push({ path: "/attraction" });
      }
    },
    movePage() {
      this.$router.push({ name: "join" });
    },
  },
};
</script>

<style scoped>
.main {
  display: flex; /* 두 개의 영역을 가로로 배치 */
  height: 100vh; /* 화면 높이에 맞게 설정 */
}

.left-side {
  background-color: black; /* 왼쪽 영역 배경 색을 검정으로 설정 */
  flex: 1; /* 왼쪽 영역이 50%를 차지하도록 설정 */
  height: 100vh; /* 화면 높이 100% */
  display: flex;
  justify-content: center;
  align-items: center; /* 중앙 정렬 */
}

.center-text {
  font-size: 5rem; /* 큰 글씨로 텍스트 설정 */
  color: white; /* 흰색 글씨 */
  font-weight: bold;
}

/* 오른쪽 영역 스타일 */
.right-side {
  flex: 1; /* 오른쪽 영역이 50%를 차지하도록 설정 */
  height: 100vh; /* 화면 높이 100% */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 로그인 폼 스타일 */
.login-wrapper {
  width: 50%; /* 폼의 너비 설정 */
}

.login-title {
  font-size: 4rem;
  font-weight: bold;
}

.login-card {
  border: none;
  box-shadow: none;
  border-radius: 0;
}

.login-error {
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.login-label {
  font-size: 1rem;
  font-weight: normal;
  margin-bottom: 0.5rem;
}

.login-input {
  height: 40px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.login-checkbox {
  font-size: 0.9rem;
  margin: 0;
}

.login-link {
  font-size: 0.9rem;
  color: #6c757d;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}

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

/* 비회원으로 이용하기 텍스트 스타일 */
.guest-link {
  display: block;
  font-size: 0.8rem;
  color: gray;
  text-align: center;
  margin-top: 10px;
  text-decoration: none;
}

.guest-link:hover {
  text-decoration: underline;
}
</style>
