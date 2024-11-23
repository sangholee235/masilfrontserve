import axios from "axios";

// axios 객체 생성
export default axios.create({
  // TODO: 요청 기본 URL 설정하기
  baseURL: process.env.BASE_URL,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});
