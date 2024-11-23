<template>
  <div id="app">
    <the-side-nav v-if="!isMainPage"></the-side-nav>
    <div class="view-wrapper">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import TheSideNav from "@/components/TheSideNav";

export default {
  name: "App",
  components: {
    TheSideNav,
  },
  computed: {
    isMainPage() {
      // 현재 경로가 '/'인지 확인
      return this.$route.path === "/";
    },
  },
};
</script>

<style>
/* 폰트 설정 */
/* 우아한형제들 */
/* @font-face {
  font-family: "KOFIHDrLEEJWTTF-B";
  src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_231029@1.1/JalnanGothic.woff")
    format("woff");
  font-weight: 700;
  font-style: normal;
} */

@font-face {
  font-family: "KOFIHDrLEEJWTTF-B";
  src: url("@/assets/fonts/musinsa-Medium.ttf") format("truetype");
  font-weight: 700;
  font-style: normal;
}

/* 마이쮸체 */
/* @font-face {
  font-family: "TTCrownMychewR";
  src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2205@1.0/TTCrownMychewR.woff2")
    format("woff2");
  font-weight: normal;
  font-style: normal;
} */

/* 화면 크기 설정 */
body {
  font-family: "KOFIHDrLEEJWTTF-B" !important;
  padding: 0;
  margin: 0;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
body::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera*/
}
#app {
  /* display: inline-flex; */
  width: 100vw;
  padding: 0;
  margin: 0;
}
.main {
  width: 100%;
  height: 100vh;
}

.view-wrapper {
  width: 100%;
  margin: auto;
}
</style>
