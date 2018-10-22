class BinaryHeap {
  constructor( scoreFunction ) {
    this.data = [ null ];
    this.scoreFunction = scoreFunction;
  }
  push( data ) {
    //insert
    this.data.push( data );
    this.percolateDown( this.data.length -1 );
  }
  pop() {
    let topNode = this.data[1];
    this.data[1] = null;
    //If there are no children then you're done!
    if( this.data.length === 2 ) {
      this.data.splice( 1, 1 );
      return topNode;
    }
    this._swap( 1, this.data.length -1 );
    this.data.splice( this.data.length-1, 1 );
    let index = 1;
    while( true ) {
      let leftIndex = index*2;
      let rightIndex = leftIndex+1;
      //if there are no children then you're done
      if( leftIndex > this.data.length -1 ) {
        break;
      }
      //find lowest value child
      let lowestChild = leftIndex;
      if( rightIndex <= this.data.length -1 &&
          this.scoreFunction(this.data[rightIndex]) < this.scoreFunction(this.data[leftIndex]) ) {

          lowestChild = rightIndex;
      }

      if( this.scoreFunction(this.data[lowestChild]) >= this.scoreFunction(this.data[index]) ) {
        break;
      }
      this._swap( lowestChild, index );
      index = lowestChild;
    }
    return topNode;
  }
  rebalance( element ) {
    //remove the old copy of the node
    this.percolateDown( this.data.indexOf( element ) );
  }
  percolateDown( index ) {
    //keep swapping the new node with it's parent until the tree is balanced
    while( index > 1 ) {
      let parentIndex = parseInt(index/2);
      if( this.scoreFunction(this.data[index]) >= this.scoreFunction(this.data[ parentIndex ]) ) {
        break;
      }
      this._swap( index, parentIndex );
      index = parentIndex;
    }
  }
  _swap( i, j ) {
    let tmp = this.data[ i ];
    this.data[ i ] = this.data[ j ];
    this.data[ j ] = tmp;
  }
  size() {
    return this.data.length -1;
  }
}

export default BinaryHeap;
