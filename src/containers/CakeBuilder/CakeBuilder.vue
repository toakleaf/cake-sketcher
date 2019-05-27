<template>
  <div class="columns is-multiline">
    <div class="column is-half">
      <h1 class="title">Cake Sketcher</h1>
      <h2 class="subtitle is-size-7 has-text-grey handwriting" style="margin-left:2em">
        <i>by</i> Oakleaf Cakes Bake Shop
      </h2>

      <app-sketch
        :tiers="[...(base ? [base] : []), ...tiers]"
        :style="'max-height:'+ windowHeight*0.75 + 'px;'"
        class="sketch"
      />
    </div>
    <div class="column">
      <div class="columns is-multiline">
        <div class="column is-two-thirds">
          <h4 class="subtitle handwriting is-size-3">New Cake Sketch 1</h4>
        </div>
        <div class="column">
          <h4 class="subtitle handwriting is-size-6 has-text-right is-marginless">Total Servings</h4>
          <h4 class="subtitle handwriting is-size-6 has-text-right is-marginless">$ 1 money</h4>
        </div>
        <div class="column is-full is-paddingless" style="margin:-0.25em 0;">
          <app-draw-line-svg/>
          <app-draw-line-svg style="margin:-0.65em 0;"/>
        </div>
      </div>
      <app-menu :tiers.sync="tiers"/>
    </div>
  </div>
</template>

<script>
import Sketch from "@/containers/CakeBuilder/Sketch.vue";
import Menu from "@/containers/CakeBuilder/Menu.vue";
import DrawLineSVG from "@/containers/CakeBuilder/DrawLineSVG.vue";

export default {
  components: {
    "app-sketch": Sketch,
    "app-menu": Menu,
    "app-draw-line-svg": DrawLineSVG
  },
  name: "CakeBuilder",
  props: {},
  data: function() {
    return {
      windowHeight: window.innerHeight,
      tiers: [
        {
          id: `${Math.floor(Math.random() * 10000)}`,
          width: 8,
          height: 4
        },
        {
          id: `${Math.floor(Math.random() * 10000)}`,
          width: 5,
          height: 4
        }
      ],
      base: {
        id: `${Math.floor(Math.random() * 10000)}`,
        width: 12,
        height: 0.5
      }
    };
  },
  computed: {},
  methods: {},
  mounted() {
    window.onresize = () => {
      this.windowHeight = window.innerHeight;
    };
  }
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Shadows+Into+Light+Two&display=swap");
.handwriting {
  font-family: "Shadows Into Light Two", cursive;
}
</style>

