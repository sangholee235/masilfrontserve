<template>
  <div class="container">
    <div class="navbar">
      <div class="navbar-brand">
        <h1>게시글 작성</h1>
      </div>
    </div>
    <div class="content">
      <board-input-item type="register"></board-input-item>
    </div>
  </div>
</template>

<script>
import BoardInputItem from "@/components/board/item/BoardInputItem.vue";
export default {
  name: "BoardWrite",
  components: {
    BoardInputItem,
  },
};
</script>

<style scoped>
.container {
  margin: 40px auto;
  max-width: 800px;
}

.navbar {
  margin-bottom: 20px;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.navbar-brand h1 {
  margin: 0;
  color: black;
}

.content {
  padding: 20px;
}
</style>
