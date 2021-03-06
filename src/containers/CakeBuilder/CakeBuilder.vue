<template>
  <div class="columns is-multiline">
    <div class="column is-half">
      <h1 class="title">Cake Sketcher</h1>
      <h2 class="subtitle is-size-7 has-text-grey handwriting" style="margin-left:2em">
        <i>by</i> Oakleaf Cakes Bake Shop
      </h2>

      <app-sketch :tiers="[...(base ? [base] : []), ...tiers]" :showBanana="banana" class="sketch"/>
      <a class="is-size-7 handwriting no-print" @click="banana = !banana">
        <span v-if="banana">[&#10003;]</span>
        <span v-else>[ ]</span> banana for scale
      </a>
    </div>
    <div class="column handwriting">
      <div class="columns is-multiline">
        <div class="column is-two-thirds invisible-input">
          <input type="text" class="subtitle is-size-3 handwriting" v-model="title">
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
          title: "New Cake Sketch 1",
          tiers: [
            {
              id: `i${Math.floor(Math.random() * 10000)}`,
              key: `k${Math.floor(Math.random() * 10000)}`,
              width: 9,
              height: 4,
              shape: "round"
            },
            {
              id: `i${Math.floor(Math.random() * 10000)}`,
              key: `k${Math.floor(Math.random() * 10000)}`,
              width: 6,
              height: 4,
              shape: "round"
            }
          ],
          base: {
            id: `i${Math.floor(Math.random() * 10000)}`,
            key: `k${Math.floor(Math.random() * 10000)}`,
            width: 12,
            height: 0.3,
            shape: "round"
          }
        };
      }
    }
  },
  data: function() {
    return {
      title: "",
      tiers: [],
      base: {},
      banana: false
    };
  },
  computed: {
    totalServings: function() {
      return this.tiers
        .map(t => getServings(t.width, t.height, t.shape))
        .reduce((a, n) => a + n);
    }
  },
  methods: {
    getServings: function(width, height, servingSize, shape) {
      return getServings(width, height, servingSize, shape);
    },
    restoreDefault: function() {
      this.title = this.defaultCake.title;
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
@import "@/assets/styles/main.scss";

.sketch {
  max-height: 78vh;
}
.invisible-input input,
.invisible-input input:focus {
  font-family: inherit;
  font-size: inherit;
  // text-decoration: underline;
  color: inherit;
  border: 0;
  // border-bottom: 1pt solid;
  outline: 0;
  background: transparent;
  margin: 0 -0.5em;
  width: auto;
  height: auto;
  text-align: left;
}
.invisible-input:hover {
  color: $link;
}
</style>

