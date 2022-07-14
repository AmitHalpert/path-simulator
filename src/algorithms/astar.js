export function aastar(matrix, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(matrix);
  while (unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    // If we encounter a wall, we skip it.
    if (!closestNode.isWall) {
      if (closestNode.distance === Infinity) return visitedNodesInOrder;

      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);
      // if the finsih node is reached then we return the visitedNodes array
      if (closestNode === finishNode) return visitedNodesInOrder;

      updateUnvisitedNeighbours(closestNode, matrix);
    }
  }
}

// returns an array of nodes from the matrix
function getAllNodes(matrix) {
  const nodes = [];
  for (const row of matrix) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbours(node, matrix) {
  const unvisitedNeighbors = getUnvisitedNeighbours(node, matrix);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1 + neighbor.distanceToFinishNode;
    neighbor.previousNode = node;
  }
}

// returns an array of unvisited neighbours of the node
function getUnvisitedNeighbours(node, matrix) {
  const neighbours = [];
  const { row, col } = node;
  if (row > 0)
    neighbours.push(matrix[row - 1][col]);
  if (row < matrix.length - 1)
    neighbours.push(matrix[row + 1][col]);
  if (col > 0)
    neighbours.push(matrix[row][col - 1]);
  if (col < matrix[0].length - 1)
    neighbours.push(matrix[row][col + 1]);
  return neighbours.filter(neighbor => !neighbor.isVisited);
}

export function getShortestAstar(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
