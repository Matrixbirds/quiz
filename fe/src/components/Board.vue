<template>
  <section class='board-container'>
    <section class='board white'>
      <ul class='tab'>
        <router-link to="/board">题目</router-link>
        <router-link to="/commit_history">提交记录</router-link>
      </ul>
      <router-view name='panel'></router-view>
    </section>
  </section>
</template>

<script>
export default {
  name: 'Board'
}
</script>

<style scoped>
@import "../css/board";
</style>
