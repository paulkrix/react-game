
export default class Dude {
  constructor( _type, _location ) {
    this.type = _type;
    this.path = [];
    this.location = _location;
    this.location.setDude( this );
  }
  setPath( path ) {
    this.path = path.slice(1);
  }
  step() {
    if( this.path.length > 0 ) {
      let next = this.path.shift();
      this.location.setDude( null );
      this.location.square.setPath( false );
      next.setDude( this );
      this.location = next;
    }
  }
}
