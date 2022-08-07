// import components
import React, { Component } from "react";
import "./PathSimulator.css";
import Node from "../Node/Node";
import { dijkstra, getNodesInShortestPathOrder, dfs, bfs, astar } from "../../algorithms";
import { animatePath, setVisualizationState } from "../../visualizers";
import { recursiveDivisionMaze, randomMaze } from "../../maze-algorithms";
import AppNavbar from "../AppNavbar/AppNavbar";
import ErrorModal from '../../components/ErrorModal/ErrorModal';
import TooltipExampleMulti from '../../components/ToolTip/ToolTip';
import 'bootstrap/dist/css/bootstrap.min.css';

// constants
const NUMBER_ROW = 24;
const NUMBER_COL = 50;

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

class PathSimulator extends Component {
  state = {
    matrix: [],
    mouseIsPressed: false,
    isPathNotFound: false,
    visitedNodes: 0,
    shortestNodes: 0,
    tooltipOpen: false,
    isVisualizing: false,
    mainIsPressed: "",
    startNode_Pos: [START_NODE_ROW, START_NODE_COL],
    finishNode_Pos: [FINISH_NODE_ROW, FINISH_NODE_COL],
}

  componentDidMount() {
    const { startNode_Pos, finishNode_Pos } = this.state;
    let matrix = getInitialMatrix(startNode_Pos, finishNode_Pos);
    this.setState({ matrix });
  }

  toggle = () => {
    this.setState({ tooltipOpen: !this.state.tooltipOpen });
  }

  /////////////////
  // user input handling
  /////////////////

  // user clicking a node
  handleMouseDown(row, col) {
    const { matrix, mainIsPressed } = this.state;
    const node = matrix[row][col];

    if (node.isStart === true && node.isFinish === false) {
      this.setState({ mainIsPressed: "start" });
      node.isStart = false;
    }
    if (node.isFinish === true && node.isStart === false) {
      this.setState({ mainIsPressed: "finish" });
      node.isFinish = false;
    }
    if (
      mainIsPressed === "" &&
      node.isFinish === false &&
      node.isStart === false
    ) {
      const newMatrix = MatrixWithWallToggled(matrix, row, col);
      this.setState({ matrix: newMatrix, mouseIsPressed: true });
    }
  }

  // user hovering over a node
  handleMouseEnter(row, col) {
    const { matrix, mouseIsPressed, mainIsPressed } = this.state;

    if (mainIsPressed === "start") {
      const newMatrix = MatrixDynamicNodes(matrix, row, col, "start");
      this.setState({ matrix: newMatrix });
    }

    if (mainIsPressed === "finish") {
      const newMatrix = MatrixDynamicNodes(matrix, row, col, "finish");
      this.setState({ matrix: newMatrix });
    }

    if (mainIsPressed !== "finish" && mainIsPressed !== "start") {
      if (mouseIsPressed && mainIsPressed === "" && mainIsPressed !== "start") {
        const newMatrix = MatrixWithWallToggled(matrix, row, col);
        this.setState({ matrix: newMatrix, mouseIsPressed: true });
      }
    }
  }

  handleMouseUp(row, col) {
    const { mainIsPressed, matrix } = this.state;
    if (mainIsPressed === "start") {
      this.setState({ mainIsPressed: "" });
      const startNode_Pos = [row, col];
      const newMatrix = MatrixDynamicNodes(matrix, row, col, "start");
      this.setState({ mainIsPressed: "", startNode_Pos, matrix: newMatrix });
    }
    if (mainIsPressed === "finish") {
      const finishNode_Pos = [row, col];
      const newMatrix = MatrixDynamicNodes(matrix, row, col, "finish");
      this.setState({ mainIsPressed: "", finishNode_Pos, matrix: newMatrix });
    }
    this.setState({ mouseIsPressed: false });
  }

  // user not clicking
  handleMouseLeave(row, col) {
    const { matrix, mainIsPressed } = this.state;
    if (mainIsPressed === "") return;
    let newMatrix = matrix.slice();
    const node = newMatrix[row][col];
    if (mainIsPressed === "start") {
      const newNode = {
        ...node,
        isStart: false,
        isWall: false,
      };
      newMatrix[row][col] = newNode;
    }
    if (mainIsPressed === "finish") {
      const newNode = {
        ...node,
        isFinish: false,
        isWall: false,
      };
      newMatrix[row][col] = newNode;
    }
    this.setState({ matrix: newMatrix });
  }


  visualizeDijkstra = () => {
    if (this.state.isVisualizing)
        return;
    const { matrix, startNode_Pos, finishNode_Pos } = this.state;
    const start_X = startNode_Pos[0], start_Y = startNode_Pos[1];
    const startNode = matrix[start_X][start_Y];
    const finish_X = finishNode_Pos[0], finish_Y = finishNode_Pos[1];
    const finishNode = matrix[finish_X][finish_Y];
    try {
        const visitedNodesInOrder = dijkstra(matrix, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        if (nodesInShortestPathOrder.length === 1)
            throw "not possible";
        this.setState({
            shortestNodes: nodesInShortestPathOrder.length,
            visitedNodes: visitedNodesInOrder.length
        });
        animatePath(this, visitedNodesInOrder, nodesInShortestPathOrder, startNode, finishNode);
    } catch (error) {
        this.setState({ isPathNotFound: true, isVisualizing: true });
        setTimeout(() => {
            this.setState({ isPathNotFound: false, isVisualizing: false });
        }, 3000);
    }
    //this.setState({ isVisualizing: false });
}

// dfs
visualizeDFS = () => {
    if (this.state.isVisualizing)
        return;
    const { matrix, startNode_Pos, finishNode_Pos } = this.state;
    const start_X = startNode_Pos[0], start_Y = startNode_Pos[1];
    const startNode = matrix[start_X][start_Y];
    const finish_X = finishNode_Pos[0], finish_Y = finishNode_Pos[1];
    const finishNode = matrix[finish_X][finish_Y];
    try {
        const visitedNodesInOrder = dfs(matrix, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.setState({
            shortestNodes: nodesInShortestPathOrder.length,
            visitedNodes: visitedNodesInOrder.length
        });
        animatePath(this, visitedNodesInOrder, nodesInShortestPathOrder, startNode, finishNode);
    } catch (error) {
        console.log(error)
        this.setState({ isPathNotFound: true, isVisualizing: true });
        setTimeout(() => {
            this.setState({ isPathNotFound: false, isVisualizing: false });
        }, 3000);
    }
}

// bfs
visualizeBFS = () => {
    if (this.state.isVisualizing)
        return;
    const { matrix, startNode_Pos, finishNode_Pos } = this.state;
    const start_X = startNode_Pos[0], start_Y = startNode_Pos[1];
    const startNode = matrix[start_X][start_Y];
    const finish_X = finishNode_Pos[0], finish_Y = finishNode_Pos[1];
    const finishNode = matrix[finish_X][finish_Y];
    try {
        const visitedNodesInOrder = bfs(matrix, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.setState({
            shortestNodes: nodesInShortestPathOrder.length,
            visitedNodes: visitedNodesInOrder.length
        });
        animatePath(this, visitedNodesInOrder, nodesInShortestPathOrder, startNode, finishNode);
    } catch (error) {
        this.setState({ isPathNotFound: true, isVisualizing: true });
        setTimeout(() => {
            this.setState({ isPathNotFound: false, isVisualizing: false });
        }, 3000);
    }
}

// astar
visualizeAstar = () => {
    if (this.state.isVisualizing)
        return;
    const { matrix,startNode_Pos,finishNode_Pos } = this.state;
    const start_X = startNode_Pos[0], start_Y = startNode_Pos[1];
    const startNode = matrix[start_X][start_Y];
    const finish_X = finishNode_Pos[0], finish_Y = finishNode_Pos[1];
    const finishNode = matrix[finish_X][finish_Y];
    try {
        const visitedNodesInOrder = astar(matrix, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        if (nodesInShortestPathOrder.length === 1) {
            throw "not possible";
        }
        this.setState({
            shortestNodes: nodesInShortestPathOrder.length,
            visitedNodes: visitedNodesInOrder.length
        });
        animatePath(this, visitedNodesInOrder, nodesInShortestPathOrder, startNode, finishNode);
    } catch (error) {
        this.setState({ isPathNotFound: true, isVisualizing: true });
        setTimeout(() => {
            this.setState({ isPathNotFound: false, isVisualizing: false });
        }, 3000);
    }
}


/*----------------------------------------------------------clear helper functions---------------------------------------------------------*/

clearMatrix = () => {
  if (this.state.isVisualizing)
      return;
  const { startNode_Pos, finishNode_Pos } = this.state;
  const start_X = startNode_Pos[0], start_Y = startNode_Pos[1];
  const finish_X = finishNode_Pos[0], finish_Y = finishNode_Pos[1];
  for (let row = 0; row < this.state.matrix.length; row++) {
      for (let col = 0; col < this.state.matrix[0].length; col++) {
          if (!((row === start_X && col === start_Y) || (row === finish_X && col === finish_Y))) {
              document.getElementById(`node-${row}-${col}`).className = "node";
          }
      }
  }
  const newMatrix = getInitialMatrix(startNode_Pos,finishNode_Pos);
  this.setState({ matrix: newMatrix, visitedNodes: 0, shortestNodes: 0 });
}

clearPath = () => {
  if (this.state.isVisualizing)
      return;
  for (let row = 0; row < this.state.matrix.length; row++) {
      for (let col = 0; col < this.state.matrix[0].length; col++) {
          if ((document.getElementById(`node-${row}-${col}`).className === "node node-shortest-path") || document.getElementById(`node-${row}-${col}`).className === "node node-visited") {
              document.getElementById(`node-${row}-${col}`).className = "node";
          }
      }
  }
  const newmatrix = getMatrixWithoutPath(this.state.matrix);
  this.setState({ matrix: newmatrix, visitedNodes: 0, shortestNodes: 0 });
}


/*----------------------------------------------------------maze generations functions---------------------------------------------------------*/
generateRecursiveDivisionMaze = () => {
  if (this.state.isVisualizing)
      return;
  this.setState({ isVisualizing: true });
  const { matrix, startNode_Pos,finishNode_Pos } = this.state;
  const startNode = matrix[startNode_Pos[0]][startNode_Pos[1]];
  const finishNode = matrix[finishNode_Pos[0]][finishNode_Pos[1]];
  const walls = recursiveDivisionMaze(matrix, startNode, finishNode);
  this.animateWalls(walls, matrix);
}

generateRandomMaze = () => {
  if (this.state.isVisualizing)
      return;
  this.setState({ isVisualizing: true });
  const { matrix,startNode_Pos,finishNode_Pos } = this.state;
  const startNode = matrix[startNode_Pos[0]][startNode_Pos[1]];
  const finishNode = matrix[finishNode_Pos[0]][finishNode_Pos[1]];
  const walls = randomMaze(matrix, startNode, finishNode);
  this.animateWalls(walls, matrix);
}

animateWalls = (walls, matrix) => {
  for (let i = 0; i <= walls.length; i++) {
      if (i === walls.length) {
          setTimeout(() => {
              const newMatrix = getNewMatrixWithMaze(this.state.matrix, walls);
              this.setState({ matrix: newMatrix, isVisualizing: false });
          }, 10 * i);
          return ;
      }
      setTimeout(() => {
          const wall = walls[i];
          const node = matrix[wall[0]][wall[1]];
          document.getElementById(`node-${node.row}-${node.col}`).className = "node node-animated-wall";
      }, 10 * i);
  }
}
  
/*------------------------------------------------------------------------------------------------------------------------------*/

  setVisualization = () => {
    this.setState({
        isVisualizing: !this.state.isVisualizing
    });
}

// same as the previous func, but this one to set the state outside of this component, in algorithms visualizing components
handleClick = () => {
    setVisualizationState(this);
}

render() {
  const { matrix, mouseIsPressed, visitedNodes, shortestNodes } = this.state;

  return (
      <>
          <TooltipExampleMulti />
          {this.state.isPathNotFound ? <ErrorModal /> : null }
          <AppNavbar
              handleDijkstra={this.visualizeDijkstra}
              handleDFS={this.visualizeDFS}
              handleBFS={this.visualizeBFS}
              handleAstar={this.visualizeAstar}
              handleClearPath={this.clearPath}
              handleClearMatrix={this.clearMatrix}
              handleMaze={this.generateRecursiveDivisionMaze}
              handleRandomMaze={this.generateRandomMaze}
              handleVisualization={this.setVisualization}
              visitedNodes={visitedNodes}
              shortestNodes={shortestNodes}
          />

          
     
          <div className="matrix">
              {matrix.map((row, rowIdx) => {
                  return (
                      <div key={rowIdx}>
                          {row.map((node, nodeIdx) => {
                              const { row, col, isStart, isFinish, isWall } = node;
                              return (
                                  <Node
                                      key={nodeIdx}
                                      row={row}
                                      col={col}
                                      isStart={isStart}
                                      isFinish={isFinish}
                                      isWall={isWall}
                                      mouseIsPressed={mouseIsPressed}
                                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                      onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                      onMouseUp={(row,col) => this.handleMouseUp(row,col)}
                                      onMouseLeave={(row, col) => this.handleMouseLeave(row, col)}
                                  />
                              )
                          })}
                      </div>
                  )
              })}
          </div>
          
      </>
   );
}
}

export default PathSimulator;

/////////////////
// matrix
/////////////////

const getInitialMatrix = (startNode_Pos, finishNode_Pos) => {
  let matrix = [];
  for (let row = 0; row < NUMBER_ROW; row++) {
    const currentRow = [];
    for (let col = 0; col < NUMBER_COL; col++) {
      currentRow.push(createNode(row, col, startNode_Pos, finishNode_Pos));
    }
    matrix.push(currentRow);
  }
  return matrix;
};

const createNode = (row, col, startNode, finishNode) => {
  let start_x = startNode[0];
  let start_y = startNode[1];
  let finish_x = finishNode[0];
  let finish_y = finishNode[1];

  return {
    col,
    row,
    isStart: row === start_x && col === start_y,
    isFinish: row === finish_x && col === finish_y,
    isWall: false,
    distance: Infinity,
    isVisited: false,
    previousNode: null,
    distanceToFinishNode: Math.abs(finish_x - row) + Math.abs(finish_y - col)
  };
};

const MatrixDynamicNodes = (matrix, row, col, pos) => {
  console.log(`start node is currently at: row: ${row} col: ${col}`);
  let newMatrix = matrix.slice();
  const node = newMatrix[row][col];
  if (pos === "start") {
    const newNode = {
      ...node,
      isStart: true,
    };
    newMatrix[row][col] = newNode;
  }
  if (pos === "finish") {
    const newNode = {
      ...node,
      isFinish: true,
    };
    newMatrix[row][col] = newNode;
  }
  return newMatrix;
};

// Toggled and untoggle isWall to the current node
const MatrixWithWallToggled = (matrix, row, col) => {
  let newMatrix = matrix.slice();
  const node = newMatrix[row][col];

  const newNode = {
    ...node,
    isWall: !node.isWall,
  };

  newMatrix[row][col] = newNode;
  return newMatrix;
};

const getMatrixWithoutPath = (matrix) => {
  let newMatrix = matrix.slice();
  for (let row of matrix) {
      for (let node of row) {
          let newNode = {
              ...node,
              distance: Infinity,
              isVisited: false,
              previousNode: null,
              distanceToFinishNode: Math.abs(FINISH_NODE_ROW - node.row) + Math.abs(FINISH_NODE_COL - node.col)
          };
          newMatrix[node.row][node.col] = newNode;
      }
  }
  return newMatrix;
}

const getNewMatrixWithMaze = (matrix, walls) => {
  let newMatrix = matrix.slice();
  for (let wall of walls) {
    let node = matrix[wall[0]][wall[1]];
    let newNode = {
      ...node,
      isWall: true,
    };
    newMatrix[wall[0]][wall[1]] = newNode;
  }
  return newMatrix;
};
