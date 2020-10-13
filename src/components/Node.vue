<template>
  <div
    @mousedown="onMouseDown($event, row, col)"
    @mouseenter="onMouseEnter($event, row, col)"
    @contextmenu.prevent
    :class="`node 
    ${isEnd ? 'end' : '' }
    ${isStart ? 'start' : '' }
    ${isWall ? 'wall' : '' }
    ${isVisited ? 'visited' : '' }
    ${isClosed ? 'closed' : ''}
    ${isSolution ? 'solution' : '' }
    node-${col}-${row}`"
  >
    <!-- <div class="info" v-if="h">h: {{h}}</div>
    <div class="info" v-if="g">g: {{g}}</div>-->
    <!-- <div class="info" v-if="f">f: {{f}}</div> -->
  </div>
</template>

<script>
export default {
  name: "Node",
  props: {
    col: Number,
    row: Number,
    isVisited: Boolean,
    isStart: Boolean,
    isEnd: Boolean,
    isWall: Boolean,
    onMouseEnter: Function,
    onMouseDown: Function,
    isDragging: Boolean,
    f: Number,
    g: Number,
    h: Number,
    isSolution: Boolean,
    size: Number,
    isClosed: Boolean
  },
  data() {
    return {
      isNodeWall: false
    };
  },
  created() {
    // console.log(this);
  },
  methods: {
    hey: function() {
      console.log("wea");
    }
  }
};
</script>

<style>
.visited,
.wall,
.solution {
  animation-duration: 1s;
  animation-timing-function: ease-out;
  animation-delay: 0;
  animation-direction: alternate;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  animation-play-state: running;
}
.visited {
  animation-name: visitedAnimation;
}
.wall {
  transition: 0.3 all;
  animation-name: wallAnimation;
}
.start,
.end {
  cursor: grab;
}
.start.visited,
.end.visited {
  animation: none !important;
}
.node {
  border: 0.1px solid #85dbca87;
  background-color: white;
  width: 2vw;
  height: 2vw;
  transition: 0.3s all;
}
.solution.visited {
  animation: none !important;
}
.solution {
  background-color: #ccabd8;
}
.info {
  font-size: 80%;
}
.end {
  background-color: #ff6565e3;
}
.start {
  background-color: #c329c8;
}

@keyframes visitedAnimation {
  0% {
    transform: scale(0.3);
    background-color: white;
    border-radius: 100%;
  }

  50% {
    background-color: rgba(17, 104, 217, 1);
  }

  75% {
    transform: scale(1.2);
    background-color: rgba(0, 217, 159, 1);
  }

  100% {
    transform: scale(1);
    background-color: #a5cad2;
  }
}
@keyframes wallAnimation {
  0% {
    transform: scale(0.3);
    background-color: rgba(255, 255, 255, 0.75);
    border-radius: 100%;
  }

  50% {
    background-color: rgba(100, 100, 100, 0.75);
  }

  75% {
    transform: scale(1.2);
    background-color: rgba(0, 12, 23, 0.75);
  }

  100% {
    transform: scale(1);
    background-color: dimgray;
  }
}
@keyframes solutionAnimation {
  0% {
    transform: scale(0.3);
    background-color: rgba(255, 255, 255, 0.75);
    border-radius: 100%;
  }

  50% {
    background-color: rgba(100, 100, 100, 0.75);
  }

  75% {
    transform: scale(1.2);
    background-color: rgba(199, 235, 158, 0.75);
  }

  100% {
    transform: scale(1);
    background-color: #dcff00;
  }
}

@media screen and (max-width: 600px) {
  .node {
    height: 5vw;
    width: 5vw;
  }
}
@media screen and (max-width: 1000px) {
  .node {
    height: 3vw;
    width: 3vw;
  }
}
</style>
