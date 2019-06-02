<template>
  <g>
    <svg
      version="1.1"
      class="tier"
      ref="tier"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    ></svg>
    <svg
      version="1.1"
      id="dots"
      ref="dots"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <!-- <g v-for="m in 5" :key="m">
        <circle
          v-for="n in 11"
          :key="n"
          :cx="xRectToCylinder(ptWidth * Math.PI / 2, ptWidth, (ptWidth * Math.PI / 2) / 10 * (n - 1)) "
          :cy="yRadius  + (ptHeight / 4)*(m-1)  + ellipseYOffset(xRadius, 0, xRadius, yRadius, xRectToCylinder(ptWidth * Math.PI / 2, ptWidth, (ptWidth * Math.PI / 2) / 10 * (n - 1)))"
          r="2"
          stroke="black"
          stroke-width="0.5"
          fill="lightblue"
        ></circle>
      </g>-->
      <!-- <path
        fill="transparent"
        stroke="black"
        :d="`M 0 ${yRadius } A${xRadius} ${yRadius} ${arcRotation(0, 0, ptWidth, ptHeight )} 0 0 ${ptWidth} ${yRadius  + ptHeight}`"
      ></path>
      <path
        fill="transparent"
        stroke="black"
        :d="`M 0 ${yRadius + ptHeight } A${xRadius} ${yRadius} ${arcRotation(0, ptHeight , ptWidth, 0)} 0 0 ${ptWidth} ${yRadius }`"
      ></path>-->
    </svg>
  </g>
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
    chamfer: {
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
        this.shape === "topsy_turvy_down"
      ) {
        corners[2] =
          ((this.chamfer / this.height) *
            (this.yCornerOffsets[2] - this.yCornerOffsets[0])) /
          2;
        corners[3] =
          this.ptWidth -
          ((this.chamfer / this.height) *
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
  methods: {
    ellipseYOffset: function(h, k, a, b, x) {
      // center: (h, k)
      // horizontal rad: a
      // vertical rad: b
      // elipse point: (x, y)
      // (x-h)^2 / a^2 + (y-k)^2 / b^2 = 1
      // therefore
      // y = k +- b sqrt( 1 - ( x^2  - 2xh + h^2) / a^2 )
      let y = k + b * Math.sqrt(1 - (x * x - 2 * x * h + h * h) / (a * a));
      return y;
    },
    xRectToCylinder: function(width, diameter, x) {
      // width is understood to be 1/2 circumference of a tier (which is longer than diameter)
      const percent = x / width;
      const angle = percent * Math.PI; // in radians from 0 to pi
      // center of tier being projected onto
      const center = diameter / 2;
      return center - Math.cos(angle) * center;
    },
    arcRotation: function(x, y, dx, dy) {
      const rad = 180 / Math.PI;
      const atan = Math.atan2(dy - y, dx - x);
      return rad * atan;
    },
    mousePosition(event) {
      console.log(
        event.pageX - this.$refs.tier.getBoundingClientRect().left,
        event.pageY - this.$refs.tier.getBoundingClientRect().top
      );
    }
  },
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

