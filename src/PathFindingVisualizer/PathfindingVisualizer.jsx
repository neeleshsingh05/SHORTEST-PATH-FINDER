import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

import './PathfindingVisualizer.css';

const START_NODE_ROW = 10;//decide the starting and ending index of the 2 points
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();//grid intialized
    this.setState({grid});
  }

  handleMouseDown(row, col) {//used to create wall....depends on the gesture of mouse if we scroll down the walls will be created
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {//scroll up and create the wall
    this.setState({mouseIsPressed: false});
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);// set time of animation
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =// set time of animation blue
          'node node-visited';// blue colour
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';// yellow colour
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];//  all the nodes initalized 
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];// all the nodes initialized
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);// brain of the particular project resides here
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);// returned all the list of the nodes of the shortest path
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);//visitednodes= blue animation and nodesinorder= yellow animation
  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (//on clicking the button the function visualizedijkstra function will be called
      <>
      <div className="logo">
          <img src={logo} width="100" height="50" />
        </div>
        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstra's Algorithm
        </button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>

                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (


                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>

                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {// 20 rows
    const currentRow = [];
    for (let col = 0; col < 50; col++) {// 50 columns
      currentRow.push(createNode(col, row));// we used createnode function and pushed in current row
    }
    grid.push(currentRow);//each grid will have different properties
  }
  return grid;
};

const createNode = (col, row) => {//properties of each node or grid (is it a start node or is it an end node or is it a wall..)
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,//to create wall...initially false
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {// this function is used to convert wall into not wall and vice-versa
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,// wall to not wall and vice versa
  };
  newGrid[row][col] = newNode;
  return newGrid;
};