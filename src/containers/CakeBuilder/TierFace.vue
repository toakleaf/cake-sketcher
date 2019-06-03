<template>
  <g>
    <svg
      version="1.1"
      id="tier_face"
      ref="tier_face"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      :width="ptWidth"
      :height="ptHeight"
      viewBox="0 0 300 300"
    >
      <!-- Testing Rectangular to Cylindrical Path Fitting -->
      <g v-for="m in 5" :key="m">
        <circle
          v-for="n in 11"
          :key="n"
          :cx="mapToCylinder(n-1, m, 10)[0]"
          :cy="mapToCylinder(n-1, (m -1) * ptHeight / 4, 10)[1]"
          r="2"
          stroke="black"
          stroke-width="0.5"
          fill="lightblue"
        ></circle>
      </g>
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
import parseSVG from "@/assets/scripts/svgPathParser";
import mapToCylinder from "@/assets/scripts/mapToCylinder";
const rough = require("roughjs/dist/rough.umd");

export default {
  name: "tier",
  props: {
    shape: {
      type: String,
      default: "round"
    },
    corners: {
      validator: function(arr) {
        return arr.length === 4 && arr.every(a => a.length === 2);
      }
    },
    xRadius: {
      type: Number
    },
    yRadius: {
      type: Number
    },
    designs: {
      // list of path lists
      type: Array,
      default: () => [
        [
          `M298.473, 107.617,
          L63.99, 290.555,
          L146.162, 4.729,
          L247.688, 284.267,
          L1.244, 117.791,
          L298, 107.5`
        ],
        [
          "M39,126,a111,24 0 1,0 222,0,a111,24 0 1,0 -222,0,v124,a111,24 0 1,0 222,0,v-124"
        ]
      ]
    }
  },
  data: function() {
    return {};
  },
  computed: {
    ptHeight: function() {
      return (
        Math.max(...this.corners.map(xy => xy[1])) -
        Math.min(...this.corners.map(xy => xy[1]))
      );
    },
    ptWidth: function() {
      return (
        Math.max(...this.corners.map(xy => xy[0])) -
        Math.min(...this.corners.map(xy => xy[0]))
      );
    }
  },
  methods: {
    mapToCylinder: function(xRect, yRect, widthRect = this.xRadius * 2) {
      return mapToCylinder(
        xRect,
        yRect,
        widthRect,
        this.xRadius * 2, //width of cylinder
        this.xRadius,
        this.yRadius
      );
    },
    arcRotation: function(x, y, dx, dy) {
      const rad = 180 / Math.PI;
      const atan = Math.atan2(dy - y, dx - x);
      return rad * atan;
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
    drawDesigns: function() {
      while (this.$refs.tier_face.firstChild) {
        this.$refs.tier_face.removeChild(this.$refs.tier_face.firstChild);
      }
      const rs = rough.svg(this.$refs.tier_face);
      const paths = this.designs.flat();
      const nodes = paths.map(p => {
        return rs.path(p, {
          bowing: 0,
          roughness: 0,
          stroke: "black",
          strokeWidth: 2
        });
      });
      nodes.forEach(n => {
        this.$refs.tier_face.appendChild(n);
      });
    },
    mousePosition(event) {
      console.log(
        event.pageX - this.$refs.tier.getBoundingClientRect().left,
        event.pageY - this.$refs.tier.getBoundingClientRect().top
      );
    }
  },
  mounted: function() {
    this.drawDesigns();
  }
};
</script>

<style lang="scss" scoped>
svg {
  overflow: visible;
}
</style>

