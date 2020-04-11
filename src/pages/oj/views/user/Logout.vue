<template>
</template>

<script>
  import api from '../../api.js'

  export default {
    mounted () {
      this.$store.dispatch('clearProfile')
      this.$router.replace({
        path: '/'
      })
    }
  }
</script>
