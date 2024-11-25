<template>
  <div id="attraction-map">
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
  name: "AttractionMap",
  components: { AttractionDetail },
  data() {
    return {
      map: null,
      lat: null,
      lon: null,
      markers: [],
      modalShow: false,
    };
  },
  computed: {
    ...mapState("attractionStore", [
      "latitude",
      "longitude",
      "markerPositions",
    ]),
  },
  watch: {
    // 마커 위치 변화에 따른 지도 마커 표시
    markerPositions: function (markerPositions) {
      if (this.markers.length > 0) {
        this.markers.forEach((marker) => marker.setMap(null));
      }
      const positions = markerPositions.map(
        (position) => new kakao.maps.LatLng(position[0], position[1])
      );
      if (markerPositions.length > 0) {
        this.markers = markerPositions.map((position) => {
          const pos = new kakao.maps.LatLng(position[0], position[1]);
          const marker = new kakao.maps.Marker({
            map: this.map,
            position: pos,
            clickable: true, // 마커 클릭 가능
          });

          // 마커 클릭 이벤트
          kakao.maps.event.addListener(marker, "click", () => {
            this.getAttraction(position[2]);
            this.map.panTo(new kakao.maps.LatLng(position[0], position[1]));
            this.modalShow = !this.modalShow;
          });

          return marker;
        });
        const bounds = positions.reduce(
          (bounds, latlng) => bounds.extend(latlng),
          new kakao.maps.LatLngBounds()
        );
        this.map.setBounds(bounds);
      }
    },
    // 모달 감지
    modalShow: function () {
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
          this.lat = position.coords.latitude;
          this.lon = position.coords.longitude;
          this.getPosition({
            latitude: this.lat,
            longitude: this.lon,
          });
          this.map.panTo(new kakao.maps.LatLng(this.lat, this.lon));
        });
      }
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

<style>
#attraction-map {
  height: 100%;
}

#map {
  height: 100%;
}
</style>
