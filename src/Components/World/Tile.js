import {COLOURS} from '../../Settings.js';

export default class Tile {
  constructor( _type, _pathable, _x, _y ) {
    this.type = _type;
    this.pathable = _pathable;
    this.x = _x;
    this.y = _y;
    this.dude = null;
    this.square = null;
  }
  setSquare( square ) {
    this.square = square;
  }
  getColour() {
    return COLOURS[ this.type ];
  }
  setDude( _dude ) {
    this.dude = _dude;
    if( this.square ) {
      this.square.setDude( _dude );
    }
  }
  removeDude() {
    this.dude = null;
  }
}
