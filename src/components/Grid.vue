/* eslint-disable no-unused-vars */
<template>
  <div
    id="grid-container"
    @mousedown="isDragging = true"
    @mouseup="disableFunctionalities"
  >
    <div id="grid" @mousewheel="adjustGridSize">
      <div
        v-for="(column, cIndex) in gridObject"
        :key="cIndex"
        :class="`col-${cIndex}`"
      >
        <div
          @contextmenu.prevent
          v-for="(row, rIndex) in column"
          :key="rIndex"
          :class="`row-${rIndex}`"
        >
          <Node
            v-bind="row"
            :isDragging="isDragging"
            :onMouseDown="handleMouseDown"
            :onMouseEnter="handleMouseEnter"
            :start="startObject"
            :end="endObject"
            :cols="grid.cols"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Node from "./Node";
import { astar } from "../algorithms/astar";
import { dijkstra } from "../algorithms/dijkstra";

export default {
  name: "Grid",
  data() {
    return {
      isDragging: false,
      gridObject: [],
      gridObjectDefault: [],
      isCreatingWalls: false,
      isErasingWalls: false,
      isDraggingStart: false,
      isDraggingEnd: false,
      startObject: {},
      endObject: {},
      algorithm: "dijkstra",
    };
  },
  components: { Node },
  props: {
    grid: Object,
    end: Object,
    start: Object,
  },
  created() {
    this.startObject = this.start;
    this.endObject = this.end;
    this.getInitialGrid();
    this.visualize();
    this.eventHub.$on("reset-grid", () => {
      this.resetGrid();
    });
    this.eventHub.$on("size-set", (size) => {
      this.grid.rows = size.rows;
      this.grid.cols = size.cols;
      this.getInitialGrid();
      this.repositionStartAndEndPoints();
    });
    this.eventHub.$on("visualize", () => {
      this.algorithm = "astar";
      this.visualize();
    });
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    handleMouseEnter: function (e, row, col) {
      e.preventDefault();
      if (!this.isDragging) return;
      if (this.isDraggingStart) {
        this.startObject = { row, col };
        this.getInitialGrid();
        this.visualize();
      }
      if (this.isDraggingEnd) {
        this.endObject = { row, col };
        this.getInitialGrid();
        this.visualize();
      }
      this.getNewGridWithWall(row, col);
    },
    // eslint-disable-next-line no-unused-vars
    handleMouseDown: function (e, row, col) {
      e.preventDefault();
      if (row === this.endObject.row && col === this.endObject.col) {
        this.isDraggingEnd = true;
        return;
      }
      if (row === this.startObject.row && col === this.startObject.col) {
        this.isDraggingStart = true;
        return;
      }
      if (e.button === 0) this.isCreatingWalls = true; // left click
      if (e.button === 2) this.isErasingWalls = true; // right click

      this.getNewGridWithWall(row, col);
    },
    adjustGridSize: function (e) {
      e.preventDefault();
      if (e.wheelDelta > 0) {
        if (this.grid.cols <= 30 && this.grid.rows <= 20) {
          this.grid.cols += 1;
          this.grid.rows += 1;
        }
      } else {
        if (this.grid.cols > 4 || this.grid.rows > 4) {
          this.grid.cols--;
          this.grid.rows--;
        }
      }
      this.repositionStartAndEndPoints();
      this.getInitialGrid();
    },
    repositionStartAndEndPoints: function () {
      if (this.startObject.row === this.grid.rows)
        this.startObject.row = this.grid.rows - 1;
      if (this.startObject.col === this.grid.cols)
        this.startObject.col = this.grid.cols - 1;
      if (this.endObject.row === this.grid.rows)
        this.endObject.row = this.grid.rows - 1;
      if (this.endObject.col === this.grid.cols)
        this.endObject.col = this.grid.cols - 1;
    },
    disableFunctionalities: function () {
      this.isDragging = false;
      this.isCreatingWalls = false;
      this.isErasingWalls = false;
      this.isDraggingEnd = false;
      this.isDraggingStart = false;
    },
    getNewGridWithWall: function (col, row) {
      const node = this.gridObject[row][col];
      if (node.isStart || node.isEnd || node.isVisited) return;
      let isWall;
      if (this.isCreatingWalls) isWall = true;
      if (this.isErasingWalls) isWall = false;

      if (isWall && node.isWall) return;
      if (!isWall && !node.isWall) return;

      this.gridObject[row][col] = {
        ...node,
        isWall: isWall,
      };
      this.gridObject.splice(); // to trigger a re-render
    },
    getInitialGrid: function () {
      let grid = new Array(this.grid.cols);

      for (let col = 0; col < grid.length; col++) {
        grid[col] = new Array(this.grid.rows);
        for (let row = 0; row < grid[col].length; row++) {
          grid[col][row] = this.createNode(col, row);
        }
      }
      for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
          this.setNodeNeighbors(grid[col][row], grid);
        }
      }
      this.gridObject = grid;
    },
    setNodeNeighbors(node, grid) {
      let neighbors = [];
      if (node.col > 0) {
        // left
        neighbors.push(grid[node.col - 1][node.row]);
      }
      if (node.col < grid.length - 1) {
        // right
        neighbors.push(grid[node.col + 1][node.row]);
      }
      if (node.row < grid[node.col].length - 1) {
        //up
        neighbors.push(grid[node.col][node.row + 1]);
      }
      if (node.row > 0) {
        // down
        neighbors.push(grid[node.col][node.row - 1]);
      }
      node.neighbors = neighbors;
    },
    createNode: function (col, row) {
      const node = {
        col,
        row,
        isWall: false,
        isVisited: false,
        isEnd: this.endObject.col === col && this.endObject.row === row,
        isStart: this.startObject.col === col && this.startObject.row === row,
        isClosed: false,
        previous: null,
      };
      if (this.algorithm === "astar") {
        return { ...node, f: 0, h: 0, g: 0 };
      } else if (this.algorithm === "dijkstra") {
        return { ...node, distance: Infinity };
      }
    },
    resetGrid: function () {
      this.getInitialGrid();
    },
    visualize: function () {
      console.log(this.algorithm);
      switch (this.algorithm) {
        case "astar":
          astar(this.gridObject, this.startObject, this.endObject);
          break;
        case "dijkstra":
          dijkstra(this.gridObject, this.startObject, this.endObject);
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style scoped >
#grid-container {
  justify-content: center;
  display: flex;
}
#grid {
  background-color: white;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  position: relative;
  width: fit-content;
  border: 2px solid tomato;
}
td,
tr {
  padding: 0;
  margin: 0;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
