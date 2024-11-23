<template>
  <div class="container mt-3">
    <div class="row">
      <div class="col">
        <div class="navbar">
          <div class="navbar-brand ms-3">
            <h1>자유게시판</h1>
          </div>
        </div>
      </div>
    </div>
    <div class="row article-list">
      <div class="col">
        <vue-good-table
          v-bind="articles"
          :columns="columns"
          :rows="articles.articles"
          @on-row-click="onRowClick"
          :sort-options="{
            enabled: true,
            initialSortBy: { field: 'articleNo', type: 'desc' },
          }"
          :search-options="{
            enabled: true,
            trigger: 'enter',
            skipDiacritics: true,
            placeholder: '검색어를 입력해주세요',
          }"
          :pagination-options="{
            enabled: true,
            mode: 'records',
            perPage: 10,
            perPageDropdownEnabled: false,
          }"
          :select-options="{
            enabled: false,
            selectOnCheckboxOnly: true,
            selectionInfoClass: 'custom-class',
            selectionText: 'rows selected',
            clearSelectionText: 'clear',
            disableSelectInfo: true,
            selectAllByGroup: true,
          }"
        >
        </vue-good-table>
      </div>
    </div>
    <div class="row mt-2 mb-1">
      <div class="col text-right">
        <button @click="moveWrite()">글 작성</button>
      </div>
    </div>
  </div>
</template>

<script>
import http from "@/api/http";
import "vue-good-table/dist/vue-good-table.css";
import { VueGoodTable } from "vue-good-table";

export default {
  name: "BoardList",
  components: {
    VueGoodTable,
  },
  data() {
    return {
      articles: [],
      columns: [
        { label: "글번호", field: "articleNo", type: "number" },
        { label: "제목", field: "subject", type: "text" },
        { label: "작성자", field: "userId", type: "text" },
        { label: "조회수", field: "hit", type: "number" },
        { label: "작성 시간", field: "registerTime", type: "text" },
      ],
      rows: [],
    };
  },
  created() {
    http.get(`/board/list?pgno=1&orderby=none&orderbydir=&key=none&word=none`).then(({ data }) => {
      this.articles = data;
    });
  },
  methods: {
    moveWrite() {
      this.$router.push({ name: "boardwrite" });
    },
    onRowClick(article) {
      this.$router.push({
        name: "boardDetail",
        params: { articleno: article.row.articleNo },
      });
    },
  },
};
</script>

<style>
h3 {
  margin: 0;
}

.vgt-wrap {
  min-width: 650px;
}

th,
td {
  text-align: center !important;
}

.vgt-global-search {
  width: 21% !important;
  min-width: 200px;
  float: left;
}

button {
  background-color: #000;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}
button:hover {
  background-color: #333;
}
</style>
