import React from 'react';
import ReactDOM from 'react-dom';
import Tile from './Tile.js';
import Dude from '../Actors/Dude.js';
import DiamondSquare from '../../DiamondSquare.js';
import Graph from '../../AStar.js';

export default class World {
  constructor( _rows, _columns ) {
    this.rows = _rows;
    this.columns = _columns;
    this.tiles = [];
    this.dudes = [];

    let ds = new DiamondSquare( _rows );
    ds.setCorners( [0.5,0.2,0.3,0.1] );
    ds.setError( 1 );
    let heights = ds.generate();
    heights = ds.setAvgHeight(0.3, 0.1);

    //Create tiles
    for( let i = 0; i < this.rows*this.columns; i++ ) {
      // let type = parseInt( Math.random()*COLOURS.length );
      // let pathable = true;
      // if( type === 2 ) {
      //   pathable = false;
      // }
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

    //Create dudes
    var placed = false
    while( !placed ) {
      let x = parseInt( Math.random()*this.rows );
      let y = parseInt( Math.random()*this.rows );
      let index = this._getIndex( x, y );
      if( this.tiles[ index ].pathable ) {
        let dude = new Dude( 0, this.tiles[ index ] );
        this.dudes.push( dude );
        this.tiles[ index ].setDude( dude );
        placed = true;
      }
    }

  }
  _doTheThing( origin, destination ) {
    let now = null;
    if( performance ) {
      now = performance.now();
    }
    // this.graph = new Graph( origin, destination, this.tiles, this.columns, this.rows );
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