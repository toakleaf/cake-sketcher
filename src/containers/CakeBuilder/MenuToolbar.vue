<template>
  <div class="columns is-multiline handwriting is-size-7 no-print" style="margin-bottom:0.35em">
    <div class="column is-one-third-tablet has-text-centered is-paddingless">
      <a @click="emitAddition(0)">[&#8593;+] Add Tier Above</a>
    </div>
    <div class="column is-one-third-tablet has-text-centered is-paddingless">
      <a @click="emitAddition(tiers.length)">[&#8595;+] Add Tier Below</a>
    </div>
    <div class="column is-one-third-tablet has-text-centered is-paddingless">
      <a class="has-text-danger" @click="$emit('reset')">[-] Clear Design</a>
    </div>
    <div class="column is-full is-paddingless">
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
  props: ["tiers"], //tiers in descending order
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
        height: 4
      }
    ) {
      if (this.tiers.length) {
        //keep default if adding first item
        switch (index) {
          case 0: //top
            newTier.width =
              this.tiers[index].width <= this.minTierWidth + 2
                ? this.minTierWidth
                : this.tiers[index].width - 2;
            break;
          case this.tiers.length: //bottom
            newTier.width =
              this.tiers[index - 1].width >= this.maxTierWidth - 2
                ? this.maxTierWidth
                : this.tiers[index - 1].width + 2;
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
      out.splice(index, 0, newTier);
      out.reverse();
      this.$emit("update:tiers", out);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

