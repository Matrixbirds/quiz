<template>
  <nav class='navbar-container white'>
    <header class='navbar'>
      <div class='navbar-title'>{{ title }}</div>
      <div class='navbar-profile'>{{ user }}</div>
    </header>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data () {
    return {
      title: null,
      user: null
    }
  },
  mounted () {
    this.title = 'Tapas-Quiz'
    this.user = 'Gayhub用户名'
  }
}
</script>

<style scoped>
@import "../css/navbar";
</style>
