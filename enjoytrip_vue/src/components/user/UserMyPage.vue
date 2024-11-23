<template>
  <b-container
    class="d-flex justify-content-center mt-4"
    data-aos="zoom-in"
    data-aos-duration="200"
  >
    <div class="info-wrapper">
      <!-- 상단 제목 -->
      <h1 class="info-title text-center mb-4">{{ userInfo.userName }}님의 정보</h1>
      <b-card class="p-4 info-card">
        <table class="table mb-4">
          <tr>
            <td class="info-label">아이디</td>
            <td class="info-value">{{ userInfo.userId }}</td>
          </tr>
          <tr>
            <td class="info-label">이름</td>
            <td class="info-value">{{ userInfo.userName }}</td>
          </tr>
          <tr>
            <td class="info-label">이메일</td>
            <td class="info-value">{{ userInfo.emailId }}@{{ userInfo.emailDomain }}</td>
          </tr>
          <tr>
            <td class="info-label">가입일</td>
            <td class="info-value">{{ userInfo.joinDate }}</td>
          </tr>
        </table>
        <!-- 버튼 영역 -->
        <div class="d-flex flex-column align-items-center">
          <b-button variant="dark" @click.prevent="movePage" class="info-button mb-3">
            정보수정
          </b-button>
          <b-button variant="danger" @click.prevent="modalShow = true" class="info-button">
            회원탈퇴
          </b-button>
        </div>
        <!-- 탈퇴 확인 모달 -->
        <b-modal v-model="modalShow" @ok="passwordCheck" title="회원 탈퇴">
          <p>정말 탈퇴하시겠습니까? 탈퇴하려면 비밀번호를 입력해주세요.</p>
          <b-form-input
            type="password"
            v-model="userPwd"
            placeholder="비밀번호를 입력해주세요"
            required
            class="modal-input"
          ></b-form-input>
        </b-modal>
      </b-card>
    </div>
  </b-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { passCheck, deleteMember } from "@/api/member";

export default {
  name: "UserMyPage",
  data() {
    return {
      userPwd: "",
      modalShow: false,
    };
  },
  computed: {
    ...mapState("memberStore", ["userInfo"]),
  },
  watch: {
    modalShow: function () {
      if (!this.modalShow) {
        this.userPwd = "";
      }
    },
  },
  methods: {
    ...mapActions("memberStore", ["userLogout"]),
    movePage() {
      this.$router.push({ name: "modify" });
    },
    passwordCheck() {
      let user = {
        userId: this.userInfo.userId,
        userPwd: this.userPwd,
      };
      passCheck(
        user,
        ({ data }) => {
          if (data.message === "success") {
            this.doDelete(user);
          } else {
            alert("비밀번호가 틀렸습니다.");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
    doDelete(user) {
      deleteMember(
        user,
        ({ data }) => {
          if (data.message === "success") {
            this.userLogout(this.userInfo.userId);
            sessionStorage.removeItem("access-token");
            sessionStorage.removeItem("refresh-token");
            this.$router.push({ name: "home" });
            alert("회원 탈퇴가 정상적으로 완료되었습니다. 이용해주셔서 감사합니다.");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
  },
};
</script>

<style scoped>
/* 전체 레이아웃 스타일 */
.info-wrapper {
  width: 50%;
}

/* 제목 스타일 */
.info-title {
  font-size: 2.5rem;
  font-weight: bold;
}

/* 카드 스타일 */
.info-card {
  border: none;
  box-shadow: none;
  border-radius: 10px;
  background-color: #f9f9f9;
}

/* 테이블 스타일 */
.table {
  width: 100%;
  margin-bottom: 1.5rem;
}

.info-label {
  font-weight: bold;
  font-size: 1rem;
  padding: 10px;
}

.info-value {
  font-size: 1rem;
  padding: 10px;
  color: #555;
}

/* 버튼 스타일 */
.info-button {
  width: 100%;
  padding: 10px 0;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 5px;
  background-color: black;
  color: white;
  border: none;
  text-align: center;
}

.info-button.variant-danger {
  background-color: #dc3545;
}

.info-button:hover {
  opacity: 0.9;
}

/* 모달 입력 스타일 */
.modal-input {
  margin-top: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
