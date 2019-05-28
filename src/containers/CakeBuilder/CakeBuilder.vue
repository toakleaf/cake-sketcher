<template>
  <div class="columns is-multiline">
    <div class="column is-half">
      <h1 class="title">Cake Sketcher</h1>
      <h2 class="subtitle is-size-7 has-text-grey handwriting" style="margin-left:2em">
        <i>by</i> Oakleaf Cakes Bake Shop
      </h2>

      <app-sketch :tiers="[...(base ? [base] : []), ...tiers]" class="sketch"/>
    </div>
    <div class="column handwriting">
      <div class="columns is-multiline">
        <div class="column is-two-thirds">
          <h4 class="subtitle is-size-3">New Cake Sketch 1</h4>
        </div>
        <div class="column">
          <h4 class="subtitle is-size-6 has-text-right is-marginless">
            <span style="position:relative;top:-0.2em;">&#8776;</span>
            {{totalServings}} Servings
          </h4>
          <h4 class="subtitle is-size-6 has-text-right is-marginless">$ 1 money</h4>
        </div>
        <div class="column is-full is-paddingless" style="margin:-0.25em 0;">
          <app-draw-line-svg/>
          <app-draw-line-svg style="margin:-0.65em 0;"/>
        </div>
      </div>
      <app-menu :tiers.sync="tiers" :base.sync="base" @reset="restoreDefault()"/>
    </div>
  </div>
</template>

<script>
import Sketch from "@/containers/CakeBuilder/Sketch.vue";
import Menu from "@/containers/CakeBuilder/Menu.vue";
import DrawLineSVG from "@/containers/CakeBuilder/DrawLineSVG.vue";
import getServings from "@/assets/scripts/getServings";

export default {
  components: {
    "app-sketch": Sketch,
    "app-menu": Menu,
    "app-draw-line-svg": DrawLineSVG
  },
  name: "CakeBuilder",
  props: {
    defaultCake: {
      default: function() {
        return {
          tiers: [
            {
              id: `i${Math.floor(Math.random() * 10000)}`,
              key: `k${Math.floor(Math.random() * 10000)}`,
              width: 9,
              height: 4
            },
            {
              id: `i${Math.floor(Math.random() * 10000)}`,
              key: `k${Math.floor(Math.random() * 10000)}`,
              width: 6,
              height: 4
            }
          ],
          base: {
            id: `i${Math.floor(Math.random() * 10000)}`,
            key: `k${Math.floor(Math.random() * 10000)}`,
            width: 12,
            height: 0.3
          }
        };
      }
    }
  },
  data: function() {
    return {
      tiers: [],
      base: {}
    };
  },
  computed: {
    totalServings: function() {
      return this.tiers
        .map(t => getServings(t.width, t.height, (t.shape = "round")))
        .reduce((a, n) => a + n);
    }
  },
  methods: {
    getServings: function(width, height, servingSize, shape) {
      return getServings(width, height, servingSize, shape);
    },
    restoreDefault: function() {
      this.tiers = this.defaultCake.tiers;
      this.base = this.defaultCake.base;
    }
  },
  created: function() {
    this.restoreDefault();
  }
};
</script>

<style lang="scss" scoped>
.sketch {
  max-height: 78vh;
}
</style>

