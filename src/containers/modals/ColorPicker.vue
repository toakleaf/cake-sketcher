<template>
  <div class="box modal-card">
    <swatches-picker :value="color" @input="emitColorHex" class="swatch"/>
    <slider-picker :value="color" @input="emitColorHex" class="slide"/>
    <a class="button" style="margin:1em 1em 0.5em 1em;" @click="$emit('close')">
      <color-swatch-svg :color="color"/>awesome.
    </a>
  </div>
</template>

<script>
import { Swatches, Slider } from "vue-color";
import ColorSwatchSVG from "@/containers/CakeBuilder/ColorSwatchSVG.vue";

export default {
  components: {
    "swatches-picker": Swatches,
    "slider-picker": Slider,
    "color-swatch-svg": ColorSwatchSVG
  },
  props: ["fill"],
  name: "ColorPicker",
  data: function() {
    return {
      hex: null
    };
  },
  computed: {
    color: function() {
      return this.hex ? this.hex : this.fill;
    }
  },
  methods: {
    emitColorHex: function(obj) {
      if (
        !obj ||
        !obj.hex ||
        obj.hex.length < 7 ||
        obj.hex.slice(0, this.color.length) === this.color.toUpperCase()
      )
        return;
      this.hex = obj && obj.hex ? obj.hex : "#FFFFFF";
      this.$emit("update:color", this.hex);
      // this.$parent.close();
    }
  }
};
</script>


<style lang="scss" scoped>
.swatch {
  width: 100%;
  height: 100%;
  box-shadow: none;
}
.slide {
  width: 100%;
  margin: auto;
  padding: 1em;
}
</style>
