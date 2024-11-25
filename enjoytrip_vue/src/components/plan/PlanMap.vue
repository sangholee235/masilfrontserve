<template>
  <div id="plan-map">
    <div id="map"></div>
    <b-modal v-model="modalShow" size="xl" ok-only>
      <attraction-detail></attraction-detail>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import AttractionDetail from "@/components/attraction/AttractionDetail";

export default {
  name: "PlanMap",
  components: { AttractionDetail },
  data() {
    return {
      map: null,
      lat: null,
      lon: null,
      markers: [],
      customOverlays: [],
      polyline: null,
      modalShow: false,
    };
  },
  computed: {
    ...mapState("attractionStore", ["latitude", "longitude", "planMarkers"]),
  },
  watch: {
    // 마커 위치 변화에 따른 지도 마커 표시
    planMarkers: function (planMarkers) {
      // 오버레이 초기화
      this.customOverlays.forEach((overlay) => {
        overlay.setMap(null);
      });
      this.customOverlays = [];

      if (this.markers.length > 0) {
        this.markers.forEach((marker) => marker.setMap(null));
      }

      const positions = planMarkers.map(
        (position) => new kakao.maps.LatLng(position[0], position[1])
      );

      if (planMarkers.length > 0) {
        const bounds = positions.reduce(
          (bounds, latlng) => bounds.extend(latlng),
          new kakao.maps.LatLngBounds()
        );
        this.map.setBounds(bounds);

        this.makeLine(positions);
        this.addNumbers(positions); // 번호 추가
      }
    },
    // 모달 감지
    modalShow: function () {
      // 모달이 닫혀 있는 경우 관광지 상세 정보 삭제
      if (!this.modalShow) {
        this.CLEAR_ATTRACTION();
      }
    },
  },
  methods: {
    ...mapMutations("attractionStore", ["CLEAR_ATTRACTION"]),
    ...mapActions("attractionStore", ["getPosition", "getAttraction"]),
    initMap() {
      // 현재 위치를 중심으로 지도 생성
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(37.5012743, 127.039585),
        level: 6,
      };
      this.map = new kakao.maps.Map(container, options);

      // geolocation을 사용할 수 있는지 확인
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          // GeoLocation을 이용해서 접속 위치 획득
          this.lat = position.coords.latitude; // 위도
          this.lon = position.coords.longitude; // 경도
          this.getPosition({
            latitude: this.lat,
            longitude: this.lon,
          });
          this.map.panTo(new kakao.maps.LatLng(this.lat, this.lon));
        });
      }
    },
    makeLine(positions) {
      // 연결선 초기화
      if (this.polyline != null) {
        this.polyline.setMap(null);
      }
      // 연결선 생성
      this.polyline = new kakao.maps.Polyline({
        path: positions, // 선을 구성하는 좌표배열
        strokeWeight: 6, // 두께
        strokeColor: "black",
        strokeOpacity: 0.7, // 불투명도(1에서 0 사이의 값, 0: 투명)
        strokeStyle: "solid", // 스타일
      });
      // 연결선 표시
      this.polyline.setMap(this.map);
    },
    addNumbers(positions) {
      // 번호를 각 위치에 표시하는 함수
      positions.forEach((position, index) => {
        const marker = new kakao.maps.CustomOverlay({
          map: this.map,
          position: position,
          content: `<div class="number-label">${index + 1}</div>`, // 번호를 표시
          yAnchor: 1,
        });
        this.customOverlays.push(marker); // 생성된 마커를 배열에 저장
      });
    },
  },
  created() {
    this.modalShow = false;
  },
  mounted() {
    if (!window.kakao || !window.kakao.maps) {
      const script = document.createElement("script");
      script.onload = () => kakao.maps.load(this.initMap);
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${process.env.VUE_APP_KAKAO_API}`;
      document.head.appendChild(script);
    } else {
      this.initMap();
    }
  },
};
</script>

<style scoped>
#plan-map {
  height: 100%;
}

#map {
  height: 100%;
}

.number-label {
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 14px;
  padding: 5px;
  border-radius: 50%;
  text-align: center;
  font-weight: bold;
}
</style>
