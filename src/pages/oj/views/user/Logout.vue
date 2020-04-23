<template>
</template>

<script>
  export default {
    mounted () {
      this.$store.dispatch('clearProfile').then(res => {
        this.$store.dispatch('clearJwt').then(res => {
          console.log(window.localStorage.getItem('JWT'))
          this.$router.replace('/')
        })
      })
    }
  }
</script>
