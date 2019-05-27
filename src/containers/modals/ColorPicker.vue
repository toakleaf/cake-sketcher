<template>
  <div class="box modal-card">
    <swatches-picker :value="color" @input="emitColorHex" class="swatch"/>
    <slider-picker :value="color" @input="emitColorHex" class="slide"/>
  </div>
</template>

<script>
import { Swatches, Slider } from "vue-color";

export default {
  components: {
    "swatches-picker": Swatches,
    "slider-picker": Slider
  },
  props: ["fill"],
  name: "ColorPicker",
  data: function() {
    return {};
  },
  computed: {
    color: function() {
      return this.fill ? this.fill : "#FFFFFF";
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
      const hex = obj && obj.hex ? obj.hex : "#fff";
      this.$emit("update:color", hex);
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
