export function dfs(matrix, startNode, finishNode) {
    const visitedNodesInOrder = [];
    // stack to keep track of the visited nodes
    const stack = []; 
    stack.push(startNode);
    while (stack.length) {
      const currentNode = stack.pop();
      // if the finsih node is reached then we return the visitedNodes
      if (currentNode === finishNode) 
        return visitedNodesInOrder;
  
      // skip if wall and if start node or finish node
      if (!currentNode.isWall && (currentNode.isStart || !currentNode.isVisited)) {
        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);
        const { row, col } = currentNode;
        updateUnvisitedNeighbours(row, col, stack, matrix,currentNode);
      }
    }
  }

  function  updateUnvisitedNeighbours(row, col, stack, matrix,currentNode) {
    let next;
    if (row > 0) {
      next = matrix[row - 1][col];
      if (!next.isVisited) {
        next.previousNode = currentNode;
        stack.push(next);
      }
    }
    if (row < matrix.length - 1) {
      next = matrix[row + 1][col];
      if (!next.isVisited) {
        next.previousNode = currentNode;
        stack.push(next);
      }
    }
    if (col < matrix[0].length - 1) {
      next = matrix[row][col + 1];
      if (!next.isVisited) {
        next.previousNode = currentNode;
        stack.push(next);
      }
    }
    if (col > 0) {
      next = matrix[row][col - 1];
      if (!next.isVisited) {
        next.previousNode = currentNode;
        stack.push(next);
      }
    }
}

export function getShortestPathDFS(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
