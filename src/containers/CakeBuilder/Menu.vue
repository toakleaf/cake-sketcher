<template>
  <div class="columns is-multiline is-gapless">
    <div class="column is-full">
      <app-menu-toolbar
        :tiers="tiersDesc"
        @update:tiers="$emit('update:tiers', $event)"
        @reset="$emit('reset'); openMenus = []"
      />
    </div>
    <div class="column is-full">
      <app-tier-menu
        v-for="(tier, i) in tiersDesc"
        :key="tier.key"
        :tierIndex="i"
        :tiers="tiersDesc"
        :tier="tier"
        :open="openMenus.some(id => id === tier.id)"
        @open="openMenus.push(tier.id)"
        @close="openMenus = openMenus.filter(id => id !== tier.id)"
        @update:tier="emitChanges(i, ...arguments)"
        @delete:tier="emitDeletion(i)"
      />
      <app-base-menu
        :key="base.key"
        :base="base"
        :open="openMenus.some(id => id === base.id)"
        @open="openMenus.push(base.id)"
        @close="openMenus = openMenus.filter(id => id !== base.id)"
        @update:base="emitChanges(-1, ...arguments)"
      />
    </div>
  </div>
</template>

<script>
import MenuToolbar from "@/containers/CakeBuilder/MenuToolbar.vue";
import TierMenu from "@/containers/CakeBuilder/TierMenu.vue";
import BaseMenu from "@/containers/CakeBuilder/BaseMenu.vue";

export default {
  name: "Menu",
  props: ["tiers", "base"],
  components: {
    "app-menu-toolbar": MenuToolbar,
    "app-tier-menu": TierMenu,
    "app-base-menu": BaseMenu
  },
  data: function() {
    return {
      openMenus: [],
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
      if (i < 0) this.$emit("update:base", val);
      const out = this.tiersDesc.slice();
      out[i] = val;
      this.$emit("update:tiers", out.reverse());
    },
    emitAddition: function(
      index = 0,
      newTier = {
        id: `i${Math.floor(Math.random() * 10000)}`,
        key: `k${Math.floor(Math.random() * 10000)}`,
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
      this.openMenus = this.openMenus.filter(id => id !== this.tiersDesc[i].id);
      let out = this.tiersDesc.slice();
      out.splice(i, 1);
      out.reverse();
      this.$emit("update:tiers", out);
    }
  },
  beforeMount: function() {
    this.openMenus.push(this.tiersDesc[0].id);
  }
};
</script>

<style lang="scss" scoped>
</style>

