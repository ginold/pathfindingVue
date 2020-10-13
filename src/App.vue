<template>
  <div id="app">
    <h1>Pathfinding</h1>
    <p>H distance from the end node</p>
    <p>G distance from the start node</p>
    <p>F = H + G</p>
    <Grid :grid="grid" :start="start" :end="end" />
    <Controls />
  </div>
</template>

<script>
import Grid from "./components/Grid.vue";
import Controls from "./components/Controls.vue";

const cols = 15;
const rows = 15;

export default {
  name: "App",
  data() {
    return {
      grid: { cols, rows },
      start: { col: 1, row: 2 },
      end: { col: 14, row: 3 }
    };
  },
  created() {},
  components: {
    Grid,
    Controls
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  padding-top: 100px;
}
html,
#app,
body {
  background-color: #592788;
}
div,
p,
h1,
h2,
h3 {
  color: white;
}
</style>
