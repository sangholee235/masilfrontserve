<template>
  <div class="main" data-aos="fade-up" data-aos-duration="200">
    <!-- 왼쪽 검은색 영역 -->
    <div class="left-side" style="display: flex; flex-direction: column">
      <div class="center-text" ref="masilText"></div>
      <h3 ref="descriptionText" style="color: gray"></h3>
    </div>

    <!-- 오른쪽 영역 (로그인 폼) -->
    <div class="right-side">
      <b-container class="d-flex justify-content-center">
        <div v-if="userInfo">
          <h2 style="margin-bottom: 30px">
            {{ userInfo.userName }} 님 안녕하세요.
          </h2>
          <b-button
            type="button"
            variant="dark"
            class="btn-block login-button mb-3"
            @click="goToAttraction"
          >
            마실 가기
          </b-button>
        </div>
        <div v-else class="login-wrapper">
          <h1 class="login-title text-center">M A S I L</h1>
          <b-card class="p-4 login-card">
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
              <b-button
                type="button"
                variant="dark"
                class="btn-block login-button mb-3"
                @click="movePage"
              >
                회원가입
              </b-button>
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
      masilTextContent: "M A S I L",
      descriptionTextContent: "마실 : 이웃에 놀러 다니는 일",
    };
  },
  created() {
    if (this.$cookies.isKey("saveid")) {
      this.saveIdCheck = "true";
      this.user.userId = this.$cookies.get("saveid");
    }
  },
  mounted() {
    this.startTypingEffect();
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

        this.$router.push({ path: "/" });
      }
    },
    movePage() {
      this.$router.push({ name: "join" });
    },
    goToAttraction() {
      this.$router.push({ path: "/attraction" });
    },
    startTypingEffect() {
      const masilElement = this.$refs.masilText;
      const descriptionElement = this.$refs.descriptionText;

      let masilIndex = 0;
      let descriptionIndex = 0;

      const type = () => {
        if (masilIndex < this.masilTextContent.length) {
          masilElement.textContent += this.masilTextContent[masilIndex++];
        } else if (descriptionIndex < this.descriptionTextContent.length) {
          descriptionElement.textContent +=
            this.descriptionTextContent[descriptionIndex++];
        } else {
          setTimeout(() => {
            masilElement.textContent = "";
            descriptionElement.textContent = "";
            masilIndex = 0;
            descriptionIndex = 0;
          }, 1000);
        }
        if (
          masilIndex <= this.masilTextContent.length ||
          descriptionIndex <= this.descriptionTextContent.length
        ) {
          setTimeout(type, 200);
        }
      };

      type();
    },
  },
};
</script>

<style scoped>
.main {
  display: flex;
  height: 100vh;
}

.left-side {
  background-color: black;
  flex: 1;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.center-text {
  font-size: 8rem;
  color: white;
  font-weight: bold;
}

.right-side {
  flex: 1;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-wrapper {
  width: 50%;
}

.login-title {
  font-size: 4rem;
  font-weight: bold;
}

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
