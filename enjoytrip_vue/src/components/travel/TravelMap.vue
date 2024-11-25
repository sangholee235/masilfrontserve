<template>
  <div id="travel-map">
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
  name: "TravelMap",
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
    ...mapState("attractionStore", [
      "latitude",
      "longitude",
      "travelPlan",
      "travelMarkers",
    ]),
  },
  watch: {
    // 좌표 변화에 따른 화면 이동
    latitude: function () {
      console.log(this.latitude, this.longitude);
      this.map.panTo(new kakao.maps.LatLng(this.latitude, this.longitude));
    },
    // 마커 위치 변화에 따른 지도 마커 표시
    travelMarkers: function (travelMarkers) {
      // 연결선 초기화
      if (this.polyline != null) {
        this.polyline.setMap(null);
      }
      // 오버레이 초기화
      this.customOverlays.forEach((overlay) => {
        overlay.setMap(null);
      });
      this.customOverlays = [];

      if (this.markers.length > 0) {
        this.markers.forEach((marker) => marker.setMap(null));
      }

      const positions = travelMarkers.map(
        (position) => new kakao.maps.LatLng(position[0], position[1])
      );
      if (travelMarkers.length > 0) {
        let index = 1;
        this.customOverlays = travelMarkers.map((position) => {
          var pos = new kakao.maps.LatLng(position[0], position[1]);

          // 번호만 표시
          var content = `<div class="label" style="padding: 5px; background-color: rgba(255, 255, 255, 0.75);"><strong>${index++}번</strong></div>`;
          var customOverlay = new kakao.maps.CustomOverlay({
            position: pos,
            content: content,
          });
          customOverlay.setMap(this.map);
          return customOverlay;
        });
        const bounds = positions.reduce(
          (bounds, latlng) => bounds.extend(latlng),
          new kakao.maps.LatLngBounds()
        );
        this.map.setBounds(bounds);

        this.makeLine(positions);
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
          // console.log("GeoLocation 접속위치 획득=>위도:" + this.lat + ", 경도:" + this.lon);
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
        strokeColor: "black", // 색깔
        strokeOpacity: 0.7, // 불투명도(1에서 0 사이의 값, 0: 투명)
        strokeStyle: "solid", // 스타일
      });
      // 연결선 표시
      this.polyline.setMap(this.map);
    },
  },
  created() {
    this.modalShow = false;
  },
  mounted() {
    if (!window.kakao || !window.kakao.maps) {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${process.env.VUE_APP_KAKAO_API}`;
      document.head.appendChild(script);
    } else {
      this.initMap();
    }
  },
};
</script>

<style>
#travel-map {
  height: 100%;
}

#map {
  width: 100%;
  height: 100%;
}

.label {
  font-size: 16px;
  color: #000;
  font-weight: bold;
  text-align: center;
}
</style>
