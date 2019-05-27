<template>
  <svg
    class="svg_icon"
    version="1.1"
    ref="svg_icon"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 300 300"
  ></svg>
</template>

<script>
const rough = require("roughjs/dist/rough.umd");
export default {
  name: "DrawSVGIcon",
  props: ["path"],
  data: function() {
    return {};
  },
  computed: {
    svg_icon: function() {
      const rs = rough.svg(this.$refs.svg_icon);
      return rs.path(`${this.path}`, {
        bowing: 7,
        roughness: 2,
        stroke: "black",
        strokeWidth: 8
      });
    }
  },
  mounted: function() {
    this.$refs.svg_icon.appendChild(this.svg_icon);
  }
};
</script>

<style lang="scss" scoped>
.svg_icon {
  overflow: visible;
  // border: 1pt solid;
  width: 1em;
  height: 1em;
  margin-right: 0.4em;
  margin-left: 0.4em;
}
</style>

