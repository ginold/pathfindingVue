export const astar = (grid, start, end) => {

  // for (let col = 0; col < grid.length; col++) {
  //   for (let row = 0; row < grid[col].length; row++) {
  //     grid[col][row] = {...grid[col][row]}
  //   }
  // }
  start.g = 0;
  start = grid[start.col][start.row];
  let openSet = [start];
  let closedSet = [];

  // heuristic, distance from the end node
  // eslint-disable-next-line no-unused-vars
  const hCost = node => {
    const dx = Math.abs(node.col - end.col);
    const dy = Math.abs(node.row - end.row);
    return dx + dy;
  };
  // distance from the start node
  // eslint-disable-next-line no-unused-vars
  const gCost = node => {
    const dx = Math.abs(node.col - start.col);
    const dy = Math.abs(node.row - start.row);
    return dx + dy;
  };

  const removeFromOpenSet = node => {
    openSet.splice(openSet.indexOf(node), 1);
  };
  const reconstructPath = node => {
    // eslint-disable-next-line no-unused-vars
    let temp = node;
    while (temp.previous) {
      temp = temp.previous;
      if ( // do not overwrite start and end positions
        (temp.col === start.col && temp.row === start.row) ||
        (temp.col === end.col && temp.row === end.row)
      ) {
        continue;
      }
      temp.isSolution = true;
    }
  };

  // we assume the lowest index has the lowest F value
  while (openSet.length > 0) {
    let lowestCostIndex = 0;
    for (let i = 0; i < openSet.length; i++) {
      let node = openSet[i];
      if (node.f < openSet[lowestCostIndex].f) {
        lowestCostIndex = i;

        // if they got the same sum cost, choose the one closer to the end
      } else if (openSet[i].f === openSet[lowestCostIndex].f) {
        if (openSet[i].h < openSet[lowestCostIndex].h) {
          lowestCostIndex = i;
        }
      }
      let currentNode = openSet[lowestCostIndex];
      // if node === end => we're done
      if (currentNode.col === end.col && currentNode.row === end.row) {
        reconstructPath(currentNode);
        return;
      }
      removeFromOpenSet(currentNode);
      closedSet.push(currentNode);

      let neighbors = currentNode.neighbors;
      for (let i = 0; i < neighbors.length; i++) {
        let neighbor = neighbors[i];
        neighbor.isVisited = true;
        if (
          closedSet.includes(neighbor) ||
          grid[neighbor.col][neighbor.row].isWall
        ) {
          continue;
        }
        // This the the first time we have arrived at this node, it must be the best
        let gScore = gCost(currentNode);
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        } else if (gScore >= neighbor.g) {
          console.log('awea')
        }

        // var dx1 = currentNode.x - end.x;
        // var dy1 = currentNode.y - end.y;
        // var dx2 = start.x - end.x;
        // var dy2 = start.y - end.y;
        // var cross = Math.abs(dx1 * dy2 - dx2 * dy1);
        // cross;
        neighbor.h = hCost(neighbor);
        neighbor.g = currentNode.g + 1;
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.previous = currentNode;
      }
    }
  }
  alert("no solution");
}