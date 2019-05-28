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
import hexColorLuminance from "@/assets/scripts/hexColorLuminance";
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
    shape: {
      type: String,
      default: "round"
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
      default: "rgba(0,0,0,0.5)"
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
      default: 4.625
    },
    background: {
      type: String
    },
    fill: {
      type: String //Must be hex!
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
      return this.ptWidth / 2 / this.radiusRatio;
    },
    pathString: function() {
      // Round
      // 16x4 tier w/ 18.5 pt inch
      //   M 2,34
      //   a148,32 0 1,0 296,0
      //   a148,32 0 1,0 -296,0
      //   v74
      //   a148,32 0 1,0 296,0
      //   v-74
      if (this.shape === "round")
        return `M ${this.pad},${this.yRadius + this.pad}
      a${this.ptWidth / 2},${this.yRadius} 0 1,0 ${this.ptWidth},0
      a${this.ptWidth / 2},${this.yRadius} 0 1,0 -${this.ptWidth},0
      v${this.ptHeight}
      a${this.ptWidth / 2},${this.yRadius} 0 1,0 ${this.ptWidth},0
      v-${this.ptHeight}`;
      // Square
      // 16x4 tier w/ 18.5 pt inch
      //   M2,     64,
      //   l0,     74,
      //   l296,   0, //I broke this into multiple paths for drawing
      //   l0,     -74,
      //   l-296,  0, //I broke this into multiple paths for drawing
      //   l24,    -62,
      //   l248,   0,
      //   l24,    62,
      if (this.shape === "square") {
        //create random seam line to make scribble nicer
        const randWidth = Math.floor(Math.random() * this.ptWidth);
        const randWidth2 = Math.floor(Math.random() * this.ptWidth);
        return `
            M${this.pad}, ${this.yRadius * 2 + this.pad},
            l0,     ${this.ptHeight},
            l${randWidth},   0,
            l${this.ptWidth - randWidth},   0,
            l0,     -${this.ptHeight},
            l-${randWidth},  0,
            l-${this.ptWidth - randWidth},  0,
            l${this.ptWidth * (1 / 12)},    -${this.ptWidth / this.radiusRatio},
            l${this.ptWidth * (5 / 6)},   0,
            l${this.ptWidth * (1 / 12)},    ${this.ptWidth / this.radiusRatio}`;
      }
    },
    tier: function() {
      const rs = rough.svg(this.$refs.tier);
      return rs.path(this.pathString, {
        bowing: this.shape === "round" ? this.bowing : this.bowing * 0.5,
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
      const fill = this.fill
        ? hexColorLuminance(this.fill, 0.33)
        : this.background
        ? this.background
        : "white";
      return rs.path(this.pathString, {
        bowing: 0,
        roughness: 0,
        strokeWidth: 0,
        fill,
        fillStyle: "solid"
      });
    }
  },
  methods: {},
  mounted: function() {
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

