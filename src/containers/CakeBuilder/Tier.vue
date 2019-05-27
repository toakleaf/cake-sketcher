<template>
  <svg
    version="1.1"
    id="tier"
    ref="tier"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  ></svg>
</template>

<script>
const rough = require("roughjs/dist/rough.umd");

export default {
  name: "tier",
  props: {
    width: {
      type: Number,
      default: 16
    },
    height: {
      type: Number,
      default: 4
    },
    pad: {
      type: Number,
      default: 2
    },
    strokeWidth: {
      type: Number,
      default: 1
    },
    strokeColor: {
      type: String,
      default: "grey"
    },
    roughness: {
      type: Number,
      default: 0.7
    },
    bowing: {
      type: Number,
      default: 7
    },
    inch: {
      type: Number,
      default: 18.5
    },
    radiusRatio: {
      type: Number,
      default: 9.25
    },
    background: {
      type: String,
      default: "white"
    },
    fill: {
      type: String
    },
    fillStyle: {
      type: String,
      default: "hachure"
    },
    fillWeight: {
      type: Number,
      default: 0.3
    },
    fillAngle: {
      type: Number
    },
    fillGap: {
      type: Number,
      default: 0.3
    }
  },
  data: function() {
    return {};
  },
  computed: {
    ptWidth: function() {
      return this.width * this.inch;
    },
    ptHeight: function() {
      return this.height * this.inch;
    },
    yRadius: function() {
      return this.ptWidth / this.radiusRatio;
    },
    pathString: function() {
      return `M ${this.pad},${this.yRadius + this.pad}
      a${this.ptWidth / 2},${this.yRadius} 0 1,0 ${this.ptWidth},0
      a${this.ptWidth / 2},${this.yRadius} 0 1,0 -${this.ptWidth},0
      v${this.ptHeight}
      a${this.ptWidth / 2},${this.yRadius} 0 1,0 ${this.ptWidth},0
      v-${this.ptHeight}`;
    },
    tier: function() {
      const rs = rough.svg(this.$refs.tier);
      return rs.path(this.pathString, {
        bowing: this.bowing,
        roughness: this.roughness,
        stroke: this.strokeColor,
        strokeWidth: this.strokeWidth,
        // if not fill then everything below is ignored
        fill: this.fill,
        fillStyle: this.fillStyle,
        fillWeight: this.fillWeight,
        ...(this.fillAngle
          ? { hachureAngle: this.fillAngle }
          : { hachureAngle: Math.random() * 360 }),
        hachureGap: this.fillGap
      });
    },
    blank: function() {
      const rs = rough.svg(this.$refs.tier);
      return rs.path(this.pathString, {
        bowing: 0,
        roughness: 0,
        strokeWidth: 0,
        fill: this.background,
        fillStyle: "solid"
      });
    }
  },
  methods: {},
  mounted: function() {
    // console.log(this.tier);
    this.$refs.tier.appendChild(this.blank);
    this.$refs.tier.appendChild(this.tier);
  }
};
</script>

<style lang="scss" scoped>
#tier {
  border: solid 2px;
  border-color: darkgray;
  overflow: visible;
}
</style>

