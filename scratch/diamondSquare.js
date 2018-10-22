function DiamondSquare(size) {
  this.size = size;
  
  this.values = [];
  for(var i = 0; i < this.size*this.size; i++) {
    this.values[i] = 0.0;
  }
  
  //seed corner values
  this.values[0] = 0.0;
  this.values[this.size-1] = 0.0;
  this.values[this.size*(this.size-1)] = 0.0;
  this.values[this.size*this.size-1] = 0.0;  
  
  this.error = 1.0;
  this.wrap = false;
}

// Corners = [topLeft, topRight, bottomLeft, bottomRight]
DiamondSquare.prototype.setSeed = function(corners) {
  //seed corner values
  this.values[0] = corners[0];
  this.values[this.size-1] = corners[1];
  this.values[this.size*(this.size-1)] = corners[2];
  this.values[this.size*this.size-1] = corners[3];  
}

// wrap = boolean
DiamondSquare.prototype.setWrap = function(wrap) {
  this.wrap = wrap;
}

// error = number
DiamondSquare.prototype.setError = function(error) {
  this.error = error;
}


DiamondSquare.prototype.get = function(x, y) {
  return this.values[x*this.size+y];
}

DiamondSquare.prototype.set = function(x, y, value) {
  this.values[x*this.size+y] = value;
}

DiamondSquare.prototype.print = function() {
  console.log("");
  for(var x = 0; x < this.size; x++) {
  
    var line = "";
    for(var y = 0; y < this.size; y++) {
      line += this.values[x*this.size+y].toFixed(2) + " "; 
    }
    console.log(line);
    
  }
}

// x,y are the top left corner of the square. size is both length and width
DiamondSquare.prototype._squareStep = function(x,y,size,error) {

  var sum = this.get(x,y) + 
            this.get(x+size,y) + 
            this.get(x, y+size) +
            this.get(x+size, y+size);

  this.set(x+size/2, y+size/2, sum/4 + Math.random()*error-error/2);
  
}

DiamondSquare.prototype._diamondStep = function(x,y,size,error) {

  var sum = this.get(x,y) + this.get(x+size,y) ;
  this.set(x+size/2, y, sum/2 + Math.random()*error-error/2);

  sum = this.get(x,y) + this.get(x,y+size) ;
  this.set(x, y+size/2, sum/2 + Math.random()*error-error/2);
  
  sum = this.get(x+size,y) + this.get(x+size,y+size) ;
  this.set(x+size, y+size/2, sum/2 + Math.random()*error-error/2);
  
  sum = this.get(x,y+size) + this.get(x+size,y+size) ;
  this.set(x+size/2, y+size, sum/2 + Math.random()*error-error/2);  
}

DiamondSquare.prototype.generate = function() {
  var error = this.error;
  var startSize = this.size-1;

  for(var size = startSize; size > 1; size /= 2) {
    for(var x = 0; x < startSize; x+=size) {
      for(var y = 0; y < startSize; y+=size) {
        this._squareStep(x,y,size,error);
        this._diamondStep(x,y,size, error);  
      }
    }
    error /= 2;
  }  
  
  return this.values;
}

DiamondSquare.prototype.setAvgHeight = function(target, tollerance) {
  //compute average
  var sum = 0;
  for(var i  = 0; i < this.values.length; i++) {
    sum += this.values[i];
  }

  var avg = sum / this.values.length;
  var delta = 0;
  if( avg < target - tollerance ) {
    delta = (target-tollerance) - avg;
  }
  if( avg > target + tollerance ) {
    delta = avg - (target + tollerance);
  }

  if(delta !== 0) {
    var sum = 0;
    for(var i  = 0; i < this.values.length; i++) {
      this.values[i] += delta;
    }
  }
  return this.values;
}

DiamondSquare.prototype.erode = function() {

  var m = new Mountainiser(this.size, this.values);
  m.mountainise();
  
  this.values = m.getValues();
  
  var ce = new CliffErosion(this.size, this.values);


  for(var i = 0; i < 50; i++) {
    ce.erode();
  }
  
  this.values = ce.getValues();
  
  var ptbr = new Perturbator(this.size, this.values);
  
  this.values = ptbr.perturb(0.2);
  
  var hr = new HydraulicErosion(this.size, this.values);

  for(var i = 0; i < 10; i++) {
    hr._addWater(0.5);  
    hr._removeSediment();
    hr._move();
    hr._depositSediment();
    hr._evaporate();
  }
  this.values = hr.getValues();

  return this.values;
}

function HydraulicErosion(size, values) {
  this.size = size;
  this.heightmap = values;
  this.watermap = [];
  this.fluxmap = [];
  
  for(var i = 0; i < this.heightmap.length; i++) {
    this.watermap[i] = 0;
    this.fluxmap[i] = [0,0,0,0];
  }
}

HydraulicErosion.prototype.getValues = function() {
  return this.heightmap;
}

HydraulicErosion.prototype._addWater = function(rain) {
  for(var i = 0; i < this.watermap.length; i++) {
    this.watermap[i] += rain;  
  }
}

HydraulicErosion.prototype._removeSediment = function() {
  for(var i = 0; i < this.watermap.length; i++) {
    this.heightmap[i] -= this.watermap[i]*0.05;
  }  
} 

HydraulicErosion.prototype._depositSediment = function() {
  for(var i = 0; i < this.watermap.length; i++) {
    this.heightmap[i] += this.watermap[i]*0.05;
  }  
}

HydraulicErosion.prototype.getHeight = function(i) {
  return this.heightmap[i] + this.watermap[i];
}

HydraulicErosion.prototype._move = function() {
  for(var i = 0 ; i < this.heightmap.length; i++) {
    var low_i = i;
    var lowest = this.getHeight(i);
    var thisHeight = lowest;
    
    if(i % this.size !== 0) {
      if(this.getHeight(i-1) < lowest) {
        lowest = this.getHeight(i-1);
        low_i = i-1;
      }
    }
    if(i % this.size !== this.size-1) {
      if(this.getHeight(i+1) < lowest) {
        lowest = this.getHeight(i+1);
        low_i = i+1;
      }
    }
    if(Math.floor(i / this.size) !== 0) {
      if(this.getHeight(i-this.size) < lowest) {
        lowest = this.getHeight(i-this.size);
        low_i = i-this.size;
      }
    }
    if(Math.floor(i / this.size) !== this.size-1) {
      if(this.getHeight(i+this.size) < lowest) {
        lowest = this.getHeight(i+this.size);
        low_i = i+this.size;
      }
    }
    
    if(lowest >= thisHeight) {
      //This is the lowest, no flow!
      continue;
    }
    
    //Move water
    var difference = thisHeight - lowest;
    if(difference/2 > this.watermap[i]) {
      this.watermap[low_i] += this.watermap[i];
      this.watermap[i] = 0;
    } else {
      this.watermap[low_i] += difference/2;
      this.watermap[i] -= difference/2;
    }
    
  }

}

HydraulicErosion.prototype._evaporate = function() {
  for(var i = 0; i < this.watermap.length; i++) {
    this.watermap[i] *= 0.5;
  }
}

function CliffErosion(size, values) {
  this.size = size;
  this.heightmap = values;
}

CliffErosion.prototype.getValues = function() {
  return this.heightmap;
}

CliffErosion.prototype.erode = function() {
  for(var i = 0 ; i < this.heightmap.length; i++) {
  
    var low_i = i;
    var lowest = this.heightmap[i];
    var thisHeight = lowest;
    
    if(i % this.size !== 0) {
      if(this.heightmap[i-1] < lowest) {
        lowest = this.heightmap[i-1];
        low_i = i-1;
      }
    }
    if(i % this.size !== this.size-1) {
      if(this.heightmap[i+1] < lowest) {
        lowest = this.heightmap[i+1];
        low_i = i+1;
      }
    }
    if(Math.floor(i / this.size) !== 0) {
      if(this.heightmap[i-this.size] < lowest) {
        lowest = this.heightmap[i-this.size];
        low_i = i-this.size;
      }
    }
    if(Math.floor(i / this.size) !== this.size-1) {
      if(this.heightmap[i+this.size] < lowest) {
        lowest = this.heightmap[i+this.size];
        low_i = i+this.size;
      }
    }
    
    if(lowest >= thisHeight) {
      continue;
    }
    
    var difference = thisHeight - lowest;
    if(difference < 0.02) {
      this.heightmap[low_i] += difference/4;
      this.heightmap[i] -= difference/4;
    }
    
  }
}

function Mountainiser(size, values) {
  this.size = size;
  this.heightmap = values;
}

Mountainiser.prototype.getValues = function() {
  return this.heightmap;
}

Mountainiser.prototype.distanceSquared = function(x1,y1,x2,y2) {
  var dx = x2-x1;
  var dy = y2-y1;
  return dx*dx + dy*dy;
}

Mountainiser.prototype.mountainise = function() {
  //add feature points
  this.featurePoints = [];
  var numFeaturePoints = 6;
  for(var i = 0; i < numFeaturePoints; i++) {
    var val = Math.random();
    if(val > 0.5) {
      val = 1;
    } else {
      val = 0;
    }
    this.featurePoints[i] = { x: Math.floor(Math.random()*this.size), y: Math.floor(Math.random()*this.size), value: val };
  }
  var avg = 0.0;
  for(var i = 0; i < this.heightmap.length; i++) {
    //find nearest two features
    var nearestDist = this.size*this.size;
    var nearestI = null;
    var nextNearestDist = this.size*this.size;
    var nextNearestI = null;
    for(var j = 0; j < this.featurePoints.length; j++) {
      var feature = this.featurePoints[j];
      var fDistance = this.distanceSquared(i%this.size, Math.floor(i/this.size), feature.x, feature.y);
      if(fDistance < nearestDist) {
        nearestDist = fDistance;
        nearestI = j;
      }
    }
    for(var j = 0; j < this.featurePoints.length; j++) {
      if(j == nearestI) {
        continue;
      }
      var feature = this.featurePoints[j];
      var fDistance = this.distanceSquared(i%this.size, Math.floor(i/this.size), feature.x, feature.y);
      if(fDistance < nextNearestDist) {
        nextNearestDist = fDistance;
        nextNearestI = j;
      }
    }    
    avg += (Math.sqrt(nextNearestDist)/this.size - Math.sqrt(nearestDist)/this.size) * this.featurePoints[nearestI].value;
    this.heightmap[i] += (Math.sqrt(nextNearestDist)/(this.size) - Math.sqrt(nearestDist)/this.size) * this.featurePoints[nearestI].value
    
  }
  for(var i = 0; i < this.heightmap.length; i++) {
    this.heightmap[i] -= avg/this.heightmap.length;
  }
}

function Perturbator (size, values) {
  this.size = size;
  this.values = values;
  this.perturbmap = [];
}

Perturbator.prototype.perturb = function(magnitude) {
  var ds = new DiamondSquare(this.size);
  this.perturbmap = ds.generate();
  var newValues = [];
  
  for(var i = 0; i < this.values.length; i++) {
    var x = i%this.size;
    var y = Math.floor(i/this.size);
    var p = magnitude * (this.perturbmap[i]-0.5);
    var x_coord = Math.min( this.size-2, Math.max( 0, x + this.size*p ) );
    var x_coord_low = Math.floor(x_coord);
    var x_coord_high = x_coord_low + 1;
    var x_fraction = x_coord - x_coord_low;

    var y_coord = Math.min( this.size-2, Math.max( 0, y + this.size*p ) );
    var y_coord_low = Math.floor(y_coord);
    var y_coord_high = y_coord_low + 1;    
    var y_fraction = y_coord - y_coord_low;
    
    var val1 = this.interpolate(
      this.values[x_coord_low+y_coord_low*this.size],
      this.values[x_coord_high+y_coord_low*this.size],
      x_fraction
    );
    var val2 = this.interpolate(
      this.values[x_coord_low+y_coord_high*this.size],
      this.values[x_coord_high+y_coord_high*this.size],
      x_fraction
    );    
    newValues[i] = this.interpolate(val1, val2, y_fraction);
  }
  return newValues;
}

Perturbator.prototype.interpolate = function(a, b, m) {
  return a*(1-m)+b*m;
}



