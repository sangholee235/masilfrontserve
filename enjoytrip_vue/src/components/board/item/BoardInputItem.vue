<template>
  <div class="form-container">
    <form @submit="onSubmit" @reset="onReset">
      <div class="form-group">
        <label for="subject">제목</label>
        <input
          id="subject"
          v-model="article.subject"
          type="text"
          required
          class="form-input"
          placeholder=""
        />
      </div>

      <div class="form-group">
        <label for="content">내용</label>
        <textarea
          id="content"
          v-model="article.content"
          class="form-textarea"
          placeholder=""
          rows="10"
        ></textarea>
      </div>

      <div class="button-group">
        <button type="submit" class="btn btn-submit" v-if="this.type === 'register'">작성</button>
        <button type="submit" class="btn btn-submit" v-else>수정</button>
        <button type="reset" class="btn btn-reset">취소</button>
      </div>
    </form>
  </div>
</template>

<script>
import http from "@/api/http";
import { mapState } from "vuex";

export default {
  name: "BoardInputItem",
  data() {
    return {
      article: {
        articleNo: 0,
        userId: "",
        subject: "",
        content: "",
      },
      isUserid: false,
    };
  },
  computed: {
    ...mapState("memberStore", ["userInfo"]),
  },
  props: {
    type: { type: String },
  },
  created() {
    this.article.userId = this.userInfo.userId;
    if (this.type === "modify") {
      http.get(`/board/view/${this.$route.params.articleno}`).then(({ data }) => {
        this.article = data;
      });
      this.isUserid = true;
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();

      let err = true;
      let msg = "";
      !this.article.userId &&
        ((msg = "작성자 입력해주세요"), (err = false), this.$refs.userid?.focus());
      err &&
        !this.article.subject &&
        ((msg = "제목 입력해주세요"), (err = false), this.$refs.subject?.focus());
      err &&
        !this.article.content &&
        ((msg = "내용 입력해주세요"), (err = false), this.$refs.content?.focus());

      if (!err) alert(msg);
      else this.type === "register" ? this.registArticle() : this.modifyArticle();
    },
    onReset(event) {
      event.preventDefault();
      this.article.articleNo = 0;
      this.article.subject = "";
      this.article.content = "";
      this.$router.push({ name: "boardList" });
    },
    registArticle() {
      http
        .post(`/board/write`, {
          userId: this.article.userId,
          subject: this.article.subject,
          content: this.article.content,
        })
        .then(({ data }) => {
          console.log(data);
          this.moveList();
        });
    },
    modifyArticle() {
      http
        .put(`/board/${this.article.articleNo}`, {
          articleno: this.article.articleNo,
          userid: this.article.userId,
          subject: this.article.subject,
          content: this.article.content,
        })
        .then(({ data }) => {
          console.log(data);
          this.$router.push({ name: "boardList" });
        });
    },
    moveList() {
      this.$router.push({ name: "boardList" });
    },
  },
};
</script>

<style>
.form-container {
  width: 100%;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.form-textarea {
  resize: none;
}

.button-group {
  display: flex;
  justify-content: end;
  gap: 10px;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-submit {
  background-color: #333;
  color: white;
}

.btn-reset {
  background-color: #ddd;
  color: black;
}
</style>
