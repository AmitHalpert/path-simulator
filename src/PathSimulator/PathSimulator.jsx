// import components
import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstra, getShortestDijkstra } from "../algorithms/dijkstra";
import { bfs, getShortestPathBFS } from "../algorithms/bfs";
import { dfs, getShortestPathDFS } from "../algorithms/dfs";
import { aastar, getShortestAstar} from "../algorithms/astar";
import "./PathSimulator.css";

// constants
const NUMBER_ROW = 26;
const NUMBER_COL = 50;

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathSimulator extends Component {
  state = {
    matrix: [],
    mouseIsPressed: false,
    mainIsPressed: "",
    isVisualizing: false,
    startNode_Pos: [START_NODE_ROW, START_NODE_COL],
    finishNode_Pos: [FINISH_NODE_ROW, FINISH_NODE_COL],
  };

  componentDidMount() {
    const { startNode_Pos, finishNode_Pos } = this.state;
    let matrix = getInitialMatrix(startNode_Pos, finishNode_Pos);
    this.setState({ matrix });
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

  /////////////////
  // clear functions
  /////////////////

  clearMatrix = () => {
    const { startNode_Pos, finishNode_Pos } = this.state;
    const start_X = startNode_Pos[0],
      start_Y = startNode_Pos[1];
    const finish_X = finishNode_Pos[0],
      finish_Y = finishNode_Pos[1];
    for (let row = 0; row < this.state.matrix.length; row++) {
      for (let col = 0; col < this.state.matrix[0].length; col++) {
        if (
          !(
            (row === start_X && col === start_Y) ||
            (row === finish_X && col === finish_Y)
          )
        ) {
          document.getElementById(`node-${row}-${col}`).className = "node";
        }
      }
    }
    const newMatrix = getInitialMatrix(startNode_Pos, finishNode_Pos);
    this.setState({ matrix: newMatrix });
  };

  /////////////////
  // algorithms animations
  /////////////////

  animateDFS(visitedNodesInOrder, getShortestPathDFS) {
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
          "node node-visited";
      }, 10 * i);
    }
  }

  animateBFS(visitedNodesInOrder, getShortestPathBFS) {
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
          "node node-visited";
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
          "node node-visited";
      }, 10 * i);
    }
  }

  animateAstar(visitedNodesInOrder, getShortestAstar) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(getShortestAstar);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  }

  


  visualizeDFS() {
    const { matrix, startNode_Pos, finishNode_Pos } = this.state;
    // get the startX and startY
    const start_X = startNode_Pos[0],
      start_Y = startNode_Pos[1];
    const startNode = matrix[start_X][start_Y];
    // get the finishX and finishY
    const finish_X = finishNode_Pos[0],
      finish_Y = finishNode_Pos[1];
    const finishNode = matrix[finish_X][finish_Y];

    const visitedNodesInOrder = dfs(matrix, startNode, finishNode);
    const nodesInShortestPathOrder = getShortestPathDFS(finishNode);
    this.animateDFS(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeBFS() {
    const { matrix, startNode_Pos, finishNode_Pos } = this.state;
    const start_X = startNode_Pos[0],
      start_Y = startNode_Pos[1];
    const startNode = matrix[start_X][start_Y];
    const finish_X = finishNode_Pos[0],
      finish_Y = finishNode_Pos[1];
    const finishNode = matrix[finish_X][finish_Y];
    const visitedNodesInOrder = bfs(matrix, startNode, finishNode);
    const nodesInShortestPathOrder = getShortestPathBFS(finishNode);
    this.animateBFS(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeDijkstra() {
    const { matrix, startNode_Pos, finishNode_Pos } = this.state;
    const start_X = startNode_Pos[0],
      start_Y = startNode_Pos[1];
    const startNode = matrix[start_X][start_Y];
    const finish_X = finishNode_Pos[0],
      finish_Y = finishNode_Pos[1];
    const finishNode = matrix[finish_X][finish_Y];
    const visitedNodesInOrder = dijkstra(matrix, startNode, finishNode);
    const nodesInShortestPathOrder = getShortestDijkstra(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeAstar() {
    const { matrix, startNode_Pos, finishNode_Pos } = this.state;
    const start_X = startNode_Pos[0],
      start_Y = startNode_Pos[1];
    const startNode = matrix[start_X][start_Y];
    const finish_X = finishNode_Pos[0],
      finish_Y = finishNode_Pos[1];
    const finishNode = matrix[finish_X][finish_Y];
    try {
        const visitedNodesInOrder = aastar(matrix, startNode, finishNode);
        const nodesInShortestPathOrder = getShortestAstar(finishNode);
        if (nodesInShortestPathOrder.length === 1) {
            throw "not enough nodes in shortest path"
        }

        this.animateAstar(visitedNodesInOrder, nodesInShortestPathOrder);

    }catch(error){
        console.log(error);
    }
  }
  

  // animateShortestPath is used for animating every algorithm
  animateShortestPath(nodesInShortestPath) {
    for (let i = 1; i < nodesInShortestPath.length-1; i++) {
      setTimeout(() => {
        const node = nodesInShortestPath[i];
        document.getElementById(`node-${node.row}-${node.col}`).className = `node node-shortest-path`;
      }, 50 * i);
    }
  }

  render() {
    const { matrix, mouseIsPressed } = this.state;

    return (
      <>
        <button onClick={() => this.visualizeAstar()} class="button-68">
          ASTAR
        </button>
        <button onClick={() => this.visualizeDijkstra()} class="button-68">
          DIJKSTRA
        </button>
        <button onClick={() => this.visualizeBFS()} class="button-68">
          BFS
        </button>
        <button onClick={() => this.visualizeDFS()} class="button-68">
          DFS
        </button>
        <button onClick={() => this.clearMatrix()} class="button-68">
          CLEAR
        </button>
        <div className="matrix">
          {matrix.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
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
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={(row, col) => this.handleMouseUp(row, col)}
                      onMouseLeave={(row, col) =>
                        this.handleMouseLeave(row, col)
                      }
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
} // end of the PathSimulator

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
