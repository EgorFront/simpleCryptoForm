<template>
  <div class="container">
    <div class="wrapper">
      <wallet class="wallet" />

      <deal-form class="deal-form" />
    </div>
  </div>
</template>

<script>
import dealForm from './components/deal-form.vue'
import wallet from './components/wallet.vue'

export default {
  components: {
    dealForm,
    wallet,
  },
}
</script>

<style lang="scss">
.container {
  display: flex;
}
.wrapper {
  width: 100%;
  max-width: 480px;
  margin: 2rem auto 0;
}
.deal-form {
  width: 100%;
  margin: 2rem auto 0;
}
</style>
