<template>
  <svg
    class="line"
    version="1.1"
    ref="line"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 400 2"
  ></svg>
</template>

<script>
const rough = require("roughjs/dist/rough.umd");
export default {
  name: "DrawLineSVG",
  data: function() {
    return {};
  },
  computed: {
    line: function() {
      const rs = rough.svg(this.$refs.line);
      return rs.line(1, 1, 399, 1, {
        bowing: 0,
        roughness: 3.5,
        stroke: "darkgrey",
        strokeWidth: 1.5
      });
    }
  },
  mounted: function() {
    this.$refs.line.appendChild(this.line);
  }
};
</script>

<style lang="scss" scoped>
.line {
  // border: 1pt solid;
  // display: none;
  width: 100%;
  float: left;
  overflow: visible;
  margin: 0.5em 0;
}
</style>

