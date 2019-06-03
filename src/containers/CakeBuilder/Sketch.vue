<template>
  <svg
    version="1.1"
    id="sketch"
    class="sketch"
    ref="sketch"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    :viewBox="`0 0 ${sketchWidth} ${sketchHeight}`"
  >
    <svg
      v-for="(tier, i) in tiers"
      :key="tier.key"
      :x="(sketchWidth - (tier.width * inch)) / 2 - pad"
      :y="getTierPosition(i)"
    >
      <app-tier
        :width="tier.width"
        :height="tier.height"
        :shape="tier.shape"
        :previousTier="tiers[i-1] ? tiers[i-1] : null"
        :fill="tier.fill"
        :fillStyle="tier.fillStyle"
        :fillWeight="tier.fillWeight"
        :fillAngle="tier.fillAngle"
        :fillGap="tier.fillGap"
        :pad="pad"
        :roughness="roughness"
        :bowing="bowing"
        :radiusRatio="radiusRatio"
        :strokeWidth="strokeWidth"
        :strokeColor="strokeColor"
      ></app-tier>
    </svg>
    <svg
      id="banana"
      ref="banana"
      :x="sketchWidth - (7 / cakeWidth * sketchWidth)"
      :y="sketchHeight - (6.5 /cakeHeight * sketchHeight)"
      :width="7 / cakeWidth * sketchWidth"
      :height="7 /cakeHeight * sketchHeight"
      viewBox="0 0 300 300"
    ></svg>
  </svg>
</template>

<script>
import Tier from "@/containers/CakeBuilder/Tier.vue";
const rough = require("roughjs/dist/rough.umd");

export default {
  components: {
    "app-tier": Tier
  },
  name: "Sketch",
  props: {
    minCakeWidth: {
      type: Number,
      default: 5
    },
    minCakeHeight: {
      type: Number,
      default: 4
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
      default: 0 //0.7
    },
    bowing: {
      type: Number,
      default: 0 //7
    },
    showBanana: {
      type: Boolean,
      default: false
    },
    tiers: {
      validator: function(obj) {
        return obj.every(
          o =>
            o.width &&
            o.height &&
            o.id &&
            o.key &&
            typeof o.width === "number" &&
            typeof o.height === "number"
        );
      },
      default: [
        {
          id: `i${Math.floor(Math.random() * 10000)}`,
          key: `k${Math.floor(Math.random() * 10000)}`,
          width: 8,
          height: 4,
          shape: "round"
        }
      ]
    }
  },
  data: function() {
    return {
      inch: 18.5,
      pad: 2,
      radiusRatio: 4.625 // the ration of x radius / y radius
    };
  },
  computed: {
    cakeWidth: function() {
      return Math.max(
        ...this.tiers.map(o => (o.width ? o.width : 0)),
        this.minCakeWidth
      );
    },
    sketchWidth: function() {
      return this.inch * this.cakeWidth;
    },
    cakeHeight: function() {
      return (
        this.tiers
          .map(o => (o.height ? o.height : 0))
          .reduce((accumulator, currentValue) => accumulator + currentValue) +
        (this.cakeWidth / 2 / this.radiusRatio) * 2
      );
    },
    sketchHeight: function() {
      return this.inch * this.cakeHeight;
    },
    banana: function() {
      if (!this.showBanana) return;
      const rs = rough.svg(this.$refs.banana);
      return rs.path(
        `M260.755,23.17l-2.532,36.951l1.66,11.76c-1.383,30.929-11.974,65.163-29.102,88.231c-27.87,37.532-64.532,53.392-106.038,55.022
        c-16.66,0.655-33.368-1.442-50.054-2.285l0.713-0.148c17.447,0,34.983,1.133,52.324-0.224c43.203-3.375,80.604-19.405,107.69-54.649
        c16.647-21.661,25.887-53.127,25.698-81.182l-2.352-10.567l0.964-46.767l-8.145-10.247l-1.753,4.117c0,0,8.407,14.012,10.859,9.984
        c2.451-4.028,17.922-1.974,17.922-1.974c-3.9-5.132-7.401-10.647-11.842-15.257c-2.884-2.992-6.931-4.758-11.602-2.061
        c-4.463,2.578-7.416,5.659-7.38,11.16c0.098,14.983-0.254,29.975,0.112,44.95c0.395,16.087-4.751,30.672-11.193,44.94
        c-16.713,37.019-46.378,59.398-83.77,72.209c-20.621,7.065-42.138,10.405-63.984,11.616c-25.405,1.409-50.632,0.23-75.748-3.744
        c-0.801-0.126-1.64-0.016-2.46-0.016l-1.051-1.412c-1.026,2.463-0.842,3.957-2.055,6.325c-6.611,12.915-9.049,10.364,4.35,22.783
        c14.74,13.66,32.708,22.125,50.503,30.757c30.666,14.879,63.061,20.983,96.616,14.314c59.15-11.757,103.356-44.401,130.419-98.714
        c8.09-16.236,9.649-33.582,4.73-51.711c-3.546-13.07-10.672-23.533-18.673-33.84c-1.203-1.551-2.551-3.735-2.382-5.488
        c1.404-14.597,3.104-29.166,4.882-43.723c0.136-1.11,1.552-2.064,2.373-3.09`,
        {
          bowing: 1,
          roughness: 1,
          stroke: "rgba(0,0,0,0.5)",
          strokeWidth: 2,
          // if not fill then everything below is ignored
          fill: "#FBE12D",
          fillWeight: 1.5,
          hachureAngle: Math.random() * 360,
          hachureGap: 1.5
        }
      );
    }
  },
  methods: {
    getTierPosition: function(i) {
      if (i === this.tiers.length - 1) return 0;
      let pos = 0;
      for (let j = this.tiers.length - 1; j > i; j--) {
        const tierGap =
          this.tiers[j - 1] && this.tiers[j - 1].width
            ? (this.tiers[j - 1].width - this.tiers[j].width) / 2
            : 0;
        pos += this.tiers[j].height
          ? this.tiers[j].height * this.inch -
            (tierGap * this.inch) / 2 / this.radiusRatio
          : 0;
      }
      return pos;
    }
  },
  mounted: function() {
    if (this.showBanana) this.$refs.banana.appendChild(this.banana);
  },
  watch: {
    showBanana: function() {
      if (this.showBanana) this.$refs.banana.appendChild(this.banana);
      else
        while (this.$refs.banana.firstChild) {
          this.$refs.banana.removeChild(this.$refs.banana.firstChild);
        }
    }
  }
};
</script>

<style lang="scss" scoped>
svg {
  overflow: visible;
}
</style>

