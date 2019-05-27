<template>
  <svg
    version="1.1"
    id="cake"
    ref="cake"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    :viewBox="`0 0 ${cakeWidth} ${cakeHeight}`"
  >
    <svg
      v-for="(tier, i) in tiers"
      :key="tier.id"
      class="tier"
      :x="(cakeWidth - (tier.width * inch)) / 2 - pad"
      :y="getTierPosition(i)"
    >
      <app-tier
        :width="tier.width"
        :height="tier.height"
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
  </svg>
</template>

<script>
import Tier from "@/containers/CakeBuilder/Tier.vue";

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
    tiers: {
      validator: function(obj) {
        return obj.every(
          o =>
            o.width &&
            o.height &&
            o.id &&
            typeof o.width === "number" &&
            typeof o.height === "number"
        );
      },
      default: [
        {
          id: `${Math.floor(Math.random() * 10000)}`,
          width: 8,
          height: 4
        }
      ]
    }
  },
  data: function() {
    return {
      inch: 18.5,
      pad: 2,
      radiusRatio: 9.25
    };
  },
  computed: {
    cakeWidth: function() {
      return (
        this.inch *
          Math.max(
            ...this.tiers.map(o => (o.width ? o.width : 0)),
            this.minCakeWidth
          ) +
        this.pad * 2
      );
    },
    cakeHeight: function() {
      return (
        this.inch *
          this.tiers
            .map(o => (o.height ? o.height : 0))
            .reduce((accumulator, currentValue) => accumulator + currentValue) +
        (this.cakeWidth / this.radiusRatio) * 2 +
        this.pad * 2
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
            ? this.tiers[j - 1].width - this.tiers[j].width
            : 0;
        pos += this.tiers[j].height
          ? this.tiers[j].height * this.inch -
            (tierGap * this.inch) / this.radiusRatio / 2
          : 0;
      }
      return pos;
    }
  }
};
</script>

<style lang="scss" scoped>
svg {
  overflow: visible;
}
</style>

