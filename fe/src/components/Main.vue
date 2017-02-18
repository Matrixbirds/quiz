<template>
  <div id='main' class='container'>
    <navbar></navbar>
    <board></board>
  </div>
</template>

<script>
import NavBar from 'components/NavBar'
import Board from 'components/Board'

export default {
  name: 'Main',
  components: {
    navbar: NavBar,
    board: Board
  }
}
</script>

<style>
@import "../css/style";
</style>
