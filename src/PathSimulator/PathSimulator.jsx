import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

import './PathSimulator.css';

var IsStartSelected = false;
var isFinishSelected = false;

const NUMBER_ROW = 27;
const NUMBER_COL = 60;

var START_NODE_ROW = 10;
var START_NODE_COL = 15;
var FINISH_NODE_ROW = 10;
var FINISH_NODE_COL = 35;

export default class PathSimulator extends Component {
  constructor() {
    super();
    this.state = {
      matrix: [],
      mouseIsPressed: false,
    };
  }

  componentDidMount() {
    const matrix = getInitialMatrix();
    this.setState({matrix});
  }
  
  /////////////////
  // USER INPUT
  /////////////////

  // user clicking a node
  handleMouseDown(row, col) {
    if(row === START_NODE_ROW && col === START_NODE_COL){
      IsStartSelected = true;
    }
    else if(row === FINISH_NODE_ROW && col === FINISH_NODE_COL){
      isFinishSelected = true;
    }
    const newMatrix = getNewMatrixWithWallToggled(this.state.matrix, row, col);
    this.setState({matrix: newMatrix, mouseIsPressed: true});
  
  }

  // user hovering over a node
  handleMouseEnter(row, col) {
    var newMatrix;
    if (!this.state.mouseIsPressed) return;
    // move start node
    if(IsStartSelected){
      START_NODE_COL = col;
      START_NODE_ROW = row;
      this.clearStart(row, col);
      newMatrix = MoveStart(this.state.matrix, row, col);
      this.setState({matrix: newMatrix});
    }
    // move start finish
    if(isFinishSelected){
      FINISH_NODE_ROW = row;
      FINISH_NODE_COL = col;
      this.clearFinish(row, col);
      newMatrix = MoveFinish(this.state.matrix, row, col);
      this.setState({matrix: newMatrix});
    }
    // put walls
    else{
      newMatrix = getNewMatrixWithWallToggled(this.state.matrix, row, col);
      this.setState({matrix: newMatrix});
    }
  }
  
  handleMouseUp() {
    IsStartSelected = false;
    isFinishSelected = false;
    this.setState({mouseIsPressed: false});
  }


  /////////////////
  // CLEAR
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

    // refresh the page
    resetMatrix(){
      window.location.reload(false);
    }


  /////////////////
  // ANIMATIONS
  /////////////////

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
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

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const {matrix} = this.state;
    const startNode = matrix[START_NODE_ROW][START_NODE_COL];
    const finishNode = matrix[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(matrix, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
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
                      onMouseUp={() => this.handleMouseUp()}
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
// MATRIX 
/////////////////

const getInitialMatrix = () => {
  const matrix = [];
  for (let row = 0; row < NUMBER_ROW; row++) {
    const currentRow = [];
    for (let col = 0; col < NUMBER_COL; col++) {
      currentRow.push(createNode(col, row));
    }
    matrix.push(currentRow);
  }
  return matrix;
};


const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: (row === START_NODE_ROW && col === START_NODE_COL),
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};


// set current node isFinish to true
const MoveFinish = (matrix, row, col) => {
  var newMatrix = matrix;
  newMatrix[row][col].isFinish = true;
  return newMatrix;
}


// set current node isStart to true
const MoveStart = (matrix, row, col) => {
  var newMatrix = matrix;
  newMatrix[row][col].isStart = true;
  return newMatrix;
};


// Toggled and untoggle isWall to the current node
const getNewMatrixWithWallToggled = (matrix, row, col) => {
  const newMatrix = matrix;

  const node = newMatrix[row][col];

  if(newMatrix[row][col].isStart === false && newMatrix[row][col].isFinish === false){
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newMatrix[row][col] = newNode;
}
  return newMatrix;
};



