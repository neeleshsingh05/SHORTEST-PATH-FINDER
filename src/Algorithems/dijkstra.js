export function dijkstra(grid, startNode, finishNode) {// dijkstra function is being exported here
    const visitedNodesInOrder = [];// visited nodes in order is an array which will return visited nodes
    startNode.distance = 0;// initialized to 0
    const unvisitedNodes = getAllNodes(grid);// stored inside unvisitednodes
    while (!!unvisitedNodes.length) {// nodes will be expanded in order
      sortNodesByDistance(unvisitedNodes);// the nodes will be sorted according to their distances and a pattern will be created
      const closestNode = unvisitedNodes.shift();// .shift() means it will remove the top node from the array
      // If we encounter a wall, we skip it.
      if (closestNode.isWall) continue;// if a node is a wall...continue
      // If the closest node is at a distance of infinity,
      // we must be trapped and should therefore stop.
      if (closestNode.distance === Infinity) return visitedNodesInOrder;
      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);// return visited nodes in order
      if (closestNode === finishNode) return visitedNodesInOrder;// if we reach the finishnode return all the visited nodes in order
      updateUnvisitedNeighbors(closestNode, grid);
    }
  }
  
  function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  }
  
  function updateUnvisitedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);// all 4 nodes will be returned here
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = node.distance + 1;// starting index will be 0 and then +1 to all the nodes (top, bottom, left, right)
      neighbor.previousNode = node;
    }
  }
  
  function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;// calling all the corresponding 4 nodes of a particular node
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);// if the node is valid to fill...its corresponding neighbours will also get filled
  }
  
  function getAllNodes(grid) {// grid passed
    const nodes = [];
    for (const row of grid) {// going into each particular node and pushing it into the nodes array
      for (const node of row) {
        nodes.push(node);// nodes are pushed
      }
    }
  
  
  
    return nodes;
  }
  
  // Backtracks from the finishNode to find the shortest path.
  // Only works when called *after* the dijkstra method above.
  export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;// we are going from last node to the first node 
    while (currentNode !== null) {// till node is not null we have to backtrack till the end
      nodesInShortestPathOrder.unshift(currentNode);// opposite of shift
      currentNode = currentNode.previousNode;// current node will have the same property of previous node as it has come through it only
    }
    return nodesInShortestPathOrder;// retrun the nodes in animated order
  }