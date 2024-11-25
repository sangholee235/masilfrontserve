<template>
  <div class="main row" data-aos="fade-up" data-aos-duration="200">
    <div class="col-7">
      <plan-map></plan-map>
    </div>
    <div class="col-5">
      <div class="plan-wrapper">
        <plan-header-select></plan-header-select>
        <plan-item-list></plan-item-list>
      </div>

      <div class="col-auto text-center">
        <b-button type="button" class="m-1" @click="openModal">
          여행코스 작성하러 가기
        </b-button>
      </div>
    </div>

    <b-modal
      v-model="modalShow"
      title="여행코스 작성하기"
      hide-footer
      size="lg"
      centered
    >
      <div v-if="loading" class="loading-container text-center">
        <b-spinner
          class="my-3"
          variant="primary"
          label="Loading..."
        ></b-spinner>
        <p>AI가 작성 중입니다...</p>
      </div>
      <div v-else>
        <b-form>
          <b-form-group id="input-group-title" label="제목 :" label-for="title">
            <b-form-input
              id="title"
              ref="title"
              v-model="title"
              placeholder=""
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-content"
            label="내용 :"
            label-for="content"
          >
            <b-form-textarea
              id="content"
              v-model="content"
              placeholder=""
              rows="6"
              max-rows="15"
            ></b-form-textarea>
          </b-form-group>

          <div class="col-auto text-center">
            <b-button type="button" @click="onSubmit" variant="primary">
              작성하기
            </b-button>
            <b-button
              type="button"
              @click="onAiRequest"
              variant="primary"
              style="margin-left: 5px"
            >
              AI 요청하기
            </b-button>
          </div>
        </b-form>
      </div>
    </b-modal>
  </div>
</template>

<script>
import http from "@/api/http";
import { mapState, mapActions } from "vuex";
import PlanMap from "@/components/plan/PlanMap";
import PlanHeaderSelect from "@/components/plan/PlanHeaderSelect";
import PlanItemList from "@/components/plan/PlanItemList";

export default {
  name: "AppPlan",
  components: {
    PlanMap,
    PlanHeaderSelect,
    PlanItemList,
  },
  data() {
    return {
      modalShow: false,
      title: "",
      content: "",
      loading: false, // 로딩 상태 추가
      typing: false, // 타이핑 상태 추가
      typingSpeed: 50, // 타이핑 속도 (밀리초)
    };
  },
  computed: {
    ...mapState("memberStore", ["userInfo"]),
    ...mapState("attractionStore", ["planMarkers"]),
  },
  methods: {
    ...mapActions("attractionStore", ["postPlan"]),
    openModal() {
      if (this.planMarkers.length == 0) {
        alert("작성하기전 여행 경로를 선택해주세요!");
      } else {
        this.modalShow = true;
      }
    },
    onSubmit() {
      this.checkValue();
    },
    checkValue() {
      let err = true;
      let msg = "";
      !this.title &&
        ((msg = "제목을 입력해주세요"),
        (err = false),
        this.$refs.title.focus());
      err &&
        !this.content &&
        ((msg = "내용을 입력해주세요"),
        (err = false),
        this.$refs.content.focus());

      if (!err) alert(msg);
      else this.doWritePlan();
    },
    doWritePlan() {
      http.defaults.headers["refresh-token"] =
        sessionStorage.getItem("refresh-token");

      let planDetailList = [];
      this.planMarkers.forEach((item, index) => {
        planDetailList.push({
          planOrder: index + 1,
          contentId: item[2],
        });
      });

      let plan = {
        title: this.title,
        content: this.content,
        userId: this.userInfo.userId,
        planDetailList: planDetailList,
      };

      http
        .post(`/plan/write`, plan)
        .then(({ data }) => {
          if (data.message === "success") {
            alert("여행경로가 등록되었습니다!");
            this.$router.push({ name: "travel" });
          } else {
            alert("여행경로 등록에 실패하였습니다.");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onAiRequest() {
      this.loading = true; // 로딩 상태 활성화
      const routeList = this.planMarkers.map((item) => item[4]);

      http
        .post("/ai", { routeList })
        .then(({ data }) => {
          if (data.title && data.content) {
            this.typingEffect("title", data.title);
            this.typingEffect("content", data.content);
          } else {
            alert("AI 응답을 받지 못했습니다.");
          }
        })
        .catch((error) => {
          console.error("AI 요청 실패:", error);
          alert("AI 요청에 실패하였습니다.");
        })
        .finally(() => {
          this.loading = false; // 로딩 상태 비활성화
        });
    },
    typingEffect(field, text) {
      this[field] = ""; // 초기화
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          this[field] += text[index];
          index++;
        } else {
          clearInterval(interval);
        }
      }, this.typingSpeed);
    },
  },
};
</script>

<style scoped>
.main {
  height: 100vh;
}

button {
  background-color: black;
  border: 0;
}
button:hover {
  background-color: black;
  border: 0;
}

.b-modal-lg {
  max-width: 900px;
  height: 70vh;
  max-height: 90vh;
  margin: auto;
}

.b-modal .modal-content {
  padding: 20px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px; /* 로딩 화면 높이 */
}
</style>
