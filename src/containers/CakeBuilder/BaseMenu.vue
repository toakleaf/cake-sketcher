<template>
  <div class="base-menu-item">
    <b-collapse
      :open="open"
      aria-id="contentIdForA11y1"
      @open="$emit('open')"
      @close="$emit('close')"
    >
      <h3 class="is-size-4" slot="trigger" aria-controls="contentIdForA11y1">
        <span>Base</span>
        <span class="icon is-pulled-right is-medium">
          <app-draw-svg-icon path="M1,299,l149,-149,l149,149,l-149,-149,l-149,149" v-show="!open"/>
          <app-draw-svg-icon path="M1,150,l149,149,l149,-149,l-149,149,l-149,-149" v-show="open"/>
        </span>
        <span class="is-size-7 is-pulled-right" style="margin:1em 1em 0 0">{{width}}"</span>
      </h3>
      <ul>
        <li>
          <app-draw-star-svg/>Shape:
          <select
            class="has-text-link"
            v-model="shape"
            @change="emitBaseUpdate({...base, shape})"
          >
            <option value="round">Round</option>
            <option value="square">Square</option>
          </select>
        </li>
        <li>
          <app-draw-svg-icon
            path="M39,126,a111,24 0 1,0 222,0,a111,24 0 1,0 -222,0,v124,a111,24 0 1,0 222,0,v-124"
          />

          <select class="has-text-link" v-model="width" @change="emitBaseUpdate({...base, width})">
            <option
              v-for="n in baseWidthLimits[1] + 1 - baseWidthLimits[0]"
              :key="n"
              :value="n - 1 + baseWidthLimits[0]"
            >{{n - 1 + baseWidthLimits[0]}}"</option>
          </select>
          wide
        </li>
        <li>
          <a @click="launchColorPickerModal">
            <app-color-swatch-svg :color="fill"/>Base Color
          </a>
          <input
            type="text"
            v-model="fill"
            size="12"
            class="has-text-link has-text-left"
            style="padding-left:0.5em"
            @blur="emitBaseUpdate({...base, fill: fill})"
            @keydown.enter="emitBaseUpdate({...base, fill: fill})"
            @keydown.delete="fill = $event.target.value.length > 2 ? $event.target.value : null"
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
import ColorPicker from "@/containers/modals/ColorPicker.vue";

export default {
  name: "baseMenu",
  components: {
    "app-draw-star-svg": DrawStarSVG,
    "app-draw-line-svg": DrawLineSVG,
    "app-draw-svg-icon": DrawSVGIcon,
    "app-color-swatch-svg": ColorSwatchSVG
  },
  props: {
    base: {
      validator: function(obj) {
        return (
          obj.width &&
          obj.height &&
          obj.id &&
          obj.key &&
          typeof obj.width === "number" &&
          typeof obj.height === "number"
        );
      }
    },
    open: {
      type: Boolean,
      default: false
    },
    baseWidthLimits: {
      validator: function(nums) {
        return (
          nums && nums.every(n => typeof n === "number") && nums.length === 2
        );
      },
      default: function() {
        return [8, 24];
      }
    }
  },
  data: function() {
    return {
      w: null,
      h: null,
      shape: null,
      fill: null
    };
  },
  computed: {
    width: {
      get: function() {
        return this.w;
      },
      set: function(val) {
        this.w = parseInt(val);
      }
    },
    height: {
      get: function() {
        return this.w > 14 ? 0.5 : 0.3;
      },
      set: function(val) {
        this.h = parseInt(val);
      }
    }
  },
  methods: {
    emitBaseUpdate: function(obj) {
      this.$emit("update:base", {
        ...obj,
        key: `k${Math.floor(Math.random() * 10000)}`
      });
    },
    launchColorPickerModal: function() {
      this.$modal.open({
        parent: this,
        component: ColorPicker,
        props: { fill: this.fill },
        hasModalCard: true,
        events: {
          "update:color": val => {
            this.fill = val;
          },
          close: () => {
            this.emitBaseUpdate({ ...this.base, fill: this.fill });
          }
        },
        onCancel: () => {
          this.emitBaseUpdate({ ...this.base, fill: this.fill });
        }
      });
    }
  },
  mounted: function() {
    this.fill = this.base.fill ? this.base.fill : "#FFF";
    this.shape = this.base.shape ? this.base.shape : "round";
    this.width = this.base.width;
    this.height = this.base.height;
  }
};
</script>

<style lang="scss" scoped>
.base-menu-item select,
.base-menu-item select:focus {
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

.base-menu-item input,
.base-menu-item input:focus {
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
}

.base-menu-item ul li {
  margin-left: 1.5em;
}
</style>

