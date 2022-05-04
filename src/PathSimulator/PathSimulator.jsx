import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getShortestDijkstra} from '../algorithms/dijkstra';
import {bfs, getShortestPathBFS} from '../algorithms/bfs';
import {dfs, getShortestPathDFS} from '../algorithms/dfs';
import './PathSimulator.css';



const NUMBER_ROW = 26;
const NUMBER_COL = 50;

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathSimulator extends Component {
  constructor() {
    super();
    this.state = {
      matrix: [],
      mouseIsPressed: false,
      mainIsPressed: "",
      isVisualizing: false,
      startNode_Pos: [START_NODE_ROW, START_NODE_COL],
      finishNode_Pos: [FINISH_NODE_ROW, FINISH_NODE_COL],
    };
  }

  componentDidMount() {
    const { startNode_Pos, finishNode_Pos } = this.state;
    let matrix = getInitialMatrix(startNode_Pos ,finishNode_Pos);
    this.setState({matrix});
  }
  
  /////////////////
  // user input handling
  /////////////////

  // user clicking a node
  handleMouseDown(row, col) {
    const {matrix, mainIsPressed} = this.state
    const node = matrix[row][col];

    if(node.isStart === true && node.isFinish === false){
      this.setState({mainIsPressed: "start"});
      node.isStart = false;
    }
    if(node.isFinish === true && node.isStart === false){
      this.setState({ mainIsPressed: "finish" });
      node.isFinish = false;
    }
    if (mainIsPressed === "") {
      const newMatrix = MatrixWithWallToggled(matrix, row, col);
      this.setState({ matrix: newMatrix, mouseIsPressed: true });
    }

  }

  // user hovering over a node
  handleMouseEnter(row, col) {
    const { matrix, mouseIsPressed, mainIsPressed } = this.state;

    if (mainIsPressed === "start") {
      const newMatrix = MatrixDynamicNodes(matrix, row, col, "start");
      this.setState({ matrix: newMatrix})
    }

  
    if(mainIsPressed === "finish") {
      const newGrid = MatrixDynamicNodes(matrix, row, col, "finish");
      this.setState({ grid: newGrid });
    }

   if (mouseIsPressed && mainIsPressed === "") {
      const newMatrix = MatrixWithWallToggled(matrix, row, col);
      this.setState({ matrix: newMatrix, mouseIsPressed: true });
    }
  }
  

  // user not clicking
  handleMouseLeave(row, col) {
    const { matrix, mainIsPressed } = this.state;
    if (mainIsPressed === "")
        return;
    let newMatrix = matrix.slice();
    const node = newMatrix[row][col];
    if (mainIsPressed === "start") {
        const newNode = {
            ...node,
            isStart: false,
            isWall: false
        }
        newMatrix[row][col] = newNode;
    }
    if (mainIsPressed === "finish") {
        const newNode = {
            ...node,
            isFinish: false,
            isWall: false
        }
        newMatrix[row][col] = newNode;
    }
    this.setState({ matrix: newMatrix });
}


  /////////////////
  // clear functions
  /////////////////


  clearStart(row, col) {
    const {matrix} = this.state;
    for (let r = 0; r < NUMBER_ROW; r++) {
      for (let c = 0; c < NUMBER_COL; c++) {
        matrix[r][c].isStart = false;
      }
    }
  }

  clearFinish(row, col) {
    const {matrix} = this.state;
    for (let r = 0; r < NUMBER_ROW; r++) {
      for (let c = 0; c < NUMBER_COL; c++) {
        matrix[r][c].isFinish = false;
      }
    }
  }


  // clear all the nodes that are isWall
   clearWalls(){
    const {matrix} = this.state;
    for (let r = 0; r < NUMBER_ROW; r++) {
      for (let c = 0; c < NUMBER_COL; c++) {
        matrix[r][c].isWall = false;
      }
    }
    // fource react to re-render.
    this.forceUpdate()
  }

    // best workaround
    resetMatrix(){
      window.location.reload(false);
    }


  /////////////////
  // algorithms animations
  /////////////////


  animateDFS(visitedNodesInOrder, getShortestPathDFS){
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(getShortestPathDFS);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateBFS(visitedNodesInOrder, getShortestPathBFS){
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(getShortestPathBFS);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateDijkstra(visitedNodesInOrder, getShortestDijkstra) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(getShortestDijkstra);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  visualizeDFS() {
    const {matrix} = this.state;
    const startNode = matrix[START_NODE_ROW][START_NODE_COL];
    const finishNode = matrix[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dfs(matrix, startNode, finishNode);
    const nodesInShortestPathOrder = getShortestPathDFS(finishNode);
    this.animateDFS(visitedNodesInOrder, nodesInShortestPathOrder);
  }


  visualizeBFS() {
    const {matrix} = this.state;
    const startNode = matrix[START_NODE_ROW][START_NODE_COL];
    const finishNode = matrix[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = bfs(matrix, startNode, finishNode);
    const nodesInShortestPathOrder = getShortestPathBFS(finishNode);
    this.animateBFS(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeDijkstra() {
    const {matrix} = this.state;
    const startNode = matrix[START_NODE_ROW][START_NODE_COL];
    const finishNode = matrix[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(matrix, startNode, finishNode);
    const nodesInShortestPathOrder = getShortestDijkstra(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }



  // animateShortestPath is used for animating every algorithm
  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }


  render() {
    const {matrix, mouseIsPressed} = this.state;

    return (
      <>
    <button onClick={() => this.resetMatrix()} class="button-68" >
    reset matrix
     </button>
    <button onClick={() => this.clearWalls()} class="button-68" >
    clear walls
    </button>
     <button onClick={() => this.visualizeDijkstra()} class="button-68" >
       Visualize Dijkstra's Algorithm
     </button>
     <button onClick={() => this.visualizeBFS()} class="button-68" >
       Visualize BFS Algorithm
     </button>
     <button onClick={() => this.visualizeDFS()} class="button-68" >
       Visualize DFS Algorithm
     </button>
        <div className="matrix">
          {matrix.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      col={col}
                      row={row}
                      key={nodeIdx}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                      onMouseUp={() => this.handleMouseUp(row, col)}
                      ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
} // end of the PathSimulator Component


/////////////////
// matrix 
/////////////////

const getInitialMatrix = (startNode_Pos, finishNode_Pos) => {
  let matrix = [];
  for (let row = 0; row < NUMBER_ROW; row++) {
    const currentRow = [];
    for (let col = 0; col < NUMBER_COL; col++) {
      currentRow.push(createNode(col,row,startNode_Pos, finishNode_Pos));
    }
    matrix.push(currentRow);
  }
  return matrix;
};


const createNode = (col, row, startNode, finishNode) => {

  let start_x = startNode[0];
  let start_y = startNode[1];
  let finish_x = finishNode[0];
  let finish_y = finishNode[1];

  return {
    col,
    row,
    isStart: (row === start_x && col === start_y),
    isFinish: (row === finish_x && col === finish_y),
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};



const MatrixDynamicNodes = (matrix, row, col, pos) => {
  console.log(`start node is currently at: row: ${row} col: ${col}`);
  let newMatrix = matrix.slice();
  const node = newMatrix[row][col];
  if (pos === "start") {
      const newNode = {
          ...node,
          isStart: true
      }
      newMatrix[row][col] = newNode;
  }
  if (pos === "finish") {
      const newNode = {
          ...node,
          isFinish: true
      }
      newMatrix[row][col] = newNode;
  }
  return newMatrix;
}

// Toggled and untoggle isWall to the current node
const MatrixWithWallToggled = (matrix, row, col) => {
  let newMatrix = matrix.slice();
  const node = newMatrix[row][col];
  const newNode = {
      ...node,
      isWall: !node.isWall
  }
  newMatrix[row][col] = newNode;
  return newMatrix;
}



