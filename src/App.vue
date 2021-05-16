<script>
export default {
  data() {
    return {
      nav: [
        {
          name: 'home',
          text: 'Home',
        },
      ],
    }
  },
}
</script>

<template>
  <div id="app">
    <div id="nav">
      <router-link
        class="link"
        v-for="(link, i) in nav"
        :key="i"
        :to="{ name: link.name }"
      >
        {{ link.text }}
      </router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
@import '~normalize.css/normalize.css';

* {
  box-sizing: border-box;
}

#app {
  // TODO: fix vh units on ios
  min-height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  text-align: center;
  background-color: #f6f6f4;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#nav {
  display: flex;
  justify-content: center;
  padding: 12px 8px;
  color: #fff;
  background-color: rgb(44, 41, 42);

  .link {
    display: block;
    font-size: 1.125rem;
    font-weight: 500;
    color: #fff;
    text-decoration: none;
    &:not(:last-of-type) {
      margin-right: 1.25em;
    }
    &.router-link-exact-active {
      text-decoration: underline;
    }
  }
}
</style>
