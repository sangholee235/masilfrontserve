<template>
  <div id="travel-list">
    <div class="header">
      <h3>여행코스</h3>
    </div>
    <div id="travel-list-item">
      <table v-if="travelList.length != 0">
        <tr v-for="(trl, index) in travelList" :key="index" @click="setTravelPlan(index)">
          <td>
            <strong>{{ index + 1 }}</strong>
          </td>
          <td v-if="trl.title.length > 25">
            <strong>{{ trl.title.substr(0, 25) }}...</strong>
          </td>
          <td v-if="trl.title.length <= 25">
            <strong>{{ trl.title }}</strong>
          </td>
          <td>
            {{ trl.userId }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "TravelList",
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapState("attractionStore", ["travelList"]),
  },
  created() {
    this.loadTravelList();
  },
  mounted() {
    this.loadTravelList();
  },
  methods: {
    ...mapActions("attractionStore", ["getTravelList"]),
    ...mapMutations("attractionStore", [
      "SET_TRAVEL_PLAN",
      "SET_TRAVEL_MARKERS",
      "CLEAR_TRAVEL_MARKERS",
      "CLEAR_TRAVEL_LIST",
      "CLEAR_TRAVEL_PLAN",
    ]),
    loadTravelList() {
      this.CLEAR_TRAVEL_MARKERS();
      this.CLEAR_TRAVEL_LIST();
      this.CLEAR_TRAVEL_PLAN();
      this.getTravelList();
      console.log("목록 호출");
      console.log(this.travelList);
    },
    setTravelPlan(index) {
      console.log("마커 세팅");
      this.CLEAR_TRAVEL_MARKERS();
      this.SET_TRAVEL_PLAN(this.travelList[index]);
      this.SET_TRAVEL_MARKERS();
      this.$router.push({ name: "travelview" });
    },
  },
};
</script>

<style scoped>
h3 {
  margin: 0;
}

#travel-list {
  width: 100%;
  height: 95vh;
  margin: 0;
  text-align: center;
}

#travel-list-item {
  width: 100%;
  height: 90%;
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

tr {
  background-color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  border-bottom: 1px solid #ddd;
}

td {
  width: 33%;
  padding: 8px 12px;
}

strong {
  font-weight: bold;
}

.header {
  margin: 20px;
}
</style>
