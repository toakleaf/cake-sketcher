<template>
  <svg
    class="color_swatch"
    version="1.1"
    ref="color_swatch"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 300 300"
  ></svg>
</template>

<script>
const rough = require("roughjs/dist/rough.umd");
export default {
  name: "ColorSwatchSVG",
  props: ["color"],
  data: function() {
    return {};
  },
  computed: {
    color_swatch: function() {
      const rs = rough.svg(this.$refs.color_swatch);
      return rs.rectangle(0, 0, 300, 300, {
        stroke: "black",
        roughness: 4,
        fill: this.color,
        bowing: 2,
        strokeWidth: 4,
        fillWeight: 4,
        hachureGap: 6
      });
    }
  },
  watch: {
    color: function() {
      this.$refs.color_swatch.removeChild(this.$refs.color_swatch.firstChild);
      this.$refs.color_swatch.appendChild(this.color_swatch);
    }
  },
  mounted: function() {
    this.$refs.color_swatch.appendChild(this.color_swatch);
  }
};
</script>

<style lang="scss" scoped>
.color_swatch {
  overflow: visible;
  // border: 1pt solid;
  width: 1em;
  height: 1em;
  margin-right: 0.4em;
  margin-left: 0.4em;
}
</style>

