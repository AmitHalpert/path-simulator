export function bfs(matrix, startNode, finishNode) {
    const visitedNodesInOrder = [];
    // queue to keep track of the visited nodes
    let queue = [];
    queue.push(startNode);

    while (queue.length) {
      const currentNode = queue.shift();

      if (currentNode === finishNode) return visitedNodesInOrder;
  
      if (!currentNode.isWall && (currentNode.isStart || !currentNode.isVisited)){
          currentNode.isVisited = true;
          visitedNodesInOrder.push(currentNode);
          const {row , col} = currentNode;
          updateUnvisitedNeighbours(row, col, queue, matrix, currentNode)
      }

    }
  }


  // updates and gets the neighbours,
  function updateUnvisitedNeighbours(row,col,queue,matrix,currentNode) {
    let next;
    if (row > 0) {
      next = matrix[row - 1][col];
      if (!next.isVisited) {
        queue.push(next);
        next.previousNode = currentNode;
      }
    }
    if (row < matrix.length - 1) {
      next = matrix[row + 1][col];
      if (!next.isVisited) {
        queue.push(next);
        next.previousNode = currentNode;
      }
    }
    if (col > 0) {
      next = matrix[row][col - 1];
      if (!next.isVisited) {
        queue.push(next);
        next.previousNode = currentNode;
      }
    }
    if (col < matrix[0].length - 1) {
      next = matrix[row][col + 1];
      if (!next.isVisited) {
        queue.push(next);
        next.previousNode = currentNode;
      }
    }
}

export function getShortestPathOrderBFS(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}