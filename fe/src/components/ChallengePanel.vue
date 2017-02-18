<template>
  <div class='challenge-panel-container'>
    <div class='challenge'>
      <div class='description'>
        {{ description }}
      </div>
      <div class='code'>
      </div>
      <button class='submit'>
        提交代码
      </button>
    </div>
  </div>
</template>

<script>
import data from '../fixtures/descriptions.json'

export default {
  name: 'ChallengePanel',
  data () {
    return {
      description: null
    }
  },
  mounted () {
    this.description = data['description']
  }
}
</script>

<style scoped>
@import "../css/challenge-panel.css";
</style>
