<template>
  <svg
    class="star"
    version="1.1"
    ref="star"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 300 300"
  ></svg>
</template>

<script>
const rough = require("roughjs/dist/rough.umd");
export default {
  name: "DrawStarSVG",
  data: function() {
    return {};
  },
  computed: {
    star: function() {
      const rs = rough.svg(this.$refs.star);
      return rs.linearPath(
        [
          [298.473, 107.617],
          [63.99, 290.555],
          [146.162, 4.729],
          [247.688, 284.267],
          [1.244, 117.791],
          [298, 107.5]
        ],
        { bowing: 7, roughness: 2, stroke: "black", strokeWidth: 8 }
      );
    }
  },
  mounted: function() {
    this.$refs.star.appendChild(this.star);
  }
};
</script>

<style lang="scss" scoped>
.star {
  // border: 1pt solid;
  width: 1em;
  height: 1em;
  margin-right: 0.4em;
  margin-left: 0.4em;
}
</style>

