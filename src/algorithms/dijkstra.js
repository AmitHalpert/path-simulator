
export function dijkstra(matrix, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllTheNodes(matrix);
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();

    // If node is wall, skip it.
    if (closestNode.isWall) continue;

    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, matrix);
  }
}


// sort the the Nodes to get the the first node
// Could be better if using minimal heap.
function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}


function updateUnvisitedNeighbors(node, matrix) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, matrix);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
}


function getUnvisitedNeighbors(node, matrix) {
  const neighbors = [];
  const {col, row} = node;
  if (row > 0) neighbors.push(matrix[row - 1][col]);
  if (row < matrix.length - 1) neighbors.push(matrix[row + 1][col]);
  if (col > 0) neighbors.push(matrix[row][col - 1]);
  if (col < matrix[0].length - 1) neighbors.push(matrix[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllTheNodes(matrix) {
  const nodes = [];
  for (const row of matrix) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
