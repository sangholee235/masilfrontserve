<template>
  <div class="row" id="plan-item-list">
    <div class="col-6">
      <h3>관광지 목록</h3>

      <draggable class="list-group" :list="attractionList" group="attraction">
        <div
          class="list-group-item"
          v-for="(atr, index) in attractionList"
          :key="index"
        >
          <div class="custom-card">
            <div class="custom-card-img">
              <img :src="atr.firstImage2" :alt="atr.title" />
            </div>
            <div class="custom-card-content">
              <div class="item-title">
                {{
                  atr.title.length > 25
                    ? atr.title.substr(0, 25) + "..."
                    : atr.title
                }}
              </div>
            </div>
          </div>
        </div>
      </draggable>
    </div>

    <div class="col-6">
      <h3>여행경로</h3>
      <draggable
        class="list-group"
        :list="planList"
        group="attraction"
        @change="setPlanMarker"
      >
        <div v-if="planList.length == 0" class="empty-list">
          여기로 드래그해주세요
        </div>
        <div
          class="list-group-item"
          v-for="(atr, index) in planList"
          :key="index"
        >
          <div class="custom-card">
            <div class="custom-card-img">
              <img :src="atr.firstImage2" :alt="atr.title" />
            </div>
            <div class="custom-card-content">
              <div class="item-title">
                <strong>{{ index + 1 }}번</strong><br />
                {{
                  atr.title.length > 15
                    ? atr.title.substr(0, 15) + "..."
                    : atr.title
                }}
              </div>
              <button class="delete-btn" @click="deleteItem(atr.contentId)">
                삭제
              </button>
            </div>
          </div>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import draggable from "vuedraggable";

export default {
  name: "PlanItemList",
  components: {
    draggable,
  },
  data() {
    return {
      attractionList: [],
      planList: [],
    };
  },
  computed: {
    ...mapState("attractionStore", ["attractions"]),
  },
  watch: {
    attractions: function (attractions) {
      this.attractionList = attractions;
    },
    planList: function () {
      this.setPlanMarker();
    },
  },
  mounted() {
    this.CLEAR_PLAN_MARKERS();
  },
  methods: {
    ...mapMutations("attractionStore", [
      "SET_PLAN_MARKERS",
      "CLEAR_PLAN_MARKERS",
    ]),
    deleteItem(contentId) {
      for (let i = 0; i < this.planList.length; i++) {
        if (this.planList[i].contentId === contentId) {
          this.attractionList.push(this.planList[i]);
          this.planList.splice(i, 1);
          i--;
          break;
        }
      }
    },
    setPlanMarker() {
      this.CLEAR_PLAN_MARKERS();
      this.SET_PLAN_MARKERS(this.planList);
    },
  },
};
</script>

<style scoped>
#plan-item-list {
  width: 100%;
  height: 80vh;
  margin: 0;
}
.list-group {
  height: 73vh;
  overflow-y: auto;
  background-color: white;
}
.list-group::-webkit-scrollbar {
  display: none;
}

.list-group-item {
  padding: 0;
  border: 0;
  margin-bottom: 10px;
}

.custom-card {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  background-color: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}
.custom-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}
.custom-card-img img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
.custom-card-content {
  padding: 10px;
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item-title {
  font-size: 1rem;
  color: #333;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.delete-btn {
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}
.delete-btn:hover {
  background-color: #e63939;
}
.empty-list {
  text-align: center;
  color: #888;
  font-size: 1.2rem;
}
</style>
