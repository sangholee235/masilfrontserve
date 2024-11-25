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
    planMarkers: function (planMarkers) {
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
        this.addNumbers(positions);
      }
    },
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
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(37.5012743, 127.039585),
        level: 6,
      };
      this.map = new kakao.maps.Map(container, options);

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
    makeLine(positions) {
      if (this.polyline != null) {
        this.polyline.setMap(null);
      }
      this.polyline = new kakao.maps.Polyline({
        path: positions,
        strokeWeight: 6,
        strokeColor: "black",
        strokeOpacity: 0.7,
        strokeStyle: "solid",
      });
      this.polyline.setMap(this.map);
    },
    addNumbers(positions) {
      positions.forEach((position, index) => {
        const marker = new kakao.maps.CustomOverlay({
          map: this.map,
          position: position,
          content: `<div class="number-label">${index + 1}번</div>`,
          yAnchor: 1,
        });
        this.customOverlays.push(marker);
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
  background-color: white; /* 흰색 배경 추가 */
  color: black; /* 텍스트 색상 조정 */
  font-size: 14px;
  padding: 5px;
  border-radius: 50%;
  text-align: center;
  font-weight: bold;
  border: 2px solid black; /* 테두리 추가 */
}
</style>
