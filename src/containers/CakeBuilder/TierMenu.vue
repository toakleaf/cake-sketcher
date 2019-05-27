<template>
  <div class="tier-menu-item">
    <b-collapse :open="false" aria-id="contentIdForA11y1">
      <h3 class="is-size-4" slot="trigger" aria-controls="contentIdForA11y1" @click="open = !open">
        <!-- {{width}}{{tier.width}} -->
        <span v-if="numTiers === 1">Tier</span>
        <span v-else-if="tierIndex === numTiers - 1">Bottom tier</span>
        <span v-else-if="!tierIndex">Top tier</span>
        <span v-else>Tier #{{tierIndex + 1}}</span>
        <span class="icon is-pulled-right is-medium">
          <app-draw-svg-icon path="M1,299,l149,-149,l149,149,l-149,-149,l-149,149" v-show="!open"/>
          <app-draw-svg-icon path="M1,150,l149,149,l149,-149,l-149,149,l-149,-149" v-show="open"/>
        </span>
        <span class="is-size-7 is-pulled-right" style="margin:1em 1em 0 0">{{width}}" x {{height}}"</span>
      </h3>
      <ul>
        <li>
          <app-draw-star-svg/>Shape:
          <select class="has-text-link" :vale="shape">
            <option value="round">Round</option>
            <option value="square">Square</option>
            <option value="topsyturvy">Topsy Turvy</option>
          </select>
        </li>
        <li>
          <app-draw-svg-icon
            path="M39,126,a111,24 0 1,0 222,0,a111,24 0 1,0 -222,0,v124,a111,24 0 1,0 222,0,v-124"
          />

          <select class="has-text-link" v-model="width" @change="emitTierUpdate({...tier, width})">
            <option v-for="n in 14" :key="n" :value="n + 4">{{n + 4}}"</option>
          </select>
          wide x
          <select
            class="has-text-link"
            v-model="height"
            @change="emitTierUpdate({...tier, height})"
          >
            <option v-for="n in [3, 4, 6, 8]" :key="n" :value="n">{{n}}"</option>
          </select>
          tall
        </li>
        <li>
          <app-draw-svg-icon
            path="M171.036,64.271
            c12.816-0.513,22.793,4.921,27.837,15.832c5.495,11.889,10.237,24.755,11.901,37.636c2.292,17.735,1.644,35.882,1.745,53.859
            c0.047,8.139-4.462,12.365-10.963,11.842c-6.147-0.494-8.882-4.982-9.188-12.801c-0.806-20.617-1.917-41.224-3.205-61.817
            c-0.219-3.483-1.915-6.873-4.578-10.143c0,2.518,0,5.037,0,7.555c0,55.974,0,111.949-0.001,167.921c0,2.221,0.085,4.443-0.034,6.658
            c-0.51,9.578-7.104,16.24-15.824,16.059s-15.001-6.947-15.025-16.695c-0.085-34.273-0.035-68.551-0.04-102.824
            c0-1.969,0.294-4.023-0.173-5.885c-0.254-1.008-1.831-2.35-2.793-2.336c-0.958,0.014-2.463,1.4-2.713,2.43
            c-0.454,1.867-0.163,3.916-0.163,5.887c-0.004,34.275-0.027,68.549,0.01,102.826c0.008,7.131-2.919,12.365-9.486,15.285
            c-6.066,2.693-12.361,1.949-16.173-3.105c-2.993-3.967-5.043-9.713-5.073-14.682c-0.344-56.713-0.219-113.426-0.22-170.141
            c0-2.944,0-5.89,0-8.834c-0.833-0.131-1.666-0.263-2.499-0.395c-1.69,9.538-4.263,19.02-4.861,28.626
            c-0.901,14.479-0.092,29.059-0.749,43.561c-0.177,3.926-2,8.961-4.856,11.322c-5.542,4.584-14.262,0.35-14.657-7.338
            c-1.473-28.579-2.651-57.28,8.004-84.693c7.498-19.291,17.048-25.504,37.535-25.504l10.025-0.137V57.09
            c-8.944-3.481-16.597-8.423-20.253-17.888c-5.484-14.198,1.395-30.242,15.458-36.06c13.828-5.723,29.677,0.394,36.056,13.919
            c6.527,13.839,0.91,30.154-12.785,37.03c-2.169,1.087-4.424,2.003-6.64,2.999v7.148L171.036,64.271z"
          />
          <span style="position:relative;top:-0.2em; padding-right:0.4em;">&#8776;</span>
          <input type="text" :value="getServings()" size="3" maxnumTiers="3" class="has-text-link"> servings
          <span class="is-size-7">
            <a>[+]</a> /
            <a>[–]</a>
          </span>
        </li>
      </ul>
      <a
        class="has-text-danger is-pulled-right is-size-7"
        @click="$emit('delete:tier')"
        style="margin-top:0.6em"
      >[–] remove</a>
      <ul>
        <li>
          <a @click="$refs.colorInput.click()">
            <app-color-swatch-svg :color="fillColor"/>Tier Color
            <input
              type="color"
              v-model="fillColor"
              style="display:none"
              ref="colorInput"
              @change="emitTierUpdate({...tier, fill: fillColor})"
            >
          </a>
          <input
            type="text"
            v-model="fillColor"
            size="12"
            class="has-text-link has-text-left"
            style="padding-left:0.5em"
            @blur="emitTierUpdate({...tier, fill: fillColor})"
            @keydown.enter="emitTierUpdate({...tier, fill: fillColor})"
            @keydown.delete="emitTierUpdate({...tier, fill: null})"
          >
        </li>
      </ul>
    </b-collapse>
    <app-draw-line-svg/>
  </div>
</template>

<script>
import DrawStarSVG from "@/containers/CakeBuilder/DrawStarSVG.vue";
import DrawLineSVG from "@/containers/CakeBuilder/DrawLineSVG.vue";
import DrawSVGIcon from "@/containers/CakeBuilder/DrawSVGIcon.vue";
import ColorSwatchSVG from "@/containers/CakeBuilder/ColorSwatchSVG.vue";

export default {
  name: "TierMenu",
  props: ["tier", "tierIndex", "numTiers", "servingSize"],
  props: {
    tier: {
      validator: function(obj) {
        return (
          obj.width &&
          obj.height &&
          typeof obj.width === "number" &&
          typeof obj.height === "number"
        );
      }
    },
    tierIndex: {
      type: Number,
      default: 0
    },
    numTiers: {
      type: Number,
      default: 0
    },
    servingSize: {
      type: Number,
      default: 13
    }
  },
  components: {
    "app-draw-star-svg": DrawStarSVG,
    "app-draw-line-svg": DrawLineSVG,
    "app-draw-svg-icon": DrawSVGIcon,
    "app-color-swatch-svg": ColorSwatchSVG
  },
  data: function() {
    return {
      open: false,
      w: null,
      h: null,
      s: null,
      fill: "#fff"
    };
  },
  computed: {
    width: {
      get: function() {
        return this.w ? this.w : this.tier.width;
      },
      set: function(val) {
        this.w = parseInt(val);
      }
    },
    height: {
      get: function() {
        return this.h ? this.h : this.tier.height;
      },
      set: function(val) {
        this.h = parseInt(val);
      }
    },
    shape: {
      get: function() {
        return this.s ? this.s : this.tier.shape;
      },
      set: function(val) {
        this.s = val;
      }
    },
    fillColor: {
      get: function() {
        return this.fill ? this.fill : this.tier.fill;
      },
      set: function(val) {
        this.fill = val;
      }
    }
  },
  methods: {
    getServings: function() {
      if (!this.shape || this.shape === "round") {
        const r = this.width / 2;
        return Math.round((Math.PI * r * r * this.height) / this.servingSize);
      }
    },
    emitTierUpdate: function(obj) {
      this.$emit("update:tier", {
        ...obj,
        id: `${Math.floor(Math.random() * 10000)}`
      });
      this.clearLocal();
    },
    clearLocal: function() {
      this.w = null;
      this.h = null;
      this.s = null;
    }
  }
};
</script>

<style lang="scss" scoped>
.tier-menu-item select,
.tier-menu-item select:focus {
  font-family: "Shadows Into Light Two", cursive;
  font-size: inherit;
  color: inherit;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: 0;
  outline: 0;
  // border-bottom: 1pt solid;
  /* needed for Firefox: */
  overflow: hidden;
  width: auto;
  background: transparent;
  text-align: center;
  text-decoration: underline;
  cursor: pointer;
}

.tier-menu-item input,
.tier-menu-item input:focus {
  font-family: inherit;
  font-size: inherit;
  text-decoration: underline;
  color: inherit;
  border: 0;
  // border-bottom: 1pt solid;
  outline: 0;
  background: transparent;
  margin: 0 -0.5em;
  width: auto;
  text-align: center;
  cursor: pointer;
}

.tier-menu-item ul li {
  margin-left: 1.5em;
}
</style>

