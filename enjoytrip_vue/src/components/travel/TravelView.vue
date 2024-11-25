<template>
  <div id="travel-info" v-if="travelInfo">
    <b-row class="mb-4">
      <b-col>
        <h1>여행 코스 상세보기</h1>
      </b-col>
    </b-row>

    <div id="travel-info-item">
      <!-- 여행 코스 상세보기 테이블 -->
      <table class="table table-hover">
        <tr>
          <td class="table-header">제목</td>
          <td>{{ travelInfo.title }}</td>
        </tr>
        <tr>
          <td class="table-header">작성자</td>
          <td>{{ travelInfo.userId }}</td>
        </tr>
        <tr>
          <td class="table-header">작성일</td>
          <td>{{ travelInfo.planTime }}</td>
        </tr>
        <tr>
          <td class="table-header">내용</td>
          <td>{{ travelInfo.content }}</td>
        </tr>
      </table>

      <b-row class="mb-4">
        <b-col>
          <h1>여행 경로</h1>
        </b-col>
      </b-row>

      <!-- 여행 경로 테이블 (여행 코스 상세보기와 동일한 디자인) -->
      <table class="table table-hover">
        <tr
          v-for="(trm, index) in travelMarkers"
          :key="index"
          @click="movePan(trm[0], trm[1])"
        >
          <td class="table-header">
            <strong>{{ index + 1 }}번</strong>
          </td>
          <td>
            <strong>{{
              trm[4].length > 25 ? trm[4].substr(0, 25) + "..." : trm[4]
            }}</strong>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "TravelView",
  data() {
    return {
      travelInfo: null,
    };
  },
  computed: {
    ...mapState("attractionStore", [
      "travelList",
      "travelMarkers",
      "travelPlanId",
    ]),
  },
  watch: {
    travelPlanId: function (travelPlanId) {
      this.travelList.forEach((item) => {
        if (item.planId == travelPlanId) {
          this.travelInfo = item;
        }
      });
    },
  },
  methods: {
    ...mapActions("attractionStore", ["getPosition"]),
    movePan(lat, lon) {
      this.getPosition({
        latitude: lat,
        longitude: lon,
      });
    },
  },
  mounted() {
    this.travelList.forEach((item) => {
      if (item.planId == this.travelPlanId) {
        this.travelInfo = item;
      }
    });
  },
};
</script>

<style scoped>
h1 {
  margin: 0;
}

#travel-info {
  width: 100%;
  height: 95vh;
  padding-top: 30px;
  margin: 0;
}

#travel-info-item {
  width: 100%;
  height: 90%;
  overflow: auto;
}

table {
  width: 100%;
  table-layout: fixed;
  margin-bottom: 20px;
}

td {
  padding: 8px;
  vertical-align: middle;
}

.table-header {
  font-weight: bold;
  width: 20%;
  background-color: #f8f9fa;
}

tr {
  background-color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
}

tr:hover {
  background-color: rgba(0, 123, 255, 0.1);
}

b-col {
  display: flex;
  justify-content: center;
}

b-row {
  margin-bottom: 20px;
}
</style>
