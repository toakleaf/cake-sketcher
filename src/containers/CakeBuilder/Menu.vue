<template>
  <div class="columns is-multiline is-gapless">
    <div class="column is-full">
      <app-menu-toolbar
        :tiers="tiersDesc"
        :base="base"
        @update:tiers="$emit('update:tiers', $event)"
        @update:base="$emit('update:base', $event)"
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
      if (i < 0) return this.$emit("update:base", val);
      let out = this.tiersDesc.slice();
      // refresh upper tier.
      if (out[i - 1] && out[i].shape !== val.shape) {
        out[i - 1] = {
          ...out[i - 1],
          key: `k${Math.floor(Math.random() * 10000)}`
        };
      }
      out[i] = { ...val };
      if (i === out.length - 1 && out[i].width > this.base.width) {
        // if bottom tier and too big, rescale base
        this.$emit("update:base", {
          ...this.base,
          width: out[i].width + 4,
          key: `k${Math.floor(Math.random() * 10000)}`
        });
      }
      this.$emit("update:tiers", out.reverse());
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

