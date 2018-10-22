import React from 'react';
import ReactDOM from 'react-dom';
import Tile from './Tile.js';
import Dude from '../Actors/Dude.js';
import DiamondSquare from '../../DiamondSquare.js';
import Graph from '../../AStar.js';

const numDudes = 3;

export default class World {
  constructor( _rows, _columns ) {
    this.rows = _rows;
    this.columns = _columns;
    this.tiles = [];
    this.dudes = [];
    this.mainDude = null;
    let ds = new DiamondSquare( _rows );
    ds.setCorners( [0.5,0.2,0.3,0.1] );
    ds.setError( 1 );
    let heights = ds.generate();
    heights = ds.setAvgHeight(0.3, 0.1);

    //Create tiles
    for( let i = 0; i < this.rows*this.columns; i++ ) {
      let type = 0;
      let pathable = false;
      if( heights[i] > 0.1 ) {
        type = 1;
        pathable = true;
      }
      if( heights[i] > 0.2 ) {
        type = 2;
      }
      if( heights[i] > 0.3 ) {
        type = 3;
      }
      if( heights[i] > 0.4) {
        type = 4;
      }
      if( heights[i] > 0.75) {
        type = 5;
      }
      this.tiles.push( new Tile( type, pathable, i%this.rows, parseInt(i/this.columns) ) );
    }

    //Create main dude
    // var placed = false
    // while( !placed ) {
    //   let x = parseInt( Math.random()*this.rows );
    //   let y = parseInt( Math.random()*this.rows );
    //   let index = this._getIndex( x, y );
    //   if( this.tiles[ index ].pathable ) {
    //     let dude = new Dude( 0, this.tiles[ index ] );
    //     this.mainDude = dude;
    //     placed = true;
    //   }
    // }
    let tile = this.getPathableTile();
    this.mainDude = new Dude( 0, tile );

    //Create other dudes
    while( this.dudes.length < numDudes ) {
      let tile = this.getPathableTile();
      this.dudes.push( new Dude( 1, tile ) );
    }

  }

  getPathableTile() {
    while( true ) {
      let x = parseInt( Math.random()*this.rows );
      let y = parseInt( Math.random()*this.rows );
      let index = this._getIndex( x, y );
      if( this.tiles[ index ].pathable ) {
        return this.tiles[ index ];
      }
    }
  }
  getTile( x, y ) {
    if( x < 0 || y < 0 || x >= this.columns || y >= this.rows ) {
      return false;
    }
    let index = this._getIndex( x, y );
    return this.tiles[ index ];
  }
  pathable( x, y ) {
    if( x >= 0 && x < this.rows && y >= 0 && y < this.columns ) {
      let index = this._getIndex( x, y );
      if( this.tiles[ index ].pathable ) {
        return true;
      }
    }
    return false;
  }
  _doTheThing( origin, destination ) {
    let now = null;
    if( performance ) {
      now = performance.now();
    }
    let graph = new Graph( origin, destination, this.tiles, this.columns, this.rows );
    if( performance ) {
      document.getElementById('performance').innerHTML = "Calculation took " + (performance.now() - now) + " milliseconds";
    }
    return graph.path;
  }
  _getIndex( x, y ) {
    return x + y * this.columns;
  }
}
