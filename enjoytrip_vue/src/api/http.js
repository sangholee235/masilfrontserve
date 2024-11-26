import axios from "axios";

// axios 객체 생성
export default axios.create({
  // TODO: 요청 기본 URL 설정하기
  baseURL: "http://43.203.210.15:80",
  // baseURL: "http://192.168.130.93:80",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});
