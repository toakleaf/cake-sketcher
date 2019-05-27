<template>
  <div class="menu columns is-multiline is-gapless">
    <div class="column is-full">
      <app-tier-menu
        v-for="(tier, i) in tiersDesc"
        :key="i"
        :tier="tier"
        :tierIndex="i"
        :numTiers="tiers.length"
        @update:tier="emitChanges(i, ...arguments)"
        @delete:tier="emitDeletion(i)"
      />
    </div>
    <div class="column is-half-tablet is-one-third-desktop has-text-centered">
      <a @click="emitAddition(0)">&#8624; Add Tier Above</a>
    </div>
    <div class="column is-half-tablet is-one-third-desktop has-text-centered">
      <a @click="emitAddition(tiersDesc.length)">&#8626; Add Tier Below</a>
    </div>
    <div class="column is-full-tablet is-one-third-desktop has-text-centered">
      <a class="is-block" @click="emitAddition(0)">&#8624; Add Tier Above</a>
      <a class="is-block" @click="emitAddition(tiersDesc.length)">&#8626; Add Tier Below</a>
    </div>
  </div>
</template>

<script>
import TierMenu from "@/containers/CakeBuilder/TierMenu.vue";

export default {
  name: "Menu",
  props: ["tiers"],
  components: {
    "app-tier-menu": TierMenu
  },
  data: function() {
    return {
      open: false,
      minTierWidth: 5,
      maxTierWidth: 18
    };
  },
  computed: {
    tiersDesc: function() {
      if (!this.tiers.length) return [];
      return this.tiers.slice().reverse();
    }
  },
  methods: {
    emitChanges: function(i, val) {
      const out = this.tiersDesc.slice();
      out[i] = val;
      this.$emit("update:tiers", out.reverse());
    },
    emitAddition: function(
      index = 0,
      newTier = {
        id: `${Math.floor(Math.random() * 10000)}`,
        width: 8,
        height: 4
      }
    ) {
      if (this.tiersDesc.length) {
        //keep default if adding first item
        switch (index) {
          case 0: //top
            newTier.width =
              this.tiersDesc[index].width <= this.minTierWidth + 2
                ? this.minTierWidth
                : this.tiersDesc[index].width - 2;
            break;
          case this.tiersDesc.length: //bottom
            newTier.width =
              this.tiersDesc[index - 1].width >= this.maxTierWidth - 2
                ? this.maxTierWidth
                : this.tiersDesc[index - 1].width + 2;
            break;

          default:
            //middle or > array length
            newTier.width =
              index >= this.tiersDesc.length
                ? this.tiersDesc[this.tiersDesc.length].width
                : parseInt(
                    this.tiersDesc[index].width +
                      this.tiersDesc[index - 1].width / 2
                  );
            break;
        }
      }
      let out = this.tiersDesc.slice();
      out.splice(index, 0, newTier);
      out.reverse();
      this.$emit("update:tiers", out);
    },
    emitDeletion: function(i) {
      let out = this.tiersDesc.slice();
      out.splice(i, 1);
      out.reverse();
      this.$emit("update:tiers", out);
    }
  }
};
</script>

<style lang="scss" scoped>
.menu {
  font-family: "Shadows Into Light Two", cursive;
  // text-align: center;
}
</style>

