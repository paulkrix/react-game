class DiamondSquare {
  constructor( size ) {
    this.size = size;
    this.values = new Array( size*size ).fill( 0.0 );
    this.error = 1.0;
    this.wrap = false;
  }

  setCorners( corners ) {
    this.values[0] = corners[0];
    this.values[this._getIndex(0, this.size-1)] = corners[1];
    this.values[this._getIndex(this.size-1, 0)] = corners[2];
    this.values[this._getIndex(this.size-1, this.size-1)] = corners[3];
  }

  setError( error ) {
    this.error = error;
  }

  get(x, y) {
    return this.values[ this._getIndex(x, y ) ];
  }

  set(x, y, value) {
    this.values[ this._getIndex(x, y ) ] = value;
  }

  // x,y are the top left corner of the square. size is both length and width
  _squareStep( x,y,size,error ) {

    var sum = this.get(x,y) +
              this.get(x+size,y) +
              this.get(x, y+size) +
              this.get(x+size, y+size);

    this.set(x+size/2, y+size/2, sum/4 + Math.random()*error-error/2);

  }

  _diamondStep( x,y,size,error ) {

    var sum = this.get(x,y) + this.get(x+size,y) ;
    this.set(x+size/2, y, sum/2 + Math.random()*error-error/2);

    sum = this.get(x,y) + this.get(x,y+size) ;
    this.set(x, y+size/2, sum/2 + Math.random()*error-error/2);

    sum = this.get(x+size,y) + this.get(x+size,y+size) ;
    this.set(x+size, y+size/2, sum/2 + Math.random()*error-error/2);

    sum = this.get(x,y+size) + this.get(x+size,y+size) ;
    this.set(x+size/2, y+size, sum/2 + Math.random()*error-error/2);
  }

  generate() {
    let error = this.error;
    let startSize = this.size-1;

    for(let size = startSize; size > 1; size /= 2) {
      for(let x = 0; x < startSize; x+=size) {
        for(let y = 0; y < startSize; y+=size) {
          this._squareStep(x,y,size,error);
          this._diamondStep(x,y,size, error);
        }
      }
      error /= 2;
    }

    return this.values;
  }

  setAvgHeight(target, tollerance) {
    //compute average
    let sum = 0;
    for(let i  = 0; i < this.values.length; i++) {
      sum += this.values[i];
    }

    let avg = sum / this.values.length;
    let delta = 0;
    if( avg < target - tollerance ) {
      delta = (target-tollerance) - avg;
    }
    if( avg > target + tollerance ) {
      delta = avg - (target + tollerance);
    }

    if(delta !== 0) {
      let sum = 0;
      for(let i  = 0; i < this.values.length; i++) {
        this.values[i] += delta;
      }
    }
    return this.values;
  }

  _getIndex( x, y ) {
    return x + y*this.size;
  }

}



// DiamondSquare.prototype.erode = function() {
//
//   var m = new Mountainiser(this.size, this.values);
//   m.mountainise();
//
//   this.values = m.getValues();
//
//   var ce = new CliffErosion(this.size, this.values);
//
//
//   for(var i = 0; i < 50; i++) {
//     ce.erode();
//   }
//
//   this.values = ce.getValues();
//
//   var ptbr = new Perturbator(this.size, this.values);
//
//   this.values = ptbr.perturb(0.2);
//
//   var hr = new HydraulicErosion(this.size, this.values);
//
//   for(var i = 0; i < 10; i++) {
//     hr._addWater(0.5);
//     hr._removeSediment();
//     hr._move();
//     hr._depositSediment();
//     hr._evaporate();
//   }
//   this.values = hr.getValues();
//
//   return this.values;
// }
export default DiamondSquare;
