<template>
  <div id="controls">
    <h1>Settings</h1>
    <md-button @click="resetGrid" class="md-raised md-accent">Reset</md-button>
    <md-button @click="visualize" class="md-raised md-primary">Go!</md-button>
    <!-- <md-select v-model="algorithm" name="algorithms" id="algorithms">
      <md-option value="astar">A *</md-option>
      <md-option value="dijkstra">Dijkstra</md-option>
    </md-select>-->
    <div class="sliders">
      <div>
        <p>Columns</p>
        <range-slider
          class="slider"
          min="2"
          max="50"
          step="1"
          v-model="columns"
        ></range-slider>
      </div>
      <div>
        <p>Rows</p>
        <range-slider
          class="slider"
          min="2"
          max="50"
          step="1"
          v-model="rows"
        ></range-slider>
      </div>
    </div>
  </div>
</template>

<script>
import RangeSlider from "vue-range-slider";

export default {
  name: "Grid",
  data() {
    return {
      columns: 10,
      rows: 10,
      algorithm: "dijkstra",
    };
  },
  components: {
    RangeSlider,
  },
  watch: {
    columns: function (newVal) {
      this.eventHub.$emit("size-set", { rows: this.rows, cols: newVal });
    },
    rows: function (newVal) {
      this.eventHub.$emit("size-set", { rows: newVal, cols: this.columns });
    },
  },
  props: {},
  methods: {
    resetGrid: function () {
      this.eventHub.$emit("reset-grid");
    },
    visualize: function () {
      this.eventHub.$emit("visualize", this.algorithm);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
#controls {
  position: relative;
}
.sliders {
  justify-content: space-between;
  width: 100%;
  padding: 50px;
  display: flex;
  position: fixed;
  top: 0;
}
</style>
