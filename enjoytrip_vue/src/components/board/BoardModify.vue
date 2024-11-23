<template>
  <div class="container">
    <header class="header">
      <h1>게시글 수정</h1>
    </header>
    <section class="content">
      <board-input-item type="modify" />
    </section>
  </div>
</template>

<script>
import BoardInputItem from "@/components/board/item/BoardInputItem.vue";

export default {
  name: "BoardModify",
  components: {
    BoardInputItem,
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 20px auto;
}
.header {
  color: #333;
  padding: 10px;
  margin-bottom: 20px;
}
.content {
  margin-top: 20px;
}
</style>
