<template>
  <div
    class="columns is-multiline handwriting is-size-7 no-print is-gapless"
    style="margin:-0.65em 0 0.35em 0"
  >
    <div class="column is-one-third-tablet has-text-centered">
      <a @click="emitAddition(0)">[&#8593;+] Add Tier Above</a>
    </div>
    <div class="column is-one-third-tablet has-text-centered">
      <a @click="emitAddition(tiers.length)">[&#8595;+] Add Tier Below</a>
    </div>
    <div class="column is-one-third-tablet has-text-centered">
      <a class="has-text-danger" @click="$emit('reset')">[-] Clear Design</a>
    </div>
    <div class="column is-full">
      <app-draw-line-svg/>
      <app-draw-line-svg style="margin:-0.65em 0;"/>
    </div>
  </div>
</template>

<script>
import TierMenu from "@/containers/CakeBuilder/TierMenu.vue";
import DrawLineSVG from "@/containers/CakeBuilder/DrawLineSVG.vue";

export default {
  name: "MenuToolbar",
  props: ["tiers", "base"], //tiers in descending order
  components: {
    "app-tier-menu": TierMenu,
    "app-draw-line-svg": DrawLineSVG
  },
  data: function() {
    return {
      minTierWidth: 5,
      maxTierWidth: 18
    };
  },
  methods: {
    emitAddition: function(
      index = 0,
      newTier = {
        id: `i${Math.floor(Math.random() * 10000)}`,
        key: `k${Math.floor(Math.random() * 10000)}`,
        width: 8,
        height: 4,
        shape: "round"
      }
    ) {
      if (this.tiers.length) {
        //keep default if adding first item
        switch (index) {
          case 0: //top
            newTier.width =
              this.tiers[index].width <= this.minTierWidth + 3
                ? this.minTierWidth
                : this.tiers[index].width - 3;
            break;
          case this.tiers.length: //bottom
            newTier.width =
              this.tiers[index - 1].width >= this.maxTierWidth - 3
                ? this.maxTierWidth
                : this.tiers[index - 1].width + 3;
            if (newTier.width > this.base.width) {
              //if bottom too big, rescale base
              this.$emit("update:base", {
                ...this.base,
                width: newTier.width + 4,
                key: `k${Math.floor(Math.random() * 10000)}`
              });
            }
            break;
          default:
            //middle or > array length
            newTier.width =
              index >= this.tiers.length
                ? this.tiers[this.tiers.length].width
                : parseInt(
                    this.tiers[index].width + this.tiers[index - 1].width / 2
                  );
            break;
        }
      }
      let out = this.tiers.slice();
      // set shape to most common option
      const tally = {
        round: 0,
        square: 0,
        topsy_turvy_up: 0,
        topsy_turvy_down: 0
      };
      out.forEach(t => (tally[t.shape] += 1));
      const mostCommonShape = Object.keys(tally).reduce((a, b) =>
        tally[a] > tally[b] ? a : b
      );
      newTier.shape = mostCommonShape;
      if (
        mostCommonShape === "topsy_turvy_up" ||
        mostCommonShape === "topsy_turvy_down"
      )
        newTier.shape =
          newTier.shape === "topsy_turvy_up"
            ? "topsy_turvy_down"
            : "topsy_turvy_up";

      // if on bottom refresh tier above too
      if (this.tiers[this.tiers.length - 1]) {
        this.tiers[this.tiers.length - 1].key = `k${Math.floor(
          Math.random() * 10000
        )}`;
      }
      out.splice(index, 0, newTier);
      out.reverse();
      this.$emit("update:tiers", out);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

