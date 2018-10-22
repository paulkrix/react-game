import Heap from './BinaryHeap.js';

class AStarNode {
  constructor( tile ) {
    this.tile = tile;
    this.visited = false;
    this.closed = false;
    this.gScore = 1000000000;
    this.fScore = 1000000000;
    this.parent = null;
  }
  setFScore( score ) {
    this.fScore = score;
  }
  setGScore( score ) {
    this.gScore = score;
  }
  setParent( node ) {
    this.parent = node;
  }
}

class AStarGraph {
  constructor( origin, destination, tiles, columns, rows ) {
    this.destination = new AStarNode( destination );
    this.tiles = tiles;
    this.nodes = tiles.map( (tile) => {
      return new AStarNode( tile );
    });
    this.columns = columns;
    this.rows = rows;
    this.openHeap = new Heap( ( element ) => {
      return element.fScore;
    });
    this.done = false;
    this.success = false;
    this.path = [];

    let root = new AStarNode( origin );
    root.setFScore( this._getManahattanDistance( origin, destination ) );
    root.setGScore( 0 );
    this.addNode( root );


    //while( this.openSet.length > 0 ) {
    while( this.openHeap.size() > 0 ) {
      this.step();
      if( this.done ) {
        break;
      }
    }
  }
  addNode( node ) {
    this.openHeap.push( node, node.fScore );
  }
  closeNode( node ) {
    // let index = this.openSet.indexOf( node );
    // this.openSet.splice(index, 1);
    node.closed = true;
  }
  step() {
    let currentNode = this.getNextNode();
    //Check if we're done
    if( currentNode.tile === this.destination.tile ) {
      this.done = true;
      this.success = true;
      this.path = this.constructPath( currentNode );
      return;
    }
    //Move node to closed set
    this.closeNode( currentNode );
    //Check neighbors that havent already been evaluated
    let neighbors = this.getNeighbors( currentNode );

    for( let i = 0; i < neighbors.length; i++ ) {
      let neighbor = neighbors[i];

      let beenVisited = neighbor.visited;
      let tentativeGScore = currentNode.gScore + 1;

      if( !beenVisited || tentativeGScore < neighbor.gScore ) {
        neighbor.visited = true;
        neighbor.setParent( currentNode );
        neighbor.setGScore( tentativeGScore );
        neighbor.setFScore( tentativeGScore + this._getManahattanDistance( neighbor.tile, this.destination.tile) );

        if( !beenVisited) {
          this.openHeap.push( neighbor );
        } else {
          this.openHeap.rebalance( neighbor );
        }

      }
    }
  }
  getNextNode() {
    // let lowestI = 0;
    // let lowest = this.openSet[0].fScore;
    // for( let i = 1; i < this.openSet.length; i++ ) {
    //   if( this.openSet[i].fScore < lowest ) {
    //     lowest = this.openSet[i].fScore;
    //     lowestI = i;
    //   }
    // }
    //return this.openSet[lowestI];
    return this.openHeap.pop();


  }
  getNeighbors( node ) {
    var tile = node.tile;
    let neighbors = [];
    if( tile.x > 0 ) {
      let neighbor = this.nodes[ this._getIndex( tile.x-1, tile.y ) ];
      if( neighbor.tile.pathable && !neighbor.closed ) {
        neighbors.push( neighbor );
      }
    }
    if( tile.y > 0 ) {
      let neighbor = this.nodes[ this._getIndex( tile.x, tile.y-1 )];
      if( neighbor.tile.pathable && !neighbor.closed ) {
        neighbors.push( neighbor );
      }
    }
    if( tile.x < this.columns-1 ) {
      let neighbor = this.nodes[ this._getIndex( tile.x+1, tile.y )];
      if( neighbor.tile.pathable && !neighbor.closed ) {
        neighbors.push( neighbor );
      }
    }
    if( tile.y < this.rows-1 ) {
      let neighbor = this.nodes[ this._getIndex( tile.x, tile.y+1 )];
      if( neighbor.tile.pathable && !neighbor.closed ) {
        neighbors.push( neighbor );
      }
    }
    return neighbors;
  }
  _getIndex( x, y ) {
    return x + y * this.columns;
  }
  inOpenSet( node ) {
    return (
      this.openSet.indexOf( node ) !== -1
    );
  }
  _getManahattanDistance( origin, destination ) {
    return Math.abs( origin.x - destination.x ) + Math.abs( origin.y - destination.y );
  }
  constructPath( finalNode ) {
    let path = [];
    let currentNode = finalNode;
    while( currentNode !== null ) {
      path.push( currentNode );
      currentNode = currentNode.parent;
    }
    return path.map( ( node, index ) => {
      return(
        node.tile
      );
    }).reverse();
  }
}

export default AStarGraph;
