/* eslint-disable no-unused-vars */
export const dijkstra = (grid, start, end) => {
  // eslint-disable-next-line no-unused-vars
  start = grid[start.col][start.row]
  start.distance = 0
  let unvisitedNodes = [start]
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      unvisitedNodes.push(grid[col][row])
    }
  }

  while (unvisitedNodes.length) {
    sortByDistance(unvisitedNodes) // node with the closest distance will be at index 0
    let currentNode = unvisitedNodes.shift() // removes the first element from an array and returns that removed
    currentNode.isVisited = true
    if (currentNode.col === end.col && currentNode.row === end.row) {
      reconstructPath(currentNode, start, end)
      return
    }
    let neighbors = currentNode.neighbors
    for (let j = 0; j <= neighbors.length - 1; j++) {
      let neighbor = neighbors[j]
      if (unvisitedNodes.includes(neighbor) && !neighbors.isWall) {
        neighbor.distance = manhattanDistance(neighbor, start)
        neighbor.previous = currentNode
      }
    }
  }
}

const manhattanDistance = (node1, node2) => {
  const dx = Math.abs(node1.col - node2.col);
  const dy = Math.abs(node1.row - node2.row);
  return dx + dy;
};
const sortByDistance = (arr) => {
  arr.sort((a, b) => a.distance - b.distance)
}
const reconstructPath = (node, start, end) => {
  let temp = node;
  let i = 0
  while (temp.previous) {
    temp = temp.previous;
    if ( // do not overwrite start and end positions
      (temp.col === start.col && temp.row === start.row) ||
      (temp.col === end.col && temp.row === end.row)
    ) {
      continue;
    }
    temp.isSolution = true;
    i++
    if (i === 100) { return }
  }
}