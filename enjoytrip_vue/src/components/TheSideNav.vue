<template>
  <div>
    <div id="sidebar" :class="{ 'sidebar-horizontal': isHorizontal }">
      <div class="sidebar-body">
        <router-link
          :to="{ name: 'home' }"
          class="sidebar-profile"
          style="text-decoration: none"
        >
          <div v-show="menuCompact.hidden">
            <div class="sidebar-links">
              <h1>무중단배포가되는지 테스트하려고</h1>
            </div>
          </div>
        </router-link>

        <div class="sidebar-links">
          <div class="links" v-if="userInfo">
            <router-link
              :to="link.path"
              v-for="link in menuLinksLogin"
              :key="link.title"
            >
              <!-- <b-icon :icon="link.icon"></b-icon> -->
              <div class="link-title" v-show="menuCompact.hidden">
                {{ link.title }}
              </div>
            </router-link>
          </div>
          <div class="links" v-else>
            <router-link
              :to="link.path"
              v-for="link in menuLinks"
              :key="link.title"
            >
              <!-- <b-icon :icon="link.icon"></b-icon> -->
              <div class="link-title" v-show="menuCompact.hidden">
                {{ link.title }}
              </div>
            </router-link>
          </div>
        </div>

        <div class="sidebar-links sidebar-user">
          <div class="links user-horizontal">
            <div v-if="userInfo" class="user-info-container">
              <!-- <div class="user-info">
                <div class="link-title" v-show="menuCompact.hidden">
                  {{ userInfo.userName }}님 환영합니다.
                </div>
              </div> -->
              <router-link :to="{ name: 'mypage' }">
                <!-- <b-icon icon="person-circle"></b-icon> -->
                <div class="link-title" v-show="menuCompact.hidden">
                  내 정보
                </div>
              </router-link>
              <a href="#" @click.prevent="onClickLogout">
                <!-- <b-icon icon="box-arrow-right"></b-icon> -->
                <div class="link-title" v-show="menuCompact.hidden">
                  로그아웃
                </div>
              </a>
            </div>
            <div v-else class="user-info-container">
              <router-link :to="{ name: 'login' }">
                <!-- <b-icon icon="box-arrow-in-right"></b-icon> -->
                <div class="link-title" v-show="menuCompact.hidden">로그인</div>
              </router-link>
              <router-link :to="{ name: 'join' }">
                <!-- <b-icon icon="person-plus"></b-icon> -->
                <div class="link-title" v-show="menuCompact.hidden">
                  회원가입
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="sidebar-toggle">
        <div @click="changeToggleState()" id="btn-toggle">
          <i id="btn-toggle-icon" class="bi bi-chevron-double-left"></i>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

const memberStore = "memberStore";

export default {
  name: "TheSideNavTest",
  data() {
    return {
      drawer: true,
      menuCompact: {
        hidden: true,
      },
      isHorizontal: true,
      menuLinks: [
        // { path: "/", title: "홈", icon: "house-door-fill" },
        { path: "/attraction", title: "여행지도", icon: "map-fill" },
        { path: "/travel", title: "여행코스", icon: "signpost-split" },
        { path: "/board", title: "게시판", icon: "card-text" },
      ],
      menuLinksLogin: [
        // { path: "/", title: "홈", icon: "house-door-fill" },
        { path: "/attraction", title: "여행지도", icon: "map-fill" },
        { path: "/travel", title: "여행코스", icon: "signpost-split" },
        { path: "/plan", title: "코스 제작", icon: "pin-map-fill" },
        { path: "/board", title: "게시판", icon: "card-text" },
      ],
    };
  },
  computed: {
    ...mapState(memberStore, ["isLogin", "userInfo"]),
    ...mapGetters(["checkUserInfo"]),
  },
  methods: {
    ...mapActions(memberStore, ["userLogout"]),
    onClickLogout() {
      this.userLogout(this.userInfo.userId);
      sessionStorage.removeItem("access-token");
      sessionStorage.removeItem("refresh-token");
      if (this.$route.path !== "/") this.$router.push({ name: "home" });
    },
    changeToggleState() {
      let btnToggleIcon = document.getElementById("btn-toggle-icon");
      this.menuCompact.hidden = !this.menuCompact.hidden;

      if (this.menuCompact.hidden) {
        btnToggleIcon.style.transform = "rotateY(0deg)";
      } else {
        btnToggleIcon.style.transform = "rotateY(180deg)";
      }
    },
  },
};
</script>

<style scoped>
.link-title {
  min-width: 100%;
  margin-left: 8px;
}

h1 {
  color: #ffffff;
}

.user-horizontal {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info-container {
  display: flex;
  align-items: center;
}

.bi {
  font-size: 28px;
  font-weight: bold;
  color: #ffffff;
}

#sidebar {
  display: flex;
  height: 100%;
  margin: 0;
  /* background-color: #2c3e50; */
  background-color: #000000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-right: 2px solid #34495e;
  color: #ecf0f1;
}

#sidebar.sidebar-horizontal {
  flex-direction: row;
  align-items: center;
  height: auto;
}

.sidebar-body {
  justify-content: space-between;
  width: 50%;
  min-width: 1000px;
  display: flex;
  margin: auto;
  margin-top: 8px;
  padding: 15px;
}

.sidebar-profile {
  width: 25%;
}

.sidebar-user {
  width: 25%;
}

.sidebar-horizontal .sidebar-body {
  flex-direction: row;
}
.sidebar-links {
  border-color: white;
}

.sidebar-links .links {
  display: flex;
}

.sidebar-horizontal .links {
  flex-direction: row;
  align-items: center;
}

.sidebar-links a {
  text-decoration: none;
  /* background-color: #34495e; */
  border-radius: 25px;
  padding: 12px 20px;
  margin: 8px;
  font-weight: 600;
  color: #ecf0f1;
  display: flex;
  align-items: center;
}

.sidebar-horizontal .sidebar-links a {
  margin: 0 15px;
}

.sidebar-toggle {
  display: flex;
  justify-content: center;
}

#btn-toggle {
  padding: 5px;
  cursor: pointer;
}

#btn-toggle-icon {
  color: #ecf0f1;
  font-size: 24px;
}

/* 반응형 디자인 */
@media screen and (max-width: 768px) {
  #sidebar {
    flex-direction: column;
  }

  .sidebar-horizontal {
    flex-direction: column;
  }

  .sidebar-links a {
    justify-content: center;
  }
}
</style>
