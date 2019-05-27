<template>
  <section class="container pad-route no-print-gutters">
    <div class="box no-print-borders">
      <app-cake-builder/>
    </div>
  </section>
</template>

<script>
import CakeBuilder from "@/containers/CakeBuilder/CakeBuilder.vue";
export default {
  components: {
    "app-cake-builder": CakeBuilder
  },
  data: function() {
    return {};
  }
};
</script>

<style lang="scss">
// CSS Debugger File:
// @import "./assets/styles/debug.css";
body {
  background-color: #6b6051;
  min-height: 100vh;
}
</style>
