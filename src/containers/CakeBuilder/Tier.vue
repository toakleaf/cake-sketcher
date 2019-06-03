<template>
  <g>
    <svg
      version="1.1"
      class="tier"
      ref="tier"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    ></svg>
    <app-tier-face
      :shape="shape"
      :corners="xCornerOffsets.map((x,i) => [x, yCornerOffsets[i]])"
      :xRadius="xRadius"
      :yRadius="yRadius"
    />
  </g>
</template>

<script>
import hexColorLuminance from "@/assets/scripts/hexColorLuminance";
import TierFace from "@/containers/CakeBuilder/TierFace.vue";
const rough = require("roughjs/dist/rough.umd");

export default {
  name: "tier",
  components: {
    "app-tier-face": TierFace
  },
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
    previousTier: {
      default: function() {
        return {
          shape: "round"
        };
      }
    },
    slope: {
      // inches of slope accross top of tier
      type: Number,
      default: 1.5
    },
    taper: {
      // how much smaller bottom diameter is than top
      type: Number,
      default: 1
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
    xRadius: function() {
      // General case for cylinder
      return this.ptWidth / 2;
    },
    yRadius: function() {
      return this.xRadius / this.radiusRatio;
    },
    topAngle: function() {
      // rotation of top ellipse
      if (this.shape === "topsy_turvy_up")
        return (Math.atan2(this.slope, this.width) * -180) / Math.PI;
      if (this.shape === "topsy_turvy_down")
        return (Math.atan2(this.slope, this.width) * 180) / Math.PI;
      return 0;
    },
    bottomAngle: function() {
      // rotation of bottom ellipse
      if (this.previousTier && this.previousTier.shape === "topsy_turvy_up")
        return (
          (Math.atan2(this.slope, this.previousTier.width) * -180) / Math.PI
        );
      if (this.previousTier && this.previousTier.shape === "topsy_turvy_down")
        return (
          (Math.atan2(this.slope, this.previousTier.width) * 180) / Math.PI
        );
      return 0;
    },
    topXRadius: function() {
      if (this.topAngle === 0) return this.ptWidth / 2;
      // Topsy uses hypotenuse instead of width
      return (
        (Math.sqrt(this.width * this.width + this.slope * this.slope) *
          this.inch) /
        2
      );
    },
    bottomXRadius: function() {
      if (this.bottomAngle === 0) return this.ptWidth / 2;
      // Uses hypotenuse instead of width
      return (
        (Math.sqrt(this.width * this.width + this.slope * this.slope) *
          this.inch) /
        2
      );
    },
    topSlopeOffset: function() {
      if (this.topAngle === 0) return 0;
      // how much lower/higher each corner of tier is (based on slope prop)
      return ((this.slope / this.height) * this.ptHeight) / 2;
    },
    bottomSlopeOffset: function() {
      // how much lower/higher each corner of tier is (based on previous tier's angle)
      if (this.bottomAngle === 0) return 0;
      return (Math.tan((this.bottomAngle * Math.PI) / 180) * this.ptWidth) / 2;
    },
    yCornerOffsets: function() {
      //returns array: [ topLeft, topRight, bottomLeft, bottomRight ]
      const corners = [
        this.yRadius + this.topSlopeOffset,
        this.yRadius - this.topSlopeOffset,
        this.yRadius + this.ptHeight - this.bottomSlopeOffset,
        this.yRadius + this.ptHeight + this.bottomSlopeOffset
      ];
      if (this.shape === "topsy_turvy_down") {
        corners[0] -= this.topSlopeOffset * 2;
        corners[1] += this.topSlopeOffset * 2;
      }
      if (this.previousTier && this.previousTier.shape === "topsy_turvy_down") {
        corners[2] += this.bottomSlopeOffset / 2;
        corners[3] += this.bottomSlopeOffset / 2;
      }
      return corners;
    },
    xCornerOffsets: function() {
      //returns array: [ topLeft, topRight, bottomLeft, bottomRight ]
      const corners = [0, this.ptWidth, 0, this.ptWidth];
      if (
        this.shape === "topsy_turvy_up" ||
        this.shape === "topsy_turvy_down" ||
        this.shape === "round_taper"
      ) {
        corners[2] =
          ((this.taper / this.height) *
            (this.yCornerOffsets[2] - this.yCornerOffsets[0])) /
          2;
        corners[3] =
          this.ptWidth -
          ((this.taper / this.height) *
            (this.yCornerOffsets[3] - this.yCornerOffsets[1])) /
            2;
      }
      return corners;
    },
    pathString: function() {
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
            M 0, ${this.yRadius * 2},
            l0,     ${this.ptHeight},
            l${randWidth},   0,
            l${this.ptWidth - randWidth},   0,
            l0,     -${this.ptHeight},
            l-${randWidth},  0,
            l-${this.ptWidth - randWidth},  0,
            l${this.ptWidth * (1 / 12)},    -${this.ptWidth / this.radiusRatio},
            l${this.ptWidth * (5 / 6)},   0,
            l${this.ptWidth * (1 / 12)},    ${this.ptWidth / this.radiusRatio}`;
      } else {
        let out = "";
        // Round & Topsy Turvy
        // 16x4 tier w/ 18.5 pt inch
        //   M 2,34
        //   a148,32 0 0,0 296,0
        //   a148,32 0 0,0 -296,0
        //   v74
        //   a148,32 0 0,0 296,0
        //   v-74
        out = "M" + this.xCornerOffsets[0] + "," + this.yCornerOffsets[0]; //starting x,y
        // path arc:  A rx ry, x-axis-rotation, large-arc-flag sweep-flag dx dy
        // bottom curve of top ellipse
        out += `A${this.topXRadius},${this.yRadius}, ${this.topAngle} 0 0,
                ${this.xCornerOffsets[1]} ${this.yCornerOffsets[1]}`;
        // top curve of top ellipse. back to start.
        out += `A${this.topXRadius},${this.yRadius}, ${this.topAngle} 0 0,
                ${this.xCornerOffsets[0]} ${this.yCornerOffsets[0]}`;
        // bottom section of tier
        out += `L ${this.xCornerOffsets[2]} ${this.yCornerOffsets[2]}
                A${this.bottomXRadius},${this.yRadius} ${this.bottomAngle} 0 0,
                ${this.xCornerOffsets[3]}, ${this.yCornerOffsets[3]}
                L ${this.xCornerOffsets[1]} ${this.yCornerOffsets[1]}`;
        return out;
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
svg {
  overflow: visible;
}
</style>

